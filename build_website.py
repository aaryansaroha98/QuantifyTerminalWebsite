import os

WEB_DIR = "/Users/aaryansaroha/Documents/Projects/Quantify Terminal Website"

def write_file(filename, content):
    with open(os.path.join(WEB_DIR, filename), 'w', encoding='utf-8') as f:
        f.write(content.strip())

CSS_CONTENT = """
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');

:root {
  --bg-color: #030303;
  --panel-bg: #090909;
  --text-primary: #ffffff;
  --text-secondary: #999999;
  --accent: #ed8c00; /* Subtle orange/gold accent typical for terminal / broker apps if he liked the old one, but lets stick to a professional blue/neutral if orange wasn't requested. Actually in screenshot it has orange text "Download Terminal". Let's use that */
  --accent-glow: rgba(237, 140, 0, 0.3);
  --border-light: rgba(255, 255, 255, 0.05); /* very subtle, mostly removed */
  --font-main: 'Inter', -apple-system, sans-serif;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  font-family: var(--font-main);
  background-color: var(--bg-color);
  color: var(--text-primary);
  line-height: 1.6;
}

body {
  background-color: var(--bg-color);
  overflow-x: hidden;
}

a {
  color: inherit;
  text-decoration: none;
  transition: all 0.2s ease;
}

a:hover {
  color: #fff;
}

/* Header */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  background: rgba(3, 3, 3, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  font-size: 1.25rem;
  letter-spacing: -0.5px;
}

.brand img {
  height: 28px;
  width: auto;
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-links a {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.nav-links a:hover, .nav-links a.active {
  color: var(--text-primary);
}

/* Button */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: var(--accent);
  color: #000;
  box-shadow: 0 4px 15px var(--accent-glow);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--accent-glow);
}

.btn-secondary {
  background: var(--panel-bg);
  border: 1px solid var(--border-light);
  color: var(--text-primary);
}

.btn-secondary:hover {
  background: #111;
  transform: translateY(-2px);
}

/* Layout */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

section {
  padding: 6rem 0;
  position: relative;
}

/* Typography */
h1 {
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: -1.5px;
  margin-bottom: 1.5rem;
}

h2 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 600;
  letter-spacing: -1px;
  margin-bottom: 1rem;
}

p.subtitle {
  font-size: clamp(1.1rem, 2vw, 1.25rem);
  color: var(--text-secondary);
  max-width: 700px;
  margin-bottom: 2.5rem;
}

/* Hero */
.hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding-top: 8rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

/* Image Showcase (Cleaned up, no white borders) */
.showcase-container {
  margin-top: 4rem;
  width: 100%;
  max-width: 1100px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0,0,0,0.8);
  border: 1px solid var(--border-light);
}

.showcase-container img {
  width: 100%;
  display: block;
}

/* Features Grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
}

.feature-card {
  background: var(--panel-bg);
  border-radius: 12px;
  padding: 2.5rem;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  position: relative;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.6);
}

.feature-card h3 {
  font-size: 1.3rem;
  margin-bottom: 0.75rem;
  color: #fff;
}

.feature-card p {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.6;
}

/* Download Cards Redesign */
.download-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--panel-bg);
  border-radius: 16px;
  padding: 3.5rem 2.5rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
  transition: all 0.4s ease;
}

.download-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.8);
  background: #0f0f0f;
}

.dl-icon-container {
  width: 80px;
  height: 80px;
  background: rgba(255,255,255,0.02);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  transition: transform 0.4s ease, background 0.4s ease;
}

.download-card:hover .dl-icon-container {
  transform: translateY(-5px);
  background: rgba(237, 140, 0, 0.1);
}

.dl-icon-container svg {
  width: 40px;
  height: 40px;
  color: #fff;
}

.download-card:hover .dl-icon-container svg {
  color: var(--accent);
}

/* Content Blocks for About/Connect */
.prose {
  max-width: 800px;
  margin: 0 auto;
  color: var(--text-secondary);
  font-size: 1.1rem;
  line-height: 1.8;
}

.prose h1, .prose h2, .prose h3 {
  color: var(--text-primary);
  margin-top: 2rem;
  text-align: left;
}
.prose p, .prose ul {
  margin-bottom: 1.5rem;
}
.prose ul {
  padding-left: 1.5rem;
  list-style-type: none;
}
.prose li {
  margin-bottom: 0.75rem;
  position: relative;
}
.prose li::before {
  content: "•";
  color: var(--accent);
  font-weight: bold;
  position: absolute;
  left: -1rem;
}

/* Social Cards */
.social-card {
  display: flex;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: var(--panel-bg);
  border-radius: 8px;
  color: #fff;
  font-weight: 500;
  text-decoration: none;
  margin-bottom: 1rem;
  transition: all 0.3s;
}

.social-card svg {
  width: 24px;
  height: 24px;
  margin-right: 1.5rem;
  color: var(--text-secondary);
  transition: color 0.3s;
}

.social-card:hover {
  transform: translateX(10px);
  background: #111;
}
.social-card:hover svg {
  color: var(--accent);
}

/* Footer */
footer {
  padding: 4rem 2rem;
  margin-top: 6rem;
  background: var(--bg-color);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
}
.footer-links {
  display: flex;
  gap: 2rem;
}
.footer-links a {
  color: var(--text-secondary);
  font-size: 0.95rem;
}
.footer-text {
  color: var(--text-secondary);
  font-size: 0.9rem;
}
.footer-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: #fff;
}
.footer-brand img {
  height: 24px;
}

/* Menu Toggle (Mobile) */
.menu-toggle {
  display: none;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
}

.menu-toggle svg {
  width: 28px;
  height: 28px;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: rgba(3, 3, 3, 0.98);
    backdrop-filter: blur(20px);
    flex-direction: column;
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  }
  
  .nav-links.show {
    display: flex;
  }

  .menu-toggle {
    display: block;
  }
  
  h1 {
    font-size: 2.2rem;
  }
  
  .hero-actions {
    flex-direction: column;
    width: 100%;
  }
  .hero-actions .btn {
    width: 100%;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
}

/* Animations */
.fade-in {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}

.grid-image {
  width: 100%;
  border-radius: 12px;
  margin-top: 1rem;
  border: 1px solid var(--border-light);
}

"""

