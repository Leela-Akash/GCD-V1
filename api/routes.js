import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// In-memory storage for demo (replace with proper database in production)
const complaints = new Map();

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'API is working!', timestamp: new Date() });
});

// Submit complaint with AI analysis
router.post('/submit-complaint', async (req, res) => {
  try {
    console.log('Received complaint:', req.body);
    
    const { description, category, customCategory, location, userId } = req.body;
    
    // Generate complaint ID
    const complaintId = Date.now().toString();
    
    // Create complaint data
    const complaintData = {
      id: complaintId,
      description,
      category: category === 'Other' ? customCategory : category,
      location,
      userId,
      status: 'pending',
      createdAt: new Date(),
      priority: 'MEDIUM' // Default priority
    };
    
    // Try Gemini AI analysis
    try {
      if (process.env.GEMINI_API_KEY) {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
        
        const prompt = `Analyze this civic complaint and determine priority (HIGH/MEDIUM/LOW):
        Description: ${description}
        Category: ${category === 'Other' ? customCategory : category}
        
        Respond with JSON: {"priority": "HIGH/MEDIUM/LOW", "analysis": "brief analysis"}`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const aiResult = JSON.parse(response.text());
        
        // Update complaint with AI analysis
        complaintData.priority = aiResult.priority;
        complaintData.aiAnalysis = aiResult.analysis;
      }
    } catch (aiError) {
      console.error('AI Analysis failed:', aiError);
    }
    
    // Store complaint in memory
    if (!complaints.has(userId)) {
      complaints.set(userId, []);
    }
    complaints.get(userId).push(complaintData);
    
    res.json({ 
      success: true, 
      id: complaintId,
      message: 'Complaint submitted successfully'
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to submit complaint', details: error.message });
  }
});

// Get user complaints
router.get('/complaints/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const userComplaints = complaints.get(userId) || [];
    
    res.json({ success: true, complaints: userComplaints });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

export default router;