const WorkerProfile = require('../models/WorkerProfile');
const User = require('../models/User');

// Helper: call Gemini API
const callGemini = async (prompt) => {
  if (!process.env.GEMINI_API_KEY) {
    // Fallback mock response
    return { success: true, data: "AI service not configured. Using mock response." };
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    }
  );
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
};

// @desc AI-powered worker matching
// @route POST /api/ai/match
const matchWorkers = async (req, res, next) => {
  try {
    const {
      services, budget, location, workType, experience,
      languages, urgency, shift, description
    } = req.body;

    // Build base query
    const query = { verificationStatus: 'verified', availabilityStatus: 'available' };
    if (services?.length) query.skills = { $in: services };
    if (workType) query.workType = workType;
    if (budget) query['expectedSalary.max'] = { $lte: parseInt(budget) };
    if (experience) query.experience = { $gte: parseInt(experience) };
    if (languages?.length) query.languagesKnown = { $in: languages };

    const profiles = await WorkerProfile.find(query)
      .populate('user', 'name profilePhoto location phone')
      .sort({ 'rating.average': -1, profileScore: -1 })
      .limit(20);

    // AI scoring
    let aiPrompt = `
You are an AI matching engine for a domestic worker platform in India.
Customer requirement: ${description || JSON.stringify({ services, budget, workType, experience, urgency })}

Rate the following ${profiles.length} workers from 0-100 based on fit.
Return ONLY a JSON array of objects: [{"id": "...", "score": 85, "reason": "..."}]

Workers:
${profiles.map(p => `ID: ${p._id}, Skills: ${p.skills.join(',')}, Exp: ${p.experience}yr, Rating: ${p.rating.average}, Salary: ${p.expectedSalary.min}-${p.expectedSalary.max}, Type: ${p.workType}`).join('\n')}
    `.trim();

    let rankedWorkers = profiles.map(p => ({ ...p.toObject(), aiScore: p.rating.average * 20 }));

    try {
      const aiResponse = await callGemini(aiPrompt);
      const parsed = JSON.parse(aiResponse.match(/\[.*\]/s)?.[0] || '[]');
      if (parsed.length) {
        rankedWorkers = profiles.map(p => {
          const aiData = parsed.find(r => r.id === p._id.toString());
          return { ...p.toObject(), aiScore: aiData?.score || 50, aiReason: aiData?.reason || '' };
        }).sort((a, b) => b.aiScore - a.aiScore);
      }
    } catch (e) {
      // Use default ranking if AI fails
    }

    return res.json({
      success: true,
      data: {
        matches: rankedWorkers.slice(0, 10),
        total: profiles.length,
        aiPowered: !!process.env.GEMINI_API_KEY
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Parse plain-language requirement
// @route POST /api/ai/parse-requirement
const parseRequirement = async (req, res, next) => {
  try {
    const text = req.body.text || req.body.prompt || '';

    const prompt = `
Parse this domestic worker requirement text into structured JSON.
Text: "${text}"

Return ONLY valid JSON with these fields (use null if not mentioned):
{
  "services": ["cooking", "cleaning", ...],
  "workType": "full-time|part-time|hourly|null",
  "shift": "morning|evening|flexible|null",
  "budget": number or null,
  "experience": number (years) or null,
  "urgency": "urgent|scheduled|null",
  "languages": ["hindi", "english", ...] or null,
  "location": "string or null",
  "summary": "one-line summary of requirement"
}

Valid services: cooking, cleaning, babysitting, eldercare, washing, ironing, gardening
    `.trim();

    let parsed = {
      services: [],
      workType: null,
      shift: null,
      budget: null,
      experience: null,
      urgency: null,
      languages: null,
      location: null,
      summary: text
    };

    // Simple keyword extraction as fallback
    const lower = text.toLowerCase();
    if (lower.includes('cook')) parsed.services.push('cooking');
    if (lower.includes('clean')) parsed.services.push('cleaning');
    if (lower.includes('baby') || lower.includes('child')) parsed.services.push('babysitting');
    if (lower.includes('elder') || lower.includes('old')) parsed.services.push('eldercare');
    if (lower.includes('wash')) parsed.services.push('washing');
    if (lower.includes('urgent') || lower.includes('asap')) parsed.urgency = 'urgent';
    if (lower.includes('part')) parsed.workType = 'part-time';
    if (lower.includes('full')) parsed.workType = 'full-time';
    if (lower.includes('morning')) parsed.shift = 'morning';
    if (lower.includes('evening')) parsed.shift = 'evening';

    try {
      const aiResponse = await callGemini(prompt);
      const jsonMatch = aiResponse.match(/\{.*\}/s);
      if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
    } catch (e) { /* use fallback */ }

    return res.json({ success: true, data: parsed });
  } catch (error) {
    next(error);
  }
};

// @desc Suggest salary range
// @route POST /api/ai/salary-suggestion
const suggestSalary = async (req, res, next) => {
  try {
    const { skills, experience, city, workType } = req.body;

    // Base salary ranges (INR per month) - mock data
    const baseSalary = {
      cooking: { min: 8000, max: 20000 },
      cleaning: { min: 6000, max: 15000 },
      babysitting: { min: 10000, max: 25000 },
      eldercare: { min: 12000, max: 30000 },
      washing: { min: 5000, max: 12000 },
    };

    const primarySkill = skills?.[0] || 'cleaning';
    const base = baseSalary[primarySkill] || { min: 7000, max: 15000 };

    // Adjust for experience
    const expMultiplier = 1 + (Math.min(experience || 0, 10) * 0.05);

    // Adjust for city tier
    const cityTier = ['mumbai', 'delhi', 'bangalore', 'hyderabad', 'pune'].includes(city?.toLowerCase()) ? 1.3 : 1;

    const suggested = {
      min: Math.round(base.min * expMultiplier * cityTier),
      max: Math.round(base.max * expMultiplier * cityTier),
      currency: 'INR',
      per: 'month',
      note: `Based on ${experience || 0} years experience in ${city || 'your city'}`
    };

    return res.json({ success: true, data: suggested });
  } catch (error) {
    next(error);
  }
};

// @desc AI Chat Assistant
// @route POST /api/ai/assistant
const chatAssistant = async (req, res, next) => {
  try {
    const { message, context } = req.body;

    const systemPrompt = `
You are KaamConnect Assistant, a helpful AI for a domestic worker platform in India.
Help users find maids, understand the platform, answer questions about bookings, safety, and payments.
Be friendly, concise, and helpful. Support both English and Hindi.
Context: ${JSON.stringify(context || {})}
    `.trim();

    const prompt = `${systemPrompt}\n\nUser: ${message}\nAssistant:`;

    let response = "I'm here to help you find the perfect domestic worker! You can search by skills, location, budget and availability. Is there anything specific you're looking for?";

    try {
      response = await callGemini(prompt);
    } catch (e) { /* use default */ }

    return res.json({ success: true, data: { response } });
  } catch (error) {
    next(error);
  }
};

// @desc Analyze review sentiment
// @route POST /api/ai/sentiment
const analyzeSentiment = async (req, res, next) => {
  try {
    const { text } = req.body;
    let sentiment = 'neutral';
    let score = 0.5;

    const positive = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'best', 'happy', 'satisfied', 'clean', 'polite'];
    const negative = ['bad', 'terrible', 'worst', 'unhappy', 'dirty', 'rude', 'late', 'unprofessional', 'disappointing'];

    const lower = text.toLowerCase();
    const posCount = positive.filter(w => lower.includes(w)).length;
    const negCount = negative.filter(w => lower.includes(w)).length;

    if (posCount > negCount) { sentiment = 'positive'; score = 0.7 + posCount * 0.05; }
    else if (negCount > posCount) { sentiment = 'negative'; score = 0.3 - negCount * 0.05; }

    return res.json({ success: true, data: { sentiment, score: Math.max(0, Math.min(1, score)) } });
  } catch (error) {
    next(error);
  }
};

module.exports = { matchWorkers, parseRequirement, suggestSalary, chatAssistant, analyzeSentiment };