JS_CONTENT = """
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav-links');
    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('show');
        });
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-links a').forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath || (currentPath === '/' && linkPath === '/')) {
            link.classList.add('active');
            link.style.color = '#fff';
        }
    });
});
"""

HTML_NAV = """
  <nav class="navbar">
    <a href="/" class="brand">
      <img src="/Public/logo.PNG" alt="Quantify Terminal Logo">
      QUANTIFY<span>TERMINAL</span>
    </a>
    <button class="menu-toggle" aria-label="Toggle menu">
      <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
    </button>
    <div class="nav-links">
      <a href="/">Home</a>
      <a href="/features">Features</a>
      <a href="/documentation">Documentation</a>
      <a href="/download">Downloads</a>
      <a href="/about">Founder</a>
      <a href="/connect">Contact</a>
      <a href="/download" class="btn btn-primary" style="padding: 0.4rem 1.2rem; font-size: 0.85rem;">Download Terminal</a>
    </div>
  </nav>
"""

HTML_FOOTER = """
  <footer>
    <div class="footer-content">
      <div class="footer-brand">
        <img src="/Public/logo.PNG" alt="Logo">
        QUANTIFY TERMINAL
      </div>
      <div class="footer-text">
        &copy; 2026 Quantify Terminal. All rights reserved. <br>Built for professional market participants.
      </div>
      <div class="footer-links">
        <a href="https://x.com/QuantifTerm" target="_blank">X (Twitter)</a>
        <a href="https://www.linkedin.com/company/quantify-terminal/" target="_blank">LinkedIn</a>
        <a href="/connect">Community</a>
      </div>
    </div>
  </footer>
  <script src="/main.js"></script>
"""

HTML_HEAD = lambda title: f"""
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} | Quantify Terminal</title>
  <meta name="description" content="A powerful next-generation financial platform designed for serious investors, analysts, and market participants. Featuring over 22+ professional modules.">
  <meta name="theme-color" content="#030303">
  <link rel="stylesheet" href="/style.css">
  <link rel="icon" type="image/png" href="/Public/logo.PNG">
</head>
<body>
{HTML_NAV}
"""

