import { useState, useEffect } from "react";
import axios from "axios";

const API = "https://interview-coach-backend-7r4u.onrender.com";
const TOTAL_QUESTIONS = 15;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'DM Sans', sans-serif; background: #0a0a0a; color: #f0ede8; min-height: 100vh; }
  .landing { min-height: 100vh; background: #0a0a0a; overflow: hidden; }
  .hero { position: relative; padding: 80px 24px 60px; text-align: center; max-width: 720px; margin: 0 auto; }
  .badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(245,158,11,0.12); border: 1px solid rgba(245,158,11,0.3); color: #f59e0b; font-size: 12px; font-weight: 500; padding: 6px 14px; border-radius: 100px; margin-bottom: 28px; letter-spacing: 0.04em; text-transform: uppercase; }
  .badge-dot { width: 6px; height: 6px; background: #f59e0b; border-radius: 50%; animation: pulse 2s infinite; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
  .hero h1 { font-family: 'Syne', sans-serif; font-size: clamp(36px, 7vw, 64px); font-weight: 800; line-height: 1.05; letter-spacing: -0.02em; color: #f0ede8; margin-bottom: 20px; }
  .hero h1 span { color: #f59e0b; }
  .hero p { font-size: 18px; color: #9a9690; line-height: 1.6; max-width: 520px; margin: 0 auto 36px; font-weight: 300; }
  .cta-group { display: flex; flex-direction: column; align-items: center; gap: 12px; }
  .btn-cta { display: inline-flex; align-items: center; gap: 10px; background: #f59e0b; color: #0a0a0a; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 16px; padding: 16px 36px; border-radius: 100px; border: none; cursor: pointer; transition: transform 0.2s, background 0.2s; letter-spacing: 0.01em; }
  .btn-cta:hover { transform: scale(1.03); background: #fbbf24; }
  .btn-cta:active { transform: scale(0.98); }
  .btn-cta:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  .cta-sub { font-size: 13px; color: #5a5754; display: flex; align-items: center; gap: 16px; }
  .social-proof { display: flex; align-items: center; justify-content: center; gap: 12px; margin: 40px auto 0; padding: 16px 24px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; max-width: 420px; }
  .avatars { display: flex; }
  .avatar { width: 32px; height: 32px; border-radius: 50%; border: 2px solid #0a0a0a; margin-left: -8px; font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
  .avatar:first-child { margin-left: 0; }
  .av1 { background: #1e3a5f; color: #93c5fd; }
  .av2 { background: #3b1f5e; color: #c4b5fd; }
  .av3 { background: #1f3b2e; color: #6ee7b7; }
  .av4 { background: #3b2a1f; color: #fcd34d; }
  .social-proof-text { font-size: 13px; color: #9a9690; line-height: 1.4; }
  .social-proof-text strong { color: #f0ede8; font-weight: 500; }
  .divider { width: 100%; max-width: 720px; margin: 60px auto; height: 1px; background: rgba(255,255,255,0.06); }
  .features { max-width: 720px; margin: 0 auto; padding: 0 24px; }
  .features-label { text-align: center; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: #5a5754; margin-bottom: 36px; font-weight: 500; }
  .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
  .feature-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 24px; transition: border-color 0.2s; }
  .feature-card:hover { border-color: rgba(245,158,11,0.2); }
  .feature-icon { width: 40px; height: 40px; background: rgba(245,158,11,0.1); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; margin-bottom: 14px; }
  .feature-card h3 { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 600; color: #f0ede8; margin-bottom: 6px; }
  .feature-card p { font-size: 13px; color: #6b6864; line-height: 1.5; }

  /* ── PRODUCT PREVIEW SECTION ── */
  .preview-section { max-width: 780px; margin: 0 auto; padding: 0 24px 0; }
  .preview-tabs { display: flex; gap: 8px; margin-bottom: 20px; justify-content: center; flex-wrap: wrap; }
  .preview-tab { padding: 8px 18px; border-radius: 100px; border: 1px solid rgba(255,255,255,0.1); background: transparent; color: #6b6864; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
  .preview-tab.active { background: rgba(245,158,11,0.12); border-color: rgba(245,158,11,0.4); color: #f59e0b; }
  .preview-tab:hover:not(.active) { border-color: rgba(255,255,255,0.2); color: #9a9690; }
  .preview-window { background: #111110; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; overflow: hidden; }
  .preview-topbar { background: #1a1918; padding: 12px 16px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .preview-dot { width: 10px; height: 10px; border-radius: 50%; }
  .pd-red { background: #ff5f57; }
  .pd-yellow { background: #febc2e; }
  .pd-green { background: #28c840; }
  .preview-url { margin-left: 8px; background: rgba(255,255,255,0.05); border-radius: 6px; padding: 4px 12px; font-size: 11px; color: #4a4846; font-family: monospace; }
  .preview-body { padding: 24px; }

  /* Question preview */
  .pv-question-block { margin-bottom: 20px; }
  .pv-label { font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: #f59e0b; font-weight: 600; margin-bottom: 8px; }
  .pv-question-text { font-size: 15px; color: #f0ede8; line-height: 1.6; background: rgba(245,158,11,0.05); border-left: 3px solid #f59e0b; border-radius: 0 8px 8px 0; padding: 14px 16px; }
  .pv-answer-block { margin-bottom: 20px; }
  .pv-answer-label { font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: #5a5754; font-weight: 600; margin-bottom: 8px; }
  .pv-answer-text { font-size: 13px; color: #9a9690; line-height: 1.6; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; padding: 14px 16px; }
  .pv-progress { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
  .pv-progress-bar { flex: 1; height: 3px; background: rgba(255,255,255,0.07); border-radius: 2px; overflow: hidden; }
  .pv-progress-fill { height: 100%; background: #f59e0b; border-radius: 2px; }
  .pv-progress-text { font-size: 11px; color: #5a5754; white-space: nowrap; }

  /* Feedback preview */
  .pv-feedback-block { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 16px; margin-bottom: 12px; }
  .pv-feedback-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
  .pv-score-badge { background: rgba(34,197,94,0.15); color: #22c55e; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 100px; border: 1px solid rgba(34,197,94,0.25); }
  .pv-score-badge.mid { background: rgba(245,158,11,0.15); color: #f59e0b; border-color: rgba(245,158,11,0.25); }
  .pv-feedback-title { font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #22c55e; font-weight: 600; }
  .pv-feedback-title.mid { color: #f59e0b; }
  .pv-feedback-text { font-size: 13px; color: #9a9690; line-height: 1.65; }
  .pv-tip-block { background: rgba(245,158,11,0.04); border: 1px solid rgba(245,158,11,0.12); border-radius: 10px; padding: 14px 16px; margin-bottom: 12px; }
  .pv-tip-label { font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: #f59e0b; font-weight: 600; margin-bottom: 6px; }
  .pv-tip-text { font-size: 13px; color: #c9b47a; line-height: 1.6; }

  /* Report preview */
  .pv-report-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
  .pv-report-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: #f0ede8; }
  .pv-report-role { font-size: 12px; color: #5a5754; margin-top: 2px; }
  .pv-overall-score { text-align: right; }
  .pv-score-number { font-family: 'Syne', sans-serif; font-size: 36px; font-weight: 800; color: #f59e0b; line-height: 1; }
  .pv-score-label { font-size: 11px; color: #5a5754; margin-top: 2px; }
  .pv-score-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
  .pv-score-item { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 12px; }
  .pv-score-item-label { font-size: 11px; color: #5a5754; margin-bottom: 6px; }
  .pv-score-item-bar { height: 4px; background: rgba(255,255,255,0.07); border-radius: 2px; overflow: hidden; margin-bottom: 4px; }
  .pv-score-item-fill { height: 100%; border-radius: 2px; }
  .pv-score-item-num { font-size: 12px; font-weight: 600; }
  .pv-plan-block { background: rgba(245,158,11,0.04); border: 1px solid rgba(245,158,11,0.1); border-radius: 10px; padding: 14px 16px; }
  .pv-plan-label { font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: #f59e0b; font-weight: 600; margin-bottom: 10px; }
  .pv-plan-item { display: flex; gap: 10px; margin-bottom: 8px; font-size: 13px; color: #9a9690; line-height: 1.5; }
  .pv-plan-num { color: #f59e0b; font-weight: 600; flex-shrink: 0; }

  /* ── SCORE STRIP ── */
  .score-strip { max-width: 720px; margin: 48px auto 0; padding: 0 24px; }
  .score-strip-inner { background: linear-gradient(135deg, #f59e0b 0%, #ff6b35 100%); border-radius: 20px; padding: 32px 36px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 24px; }
  .score-strip-left h3 { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: #fff; margin-bottom: 6px; }
  .score-strip-left p { font-size: 14px; color: rgba(255,255,255,0.8); line-height: 1.5; max-width: 320px; }
  .score-strip-right { text-align: center; flex-shrink: 0; }
  .score-strip-number { font-family: 'Syne', sans-serif; font-size: 64px; font-weight: 800; color: #fff; line-height: 1; }
  .score-strip-label { font-size: 12px; color: rgba(255,255,255,0.7); margin-top: 4px; letter-spacing: 0.05em; text-transform: uppercase; }
  .score-strip-bars { display: flex; flex-direction: column; gap: 8px; margin-top: 20px; }
  .score-strip-bar-row { display: flex; align-items: center; gap: 10px; }
  .score-strip-bar-label { font-size: 12px; color: rgba(255,255,255,0.8); width: 130px; flex-shrink: 0; }
  .score-strip-bar-track { flex: 1; height: 4px; background: rgba(255,255,255,0.25); border-radius: 2px; overflow: hidden; }
  .score-strip-bar-fill { height: 100%; background: #fff; border-radius: 2px; }
  .score-strip-bar-num { font-size: 12px; color: #fff; font-weight: 600; width: 36px; text-align: right; flex-shrink: 0; }

  .testimonials { max-width: 720px; margin: 60px auto 0; padding: 0 24px; }
  .testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
  .testimonial-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 20px; }
  .stars { color: #f59e0b; font-size: 13px; margin-bottom: 10px; }
  .testimonial-card p { font-size: 13px; color: #9a9690; line-height: 1.6; margin-bottom: 14px; font-style: italic; }
  .testimonial-author { font-size: 12px; font-weight: 500; color: #f0ede8; }
  .testimonial-role { color: #5a5754; font-weight: 400; }
  .faq { max-width: 720px; margin: 60px auto 0; padding: 0 24px; }
  .faq-item { border-bottom: 1px solid rgba(255,255,255,0.06); padding: 20px 0; }
  .faq-item h3 { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 600; color: #f0ede8; margin-bottom: 8px; }
  .faq-item p { font-size: 14px; color: #6b6864; line-height: 1.6; }
  .bottom-cta { margin: 60px 24px; padding: 48px 24px; text-align: center; background: rgba(245,158,11,0.05); border: 1px solid rgba(245,158,11,0.15); border-radius: 24px; }
  .bottom-cta h2 { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: #f0ede8; margin-bottom: 12px; }
  .bottom-cta p { font-size: 15px; color: #9a9690; margin-bottom: 28px; }
  .price-tag { font-size: 36px; font-family: 'Syne', sans-serif; font-weight: 800; color: #f59e0b; margin-bottom: 4px; }
  .price-original { font-size: 16px; color: #5a5754; text-decoration: line-through; margin-bottom: 24px; }
  .guarantee { font-size: 12px; color: #5a5754; margin-top: 14px; }
  .page { min-height: 100vh; background: #0a0a0a; padding: 40px 24px; max-width: 720px; margin: 0 auto; }
  .page-header { margin-bottom: 32px; }
  .page-header h2 { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; color: #f0ede8; }
  .page-header p { font-size: 14px; color: #5a5754; margin-top: 4px; }
  .progress-bar { height: 3px; background: rgba(255,255,255,0.07); border-radius: 2px; margin-bottom: 32px; overflow: hidden; }
  .progress-fill { height: 100%; background: #f59e0b; border-radius: 2px; transition: width 0.5s ease; }
  .question-box { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-left: 3px solid #f59e0b; border-radius: 12px; padding: 24px; margin-bottom: 24px; }
  .question-box h3 { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #f59e0b; margin-bottom: 12px; font-weight: 500; }
  .question-box p { font-size: 16px; color: #f0ede8; line-height: 1.6; }
  .answer-box { margin-bottom: 24px; }
  .answer-box h3 { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #5a5754; margin-bottom: 12px; font-weight: 500; }
  textarea { width: 100%; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px; color: #f0ede8; font-family: 'DM Sans', sans-serif; font-size: 15px; line-height: 1.6; resize: vertical; min-height: 140px; outline: none; transition: border-color 0.2s; }
  textarea:focus { border-color: rgba(245,158,11,0.4); }
  .btn-submit, .btn-next, .btn-restart { width: 100%; padding: 14px; border-radius: 100px; border: none; cursor: pointer; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; transition: transform 0.2s, opacity 0.2s; margin-top: 12px; }
  .btn-submit { background: #f59e0b; color: #0a0a0a; }
  .btn-submit:disabled { opacity: 0.3; cursor: not-allowed; }
  .btn-submit:not(:disabled):hover { transform: scale(1.02); }
  .btn-next { background: rgba(245,158,11,0.1); color: #f59e0b; border: 1px solid rgba(245,158,11,0.3); }
  .btn-next:hover { background: rgba(245,158,11,0.15); }
  .btn-restart { background: rgba(255,255,255,0.05); color: #f0ede8; border: 1px solid rgba(255,255,255,0.1); }
  .feedback-box { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 20px; margin-bottom: 16px; }
  .feedback-box h3 { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #22c55e; margin-bottom: 12px; font-weight: 500; }
  .feedback-box p { font-size: 14px; color: #9a9690; line-height: 1.7; white-space: pre-wrap; }
  .loading { text-align: center; padding: 60px 0; color: #5a5754; font-size: 15px; }
  .loading-dot { display: inline-block; animation: blink 1.4s infinite; }
  @keyframes blink { 0%, 80%, 100% { opacity: 0; } 40% { opacity: 1; } }
  .report-box { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 24px; margin-bottom: 24px; font-size: 14px; color: #9a9690; line-height: 1.8; white-space: pre-wrap; }
  .role-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; padding: 40px 32px; text-align: center; max-width: 480px; margin: 80px auto 0; }
  .role-card h2 { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; color: #f0ede8; margin-bottom: 8px; }
  .role-card p { font-size: 14px; color: #5a5754; margin-bottom: 24px; }
  .role-card input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 100px; padding: 14px 20px; color: #f0ede8; font-family: 'DM Sans', sans-serif; font-size: 15px; outline: none; margin-bottom: 16px; text-align: center; transition: border-color 0.2s; }
  .role-card input:focus { border-color: rgba(245,158,11,0.4); }
  .role-card input::placeholder { color: #3a3836; }
  .error-page { min-height: 100vh; background: #0a0a0a; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 24px; text-align: center; }
  .error-page h1 { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 700; color: #f0ede8; margin-bottom: 12px; }
  .error-page p { font-size: 15px; color: #6b6864; margin-bottom: 28px; max-width: 400px; }
  .upsell-page { min-height: 100vh; background: #0a0a0a; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 24px; text-align: center; }
  .upsell-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 24px; padding: 48px 32px; max-width: 480px; width: 100%; }
  .upsell-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.3); color: #22c55e; font-size: 12px; font-weight: 500; padding: 6px 14px; border-radius: 100px; margin-bottom: 24px; }
  .upsell-card h2 { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; color: #f0ede8; margin-bottom: 12px; line-height: 1.2; }
  .upsell-card h2 span { color: #f59e0b; }
  .upsell-card p { font-size: 15px; color: #6b6864; line-height: 1.6; margin-bottom: 28px; }
  .upsell-features { display: flex; flex-direction: column; gap: 10px; margin-bottom: 32px; text-align: left; }
  .upsell-feature { display: flex; align-items: center; gap: 12px; font-size: 14px; color: #9a9690; }
  .upsell-feature-icon { width: 28px; height: 28px; background: rgba(245,158,11,0.1); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
  .upsell-price { margin-bottom: 20px; }
  .upsell-price-num { font-family: 'Syne', sans-serif; font-size: 42px; font-weight: 800; color: #f59e0b; }
  .upsell-price-orig { font-size: 16px; color: #3a3836; text-decoration: line-through; margin-left: 8px; }
  .upsell-guarantee { font-size: 12px; color: #3a3836; margin-top: 12px; }
  .free-banner { background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.15); border-radius: 10px; padding: 10px 16px; font-size: 13px; color: #22c55e; margin-bottom: 20px; }
`;

function getTokenFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("token");
}

function ProductPreview() {
  const [activeTab, setActiveTab] = useState("question");

  return (
    <div className="preview-section">
      <div className="features-label" style={{ textAlign: "center", marginBottom: "16px" }}>
        See exactly what you get
      </div>
      <p style={{ textAlign: "center", fontSize: "14px", color: "#5a5754", marginBottom: "28px" }}>
        Real screenshots from inside the app
      </p>
      <div className="preview-tabs">
        <button
          className={`preview-tab ${activeTab === "question" ? "active" : ""}`}
          onClick={() => setActiveTab("question")}
        >
          💬 Live Interview
        </button>
        <button
          className={`preview-tab ${activeTab === "feedback" ? "active" : ""}`}
          onClick={() => setActiveTab("feedback")}
        >
          ⚡ Instant Feedback
        </button>
        <button
          className={`preview-tab ${activeTab === "report" ? "active" : ""}`}
          onClick={() => setActiveTab("report")}
        >
          📊 Final Report
        </button>
      </div>

      <div className="preview-window">
        <div className="preview-topbar">
          <div className="preview-dot pd-red" />
          <div className="preview-dot pd-yellow" />
          <div className="preview-dot pd-green" />
          <div className="preview-url">interview-coach-frontend-nu.vercel.app</div>
        </div>
        <div className="preview-body">

          {activeTab === "question" && (
            <>
              <div style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontFamily: "Syne, sans-serif", fontSize: "14px", fontWeight: 700, color: "#f0ede8" }}>Mock Interview — Software Engineer</span>
                  <span style={{ fontSize: "12px", color: "#5a5754" }}>Question 4 of 15</span>
                </div>
                <div className="pv-progress">
                  <div className="pv-progress-bar">
                    <div className="pv-progress-fill" style={{ width: "26%" }} />
                  </div>
                  <span className="pv-progress-text">26% complete</span>
                </div>
              </div>

              <div className="pv-question-block">
                <div className="pv-label">Interviewer</div>
                <div className="pv-question-text">
                  You're given a system that currently handles 1,000 requests/second and needs to scale to 100,000. Walk me through your approach — what bottlenecks would you look for and how would you address them?
                </div>
              </div>

              <div className="pv-answer-block">
                <div className="pv-answer-label">Your Answer</div>
                <div className="pv-answer-text">
                  I'd start by profiling to identify the actual bottleneck — usually it's either the database, the application tier, or the network. For the DB, I'd look at query optimization and read replicas first. Then I'd consider horizontal scaling of the app tier with a load balancer...
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                <div style={{ flex: 1, background: "#f59e0b", borderRadius: "100px", padding: "10px", textAlign: "center", fontSize: "13px", fontWeight: 700, color: "#0a0a0a", fontFamily: "Syne, sans-serif" }}>
                  Submit Answer
                </div>
              </div>
            </>
          )}

          {activeTab === "feedback" && (
            <>
              <div className="pv-question-block" style={{ marginBottom: "16px" }}>
                <div className="pv-label">Question Asked</div>
                <div className="pv-question-text" style={{ fontSize: "13px" }}>
                  Tell me about a time you handled a conflict with a teammate. What was the outcome?
                </div>
              </div>

              <div className="pv-feedback-block">
                <div className="pv-feedback-header">
                  <div className="pv-score-badge">Score: 8/10</div>
                  <div className="pv-feedback-title">✓ What worked well</div>
                </div>
                <div className="pv-feedback-text">
                  Strong use of the STAR format — you clearly described the situation, your role, and the resolution. Your answer showed maturity and ownership. Mentioning the specific outcome ("we shipped on time and the relationship improved") made it concrete and credible.
                </div>
              </div>

              <div className="pv-feedback-block" style={{ borderColor: "rgba(245,158,11,0.15)" }}>
                <div className="pv-feedback-header">
                  <div className="pv-score-badge mid">Needs work</div>
                  <div className="pv-feedback-title mid">△ What to improve</div>
                </div>
                <div className="pv-feedback-text">
                  You spent too long on the backstory (3–4 sentences) before getting to your actions. Interviewers want to hear what YOU did, not the full history. Trim setup to 1 sentence, spend 70% of your answer on your actions and the result.
                </div>
              </div>

              <div className="pv-tip-block">
                <div className="pv-tip-label">💡 Pro Tip for Next Time</div>
                <div className="pv-tip-text">
                  End with a "what I learned" line — e.g. "This taught me to raise concerns earlier rather than letting tension build." It signals self-awareness and makes you memorable.
                </div>
              </div>
            </>
          )}

          {activeTab === "report" && (
            <>
              <div className="pv-report-header">
                <div>
                  <div className="pv-report-title">Final Performance Report</div>
                  <div className="pv-report-role">Role: Product Manager · 15 questions completed</div>
                </div>
                <div className="pv-overall-score">
                  <div className="pv-score-number">74</div>
                  <div className="pv-score-label">Overall Score</div>
                </div>
              </div>

              <div className="pv-score-grid">
                <div className="pv-score-item">
                  <div className="pv-score-item-label">Communication</div>
                  <div className="pv-score-item-bar">
                    <div className="pv-score-item-fill" style={{ width: "82%", background: "#22c55e" }} />
                  </div>
                  <div className="pv-score-item-num" style={{ color: "#22c55e" }}>82/100</div>
                </div>
                <div className="pv-score-item">
                  <div className="pv-score-item-label">Technical Depth</div>
                  <div className="pv-score-item-bar">
                    <div className="pv-score-item-fill" style={{ width: "65%", background: "#f59e0b" }} />
                  </div>
                  <div className="pv-score-item-num" style={{ color: "#f59e0b" }}>65/100</div>
                </div>
                <div className="pv-score-item">
                  <div className="pv-score-item-label">Structured Thinking</div>
                  <div className="pv-score-item-bar">
                    <div className="pv-score-item-fill" style={{ width: "78%", background: "#22c55e" }} />
                  </div>
                  <div className="pv-score-item-num" style={{ color: "#22c55e" }}>78/100</div>
                </div>
                <div className="pv-score-item">
                  <div className="pv-score-item-label">Confidence & Clarity</div>
                  <div className="pv-score-item-bar">
                    <div className="pv-score-item-fill" style={{ width: "70%", background: "#f59e0b" }} />
                  </div>
                  <div className="pv-score-item-num" style={{ color: "#f59e0b" }}>70/100</div>
                </div>
              </div>

              <div className="pv-plan-block">
                <div className="pv-plan-label">📅 Your 1-Week Improvement Plan</div>
                <div className="pv-plan-item">
                  <span className="pv-plan-num">1.</span>
                  <span>Practice concise problem framing — your answers run 20% longer than needed. Use the "headline first" technique: state your conclusion, then explain.</span>
                </div>
                <div className="pv-plan-item">
                  <span className="pv-plan-num">2.</span>
                  <span>Study metrics-driven answers. 6 of your 15 answers lacked specific numbers. Prepare 3–4 data points from past experience you can drop naturally.</span>
                </div>
                <div className="pv-plan-item">
                  <span className="pv-plan-num">3.</span>
                  <span>For behavioural questions, cut setup to 1 sentence. You're strong on outcomes but spend too long on context before getting to your actions.</span>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

const FREE_QUESTIONS = 3;

export default function App() {
  const [page, setPage] = useState("landing");
  const [role, setRole] = useState("");
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [transcript, setTranscript] = useState("");
  const [report, setReport] = useState("");
  const [questionNum, setQuestionNum] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tokenError, setTokenError] = useState(false);
  const [isFree, setIsFree] = useState(false);

  useEffect(() => {
    const token = getTokenFromURL();
    if (token) checkToken();
  }, []);

  async function checkToken() {
    const token = getTokenFromURL();
    if (!token) { setTokenError(true); return; }
    try {
      const res = await axios.post(`${API}/api/verify-token`, { token });
      if (res.data.valid) setPage("role");
      else setTokenError(true);
    } catch { setTokenError(true); }
  }

  function handleBuyClick() {
    fetch(`${API}/api/track-click`, { method: "POST" }).catch(() => {});
    window.open("https://superprofile.bio/vp/interview-coach", "_blank");
  }

  function handleFreeClick() {
    setIsFree(true);
    setPage("role");
  }

  async function startInterview() {
    setLoading(true);
    try {
      if (isFree) {
        const res = await axios.post(`${API}/api/free-interview`, {
          role,
          messages: [{ role: "user", content: "Start the interview" }],
        });
        const firstQuestion = res.data.reply;
        setQuestion(firstQuestion);
        setMessages([{ role: "assistant", content: firstQuestion }]);
        setQuestionNum(1);
        setPage("interview");
      } else {
        const token = getTokenFromURL();
        await axios.post(`${API}/api/use-token`, { token });
        const res = await axios.post(`${API}/api/interview`, {
          role,
          messages: [{ role: "user", content: "Start the interview" }],
        });
        const firstQuestion = res.data.reply;
        setQuestion(firstQuestion);
        setMessages([{ role: "assistant", content: firstQuestion }]);
        setQuestionNum(1);
        setPage("interview");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  async function submitAnswer() {
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/feedback`, { question, answer });
      setFeedback(res.data.feedback);
      setTranscript((prev) => prev + `Q${questionNum}: ${question}\nAnswer: ${answer}\n\n`);
    } catch { alert("Something went wrong. Please try again."); }
    setLoading(false);
  }

  async function nextQuestion() {
    // Free trial limit reached
    if (isFree && questionNum >= FREE_QUESTIONS) {
      setPage("upsell");
      return;
    }
    if (!isFree && questionNum >= TOTAL_QUESTIONS) {
      setPage("report");
      setLoading(true);
      try {
        const res = await axios.post(`${API}/api/report`, { role, transcript });
        setReport(res.data.report);
      } catch { alert("Error generating report."); }
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const updatedMessages = [...messages, { role: "user", content: answer }];
      const endpoint = isFree ? `${API}/api/free-interview` : `${API}/api/interview`;
      const res = await axios.post(endpoint, { role, messages: updatedMessages });
      const nextQ = res.data.reply;
      setMessages([...updatedMessages, { role: "assistant", content: nextQ }]);
      setQuestion(nextQ);
      setAnswer("");
      setFeedback("");
      setQuestionNum((n) => n + 1);
    } catch { alert("Something went wrong. Please try again."); }
    setLoading(false);
  }

  function restart() {
    setPage("landing"); setRole(""); setMessages([]);
    setQuestion(""); setAnswer(""); setFeedback("");
    setTranscript(""); setReport(""); setQuestionNum(0);
    setIsFree(false);
  }

  return (
    <>
      <style>{styles}</style>

      {tokenError && (
        <div className="error-page">
          <h1>Invalid Access Link</h1>
          <p>This link is invalid or has already been used. Please purchase a new session to continue.</p>
          <button className="btn-cta" onClick={handleBuyClick}>Buy a Session</button>
        </div>
      )}

      {!tokenError && page === "landing" && (
        <div className="landing">
          <div className="hero">
            <div className="badge">
              <div className="badge-dot" />
              Try free — no sign up needed
            </div>
            <h1>Ace Your Next<br /><span>Job Interview</span></h1>
            <p>Practice with an AI interviewer that asks real questions, judges your answers, and tells you exactly what to improve.</p>
            <div className="cta-group">
              <button className="btn-cta" onClick={handleFreeClick}>
                🎯 Try Free — 3 Questions, No Sign Up
              </button>
              <div className="cta-sub">
                <span>No payment needed</span>
                <span>Any role</span>
                <span>Instant start</span>
              </div>
              <button style={{background:"transparent", border:"1px solid rgba(245,158,11,0.3)", color:"#f59e0b", fontFamily:"'DM Sans', sans-serif", fontSize:"14px", padding:"10px 24px", borderRadius:"100px", cursor:"pointer", marginTop:"4px"}} onClick={handleBuyClick}>
                Already convinced? Full access — Rs.299 →
              </button>
            </div>
            <div className="social-proof">
              <div className="avatars">
                <div className="avatar av1">AK</div>
                <div className="avatar av2">SR</div>
                <div className="avatar av3">PM</div>
                <div className="avatar av4">RJ</div>
              </div>
              <div className="social-proof-text">
                <strong>200+ professionals</strong> have used this to land their dream jobs
              </div>
            </div>
          </div>

          <div className="divider" />

          <div className="features">
            <div className="features-label">What you get</div>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🎯</div>
                <h3>Role-specific questions</h3>
                <p>15 real interview questions tailored exactly to your job role and industry.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h3>Instant AI feedback</h3>
                <p>Get brutally honest coaching after every answer - what worked and what did not.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>Performance report</h3>
                <p>A detailed final report with your score and a personalized improvement plan.</p>
              </div>
            </div>
          </div>

          {/* ── PRODUCT PREVIEW ── */}
          <div className="divider" />
          <ProductPreview />

          {/* ── SCORE STRIP ── */}
          <div className="score-strip">
            <div className="score-strip-inner">
              <div className="score-strip-left">
                <h3>See exactly how you score</h3>
                <p>After your 15-question session, get a detailed breakdown across 4 key dimensions with a personalised improvement plan.</p>
                <div className="score-strip-bars">
                  <div className="score-strip-bar-row">
                    <span className="score-strip-bar-label">Communication</span>
                    <div className="score-strip-bar-track"><div className="score-strip-bar-fill" style={{width:"82%"}} /></div>
                    <span className="score-strip-bar-num">82</span>
                  </div>
                  <div className="score-strip-bar-row">
                    <span className="score-strip-bar-label">Technical Depth</span>
                    <div className="score-strip-bar-track"><div className="score-strip-bar-fill" style={{width:"65%"}} /></div>
                    <span className="score-strip-bar-num">65</span>
                  </div>
                  <div className="score-strip-bar-row">
                    <span className="score-strip-bar-label">Structured Thinking</span>
                    <div className="score-strip-bar-track"><div className="score-strip-bar-fill" style={{width:"78%"}} /></div>
                    <span className="score-strip-bar-num">78</span>
                  </div>
                  <div className="score-strip-bar-row">
                    <span className="score-strip-bar-label">Confidence & Clarity</span>
                    <div className="score-strip-bar-track"><div className="score-strip-bar-fill" style={{width:"70%"}} /></div>
                    <span className="score-strip-bar-num">70</span>
                  </div>
                </div>
              </div>
              <div className="score-strip-right">
                <div className="score-strip-number">74</div>
                <div className="score-strip-label">Overall Score</div>
              </div>
            </div>
          </div>

          <div className="testimonials">
            <div className="features-label" style={{textAlign:"center", marginBottom:"36px", marginTop:"60px"}}>What people are saying</div>
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <div className="stars">★★★★★</div>
                <p>The feedback was incredibly specific. It told me exactly where my answers were weak. Got the offer after 2 sessions.</p>
                <div className="testimonial-author">Arjun K. <span className="testimonial-role">Software Engineer</span></div>
              </div>
              <div className="testimonial-card">
                <div className="stars">★★★★★</div>
                <p>Better than any mock interview I have done with friends. The AI does not go easy on you, which is exactly what you need.</p>
                <div className="testimonial-author">Sneha R. <span className="testimonial-role">Product Manager</span></div>
              </div>
              <div className="testimonial-card">
                <div className="stars">★★★★★</div>
                <p>Rs.299 is nothing compared to what I will earn in my new job. Worth every rupee. Wish I found this sooner.</p>
                <div className="testimonial-author">Rahul M. <span className="testimonial-role">Marketing Manager</span></div>
              </div>
            </div>
          </div>

          <div className="faq">
            <div className="features-label" style={{textAlign:"center", marginBottom:"24px", marginTop:"60px"}}>Frequently asked questions</div>
            <div className="faq-item">
              <h3>Will this work for my specific role?</h3>
              <p>Yes. Just type your exact role and the AI tailors every question specifically for you.</p>
            </div>
            <div className="faq-item">
              <h3>How is this different from YouTube videos?</h3>
              <p>Videos give generic tips. This gives you a real interactive interview where YOU answer questions and get feedback on YOUR specific answers.</p>
            </div>
            <div className="faq-item">
              <h3>What happens after I pay?</h3>
              <p>You get an email instantly with a unique access link. Click it and your interview starts right away.</p>
            </div>
            <div className="faq-item">
              <h3>Can I use it more than once?</h3>
              <p>Each purchase gives you one full 15-question session. Buy multiple sessions to practice different roles.</p>
            </div>
          </div>

          <div className="bottom-cta">
            <h2>Ready to nail your interview?</h2>
            <p>Join hundreds of professionals who practiced smarter and landed their dream jobs.</p>
            <div className="price-tag">Rs.299</div>
            <div className="price-original">Usually Rs.999</div>
            <button className="btn-cta" onClick={handleBuyClick}>Get Instant Access</button>
            <div className="guarantee">Secure payment via Superprofile - Instant email delivery</div>
          </div>
        </div>
      )}

      {!tokenError && page === "role" && (
        <div style={{background:"#0a0a0a", minHeight:"100vh"}}>
          <div className="role-card">
            <h2>What role are you interviewing for?</h2>
            <p>Be specific for the best questions</p>
            <input
              type="text"
              placeholder="e.g. Senior Frontend Engineer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && role && !loading && startInterview()}
            />
            <button className="btn-cta" style={{width:"100%", justifyContent:"center"}} onClick={startInterview} disabled={!role || loading}>
              {loading ? "Starting..." : "Begin Interview"}
            </button>
          </div>
        </div>
      )}

      {!tokenError && page === "interview" && (
        <div className="page">
          <div className="page-header">
            <h2>Mock Interview — {role}</h2>
            <p>Question {questionNum} of {isFree ? FREE_QUESTIONS : TOTAL_QUESTIONS}{isFree ? " · Free Preview" : ""}</p>
          </div>
          {isFree && (
            <div className="free-banner">
              🎯 Free preview · {FREE_QUESTIONS - questionNum + 1} question{FREE_QUESTIONS - questionNum + 1 !== 1 ? "s" : ""} remaining · Unlock all 15 + report for Rs.299
            </div>
          )}
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(questionNum / (isFree ? FREE_QUESTIONS : TOTAL_QUESTIONS)) * 100}%` }} />
          </div>
          {loading ? (
            <div className="loading">
              Thinking
              <span className="loading-dot" style={{animationDelay:"0s"}}>.</span>
              <span className="loading-dot" style={{animationDelay:"0.2s"}}>.</span>
              <span className="loading-dot" style={{animationDelay:"0.4s"}}>.</span>
            </div>
          ) : (
            <>
              <div className="question-box">
                <h3>Interviewer</h3>
                <p>{question}</p>
              </div>
              {!feedback && (
                <div className="answer-box">
                  <h3>Your Answer</h3>
                  <textarea
                    placeholder="Type your answer here..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                  <button className="btn-submit" onClick={submitAnswer} disabled={!answer}>
                    Submit Answer
                  </button>
                </div>
              )}
              {feedback && (
                <>
                  <div className="feedback-box">
                    <h3>Coach Feedback</h3>
                    <p>{feedback}</p>
                  </div>
                  <button className="btn-next" onClick={nextQuestion}>
                    {isFree && questionNum >= FREE_QUESTIONS ? "See Upgrade Options →" : !isFree && questionNum >= TOTAL_QUESTIONS ? "See Final Report" : "Next Question →"}
                  </button>
                </>
              )}
            </>
          )}
        </div>
      )}

      {!tokenError && page === "upsell" && (
        <div className="upsell-page">
          <div className="upsell-card">
            <div className="upsell-badge">✓ Free preview complete</div>
            <h2>You've seen what it can do.<br />Now <span>go all in.</span></h2>
            <p>You just did 3 questions. Real interviews have 10–15. Get the full session + a detailed performance report to know exactly where you stand.</p>
            <div className="upsell-features">
              <div className="upsell-feature">
                <div className="upsell-feature-icon">🎯</div>
                <span>12 more role-specific questions (15 total)</span>
              </div>
              <div className="upsell-feature">
                <div className="upsell-feature-icon">⚡</div>
                <span>Instant AI feedback on every single answer</span>
              </div>
              <div className="upsell-feature">
                <div className="upsell-feature-icon">📊</div>
                <span>Final performance report with score + 1-week plan</span>
              </div>
              <div className="upsell-feature">
                <div className="upsell-feature-icon">📧</div>
                <span>Instant email delivery — start in 60 seconds</span>
              </div>
            </div>
            <div className="upsell-price">
              <span className="upsell-price-num">Rs.299</span>
              <span className="upsell-price-orig">Rs.999</span>
            </div>
            <button className="btn-cta" style={{width:"100%", justifyContent:"center"}} onClick={handleBuyClick}>
              Get Full Access — Rs.299
            </button>
            <div className="upsell-guarantee">Secure payment · Instant email · One-time payment</div>
          </div>
        </div>
      )}

      {!tokenError && page === "report" && (
        <div className="page">
          <div className="page-header">
            <h2>Your Final Report</h2>
            <p>Here is how you performed as a {role}</p>
          </div>
          {loading ? (
            <div className="loading">Generating your report...</div>
          ) : (
            <>
              <div className="report-box">{report}</div>
              <button className="btn-restart" onClick={restart}>Start New Interview</button>
            </>
          )}
        </div>
      )}
    </>
  );
}
