import { useState } from 'react';
import MagicBento from '../components/effects/MagicBento';
import ClickSpark from '../components/effects/ClickSpark';
import Footer from '../components/common/Footer';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    alert('Thank you for your message! We will get back to you soon.');
  };

  const contactInfo = [
    {
      icon: '📧',
      title: 'Email Us',
      description: 'Get in touch via email',
      contact: 'support@civicsense.ai',
      action: 'mailto:support@civicsense.ai'
    },
    {
      icon: '📞',
      title: 'Call Us',
      description: '24/7 support hotline',
      contact: '8885277944',
      action: 'tel:8885277944'
    },
    {
      icon: '📍',
      title: 'Visit Us',
      description: 'Our headquarters',
      contact: 'Vaddeswaram,Vijayawada, Andhra Pradesh, India',
      action: 'https://maps.google.com'
    },
    {
      icon: '💬',
      title: 'Live Chat',
      description: 'Instant support',
      contact: 'Available 9 AM - 6 PM',
      action: '#'
    }
  ];

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="hero-content">
          <h1 className="hero-title">Get in Touch</h1>
          <p className="hero-subtitle">
            Have questions about CivicSense AI? We're here to help you make your community better.
          </p>
        </div>
      </div>

      <div className="contact-content">
        <div className="contact-form-section">
          <div className="form-container">
            <div className="form-header">
              <h2>Send us a Message</h2>
              <p>Fill out the form below and we'll get back to you within 24 hours.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email address"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  placeholder="What's this about?"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  placeholder="Tell us how we can help you..."
                  rows="5"
                  className="form-textarea"
                />
              </div>

              <ClickSpark
                sparkColor="#4285F4"
                sparkSize={12}
                sparkRadius={25}
                sparkCount={12}
                duration={600}
                extraScale={1.2}
              >
                <button type="submit" className="submit-btn">
                  <span className="btn-text">Send Message</span>
                  <span className="btn-icon">✨</span>
                </button>
              </ClickSpark>
            </form>
          </div>
        </div>

        <div className="contact-info-section">
          <div className="info-header">
            <h2>Contact Information</h2>
            <p>Choose your preferred way to reach us</p>
          </div>
          
          <div className="contact-cards">
            {contactInfo.map((info, index) => (
              <ClickSpark
                key={index}
                sparkColor="#34A853"
                sparkSize={8}
                sparkRadius={20}
                sparkCount={8}
                duration={500}
              >
                <a 
                  href={info.action}
                  className="contact-card"
                  target={info.action.startsWith('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                >
                  <div className="card-icon">{info.icon}</div>
                  <div className="card-content">
                    <h3 className="card-title">{info.title}</h3>
                    <p className="card-description">{info.description}</p>
                    <span className="card-contact">{info.contact}</span>
                  </div>
                  <div className="card-arrow">→</div>
                </a>
              </ClickSpark>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