index_html = HTML_HEAD("The Professional Market Desktop") + """
  <section class="hero container fade-in">
    <h1 style="text-align: center; margin: 0 auto; max-width: 900px;">Data that speaks for itself.</h1>
    <p class="subtitle" style="text-align: center; margin: 1.5rem auto 3rem auto;">A powerful, native desktop environment engineered exclusively for quantitative research, algorithmic logic mapping, and unparalleled global market intelligence.</p>
    <div class="hero-actions">
      <a href="/download" class="btn btn-primary">Download Terminal</a>
      <a href="/features" class="btn btn-secondary">Explore 22+ Modules</a>
    </div>

    <!-- USING REAL SHOT FROM THE qt_images FOLDER -->
    <div class="showcase-container fade-in">
      <img src="/Public/qt_images/image_03.png" alt="Terminal Dashboard Interface Preview">
    </div>
  </section>

  <section class="container fade-in">
    <div style="text-align: center; margin-bottom: 4rem;">
      <h2>Unrivaled Capabilities</h2>
      <p class="subtitle" style="margin: 0 auto;">Everything required to execute complex financial workflows at institutional speed.</p>
    </div>
    <div class="features-grid">
      <div class="feature-card fade-in">
        <h3 style="color: var(--accent);">Algorithmic Infrastructure</h3>
        <p>Construct, backtest, and deploy advanced execution strategies with a highly visual Algo Maker linked directly to the core Engine.</p>
        <img src="/Public/qt_images/image_04.png" class="grid-image" alt="Algo">
      </div>
      <div class="feature-card fade-in">
        <h3 style="color: var(--accent);">Broker Support & Integration</h3>
        <p>Direct integration with premium brokers for flawless execution and deep multi-asset portfolio management.</p>
        <img src="/Public/qt_images/image_09.png" class="grid-image" alt="Broker Integration">
      </div>
      <div class="feature-card fade-in">
        <h3 style="color: var(--accent);">22+ Workspace Modules</h3>
        <p>Command Deep Equity Research, Live Portfolios, Market Scanners, and sophisticated Relationship Maps through a modular layout.</p>
        <img src="/Public/qt_images/image_16.png" class="grid-image" alt="Workspaces">
      </div>
    </div>
  </section>
""" + HTML_FOOTER

features_html = HTML_HEAD("Features") + """
  <section class="container" style="padding-top: 10rem;">
    <div class="fade-in" style="text-align: center;">
      <h1 style="margin: 0 auto; max-width: 800px;">Infinite Workflows.<br>One Native Terminal.</h1>
      <p class="subtitle" style="margin: 1.5rem auto 4rem auto;">Engineered with 22+ deeply integrated applications to replace fragmented, browser-based systems with a rigorous, high-performance desktop framework.</p>
    </div>

    <div class="showcase-container fade-in" style="margin: 0 auto 6rem auto;">
      <img src="/Public/qt_images/image_26.png" alt="Feature Environment">
    </div>

    <div class="features-grid">
      <div class="feature-card fade-in">
        <h3>Institutional Equity Analysis</h3>
        <p>Perform precise modeling and comparisons. Break down fundamentals, view complex peer parity models, and chart multi-layered technicals seamlessly.</p>
      </div>
      <div class="feature-card fade-in">
        <h3>Live Market Engine</h3>
        <p>Track your execution through real-time portfolio arrays. Monitor shifting multi-asset positions with near-zero latency data synchronization.</p>
      </div>
      <div class="feature-card fade-in">
        <h3>Algorithmic Designer</h3>
        <p>Bridge the gap between math and execution. Deploy visual logical maps straight into the backend for robust, historical backtesting and forward deployment.</p>
      </div>
      <div class="feature-card fade-in">
        <h3>Macro-Economics Matrix</h3>
        <p>Consolidate thousands of international economic indicators. Evaluate central bank pivot points, trade balances, and sovereign shifts interactively.</p>
      </div>
      <div class="feature-card fade-in">
        <h3>Supply Chain Topography</h3>
        <p>Expose hidden structural dependencies. Visualize interconnected supplier networks and institutional linkages that govern global production routes.</p>
      </div>
      <div class="feature-card fade-in">
        <h3>Adaptive Screener & AI</h3>
        <p>Filter global equities and query the terminal with natural language commands instantly connecting to real-time charting flows.</p>
      </div>
    </div>
  </section>
""" + HTML_FOOTER

