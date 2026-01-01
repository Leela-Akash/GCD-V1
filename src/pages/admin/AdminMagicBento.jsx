import { useRef, useEffect, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import CountUp from './CountUp';
import './MagicBento.css';

const DEFAULT_PARTICLE_COUNT = 15;
const DEFAULT_GLOW_COLOR = '66, 133, 244';

const createParticleElement = (x, y, color = DEFAULT_GLOW_COLOR) => {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = `
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 12px rgba(${color}, 0.8), 0 0 24px rgba(${color}, 0.4);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const ParticleCard = ({
  children,
  className = '',
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  onClick
}) => {
  const cardRef = useRef(null);
  const particlesRef = useRef([]);
  const timeoutsRef = useRef([]);
  const isHoveredRef = useRef(false);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    particlesRef.current.forEach(particle => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(1.7)',
        onComplete: () => {
          particle.parentNode?.removeChild(particle);
        }
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;

    Array.from({ length: particleCount }, (_, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const { width, height } = cardRef.current.getBoundingClientRect();
        const particle = createParticleElement(Math.random() * width, Math.random() * height, glowColor);
        
        cardRef.current.appendChild(particle);
        particlesRef.current.push(particle);

        gsap.fromTo(particle, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });

        gsap.to(particle, {
          x: (Math.random() - 0.5) * 120,
          y: (Math.random() - 0.5) * 120,
          rotation: Math.random() * 360,
          duration: 1.5 + Math.random() * 2,
          ease: 'none',
          repeat: -1,
          yoyo: true
        });

        gsap.to(particle, {
          opacity: 0.8,
          scale: 1.2,
          duration: 1,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true
        });
      }, index * 100);

      timeoutsRef.current.push(timeoutId);
    });
  }, [particleCount, glowColor]);

  useEffect(() => {
    if (!cardRef.current) return;

    const element = cardRef.current;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();

      gsap.to(element, {
        rotateX: 8,
        rotateY: 8,
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out',
        transformPerspective: 1000
      });
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();

      gsap.to(element, {
        rotateX: 0,
        rotateY: 0,
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleMouseMove = e => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;
      const magnetX = (x - centerX) * 0.08;
      const magnetY = (y - centerY) * 0.08;

      gsap.to(element, {
        rotateX,
        rotateY,
        x: magnetX,
        y: magnetY,
        duration: 0.1,
        ease: 'power2.out',
        transformPerspective: 1000
      });
    };

    const handleClick = e => {
      if (onClick) onClick(e);
      
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );

      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
      `;

      element.appendChild(ripple);

      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        {
          scale: 1,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => ripple.remove()
        }
      );
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('click', handleClick);

    return () => {
      isHoveredRef.current = false;
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('click', handleClick);
      clearAllParticles();
    };
  }, [animateParticles, clearAllParticles, glowColor, onClick]);

  return (
    <div
      ref={cardRef}
      className={`${className} particle-container`}
      style={{ ...style, position: 'relative', overflow: 'hidden' }}
    >
      {children}
    </div>
  );
};

const AdminMagicBento = ({ 
  cards = [],
  enableStars = true,
  glowColor = DEFAULT_GLOW_COLOR
}) => {
  return (
    <div className="admin-bento-grid">
      {cards.map((card, index) => {
        const CardComponent = enableStars ? ParticleCard : 'div';
        const cardProps = enableStars ? {
          glowColor,
          onClick: card.onClick
        } : {
          onClick: card.onClick
        };

        return (
          <CardComponent
            key={index}
            className="admin-bento-card"
            style={{ background: card.gradient }}
            {...cardProps}
          >
            <div className="admin-bento-icon">{card.icon}</div>
            <div className="admin-bento-content">
              <h3 className="admin-bento-title">{card.title}</h3>
              <div className="admin-bento-value">
                <CountUp 
                  from={0}
                  to={card.value}
                  duration={1.5}
                  delay={index * 0.2}
                  separator=","
                  className="count-up-number"
                />
              </div>
              <p className="admin-bento-description">{card.description}</p>
            </div>
            <div className="admin-bento-arrow">→</div>
          </CardComponent>
        );
      })}
    </div>
  );
};

export default AdminMagicBento;