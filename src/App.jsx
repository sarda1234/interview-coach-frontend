import { useState, useEffect } from "react";
import axios from "axios";

const API = "https://interview-coach-backend-7r4u.onrender.com";
const TOTAL_QUESTIONS = 15;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: #0a0a0a;
    color: #f0ede8;
    min-height: 100vh;
  }

  .landing { min-height: 100vh; background: #0a0a0a; overflow: hidden; }

  .hero {
    position: relative;
    padding: 80px 24px 60px;
    text-align: center;
    max-width: 720px;
    margin: 0 auto;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(245, 158, 11, 0.12);
    border: 1px solid rgba(245, 158, 11, 0.3);
    color: #f59e0b;
    font-size: 12px;
    font-weight: 500;
    padding: 6px 14px;
    border-radius: 100px;
    margin-bottom: 28px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .badge-dot {
    width: 6px;
    height: 6px;
    background: #f59e0b;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .hero h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(36px, 7vw, 64px);
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.02em;
    color: #f0ede8;
    margin-bottom: 20px;
  }

  .hero h1 span { color: #f59e0b; }

  .hero p {
    font-size: 18px;
    color: #9a9690;
    line-height: 1.6;
    max-width: 520px;
    margin: 0 auto 36px;
    font-weight: 300;
  }

  .cta-group { display: flex; flex-direction: column; align-items: center; gap: 12px; }

  .btn-cta {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: #f59e0b;
    color: #0a0a0a;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 16px;
    padding: 16px 36px;
    border-radius: 100px;
    border: none;
    cursor: pointer;
    transition: transform 0.2s, background 0.2s;
    text-decoration: none;
    letter-spacing: 0.01em;
  }

  .btn-cta:hover { transform: scale(1.03); background: #fbbf24; }
  .btn-cta:active { transform: scale(0.98); }
  .btn-cta:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  .cta-sub {
    font-size: 13px;
    color: #5a5754;
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .social-proof {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin: 40px auto 0;
    padding: 16px 24px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px;
    max-width: 420px;
  }

  .avatars { display: flex; }

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid #0a0a0a;
    margin-left: -8px;
    font-family: 'Syne', sans-serif;
    font-size: 11px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .avatar:first-child { margin-left: 0; }
  .av1 { background: #1e3a5f; color: #93c5fd; }
  .av2 { background: #3b1f5e; color: #c4b5fd; }
  .av3 { background: #1f3b2e; color: #6ee7b7; }
  .av4 { background: #3b2a1f; color: #fcd34d; }

  .social-proof-text { font-size: 13px; color: #9a9690; line-height: 1.4; }
  .social-proof-text strong { color: #f0ede8; font-weight: 500; }

  .divider {
    width: 100%;
    max-width: 720px;
    margin: 60px auto;
    height: 1px;
    background: rgba(255,255,255,0.06);
  }

  .features { max-width: 720px; margin: 0 auto; padding: 0 24px; }

  .features-label {
    text-align: center;
    font-size: 12px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #5a5754;
    margin-bottom: 36px;
    font-weight: 500;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }

  .feature-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    padding: 24px;
    transition: border-color 0.2s;
  }

  .feature-card:hover { border-color: rgba(245,158,11,0.2); }

  .feature-icon {
    width: 40px;
    height: 40px;
    background: rgba(245, 158, 11, 0.1);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    margin-bottom: 14px;
  }

  .feature-card h3 {
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: #f0ede8;
    margin-bottom: 6px;
  }

  .feature-card p { font-size: 13px; color: #6b6864; line-height: 1.5; }

  .testimonials { max-width: 720px; margin: 60px auto 0; padding: 0 24px; }

  .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }

  .testimonial-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    padding: 20px;
  }

  .stars { color: #f59e0b; font-size: 13px; margin-bottom: 10px; }

  .testimonial-card p {
    font-size: 13px;
    color: #9a9690;
    line-height: 1.6;
    margin-bottom: 14px;
    font-style: italic;
  }

  .testimonial-author { font-size: 12px; font-weight: 500; color: #f0ede8; }
  .testimonial-role { color: #5a5754; font-weight: 400; }

  .faq { max-width: 720px; margin: 60px auto 0; padding: 0 24px; }

  .faq-item { border-bottom: 1px solid rgba(255,255,255,0.06); padding: 20px 0; }

  .faq-item h3 {
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: #f0ede8;
    margin-bottom: 8px;
  }

  .faq-item p { font-size: 14px; color: #6b6864; line-height: 1.6; }

  .bottom-cta {
    margin: 60px 24px;
    padding: 48px 24px;
    text-align: center;
    background: rgba(245, 158, 11, 0.05);
    border: 1px solid rgba(245, 158, 11, 0.15);
    border-radius: 24px;
  }

  .bottom-cta h2 {
    font-family: 'Syne', sans-serif;
    font-size: 28px;
    font-weight: 800;
    color: #f0ede8;
    margin-bottom: 12px;
  }

  .bottom-cta p { font-size: 15px; color: #9a9690; margin-bottom: 28px; }

  .price-tag {
    font-size: 36px;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    color: #f59e0b;
    margin-bottom: 4px;
  }

  .price-original {
    font-size: 16px;
    color: #5a5754;
    text-decoration: line-through;
    margin-bottom: 24px;
  }

  .guarantee { font-size: 12px; color: #5a5754; margin-top: 14px; }

  .page { min-height: 100vh; background: #0a0a0a; padding: 40px 24px; max-width: 720px; margin: 0 auto; }

  .page-header { margin-bottom: 32px; }

  .page-header h2 {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: #f0ede8;
  }

  .page-header p { font-size: 14px; color: #5a5754; margin-top: 4px; }

  .progress-bar {
    height: 3px;
    background: rgba(255,255,255,0.07);
    border-radius: 2px;
    margin-bottom: 32px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: #f59e0b;
    border-radius: 2px;
    transition: width 0.5s ease;
  }

  .question-box {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-left: 3px solid #f59e0b;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
  }

  .question-box h3 {
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #f59e0b;
    margin-bottom: 12px;
    font-weight: 500;
  }

  .question-box p { font-size: 16px; color: #f0ede8; line-height: 1.6; }

  .answer-box { margin-bottom: 24px; }

  .answer-box h3 {
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #5a5754;
    margin-bottom: 12px;
    font-weight: 500;
  }

  textarea {
    width: 100%;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 16px;
    color: #f0ede8;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    line-height: 1.6;
    resize: vertical;
    min-height: 140px;
    outline: none;
    transition: border-color 0.2s;
  }

  textarea:focus { border-color: rgba(245,158,11,0.4); }

  .btn-submit, .btn-next, .btn-restart {
    width: 100%;
    padding: 14px;
    border-radius: 100px;
    border: none;
    cursor: pointer;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 15px;
    transition: transform 0.2s, opacity 0.2s;
    margin-top: 12px;
  }

  .btn-submit { background: #f59e0b; color: #0a0a0a; }
  .btn-submit:disabled { opacity: 0.3; cursor: not-allowed; }
  .btn-submit:not(:disabled):hover { transform: scale(1.02); }
  .btn-next { background: rgba(245,158,11,0.1); color: #f59e0b; border: 1px solid rgba(245,158,11,0.3); }
  .btn-next:hover { background: rgba(245,158,11,0.15); }
  .btn-restart { background: rgba(255,255,255,0.05); color: #f0ede8; border: 1px solid rgba(255,255,255,0.1); }

  .feedback-box {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
  }

  .feedback-box h3 {
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #22c55e;
    margin-bottom: 12px;
    font-weight: 500;
  }

  .feedback-box p { font-size: 14px; color: #9a9690; line-height: 1.7; white-space: pre-wrap; }

  .loading { text-align: center; padding: 60px 0; color: #5a5754; font-size: 15px; }

  .loading-dot { display: inline-block; animation: blink 1.4s infinite; }

  @keyframes blink {
    0%, 80%, 100% { opacity: 0; }
    40% { opacity: 1; }
  }

  .report-box {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    font-size: 14px;
    color: #9a9690;
    line-height: 1.8;
    white-space: pre-wrap;
  }

  .role-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    padding: 40px 32px;
    text-align: center;
    max-width: 480px;
    margin: 80px auto 0;
  }

  .role-card h2 {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: #f0ede8;
    margin-bottom: 8px;
  }

  .role-card p { font-size: 14px; color: #5a5754; margin-bottom: 24px; }

  .role-card input {
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 100px;
    padding: 14px 20px;
    color: #f0ede8;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    outline: none;
    margin-bottom: 16px;
    text-align: center;
    transition: border-color 0.2s;
  }

  .role-card input:focus { border-color: rgba(245,158,11,0.4); }
  .role-card input::placeholder { color: #3a3836; }

  .error-page {
    min-height: 100vh;
    background: #0a0a0a;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 24px;
    text-align: center;
  }

  .error-page h1 {
    font-family: 'Syne', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: #f0ede8;
    margin-bottom: 12px;
  }

  .error-page p { font-size: 15px; color: #6b6864; margin-bottom: 28px; max-width: 400px; }
`;

function getTokenFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("token");
}

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

  async function startInterview() {
    setLoading(true);
    try {
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
    if (questionNum >= TOTAL_QUESTIONS) {
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
      const res = await axios.post(`${API}/api/interview`, { role, messages: updatedMessages });
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
  }

  return (
    <>
      <style>{styles}</style>

      {tokenError && (
        <div className="error-page">
          <h1>Invalid Access Link</h1>