download_html = HTML_HEAD("Download") + """
  <section class="container" style="padding-top: 10rem; text-align: center; min-height: 85vh;">
    <div class="fade-in">
      <h1>Deployment Architecture</h1>
      <p class="subtitle" style="margin: 0 auto; max-width: 500px;">Compiled natively for superior threading and hardware acceleration across operating systems.</p>
    </div>

    <div class="features-grid fade-in" style="margin-top: 4rem;">
      <div class="download-card">
        <div class="dl-icon-container">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
        </div>
        <h3 style="font-size: 1.5rem">macOS</h3>
        <p style="color: var(--text-secondary); margin-bottom: 2rem; font-size: 0.95rem;">Apple Silicon (M1/M2/M3) & Intel Support.</p>
        <button class="btn btn-primary" style="width: 100%;">Download Installer</button>
      </div>

      <div class="download-card">
        <div class="dl-icon-container">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 5.557v12.886l8.062 1.15V4.398L3 5.557zm9.062-1.3l8.938-1.282v18.05l-8.938-1.282V4.257z"/></svg>
        </div>
        <h3 style="font-size: 1.5rem">Windows</h3>
        <p style="color: var(--text-secondary); margin-bottom: 2rem; font-size: 0.95rem;">Optimized for Windows 10 & 11 (64-bit).</p>
        <button class="btn btn-primary" style="width: 100%;">Download Setup</button>
      </div>

      <div class="download-card">
        <div class="dl-icon-container">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.28 14.54c-.95.86-2.5 1.34-4.28 1.34-1.78 0-3.33-.48-4.28-1.34L6 15l2-1.5c1 .75 2.15 1.15 4 1.15s3-.4 4-1.15L18 15l-1.72 1.54zM12 13.5c-2.33 0-4.5-1.17-5.5-3h11c-1 1.83-3.17 3-5.5 3zm4.5-5H7.5V6H12v2.5L16.5 6v2.5z"/></svg>
        </div>
        <h3 style="font-size: 1.5rem">Linux</h3>
        <p style="color: var(--text-secondary); margin-bottom: 2rem; font-size: 0.95rem;">AppImage & Flatpak deployment environments.</p>
        <button class="btn btn-primary" style="width: 100%;">Download Package</button>
      </div>
    </div>
  </section>
""" + HTML_FOOTER

about_html = HTML_HEAD("Founder") + """
  <section class="container fade-in" style="padding-top: 10rem; min-height: 85vh;">
    <div class="prose" style="background: var(--panel-bg); padding: 4rem; border-radius: 16px;">
      
      <h1 style="margin-top: 0; font-size: 2.5rem; letter-spacing: -0.5px;">About the Founder</h1>
      
      <p style="font-size: 1.15rem; color: #fff; font-weight: 500;">Aaryan Saroha is a young entrepreneur, builder, and finance enthusiast from Haryana, India, currently pursuing Electrical Engineering at Indian Institute of Technology Jammu.</p>

      <p>From an early stage, Aaryan developed a deep interest in financial markets, quantitative finance, technology, and business. His passion for finance was never limited to simply watching markets — he became deeply interested in understanding how global financial systems work, how quantitative analysis drives decision-making, and how technology can transform the future of finance.</p>

      <p>Driven by this passion, he founded Quantify Terminal with the vision of building a powerful next-generation financial platform designed for serious investors, analysts, and market participants.</p>

      <h3 style="margin-top: 3rem; font-size: 1.4rem;">Aaryan is deeply passionate about:</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.5rem;">
        <ul style="margin:0;">
          <li>Quantitative Finance</li>
          <li>Financial Markets</li>
          <li>Financial Technology</li>
        </ul>
        <ul style="margin:0;">
          <li>Data Analytics</li>
          <li>System Design</li>
          <li>Entrepreneurship</li>
        </ul>
      </div>

      <p style="margin-top: 3rem;">What makes his journey unique is the combination of engineering and finance. While studying Electrical Engineering, he simultaneously focused on developing advanced financial systems, real-time analytics infrastructure, and data-driven market intelligence tools.</p>

      <p>He believes that the future of finance belongs to technology-driven platforms that are fast, intelligent, and data-focused. This belief became the foundation behind Quantify Terminal.</p>

      <p>Beyond academics and business, Aaryan is someone who enjoys building things from scratch, learning continuously, and turning ambitious ideas into real products. His goal is to create technology that helps people understand markets better and make smarter financial decisions.</p>

      <p style="font-weight: 500; font-style: italic; color: #fff; margin-top: 2rem;">For Aaryan, Quantify Terminal is not just a project — it is a long-term vision built from passion, curiosity, and a deep interest in the world of finance.</p>

      <div style="margin-top: 4rem; padding-top: 3rem; border-top: 1px solid var(--border-light);">
        <h3 style="margin-top: 0;">Connect with Aaryan</h3>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1.5rem;">
            <a href="https://x.com/aaryan_sar60649" target="_blank" class="btn btn-secondary">
              <svg style="width:18px;margin-right:10px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>
              X Account
            </a>
            <a href="https://www.linkedin.com/in/aaryan-saroha-4301a3378/" target="_blank" class="btn btn-secondary">
              <svg style="width:18px;margin-right:10px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              LinkedIn Profile
            </a>
        </div>
      </div>
    </div>
  </section>
""" + HTML_FOOTER

