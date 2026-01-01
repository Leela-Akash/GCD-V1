import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      background: '#050508',
      color: '#fff',
      padding: '60px 12% 40px',
      position: 'relative',
      overflow: 'hidden',
      borderTop: '1px solid rgba(175, 153, 246, 0.2)'
    }}>
      {/* Background Grid Effect */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 20% 80%, rgba(175, 153, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(175, 153, 246, 0.1) 0%, transparent 50%)',
        zIndex: 0
      }} />

      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          {/* Company Info */}
          <div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '16px',
              background: 'linear-gradient(135deg, #af99f6, #ffffff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Google CivicSense AI
            </h3>
            <p style={{
              color: 'rgba(255, 255, 255, 0.8)',
              lineHeight: '1.6',
              marginBottom: '20px'
            }}>
              Empowering citizens with AI-driven civic engagement. Transforming urban governance through intelligent complaint analysis and transparent resolution.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {['Twitter', 'LinkedIn', 'GitHub', 'YouTube'].map((platform) => (
                <a
                  key={platform}
                  href="#"
                  style={{
                    color: '#af99f6',
                    textDecoration: 'none',
                    padding: '8px 12px',
                    border: '1px solid #af99f6',
                    borderRadius: '6px',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    display: 'inline-block'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#af99f6';
                    e.target.style.color = '#050508';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#af99f6';
                  }}
                >
                  {platform}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px',
              color: '#af99f6'
            }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                'About CivicSense',
                'How It Works',
                'AI Features',
                'Municipal Partners',
                'Privacy Policy',
                'Terms of Service'
              ].map((link) => (
                <li key={link} style={{ marginBottom: '8px' }}>
                  <a
                    href="#"
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      textDecoration: 'none',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#af99f6'}
                    onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px',
              color: '#af99f6'
            }}>
              Contact Us
            </h4>
            <div style={{ marginBottom: '16px' }}>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '4px 0' }}>
                📧 support@civicsense.ai
              </p>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '4px 0' }}>
                📞 +1 (555) 123-4567
              </p>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '4px 0' }}>
                📍 Mountain View, CA
              </p>
            </div>
            <p style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '14px',
              lineHeight: '1.5'
            }}>
              Available 24/7 for urgent civic issues. Our AI-powered system ensures rapid response and resolution.
            </p>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px',
              color: '#af99f6'
            }}>
              Stay Updated
            </h4>
            <p style={{
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              Get the latest updates on civic technology and urban innovation.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <input
                type="email"
                placeholder="Enter your email"
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(175, 153, 246, 0.3)',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <button style={{
                padding: '10px 16px',
                background: 'linear-gradient(135deg, #af99f6, #8a7cf6)',
                border: 'none',
                borderRadius: '6px',
                color: '#050508',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(175, 153, 246, 0.2)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <p style={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '14px',
            margin: 0
          }}>
            © 2024 Google CivicSense AI. All rights reserved. Powered by Google AI.
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Privacy', 'Terms', 'Accessibility'].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = '#af99f6'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
