// Initialize admin account in Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDNZdH6t8Wh_Nh5Nh5Nh5Nh5Nh5Nh5Nh5",
  authDomain: "civicsense-ai.firebaseapp.com",
  projectId: "civicsense-ai",
  storageBucket: "civicsense-ai.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function initializeAdmin() {
  try {
    const adminData = {
      email: 'admin@civicsense.ai',
      password: 'admin123', // In production, hash this
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
    console.log('✅ Admin account created with ID:', docRef.id);
    console.log('📧 Email: admin@civicsense.ai');
    console.log('🔑 Password: admin123');
    
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  }
}

initializeAdmin();