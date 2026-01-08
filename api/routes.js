import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from './firebase-server.js';
import { collection, addDoc, updateDoc, doc, getDocs, query, where, orderBy } from 'firebase/firestore';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'API is working!', timestamp: new Date() });
});

// Submit complaint with AI analysis
router.post('/submit-complaint', async (req, res) => {
  try {
    console.log('Received complaint:', req.body);
    
    const { description, category, customCategory, location, userId } = req.body;
    
    // Create complaint data
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
    console.log('Complaint saved to Firestore:', docRef.id);
    
    // Try Gemini AI analysis
    try {
      if (process.env.GEMINI_API_KEY) {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        
        const prompt = `You are an AI assistant analyzing civic complaints for priority classification.
        
        Complaint Details:
        - Description: "${description}"
        - Category: ${category === 'Other' ? customCategory : category}
        
        Analyze this complaint and classify its priority based on:
        - HIGH: Emergency situations, public safety risks, health hazards, infrastructure failures
        - MEDIUM: Quality of life issues, moderate inconveniences, non-urgent repairs
        - LOW: Minor complaints, suggestions, cosmetic issues
        
        Respond ONLY with valid JSON in this exact format:
        {"priority": "HIGH", "analysis": "Brief explanation of why this priority was assigned"}
        
        Do not include any markdown formatting or code blocks.`;
        
        console.log('Sending prompt to Gemini:', prompt);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let responseText = response.text().trim();
        
        console.log('Raw Gemini response:', responseText);
        
        // Clean up response - remove markdown code blocks and extra formatting
        responseText = responseText
          .replace(/```json\s*/g, '')
          .replace(/```\s*/g, '')
          .replace(/^[\s\n]*/, '')
          .replace(/[\s\n]*$/, '')
          .trim();
        
        console.log('Cleaned response:', responseText);
        
        const aiResult = JSON.parse(responseText);
        console.log('Parsed AI result:', aiResult);
        
        // Update complaint with AI analysis
        await updateDoc(doc(db, 'complaints', docRef.id), {
          priority: aiResult.priority,
          aiAnalysis: aiResult.analysis
        });
        
        console.log('AI analysis completed');
      }
    } catch (aiError) {
      console.error('AI Analysis failed (continuing without it):', aiError.message);
    }
    
    res.json({ 
      success: true, 
      id: docRef.id,
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
    
    // Simple query without orderBy to avoid index requirement
    const q = query(
      collection(db, 'complaints'), 
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    
    const complaints = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      complaints.push({ 
        id: doc.id, 
        ...data,
        createdAt: data.createdAt.toDate() // Convert Firestore timestamp
      });
    });
    
    // Sort in JavaScript instead of Firestore
    complaints.sort((a, b) => b.createdAt - a.createdAt);
    
    console.log(`Found ${complaints.length} complaints for user ${userId}`);
    res.json({ success: true, complaints });
    
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

// Contact form submission
router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    console.log('Contact form submission:', { name, email, subject });
    
    // Store in Firestore
    await addDoc(collection(db, 'contacts'), {
      name,
      email,
      subject,
      message,
      createdAt: new Date(),
      status: 'new'
    });
    
    // TODO: Send email notification to admin
    // You can integrate with SendGrid, Nodemailer, or other email services
    
    res.json({ 
      success: true, 
      message: 'Contact form submitted successfully'
    });
    
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
});

// Audio transcription endpoint
router.post('/transcribe-audio', async (req, res) => {
  try {
    const { audioData } = req.body;
    
    if (!audioData) {
      return res.status(400).json({ error: 'Audio data is required' });
    }
    
    console.log('🎙️ Transcribing audio with Gemini...');
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: 'audio/webm',
          data: audioData
        }
      },
      {
        text: 'Transcribe this audio to text accurately. Rules: 1) Return only clean transcribed text 2) Remove repetitive words 3) Fix grammar 4) If unclear, return "Audio unclear" 5) Maximum 200 words'
      }
    ]);
    
    const response = await result.response;
    let transcribedText = response.text().trim();
    
    // Clean repetitive text
    transcribedText = cleanRepetitiveText(transcribedText);
    
    console.log('🎙️ Transcription result:', transcribedText);
    
    res.json({ 
      success: true, 
      transcription: transcribedText 
    });
    
  } catch (error) {
    console.error('Audio transcription error:', error);
    res.status(500).json({ 
      error: 'Failed to transcribe audio',
      transcription: 'Audio transcription failed'
    });
  }
});

