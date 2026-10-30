const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Profile photo storage
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'kaamconnect/profiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
  },
});

// Document storage (Aadhaar, Word resumes, PDFs, address proof, etc.)
const documentStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const ext = (file.originalname.split('.').pop() || '').toLowerCase();
    const isRaw = ['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(ext);
    const sanitized = file.originalname.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
    return {
      folder: 'kaamconnect/documents',
      resource_type: isRaw ? 'raw' : 'image',
      format: ext || undefined,
      public_id: `${Date.now()}-${sanitized}`
    };
  },
});

const uploadProfile = multer({
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const uploadDocument = multer({
  storage: documentStorage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
  fileFilter: (req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|webp|pdf|doc|docx)$/i;
    if (!file.originalname.match(allowed)) {
      return cb(new Error('Only PDF, Word (.doc, .docx), and Image (JPG, PNG, WEBP) files are supported.'), false);
    }
    cb(null, true);
  }
});

const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
  }
};

module.exports = { cloudinary, uploadProfile, uploadDocument, deleteFromCloudinary };
