import { useState, useEffect, useRef } from "react";
import { FaCarSide, FaGithub } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { FaLinkedin } from "react-icons/fa";

/* ─── PURE CSS (injected once) ─── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&family=Inter:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #0a0a0f;
    --bg2:       #111118;
    --bg3:       #1a1a24;
    --accent:    #7c6af7;
    --accent2:   #a78bfa;
    --cyan:      #22d3ee;
    --green:     #4ade80;
    --text:      #e2e8f0;
    --muted:     #64748b;
    --border:    rgba(124,106,247,0.18);
    --card:      #13131c;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Inter', sans-serif;
    line-height: 1.6;
  }

  /* NAV */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 60px;
    background: rgba(10,10,15,0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
  }
  .nav-logo {
    font-family: 'Fira Code', monospace;
    font-size: 18px; font-weight: 500;
    color: var(--accent2);
    letter-spacing: -0.5px;
  }
  .nav-logo span { color: var(--cyan); }
  .nav-links { display: flex; gap: 32px; list-style: none; }
  .nav-links a {
    color: var(--muted); font-size: 14px; text-decoration: none;
    transition: color 0.2s; font-family: 'Fira Code', monospace;
  }
  .nav-links a:hover { color: var(--accent2); }
  .nav-links .active { color: var(--text); }

  /* HERO */
  .hero {
    min-height: 100vh;
    display: flex; align-items: center;
    padding: 100px 60px 60px;
    position: relative; overflow: hidden;
  }
  .hero-grid-bg {
    position: absolute; inset: 0; z-index: 0;
    background-image:
      linear-gradient(rgba(124,106,247,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(124,106,247,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
  }
  .hero-glow {
    position: absolute; top: 20%; left: 30%;
    width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(124,106,247,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .hero-content { position: relative; z-index: 1; max-width: 700px; }
  .hero-eyebrow {
    font-family: 'Fira Code', monospace;
    font-size: 13px; color: var(--cyan);
    margin-bottom: 20px; letter-spacing: 1px;
  }
  .hero-eyebrow::before { content: '> '; color: var(--accent); }
  .hero-name {
    font-size: clamp(42px, 6vw, 72px);
    font-weight: 600; line-height: 1.1;
    color: #fff; margin-bottom: 12px;
    letter-spacing: -2px;
  }
  .hero-name .accent { color: var(--accent2); }
  .hero-role {
    font-family: 'Fira Code', monospace;
    font-size: clamp(16px, 2.5vw, 22px);
    color: var(--muted); margin-bottom: 28px;
    min-height: 32px;
  }
  .hero-role .cursor {
    display: inline-block; width: 2px; height: 1.1em;
    background: var(--accent2); vertical-align: text-bottom;
    animation: blink 1s step-end infinite;
  }
  @keyframes blink { 50% { opacity: 0; } }
  .hero-desc {
    font-size: 16px; color: var(--muted); max-width: 520px;
    line-height: 1.8; margin-bottom: 40px;
  }
  .hero-btns { display: flex; gap: 14px; flex-wrap: wrap; }
  .btn-primary {
    padding: 12px 28px; border-radius: 8px;
    background: var(--accent); color: #fff;
    font-size: 14px; font-weight: 500; border: none;
    cursor: pointer; text-decoration: none;
    transition: background 0.2s, transform 0.15s;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .btn-primary:hover { background: var(--accent2); transform: translateY(-1px); }
  .btn-outline {
    padding: 12px 28px; border-radius: 8px;
    background: transparent; color: var(--text);
    font-size: 14px; font-weight: 500;
    border: 1px solid var(--border);
    cursor: pointer; text-decoration: none;
    transition: border-color 0.2s, transform 0.15s;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .btn-outline:hover { border-color: var(--accent2); color: var(--accent2); transform: translateY(-1px); }

  /* TERMINAL CARD */
  .terminal {
    position: absolute; right: 60px; top: 50%;
    transform: translateY(-50%);
    width: 380px; background: var(--card);
    border: 1px solid var(--border); border-radius: 12px;
    overflow: hidden; font-family: 'Fira Code', monospace;
    font-size: 13px;
  }
  .terminal-bar {
    background: var(--bg3); padding: 10px 16px;
    display: flex; align-items: center; gap: 8px;
  }
  .dot { width: 12px; height: 12px; border-radius: 50%; }
  .dot-red    { background: #ff5f57; }
  .dot-yellow { background: #febc2e; }
  .dot-green  { background: #28c840; }
  .terminal-title { color: var(--muted); font-size: 12px; margin-left: 8px; }
  .terminal-body { padding: 20px; line-height: 1.9; }
  .t-prompt { color: var(--accent); }
  .t-cmd    { color: var(--text); }
  .t-key    { color: var(--cyan); }
  .t-val    { color: var(--green); }
  .t-str    { color: #f9a875; }
  .t-comment { color: var(--muted); }

  /* SECTIONS */
  .section { padding: 90px 60px; max-width: 1100px; margin: 0 auto; }
  .section-label {
    font-family: 'Fira Code', monospace;
    font-size: 12px; color: var(--accent);
    letter-spacing: 2px; text-transform: uppercase;
    margin-bottom: 12px;
  }
  .section-title {
    font-size: clamp(26px, 3.5vw, 38px);
    font-weight: 600; color: #fff;
    letter-spacing: -1px; margin-bottom: 10px;
  }
  .section-sub { color: var(--muted); font-size: 15px; margin-bottom: 56px; }
  .divider {
    width: 48px; height: 3px; border-radius: 2px;
    background: linear-gradient(90deg, var(--accent), var(--cyan));
    margin: 16px 0 40px;
  }

  /* SKILLS */
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 20px;
  }
  .skill-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px; padding: 22px 24px;
    transition: border-color 0.25s, transform 0.2s;
  }
  .skill-card:hover { border-color: var(--accent); transform: translateY(-3px); }
  .skill-card-icon { font-size: 28px; margin-bottom: 14px; }
  .skill-card-title { font-size: 15px; font-weight: 500; color: #fff; margin-bottom: 10px; }
  .skill-tags { display: flex; flex-wrap: wrap; gap: 8px; }
  .tag {
    font-family: 'Fira Code', monospace;
    font-size: 11px; padding: 4px 10px;
    border-radius: 4px; border: 1px solid var(--border);
    color: var(--accent2);
    background: rgba(124,106,247,0.08);
  }

  /* PROJECTS */
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
  }
  .project-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 14px; padding: 28px;
    transition: border-color 0.25s, transform 0.2s;
    display: flex; flex-direction: column;
  }
  .project-card:hover { border-color: var(--accent); transform: translateY(-4px); }
  .project-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
  .project-icon { font-size: 30px; }
  .project-links { display: flex; gap: 10px; }
  .project-link {
    font-size: 18px; color: var(--muted); text-decoration: none;
    transition: color 0.2s;
  }
  .project-link:hover { color: var(--accent2); }
  .project-name { font-size: 17px; font-weight: 600; color: #fff; margin-bottom: 10px; }
  .project-desc { font-size: 14px; color: var(--muted); line-height: 1.7; margin-bottom: 18px; flex: 1; }
  .project-stack { display: flex; flex-wrap: wrap; gap: 6px; }
  .stack-tag {
    font-family: 'Fira Code', monospace;
    font-size: 11px; padding: 3px 8px;
    border-radius: 4px; color: var(--cyan);
    background: rgba(34,211,238,0.08);
    border: 1px solid rgba(34,211,238,0.15);
  }
  .project-featured {
    grid-column: 1 / -1;
    display: grid; grid-template-columns: 1.2fr 1fr;
    align-items: center; gap: 40px;
  }
  .project-featured .project-name { font-size: 22px; }
  .project-featured .project-desc { font-size: 15px; }
  .featured-badge {
    font-family: 'Fira Code', monospace;
    font-size: 11px; color: var(--accent);
    border: 1px solid var(--accent);
    padding: 3px 10px; border-radius: 4px;
    margin-bottom: 16px; display: inline-block;
  }
  .project-img-placeholder {
    background: var(--bg3); border-radius: 10px;
    height: 220px; display: flex;
    align-items: center; justify-content: center;
    font-size: 64px; border: 1px solid var(--border);
  }

  /* EXPERIENCE */
  .timeline { position: relative; padding-left: 28px; }
  .timeline::before {
    content: ''; position: absolute;
    left: 0; top: 8px; bottom: 0;
    width: 1px; background: var(--border);
  }
  .timeline-item { position: relative; margin-bottom: 48px; }
  .timeline-dot {
    position: absolute; left: -32px; top: 6px;
    width: 10px; height: 10px; border-radius: 50%;
    background: var(--accent); border: 2px solid var(--bg);
    box-shadow: 0 0 0 3px rgba(124,106,247,0.25);
  }
  .timeline-period {
    font-family: 'Fira Code', monospace;
    font-size: 12px; color: var(--accent);
    margin-bottom: 6px;
  }
  .timeline-role { font-size: 17px; font-weight: 600; color: #fff; }
  .timeline-company { font-size: 14px; color: var(--accent2); margin-bottom: 10px; }
  .timeline-desc { font-size: 14px; color: var(--muted); line-height: 1.8; }
  .timeline-tags { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }

  /* STATS */
  .stats-row {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 20px; margin: 60px 0;
  }
  .stat-box {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 12px; padding: 24px;
    text-align: center;
  }
  .stat-num {
    font-family: 'Fira Code', monospace;
    font-size: 32px; font-weight: 500;
    color: var(--accent2); line-height: 1;
    margin-bottom: 6px;
  }
  .stat-label { font-size: 13px; color: var(--muted); }

  /* CONTACT */
  .contact-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 60px; align-items: start;
  }
  .contact-info p { color: var(--muted); font-size: 15px; line-height: 1.8; margin-bottom: 32px; }
  .contact-links { display: flex; flex-direction: column; gap: 14px; }
  .contact-link {
    display: flex; align-items: center; gap: 14px;
    color: var(--text); text-decoration: none;
    font-size: 14px; padding: 14px 18px;
    background: var(--card); border: 1px solid var(--border);
    border-radius: 10px; transition: border-color 0.2s;
  }
  .contact-link:hover { border-color: var(--accent2); color: var(--accent2); }
  .contact-link-icon { font-size: 20px; }
  .contact-form { display: flex; flex-direction: column; gap: 16px; }
  .form-group { display: flex; flex-direction: column; gap: 6px; }
  .form-label { font-size: 13px; color: var(--muted); font-family: 'Fira Code', monospace; }
  .form-input, .form-textarea {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 8px; padding: 12px 16px;
    color: var(--text); font-size: 14px; font-family: 'Inter', sans-serif;
    outline: none; transition: border-color 0.2s;
  }
  .form-input:focus, .form-textarea:focus { border-color: var(--accent); }
  .form-textarea { resize: vertical; min-height: 120px; }

  /* FOOTER */
  .footer {
    border-top: 1px solid var(--border);
    padding: 32px 60px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .footer-copy {
    font-family: 'Fira Code', monospace;
    font-size: 13px; color: var(--muted);
  }
  .footer-copy span { color: var(--accent2); }
  .social-links { display: flex; gap: 16px; }
  .social-link {
    width: 36px; height: 36px; border-radius: 8px;
    background: var(--card); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    color: var(--muted); text-decoration: none; font-size: 16px;
    transition: border-color 0.2s, color 0.2s;
  }
  .social-link:hover { border-color: var(--accent2); color: var(--accent2); }

  /* MOBILE */
  @media (max-width: 900px) {
    .nav { padding: 16px 24px; }
    .hero { padding: 100px 24px 60px; }
    .terminal { display: none; }
    .section { padding: 60px 24px; }
    .stats-row { grid-template-columns: repeat(2, 1fr); }
    .contact-grid { grid-template-columns: 1fr; gap: 40px; }
    .project-featured { grid-template-columns: 1fr; }
    .project-img-placeholder { display: none; }
    .footer { padding: 24px; flex-direction: column; gap: 16px; text-align: center; }
  }
  @media (max-width: 640px) {
    .hero-name { letter-spacing: -1px; }
    .nav-links { display: none; }
  }

  .nav-links li:last-child a {
  color: var(--cyan);
  border: 1px solid var(--border);
  padding: 6px 12px;
  border-radius: 6px;
}

.nav-links li:last-child a:hover {
  color: var(--accent2);
  border-color: var(--accent2);
}
  .resume-card {
  max-width: 720px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 26px;
}

.resume-text {
  color: var(--muted);
  font-size: 14px;
  margin-bottom: 18px;
}

.resume-frame {
  width: 100%;
  height: 520px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: white;
}

.resume-actions {
  display: flex;
  gap: 14px;
  margin-top: 18px;
  flex-wrap: wrap;
}

@media (max-width: 640px) {
  .resume-frame {
    height: 420px;
  }
}
`;

/* ─── DATA ─── */
const skills = [
  {
    icon: "🌐",
    title: "Frontend",
    tags: ["HTML5", "CSS3", "bootstrap 5", "Redux", "JavaScript"],
  },
  {
    icon: "🖥️",
    title: "Backend",
    tags: ["laravel", "codeniter", "PHP", "REST APIs"],
  },
  {
    icon: "🗄️",
    title: "Database",
    tags: ["MySQL", "PhpMyAdmin"],
  },
  {
    icon: "🛠️",
    title: "DevOps & Tools & CMS ",
    tags: ["Git", "GitHub", "VS Code", "Postman", "Wordpress"],
  },
];

const projects = [
  {
    icon: <FaCarSide />,
    name: "CarDekho Clone",
    desc: "A modern car listing platform inspired by CarDekho. Developed using React JS with responsive design, routing, reusable components and dynamic car listings. The project demonstrates frontend development skills and clean UI implementation.",
    stack: ["React JS", "JavaScript", "Bootstrap", "CSS"],
    gh: "https://github.com/mdrehan8084/carDekho-clone-frontend",
    live: "https://car-dekho-clone-frontend.vercel.app",
  },
  {
    icon: "👥",
    name: "Multi-User Login System",
    desc: "Role-based login system with Super Admin, HR, and Digital Marketing roles. Each role has its own dashboard and access permissions.",
    stack: ["PHP", "MySQL", "Bootstrap 5"],
    gh: "https://github.com/mdrehan8084/multi-user-system-adminpanel",
    live: "https://mdrehan8084.howto.rocks/login.php",
  },
  {
    icon: "📝",
    name: "Blog Website",
    desc: "Custom WordPress blog with responsive theme, post categories, contact form, and SEO-friendly structure.",
    stack: ["WordPress", "CSS", "PHP"],
    gh: "https://github.com/mdrehan8084/office-blog-wordpress",
    live: "#",
  },
  {
    icon: "⚛️",
    name: "Portfolio Website",
    desc: "Personal developer portfolio built with React.js and plain CSS. Dark theme, animated hero section, and fully responsive.",
    stack: ["React.js", "CSS", "Vite"],
    gh: "https://github.com/mdrehan8084/my-portfoilio",
    live: "#",
  },

  {
    icon: "🎓",
    name: "Student Management System",
    desc: "A complete student management application with student CRUD, course management, image upload, soft delete, restore functionality, pagination and authentication.",
    stack: ["Laravel", "PHP", "MySQL", "Bootstrap"],
    gh: "https://github.com/mdrehan8084/student-management-system",
    live: "#",
  },

  {
    icon: "🛒",
    name: "E-Commerce Website",
    desc: "Complete eCommerce platform developed using Laravel with product management, shopping cart, order handling, authentication and admin dashboard.",
    stack: ["Laravel", "PHP", "MySQL", "Bootstrap"],
    gh: "https://github.com/mdrehan8084/responship-ecommerce-website",
    live: "#",
  },

  {
    icon: "🍔",
    name: "Food Delivery System",
    desc: "Food ordering and delivery management application with restaurant listings, menu management and order processing.",
    stack: ["PHP", "MySQL", "Bootstrap"],
    gh: "https://github.com/mdrehan8084/food-delivery-system-app",
    live: "#",
  },

  {
    icon: "🌦️",
    name: "Weather API App",
    desc: "Weather forecast application using REST API integration to display real-time weather information.",
    stack: ["API", "JavaScript", "Bootstrap"],
    gh: "https://github.com/mdrehan8084/weather-api-test",
    live: "#",
  },
];

const experience = [
  {
    period: "2025 - 2026",
    role: "Full Stack Web Development Training",
    company: "Next-G Education, Delhi",
    desc: "Completed professional training in HTML, CSS, Bootstrap, JavaScript, PHP, CodeIgniter, Laravel, React JS, MySQL, Git and GitHub. Built multiple frontend and backend projects during the training program.",
    tags: ["HTML", "CSS", "JavaScript", "PHP"],
  },
  {
    period: "2026",
    role: "Frontend Development Projects",
    company: "Next-G Education, Delhi",
    desc: "Developed a CarDekho Clone using React JS with modern UI, routing, reusable components and responsive design principles.",
    tags: ["React JS", "Bootstrap", "JavaScript", "GitHub"],
  },
  {
    period: "2026",
    role: "Backend Development Projects",
    company: "Next-G Education, Delhi",
    desc: "Built Student Management System and Multi User Login System with authentication, CRUD operations, image upload, role management and database integration.",
    tags: ["Laravel", "PHP", "MySQL", "Bootstrap"],
  },
];
/* ─── TYPEWRITER HOOK ─── */
function useTypewriter(words, speed = 80, pause = 1800) {
  const [display, setDisplay] = useState("");
  const [wIdx, setWIdx] = useState(0);
  const [cIdx, setCIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wIdx];
    const delay = deleting ? speed / 2 : speed;
    const timer = setTimeout(() => {
      if (!deleting) {
        setDisplay(word.slice(0, cIdx + 1));
        if (cIdx + 1 === word.length) {
          setTimeout(() => setDeleting(true), pause);
        } else {
          setCIdx((c) => c + 1);
        }
      } else {
        setDisplay(word.slice(0, cIdx - 1));
        if (cIdx - 1 === 0) {
          setDeleting(false);
          setWIdx((w) => (w + 1) % words.length);
          setCIdx(0);
        } else {
          setCIdx((c) => c - 1);
        }
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [cIdx, deleting, wIdx, words, speed, pause]);

  return display;
}

/* ─── COMPONENTS ─── */
function Nav({ active }) {
  const links = [
    "About",
    "Skills",
    "Projects",
    "Experience",
    "Contact",
    "Resume",
  ];

  return (
    <nav className="nav">
      <div className="nav-logo">
        &lt;<span>Rehan</span> /&gt;
      </div>

      <ul className="nav-links">
        {links.map((l) => (
          <li key={l}>
            <a
              href={`#${l.toLowerCase()}`}
              className={active === l.toLowerCase() ? "active" : ""}
            >
              {l.toLowerCase()}
            </a>
          </li>
        ))}

        <li>
          <a
            href="/mdrehan-resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            resume
          </a>
        </li>
      </ul>
    </nav>
  );
}
function Hero() {
  const role = useTypewriter([
    "MD Rehan",

    "Full Stack Web Developer",

    "HTML | CSS | Bootstrap | JavaScript | PHP | Laravel | React JS",

    "Building responsive and scalable web applications.",
  ]);

  return (
    <section className="hero" id="about">
      <div className="hero-grid-bg" />
      <div className="hero-glow" />
      <div className="hero-content">
        <p className="hero-eyebrow">Hello, World! I'm</p>
        <h1 className="hero-name">
          MD <span className="accent">Rehan</span>
        </h1>
        <p className="hero-role">
          {role}
          <span className="cursor" />
        </p>
        <p className="hero-desc">
          Full Stack Web Developer skilled in Laravel, React JS, PHP and MySQL.
          Experienced in building responsive web applications, authentication
          systems, REST APIs, admin panels and database-driven applications.
          Currently seeking Internship, Junior Developer and Freelance
          opportunities.
        </p>
        <div className="hero-btns">
          <a href="#projects" className="btn-primary">
            View My Work →
          </a>

          <a
            href="/mdrehan-resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            📄 Download Resume
          </a>

          <a href="#contact" className="btn-outline">
            Let's Connect
          </a>
        </div>
      </div>

      {/* Terminal Card */}
      <div className="terminal">
        <div className="terminal-bar">
          <div className="dot dot-red" />
          <div className="dot dot-yellow" />
          <div className="dot dot-green" />
          <span className="terminal-title">mdrehan@dev ~ portfolio.json</span>
        </div>
        <div className="terminal-body">
          <div>
            <span className="t-prompt">$ </span>
            <span className="t-cmd">cat portfolio.json</span>
          </div>
          <div style={{ marginTop: 8 }}>{"{"}</div>
          <div>
            &nbsp;&nbsp;<span className="t-key">"name"</span>:{" "}
            <span className="t-str">"Md Rehan"</span>
          </div>
          <div>
            &nbsp;&nbsp;<span className="t-key">"role"</span>:{" "}
            <span className="t-str">"Full Stack Dev"</span>,
          </div>
          <div>
            &nbsp;&nbsp;<span className="t-key">"exp"</span>:{" "}
            <span className="t-val">Junior Dev</span>,
          </div>
          <div>
            &nbsp;&nbsp;<span className="t-key">"location"</span>:{" "}
            <span className="t-str">"Delhi, IN"</span>,
          </div>
          <div>
            &nbsp;&nbsp;<span className="t-key">"stack"</span>: [
          </div>
          <div>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="t-str">"React js"</span>,{" "}
            <span className="t-str">"php "</span>,
          </div>
          <div>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="t-str">"MySQL"</span>,{" "}
          </div>
          <div>&nbsp;&nbsp;],</div>
          <div>
            &nbsp;&nbsp;<span className="t-key">"available"</span>:{" "}
            <span className="t-val">true</span>
          </div>
          <div>{"}"}</div>
          <div style={{ marginTop: 8 }}>
            <span className="t-prompt">$ </span>
            <span className="t-comment">█</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section className="section" id="skills">
      <p className="section-label">// what I work with</p>
      <h2 className="section-title">Skills & Tech Stack</h2>
      <div className="divider" />
      <div className="skills-grid">
        {skills.map((s) => (
          <div className="skill-card" key={s.title}>
            <div className="skill-card-icon">{s.icon}</div>
            <div className="skill-card-title">{s.title}</div>
            <div className="skill-tags">
              {s.tags.map((t) => (
                <span className="tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Projects() {
  const [featured, ...rest] = projects;
  return (
    <section className="section" id="projects">
      <p className="section-label">// things I've built</p>
      <h2 className="section-title">Projects</h2>
      <div className="divider" />
      <div className="projects-grid">
        {/* Featured */}
        <div className="project-card project-featured">
          <div>
            <span className="featured-badge">⭐ Featured Project</span>
            <div className="project-name">{featured.name}</div>
            <div className="project-desc">{featured.desc}</div>
            <div className="project-stack">
              {featured.stack.map((t) => (
                <span className="stack-tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
            <div className="project-links" style={{ marginTop: 20, gap: 12 }}>
              <a
                href={featured.gh}
                className="btn-outline"
                style={{ fontSize: 13, padding: "8px 18px" }}
              >
                <FaGithub /> GitHub
              </a>

              <a
                href={featured.live}
                className="btn-primary"
                style={{ fontSize: 13, padding: "8px 18px" }}
              >
                <FiExternalLink /> Live Demo
              </a>
            </div>
          </div>
          <div className="project-img-placeholder">{featured.icon}</div>
        </div>
        {/* Rest */}
        {/* Rest */}
        {rest.map((p) => (
          <div className="project-card" key={p.name}>
            <div className="project-top">
              <div className="project-icon">{p.icon}</div>

              <div className="project-links">
                <a
                  href={p.gh}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link"
                  title="GitHub"
                >
                  <FaGithub />
                </a>

                <a
                  href={p.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link"
                  title="Live Demo"
                >
                  <FiExternalLink />
                </a>
              </div>
            </div>

            <div className="project-name">{p.name}</div>

            <div className="project-desc">{p.desc}</div>

            <div className="project-stack">
              {p.stack.map((t) => (
                <span className="stack-tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section className="section" id="experience">
      <p className="section-label">// where I've worked</p>
      <h2 className="section-title">Experience</h2>
      <div className="divider" />

      <div className="stats-row">
        {[
          { num: "8+", label: " Projects Completed" },
          { num: "10+", label: " Technologies Learned" },
          { num: "1+", label: "Year Training" },
          { num: "150+", label: "GitHub Commits" },
        ].map((s) => (
          <div className="stat-box" key={s.label}>
            <div className="stat-num">{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="timeline">
        {experience.map((e) => (
          <div className="timeline-item" key={e.role}>
            <div className="timeline-dot" />
            <div className="timeline-period">{e.period}</div>
            <div className="timeline-role">{e.role}</div>
            <div className="timeline-company">@ {e.company}</div>
            <div className="timeline-desc">{e.desc}</div>
            <div className="timeline-tags">
              {e.tags.map((t) => (
                <span className="tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="section" id="contact">
      <p className="section-label">// get in touch</p>
      <h2 className="section-title">Let's Work Together</h2>
      <div className="divider" />
      <div className="contact-grid">
        <div className="contact-info">
          <p>
            I'm currently open to freelance projects and full-time
            opportunities. Whether you have a project in mind or just want to
            say hi — my inbox is always open!
          </p>
          <div className="contact-links">
            {[
              {
                icon: "📧",
                label: "rehanmd62076@gmail.com",
                href: "mailto:rehanmd62076@gmail.com",
              },
              {
                icon: "📄",
                label: "Download Resume",
                href: "/mdrehan-resume.pdf",
              },
              {
                icon: "📱",
                label: "+91 8084524725",
                href: "tel:+918084524725",
              },
              {
                icon: "📱",
                label: "+91 6204293932",
                href: "tel:+916204293932",
              },
              {
                icon: <FaLinkedin />,
                label: "linkedin.com/in/mdrehan8084",
                href: "https://linkedin.com/in/mdrehan-565331415",
              },
              {
                icon: <FaGithub />,
                label: "github.com/mdrehan8084",
                href: "https://github.com/mdrehan8084",
              },
              { icon: "📍", label: "Delhi, India — Open to remote", href: "#" },
            ].map((c) => (
              <a href={c.href} className="contact-link" key={c.label}>
                <span className="contact-link-icon">{c.icon}</span>
                <span>{c.label}</span>
              </a>
            ))}
          </div>
        </div>
        <div>
          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label className="form-label">name</label>
              <input
                className="form-input"
                type="text"
                placeholder="Your name"
              />
            </div>
            <div className="form-group">
              <label className="form-label">email</label>
              <input
                className="form-input"
                type="email"
                placeholder="your@email.com"
              />
            </div>
            <div className="form-group">
              <label className="form-label">message</label>
              <textarea
                className="form-textarea"
                placeholder="Tell me about your project..."
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              style={{ alignSelf: "flex-start" }}
            >
              Send Message →
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
function Resume() {
  return (
    <section className="section" id="resume">
      <p className="section-label">// my resume</p>
      <h2 className="section-title">
        My <span style={{ color: "var(--cyan)" }}>Resume</span>
      </h2>
      <div className="divider" />

      <div className="resume-card">
        <p className="resume-text">
          Preview below, or download the file directly.
        </p>

        <iframe
          src="/mdrehan-resume.pdf"
          title="Md Rehan Resume"
          className="resume-frame"
        />

        <div className="resume-actions">
          <a href="/mdrehan-resume.pdf" download className="btn-primary">
            Download PDF
          </a>

          <a
            href="/mdrehan-resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            Open in new tab
          </a>
        </div>
      </div>
    </section>
  );
}
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-copy">
        Designed & Built by <span>Md Rehan</span> · 2026
      </div>
      <div className="social-links">
        {["GH", "LI", "TW", "EM"].map((s) => (
          <a href="#" className="social-link" key={s} title={s}>
            {s === "GH" ? "⌥" : s === "LI" ? "in" : s === "TW" ? "𝕏" : "✉"}
          </a>
        ))}
      </div>
    </footer>
  );
}

/* ─── APP ─── */
export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("about");

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { threshold: 0.4 },
    );
    document
      .querySelectorAll("section[id]")
      .forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Nav active={activeSection} />
      <Hero />
      <Skills />
      <Projects />
      <Experience />
      <Contact />
      <Resume />
      <Footer />
    </>
  );
}
