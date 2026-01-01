import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import "./PillNav.css";

const CardNav = ({
  logo,
  logoAlt = "Logo",
  items,
  activeHref,
  className = "",
  pillColor = "rgba(255,255,255,0.9)",
  hoveredPillTextColor = "#ffffff",
  pillTextColor = "#202124"
}) => {

  const [dropdownOpen, setDropdownOpen] = useState(null);
  const circleRefs = useRef([]);
  const tlRefs = useRef([]);
  const logoImgRef = useRef(null);

  /* ===============================
     GSAP HOVER EFFECT
  ================================ */
  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle, i) => {
        if (!circle?.parentElement) return;



        gsap.set(circle, {
          scale: 0,
          xPercent: -50,
          yPercent: 100,
          transformOrigin: "50% 100%"
        });

        tlRefs.current[i]?.kill();

        const tl = gsap.timeline({ paused: true });
        tl.to(circle, {
          scale: 1.2,
          duration: 0.35,
          ease: "power2.out"
        });

        tlRefs.current[i] = tl;
      });
    };

    layout();
    window.addEventListener("resize", layout);
    return () => window.removeEventListener("resize", layout);
  }, [items]);

  const cssVars = {
    "--google-blue": "#4285F4",
    "--google-red": "#EA4335",
    "--google-yellow": "#FBBC05",
    "--google-green": "#34A853",
    "--pill-bg": pillColor,
    "--pill-text": pillTextColor,
    "--hover-text": hoveredPillTextColor
  };

  return (
    <div className="pill-nav-container">
      <nav className={`pill-nav ${className}`} style={cssVars}>
        {/* LOGO */}
        <Link
          to="/"
          className="pill-logo"
          onMouseEnter={() => {
            if (logoImgRef.current) {
              gsap.fromTo(
                logoImgRef.current,
                { rotate: 0 },
                { rotate: 360, duration: 0.6, ease: "power2.out" }
              );
            }
          }}
        >
          <img src={logo} alt={logoAlt} ref={logoImgRef} />
        </Link>

        {/* NAV ITEMS */}
        <div className="pill-nav-items">
          <ul className="pill-list">
            {items.map((item, i) => (
              <li key={item.href || item.label} className="pill-item">
                {item.subitems ? (
                  <div className="dropdown">
                    <button
                      className={`pill ${dropdownOpen === i ? "is-active" : ""}`}
                      onClick={() => setDropdownOpen(dropdownOpen === i ? null : i)}
                      onMouseEnter={() => tlRefs.current[i]?.play()}
                      onMouseLeave={() => tlRefs.current[i]?.reverse()}
                    >
                      <span
                        className="hover-circle"
                        ref={el => (circleRefs.current[i] = el)}
                      />
                      <span className="pill-label">{item.label} ▼</span>
                    </button>
                    {dropdownOpen === i && (
                      <ul className="dropdown-menu show">
                        {item.subitems.map((subitem, j) => (
                          <li key={subitem.href || j}>
                            {subitem.onClick ? (
                              <button
                                onClick={subitem.onClick}
                                className={`dropdown-item ${activeHref === subitem.href ? "is-active" : ""}`}
                                style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
                              >
                                {subitem.label}
                              </button>
                            ) : (
                              <Link
                                to={subitem.href}
                                className={`dropdown-item ${activeHref === subitem.href ? "is-active" : ""}`}
                              >
                                {subitem.label}
                              </Link>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={`pill ${activeHref === item.href ? "is-active" : ""}`}
                    onMouseEnter={() => tlRefs.current[i]?.play()}
                    onMouseLeave={() => tlRefs.current[i]?.reverse()}
                  >
                    <span
                      className="hover-circle"
                      ref={el => (circleRefs.current[i] = el)}
                    />
                    <span className="pill-label">{item.label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default CardNav;
