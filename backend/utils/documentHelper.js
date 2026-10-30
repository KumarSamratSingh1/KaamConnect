const { cloudinary } = require('../config/cloudinary');

/**
 * Enriches a document subdocument with signed URL, proxy URL, and format flags.
 */
const enrichDocument = (doc, userId) => {
  if (!doc) return doc;
  const d = doc.toObject ? doc.toObject() : { ...doc };

  const ext = (d.name || d.url || d.publicId || '').split('.').pop().toLowerCase();
  const isRaw = ['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(ext);
  const resourceType = isRaw ? 'raw' : 'image';

  d.fileType = ext;
  d.isRaw = isRaw;

  if (d.publicId) {
    try {
      const signedUrl = cloudinary.utils.private_download_url(d.publicId, '', {
        resource_type: resourceType,
        type: 'upload',
        expires_at: Math.floor(Date.now() / 1000) + (86400 * 7) // 7 days expiration
      });
      d.viewUrl = signedUrl;

      // Always point url to the signed URL so standard <a> links open without 401 ACL error
      if (isRaw || !d.url || d.url.includes('/raw/upload/')) {
        d.url = signedUrl;
      }
    } catch (err) {
      console.error('Error generating signed document URL:', err.message);
    }
  }

  const uId = userId || d.user || (d.owner ? d.owner.toString() : null);
  if (uId && (d._id || d.type)) {
    const docId = d._id ? d._id.toString() : d.type;
    d.proxyUrl = `/api/workers/document/view/${uId}/${docId}`;
  }

  return d;
};

/**
 * Enriches all documents on a worker profile.
 */
const enrichWorkerDocuments = (profile) => {
  if (!profile) return profile;
  const obj = profile.toObject ? profile.toObject() : { ...profile };
  const userId = obj.user?._id ? obj.user._id.toString() : (obj.user ? obj.user.toString() : null);

  if (obj.documents && Array.isArray(obj.documents)) {
    obj.documents = obj.documents.map(d => enrichDocument(d, userId));
  }
  return obj;
};

module.exports = { enrichDocument, enrichWorkerDocuments };

