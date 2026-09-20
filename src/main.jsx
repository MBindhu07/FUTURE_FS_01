import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const projects = [
  {
    title: "SafeAI Drive",
    type: "AI • Road Safety",
    description: "An AI-focused road safety project designed to help detect risky driving situations and support safer journeys.",
    tech: ["Python", "AI/ML", "Computer Vision"]
  },
  {
    title: "Food Delivery Tracker",
    type: "Full Stack Web App",
    description: "A web application for tracking food delivery orders with a practical backend and database workflow.",
    tech: ["Flask", "SQLite", "HTML/CSS"]
  },
  {
    title: "Transfer Certificate Generator",
    type: "Web Application",
    description: "A web system for generating and managing transfer certificate information through a structured workflow.",
    tech: ["Node.js", "Express", "MySQL"]
  },
  {
    title: "Crop Yield Prediction",
    type: "Machine Learning",
    description: "A machine learning project focused on predicting crop yield from relevant agricultural data.",
    tech: ["Python", "scikit-learn", "Data Science"]
  }
];

const skills = {
  "Languages": ["Python", "Java", "C", "C++", "JavaScript", "TypeScript", "SQL"],
  "Web & Systems": ["React.js", "Node.js", "Express.js", "FastAPI", "Flask", "REST APIs", "HTML5", "CSS3", "Tailwind CSS"],
  "AI & ML": ["scikit-learn", "PyTorch", "TensorFlow", "CNNs", "NLP", "Ollama"],
  "Tools & Cloud": ["Git", "GitHub", "Docker", "Firebase", "MongoDB", "GCP", "Azure", "Vercel"]
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const submitContact = (e) => {
    e.preventDefault();
    setSent(true);
    e.currentTarget.reset();
  };

  return (
    <div className="site">
      <div className="glow glow-one"></div>
      <div className="glow glow-two"></div>

      <header className="navbar">
        <button className="brand" onClick={() => scrollTo("home")}>
          <span className="brand-mark">MB</span>
          <span>M Bindhu</span>
        </button>

        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
          ☰
        </button>

        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          {["home", "about", "skills", "projects", "contact"].map((item) => (
            <button key={item} onClick={() => scrollTo(item)}>
              {item}
            </button>
          ))}
          <a className="nav-cta" href="#contact" onClick={() => setMenuOpen(false)}>Let's Talk ↗</a>
        </nav>
      </header>

      <main>
        <section id="home" className="hero section">
          <div className="hero-copy">
            <p className="eyebrow">COMPUTER SCIENCE & DESIGN • FULL STACK</p>
            <h1>Building digital experiences that feel <span>simple, smart & human.</span></h1>
            <p className="hero-text">
              I'm M Bindhu, a Computer Science & Design student who enjoys building modern web
              applications and exploring AI-powered solutions.
            </p>
            <div className="hero-actions">
              <button className="primary-btn" onClick={() => scrollTo("projects")}>View My Work ↗</button>
              <button className="secondary-btn" onClick={() => scrollTo("contact")}>Contact Me</button>
            </div>
            <div className="mini-stats">
              <div><strong>Full Stack</strong><span>Development</span></div>
              <div><strong>AI / ML</strong><span>Projects</span></div>
              <div><strong>UI / UX</strong><span>Design Mindset</span></div>
            </div>
          </div>

          <div className="hero-card">
            <div className="code-window">
              <div className="window-bar"><i></i><i></i><i></i><span>bindhu.js</span></div>
              <pre>{`const developer = {
  name: "M Bindhu",
  focus: [
    "Full Stack",
    "AI Engineering",
    "UI / UX"
  ],
  mindset: "Build • Learn • Improve"
};

developer.create();`}</pre>
            </div>
            <div className="floating-card one">✦ React + Node</div>
            <div className="floating-card two">⌁ AI Explorer</div>
          </div>
        </section>

        <section id="about" className="section about">
          <div className="section-heading">
            <p className="eyebrow">01 • ABOUT</p>
            <h2>A curious developer with a <span>builder's mindset.</span></h2>
          </div>
          <div className="about-grid">
            <div className="about-card big-card">
              <div className="avatar">MB</div>
              <h3>M Bindhu</h3>
              <p>Computer Science & Design Engineering</p>
              <div className="availability">● Open to opportunities</div>
            </div>
            <div className="about-copy">
              <p>
                I enjoy turning ideas into useful, responsive and visually polished products.
                My interests sit at the intersection of full-stack development, artificial
                intelligence and thoughtful interface design.
              </p>
              <p>
                I like learning by building — from academic projects and hackathon ideas to
                practical web applications. I'm currently strengthening my development and
                problem-solving skills for the software industry.
              </p>
              <div className="facts">
                <div><span>Education</span><strong>B.E. — CSD</strong></div>
                <div><span>Current Focus</span><strong>Full Stack + AI</strong></div>
                <div><span>Workflow</span><strong>Design → Build → Test</strong></div>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="section">
          <div className="section-heading">
            <p className="eyebrow">02 • SKILLS</p>
            <h2>Tools I use to turn <span>ideas into products.</span></h2>
          </div>
          <div className="skill-grid">
            {Object.entries(skills).map(([group, items]) => (
              <article className="skill-card" key={group}>
                <div className="skill-icon">{group === "Languages" ? "01" : group === "Web & Systems" ? "02" : group === "AI & ML" ? "03" : "04"}</div>
                <h3>{group}</h3>
                <div className="chips">{items.map(item => <span key={item}>{item}</span>)}</div>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className="section projects">
          <div className="section-heading row-heading">
            <div>
              <p className="eyebrow">03 • PROJECTS</p>
              <h2>Selected work & <span>experiments.</span></h2>
            </div>
            <p className="muted">A few projects that represent my interest in web development, AI and practical problem solving.</p>
          </div>
          <div className="project-grid">
            {projects.map((project, index) => (
              <article className="project-card" key={project.title}>
                <div className="project-top">
                  <span className="project-number">0{index + 1}</span>
                  <span className="project-type">{project.type}</span>
                </div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="chips">{project.tech.map(t => <span key={t}>{t}</span>)}</div>
                <button className="project-link" onClick={() => alert("Add your live project/GitHub URL here.")}>View project ↗</button>
              </article>
            ))}
          </div>
        </section>

        <section className="section resume-banner">
          <div>
            <p className="eyebrow">04 • RESUME</p>
            <h2>Let's build something <span>meaningful.</span></h2>
            <p>Add your resume PDF to <code>public/resume.pdf</code> and the button below will open it.</p>
          </div>
          <a className="primary-btn" href="/resume.pdf" target="_blank" rel="noreferrer">Open Resume ↗</a>
        </section>

        <section id="contact" className="section contact">
          <div className="contact-copy">
            <p className="eyebrow">05 • CONTACT</p>
            <h2>Have an idea? <span>Let's talk.</span></h2>
            <p>Use the form to send a message. For real email notifications, connect this form to EmailJS, Formspree, Web3Forms, or your own backend before deployment.</p>
            <div className="contact-links">
              <a href="mailto:your-email@example.com">✉ your-email@example.com</a>
              <a href="https://github.com/" target="_blank" rel="noreferrer">◈ GitHub profile</a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">in LinkedIn profile</a>
            </div>
          </div>

          <form className="contact-form" onSubmit={submitContact}>
            <label>Name<input name="name" required placeholder="Your name" /></label>
            <label>Email<input name="email" type="email" required placeholder="you@example.com" /></label>
            <label>Message<textarea name="message" required rows="5" placeholder="Tell me about your idea..."></textarea></label>
            <button className="primary-btn" type="submit">Send Message ↗</button>
            {sent && <p className="success">Message captured successfully. Connect an email service to receive it in your inbox.</p>}
          </form>
        </section>
      </main>

      <footer>
        <div><strong>M Bindhu</strong><span>Full Stack Web Development</span></div>
        <p>© {new Date().getFullYear()} M Bindhu. Built with React.</p>
        <button onClick={() => scrollTo("home")}>Back to top ↑</button>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
