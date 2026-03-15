import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="landing-container animate-in">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">Elevate Your Hiring Process</h1>
          <p class="hero-subtitle">
            The all-in-one Interview Management System designed to connect world-class organizations 
            with elite tech talent through seamless scheduling, robust feedback, and intelligent matching.
          </p>
          <div class="hero-actions">
            <a routerLink="/register" class="btn-primary hero-btn">Get Started Now</a>
            <a routerLink="/login" class="btn-outline hero-btn">Login to Dashboard</a>
          </div>
        </div>
        <div class="hero-image-placeholder">
          <!-- Abstract Graphic Representation -->
          <div class="glass-orb orb-1"></div>
          <div class="glass-orb orb-2"></div>
          <div class="glass-orb orb-3"></div>
          <div class="mockup-card">
            <div class="mockup-header"></div>
            <div class="mockup-line w-75"></div>
            <div class="mockup-line w-50"></div>
            <div class="mockup-line w-100 mt-md"></div>
            <div class="mockup-line w-80"></div>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="stats-section glass-card">
        <div class="stat-item">
          <h3 class="stat-number">5M+</h3>
          <p class="stat-label">Interviews Conducted</p>
        </div>
        <div class="stat-item">
          <h3 class="stat-number">98%</h3>
          <p class="stat-label">Placement Match Rate</p>
        </div>
        <div class="stat-item">
          <h3 class="stat-number">10k+</h3>
          <p class="stat-label">Active Expert Interviewers</p>
        </div>
        <div class="stat-item">
          <h3 class="stat-number">4.9/5</h3>
          <p class="stat-label">Average Client Rating</p>
        </div>
      </section>

      <!-- Trusted By Section -->
      <section class="trusted-section">
        <h3 class="section-title text-center mb-6">Trusted By Industry Leaders</h3>
        <div class="client-logos">
          <!-- simulated logos using styled text -->
          <div class="logo-box"><span>TATA</span> CONSULTANCY</div>
          <div class="logo-box"><span style="color: #007cc3; font-weight: 800; font-size: 24px;">Infosys</span></div>
          <div class="logo-box" style="font-family: monospace; font-size: 22px;">Wipro <span style="color:red">_</span></div>
          <div class="logo-box" style="font-weight: 900; letter-spacing: 2px;">TECH<br>MAHINDRA</div>
          <div class="logo-box" style="font-style: italic; color: #00add8;">Capgemini</div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section mt-12">
        <h2 class="section-title text-center mb-10">Why Choose ElevateHire?</h2>
        <div class="features-grid">
          <div class="feature-card glass-card">
            <div class="feature-icon">🏢</div>
            <h3>For Organizations</h3>
            <p>Post requisitions, auto-assign expert interviewers securely, and track candidate pipelines in real-time. Reduce time-to-hire by 40%.</p>
          </div>
          <div class="feature-card glass-card">
            <div class="feature-icon">🎯</div>
            <h3>For Interviewers</h3>
            <p>Monetize your expertise. Access a steady stream of relevant candidate interviews, schedule flexibly, and submit structured feedback.</p>
          </div>
          <div class="feature-card glass-card">
            <div class="feature-icon">🚀</div>
            <h3>For Candidates</h3>
            <p>Apply to top tech giants with a single profile. Track your application status, receive automated meeting links, and get hired faster.</p>
          </div>
        </div>
      </section>
      
      <!-- Footer -->
      <footer class="landing-footer text-center mt-12 glass-card">
        <p>&copy; 2024 ElevateHire Systems. Empowering the future of tech recruitment.</p>
      </footer>
    </div>
  `,
  styles: [`
    .landing-container { padding: 0; margin-top: -20px; }
    
    /* Hero Section */
    .hero-section { display: flex; align-items: center; justify-content: space-between; min-height: 70vh; gap: 40px; padding: 40px 0; }
    .hero-content { flex: 1; z-index: 10; }
    .hero-title { font-size: 56px; font-weight: 800; line-height: 1.1; margin-bottom: 24px; background: linear-gradient(135deg, #ffffff, #60a5fa, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .hero-subtitle { font-size: 18px; color: var(--text-muted); line-height: 1.6; margin-bottom: 40px; max-width: 600px; }
    .hero-actions { display: flex; gap: 16px; }
    .hero-btn { padding: 16px 32px; font-size: 16px; font-weight: 600; border-radius: 8px; text-decoration: none; text-align: center; }
    
    /* Hero Graphic */
    .hero-image-placeholder { flex: 1; position: relative; height: 500px; display: flex; justify-content: center; align-items: center; }
    .glass-orb { position: absolute; border-radius: 50%; filter: blur(60px); opacity: 0.5; z-index: 0; }
    .orb-1 { width: 300px; height: 300px; background: rgba(59, 130, 246, 0.4); top: 0; right: 20%; animation: float 6s ease-in-out infinite; }
    .orb-2 { width: 250px; height: 250px; background: rgba(167, 139, 250, 0.4); bottom: 10%; left: 10%; animation: float 8s ease-in-out infinite reverse; }
    .orb-3 { width: 200px; height: 200px; background: rgba(14, 165, 233, 0.3); bottom: 30%; right: 10%; animation: float 7s ease-in-out infinite 1s; }
    
    .mockup-card { position: relative; z-index: 2; width: 80%; background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(20px); border: 1px solid var(--glass-border); border-radius: 16px; padding: 30px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); transform: perspective(1000px) rotateY(-10deg) rotateX(5deg); transition: transform 0.5s; }
    .mockup-card:hover { transform: perspective(1000px) rotateY(-5deg) rotateX(2deg); }
    .mockup-header { height: 24px; width: 40%; background: rgba(255,255,255,0.1); border-radius: 4px; margin-bottom: 30px; }
    .mockup-line { height: 12px; background: rgba(255,255,255,0.05); border-radius: 4px; margin-bottom: 16px; }
    .w-100 { width: 100%; } .w-80 { width: 80%; } .w-75 { width: 75%; } .w-50 { width: 50%; } .mt-md { margin-top: 30px; }

    /* Stats */
    .stats-section { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; padding: 40px; text-align: center; margin-bottom: 60px; background: rgba(15, 23, 42, 0.4); border-top: 1px solid rgba(255,255,255,0.05); }
    .stat-number { font-size: 36px; font-weight: 800; color: white; margin-bottom: 8px; }
    .stat-label { color: var(--text-muted); font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }

    /* Trusted By */
    .trusted-section { padding: 40px 0; }
    .section-title { font-size: 32px; font-weight: 700; color: white; }
    .client-logos { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 30px; margin-top: 40px; opacity: 0.7; filter: grayscale(100%); transition: all 0.3s; }
    .client-logos:hover { opacity: 1; filter: grayscale(0%); }
    .logo-box { background: rgba(255,255,255,0.03); padding: 20px 30px; border-radius: 8px; font-size: 20px; font-weight: bold; display: flex; align-items: center; justify-content: center; min-width: 180px; text-align: center; border: 1px solid rgba(255,255,255,0.05); }
    
    /* Features */
    .features-section { padding: 60px 0; }
    .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
    .feature-card { padding: 40px 30px; transition: transform 0.3s; }
    .feature-card:hover { transform: translateY(-10px); }
    .feature-icon { font-size: 48px; margin-bottom: 24px; }
    .feature-card h3 { font-size: 22px; color: white; margin-bottom: 16px; }
    .feature-card p { color: var(--text-muted); line-height: 1.6; }

    /* Utilities */
    .text-center { text-align: center; }
    .mb-6 { margin-bottom: 24px; }
    .mb-10 { margin-bottom: 40px; }
    .mt-12 { margin-top: 60px; }
    .landing-footer { padding: 30px; color: var(--text-muted); font-size: 14px; border-radius: 16px; margin-bottom: 20px; }

    @keyframes float {
      0% { transform: translateY(0px) scale(1); }
      50% { transform: translateY(-20px) scale(1.05); }
      100% { transform: translateY(0px) scale(1); }
    }

    /* Responsive */
    @media (max-width: 992px) {
      .hero-section { flex-direction: column; text-align: center; padding-top: 60px; }
      .hero-subtitle { margin: 0 auto 40px auto; }
      .hero-actions { justify-content: center; }
      .hero-image-placeholder { width: 100%; height: 400px; margin-top: 40px; }
      .stats-section { grid-template-columns: repeat(2, 1fr); gap: 40px 20px; }
      .features-grid { grid-template-columns: 1fr; }
      .client-logos { justify-content: center; }
    }
  `]
})
export class LandingPageComponent {}