connect_html = HTML_HEAD("Connect") + """
  <section class="container fade-in" style="padding-top: 10rem; min-height: 85vh;">
    <div style="max-width: 650px; margin: 0 auto; text-align: center;">
      <h1 style="font-size: 3rem;">Connect Infrastructure</h1>
      <p class="subtitle" style="margin: 1rem auto 4rem auto;">Join the official networks. Experience real-time updates and integrate into the expanding Quantify Terminal framework.</p>
      
      <div style="display: grid; grid-template-columns: 1fr; gap: 1rem; text-align: left;">
        
        <a href="https://www.quantifyterminal.com/" target="_blank" class="social-card">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
          Official Website Architecture
        </a>

        <a href="https://x.com/QuantifTerm" target="_blank" class="social-card">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>
          Terminal X Broadcasts
        </a>

        <a href="https://www.youtube.com/@QuantifyTerminal" target="_blank" class="social-card">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
          YouTube Deployment Videos
        </a>

        <a href="https://www.reddit.com/user/QuantifyTerminal/" target="_blank" class="social-card">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M14.5 14.5c-1.5 1.5-3.5 1.5-5 0"></path><circle cx="9" cy="10" r="1"></circle><circle cx="15" cy="10" r="1"></circle></svg>
          Reddit Data Threads
        </a>

        <a href="https://www.linkedin.com/company/quantify-terminal/" target="_blank" class="social-card">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          LinkedIn Corporate Operations
        </a>

        <a href="https://www.instagram.com/quantifyterminal/" target="_blank" class="social-card">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          Instagram Media Library
        </a>

        <a href="https://discord.gg/djKVhBH8cF" target="_blank" class="social-card">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 14.5c-1.5 1.5-3.5 1.5-5 0"></path><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
          Discord Core Server
        </a>

        <a href="https://github.com/Quantify-Terminal" target="_blank" class="social-card">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          GitHub Open Source & References
        </a>

        <a href="mailto:contact@quantifyterminal.com" class="social-card">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          contact@quantifyterminal.com
        </a>

      </div>
    </div>
  </section>
""" + HTML_FOOTER

documentation_html = HTML_HEAD("Documentation") + """
  <section class="container fade-in" style="padding-top: 10rem; min-height: 85vh; text-align: center;">
    <h1>Documentation & Support</h1>
    <p class="subtitle" style="margin: 0 auto;">Extensive technical documentation, API guides, and architectural references are being updated and will be available shortly.</p>
    <a href="/features" class="btn btn-primary" style="margin-top: 2rem;">Return to Features</a>
  </section>
""" + HTML_FOOTER

error_html = HTML_HEAD("404 - Not Found") + """
  <section class="container fade-in" style="padding-top: 10rem; min-height: 85vh; text-align: center;">
    <h1 style="font-size: 5rem;">404</h1>
    <p class="subtitle" style="margin: 0 auto;">The page you are looking for does not exist or has been moved.</p>
    <a href="/" class="btn btn-primary" style="margin-top: 2rem;">Return Home</a>
  </section>
""" + HTML_FOOTER

def write_and_log(filename, content):
    write_file(filename, content)
    print(f"Wrote {filename}")

write_and_log('index.html', index_html)
write_and_log('features.html', features_html)
write_and_log('download.html', download_html)
write_and_log('about.html', about_html)
write_and_log('connect.html', connect_html)
write_and_log('documentation.html', documentation_html)
write_and_log('404.html', error_html)
write_and_log('style.css', CSS_CONTENT)
write_and_log('main.js', JS_CONTENT)
