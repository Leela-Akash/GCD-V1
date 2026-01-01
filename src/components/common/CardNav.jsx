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
  ease = "power3.easeOut",
  baseColor = "#fff",
  pillColor = "#060010",
  hoveredPillTextColor = "#060010",
  pillTextColor,
  onMobileMenuClick,
  initialLoadAnimation = true
}) => {
  const resolvedPillTextColor = pillTextColor ?? baseColor;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const circleRefs = useRef([]);
  const tlRefs = useRef([]);
  const logoImgRef = useRef(null);
  const hamburgerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navItemsRef = useRef(null);
  const logoRef = useRef(null);

  /* ===============================
     GSAP SETUP (FAST ANIMATIONS)
  ================================ */
  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach(circle => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;

        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`
        });

        const label = pill.querySelector(".pill-label");
        const hoverLabel = pill.querySelector(".pill-label-hover");

        if (label) gsap.set(label, { y: 0 });
        if (hoverLabel) gsap.set(hoverLabel, { y: h + 12, opacity: 0 });

        const index = circleRefs.current.indexOf(circle);
        if (index === -1) return;

        tlRefs.current[index]?.kill();

        const tl = gsap.timeline({ paused: true });

        tl.to(circle, {
          scale: 1.2,
          duration: 0.35,
          ease: "power2.out"
        }, 0);

        if (label) {
          tl.to(label, {
            y: -(h + 8),
            duration: 0.35,
            ease: "power2.out"
          }, 0);
        }

        if (hoverLabel) {
          tl.to(hoverLabel, {
            y: 0,
            opacity: 1,
            duration: 0.35,
            ease: "power2.out"
          }, 0);
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();
    window.addEventListener("resize", layout);
    return () => window.removeEventListener("resize", layout);
  }, [items, ease, initialLoadAnimation]);

  /* ===============================
     MOBILE MENU
  ================================ */
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
    onMobileMenuClick?.();
  };

  /* ===============================
     CSS VARIABLES
  ================================ */
  const cssVars = {
    "--base": baseColor,
    "--pill-bg": pillColor,
    "--hover-text": hoveredPillTextColor,
    "--pill-text": resolvedPillTextColor
  };

  return (
    <div className="pill-nav-container">
      <nav className={`pill-nav ${className}`} style={cssVars}>
        {/* LOGO */}
        <Link
          to="/"
          className="pill-logo"
          ref={logoRef}
          onMouseEnter={() => {
            if (logoImgRef.current) {
              gsap.fromTo(
                logoImgRef.current,
                { rotate: 0 },
                { rotate: 360, duration: 0.08, ease: "power2.out" }
              );
            }
          }}
        >
          <img src={logo} alt={logoAlt} ref={logoImgRef} />
        </Link>

        {/* DESKTOP NAV */}
        <div className="pill-nav-items desktop-only" ref={navItemsRef}>
          <ul className="pill-list">
            {items.map((item, i) => (
              <li key={item.href}>
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
                  <span className="label-stack">
                    <span className="pill-label">{item.label}</span>
                    <span className="pill-label-hover">{item.label}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* MOBILE BUTTON */}
        <button
          className="mobile-menu-button mobile-only"
          onClick={toggleMobileMenu}
          ref={hamburgerRef}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </nav>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-popover mobile-only" ref={mobileMenuRef} style={cssVars}>
          <ul className="mobile-menu-list">
            {items.map(item => (
              <li key={item.href}>
                <Link to={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CardNav;
