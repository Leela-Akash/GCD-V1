import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '../src/services/firebase.js';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Submit complaint with AI analysis
router.post('/submit-complaint', async (req, res) => {
  try {
    const { description, category, customCategory, location, userId } = req.body;
    
    // Create complaint document in Firestore
    const complaintData = {
      description,
      category: category === 'Other' ? customCategory : category,
      location,
      userId,
      status: 'pending',
      createdAt: new Date(),
      priority: 'MEDIUM' // Default priority
    };

    // Add to Firestore
    const docRef = await addDoc(collection(db, 'complaints'), complaintData);
    
    // Analyze with Gemini AI
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
      
      const prompt = `Analyze this civic complaint and determine priority (HIGH/MEDIUM/LOW):
      Description: ${description}
      Category: ${category === 'Other' ? customCategory : category}
      
      Respond with JSON: {"priority": "HIGH/MEDIUM/LOW", "analysis": "brief analysis"}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const analysis = JSON.parse(response.text());
      
      // Update complaint with AI analysis
      await updateDoc(doc(db, 'complaints', docRef.id), {
        priority: analysis.priority,
        aiAnalysis: analysis.analysis
      });
      
    } catch (aiError) {
      console.error('AI Analysis failed:', aiError);
      // Continue without AI analysis
    }
    
    res.json({ 
      success: true, 
      id: docRef.id,
      message: 'Complaint submitted successfully'
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to submit complaint' });
  }
});

// Analyze media (images)
router.post('/analyze-media', async (req, res) => {
  try {
    const { imageData } = req.body;
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const result = await model.generateContent([
      'Analyze this image for civic issues. Describe what you see and suggest priority level.',
      { inlineData: { data: imageData, mimeType: 'image/jpeg' } }
    ]);
    
    const response = await result.response;
    res.json({ success: true, analysis: response.text() });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to analyze media' });
  }
});

export default router;