// Helper function to clean repetitive text
function cleanRepetitiveText(text) {
  if (!text || text.length < 10) return text;
  
  // Split into words and remove excessive repetition
  const words = text.split(' ');
  const cleanWords = [];
  let lastWord = '';
  let repeatCount = 0;
  
  for (const word of words) {
    if (word.toLowerCase() === lastWord.toLowerCase()) {
      repeatCount++;
      if (repeatCount < 2) { // Allow max 1 repetition
        cleanWords.push(word);
      }
    } else {
      cleanWords.push(word);
      repeatCount = 0;
    }
    lastWord = word.toLowerCase();
  }
  
  let cleaned = cleanWords.join(' ');
  
  // Remove repetitive phrases
  const sentences = cleaned.split(/[.!?]+/);
  const uniqueSentences = [];
  
  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (trimmed && trimmed.length > 3) {
      // Check if this sentence is too similar to existing ones
      const isDuplicate = uniqueSentences.some(existing => {
        const similarity = calculateSimilarity(trimmed.toLowerCase(), existing.toLowerCase());
        return similarity > 0.7; // 70% similarity threshold
      });
      
      if (!isDuplicate) {
        uniqueSentences.push(trimmed);
      }
    }
  }
  
  return uniqueSentences.join('. ').trim();
}

// Calculate text similarity
function calculateSimilarity(str1, str2) {
  const words1 = str1.split(' ');
  const words2 = str2.split(' ');
  const commonWords = words1.filter(word => words2.includes(word));
  return commonWords.length / Math.max(words1.length, words2.length);
}

// One-time system initialization (run once in production)
router.get('/initialize-system', async (req, res) => {
  try {
    // Check if any admin already exists
    const adminSnapshot = await getDocs(collection(db, 'admins'));
    
    if (adminSnapshot.size > 0) {
      return res.status(400).json({ 
        error: 'System already initialized',
        adminCount: adminSnapshot.size 
      });
    }
    
    // Create first admin account
    const adminData = {
      email: 'admin@civicsense.ai',
      password: 'admin123', // Change this in production
      name: 'System Administrator',
      role: 'super_admin',
      createdAt: new Date(),
      lastLogin: null,
      loginCount: 0,
      status: 'active',
      permissions: [
        'view_complaints',
        'manage_complaints', 
        'view_analytics',
        'manage_users',
        'system_settings'
      ]
    };
    
    const docRef = await addDoc(collection(db, 'admins'), adminData);
    
    console.log('✅ Production admin initialized:', docRef.id);
    
    res.json({
      success: true,
      message: 'System initialized successfully',
      adminId: docRef.id,
      credentials: {
        email: 'admin@civicsense.ai',
        password: 'admin123'
      }
    });
    
  } catch (error) {
    console.error('System initialization error:', error);
    res.status(500).json({ error: 'Failed to initialize system' });
  }
});

// Admin registration/login endpoint
router.post('/admin-auth', async (req, res) => {
  try {
    const { email, password, action } = req.body;
    
    if (action === 'login') {
      // Check admin credentials
      const adminQuery = query(
        collection(db, 'admins'),
        where('email', '==', email)
      );
      
      const adminSnapshot = await getDocs(adminQuery);
      
      if (adminSnapshot.empty) {
        return res.status(401).json({ error: 'Admin not found' });
      }
      
      const adminDoc = adminSnapshot.docs[0];
      const adminData = adminDoc.data();
      
      // Simple password check (in production, use proper hashing)
      if (adminData.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Update last login
      await updateDoc(doc(db, 'admins', adminDoc.id), {
        lastLogin: new Date(),
        loginCount: (adminData.loginCount || 0) + 1
      });
      
      res.json({
        success: true,
        admin: {
          id: adminDoc.id,
          email: adminData.email,
          name: adminData.name,
          role: adminData.role
        }
      });
      
    } else if (action === 'register') {
      // Create new admin (only if authorized)
      const newAdmin = {
        email,
        password, // In production, hash this
        name: req.body.name || 'Admin',
        role: 'admin',
        createdAt: new Date(),
        lastLogin: new Date(),
        loginCount: 1,
        status: 'active'
      };
      
      const docRef = await addDoc(collection(db, 'admins'), newAdmin);
      
      res.json({
        success: true,
        admin: {
          id: docRef.id,
          email: newAdmin.email,
          name: newAdmin.name,
          role: newAdmin.role
        }
      });
    }
    
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Admin activity logging
router.post('/admin-activity', async (req, res) => {
  try {
    const { adminId, action, details } = req.body;
    
    await addDoc(collection(db, 'admin_activities'), {
      adminId,
      action,
      details,
      timestamp: new Date(),
      ip: req.ip || 'unknown'
    });
    
    res.json({ success: true });
    
  } catch (error) {
    console.error('Activity logging error:', error);
    res.status(500).json({ error: 'Failed to log activity' });
  }
});

export default router;