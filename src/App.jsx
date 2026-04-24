import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API = "https://interview-coach-backend-7r4u.onrender.com";
const TOTAL_QUESTIONS = 15;

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
    if (token) {
      checkToken();
    }
  }, []);

  async function checkToken() {
    const token = getTokenFromURL();
    if (!token) {
      setTokenError(true);
      return;
    }
    try {
      const res = await axios.post(`${API}/api/verify-token`, { token });
      if (res.data.valid) {
        setPage("role");
      } else {
        setTokenError(true);
      }
    } catch {
      setTokenError(true);
    }
  }

  async function startInterview() {
    setLoading(true);
    try {
      // Consume token when interview actually begins
      const token = getTokenFromURL();
      await axios.post(`${API}/api/use-token`, { token });

      const res = await axios.post(`${API}/api/interview`, { role, messages: [] });
      const firstQuestion = res.data.reply;
      setQuestion(firstQuestion);
      setMessages([{ role: "assistant", content: firstQuestion }]);
      setQuestionNum(1);
      setPage("interview");
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  async function submitAnswer() {
    setLoading(true);
    const res = await axios.post(`${API}/api/feedback`, { question, answer });
    setFeedback(res.data.feedback);
    setTranscript((prev) => prev + `Q${questionNum}: ${question}\nAnswer: ${answer}\n\n`);
    setLoading(false);
  }

  async function nextQuestion() {
    if (questionNum >= TOTAL_QUESTIONS) {
      setPage("report");
      setLoading(true);
      const res = await axios.post(`${API}/api/report`, { role, transcript });
      setReport(res.data.report);
      setLoading(false);
      return;
    }
    setLoading(true);
    const updatedMessages = [...messages, { role: "user", content: answer }];
    const res = await axios.post(`${API}/api/interview`, { role, messages: updatedMessages });
    const nextQ = res.data.reply;
    setMessages([...updatedMessages, { role: "assistant", content: nextQ }]);
    setQuestion(nextQ);
    setAnswer("");
    setFeedback("");
    setQuestionNum((n) => n + 1);
    setLoading(false);
  }

  function restart() {
    setPage("landing");
    setRole("");
    setMessages([]);
    setQuestion("");
    setAnswer("");
    setFeedback("");
    setTranscript("");
    setReport("");
    setQuestionNum(0);
  }

  if (tokenError) {
    return (
      <div className="landing">
        <h1>❌ Invalid Access</h1>
        <p>This link is invalid or has already been used. Please purchase a new session.</p>
        <button className="btn-primary" onClick={() => window.open("https://superprofile.bio/vp/interview-coach", "_blank")}>
          Buy a Session →
        </button>
      </div>
    );
  }

  if (page === "landing") {
    return (
      <div className="landing">
        <h1>🎯 AI Interview Coach</h1>
        <p>Practice real job interviews with AI. Get brutal, honest feedback after every answer. Walk into your next interview fully prepared.</p>
        <div className="features">
          <div className="feature-card">
            <div className="icon">🧑‍💼</div>
            <p>Real interview questions for any role</p>
          </div>
          <div className="feature-card">
            <div className="icon">📋</div>
            <p>Instant feedback after every answer</p>
          </div>
          <div className="feature-card">
            <div className="icon">🏆</div>
            <p>Final score and improvement plan</p>
          </div>
        </div>
        <button className="btn-primary" onClick={() => window.open("https://superprofile.bio/vp/interview-coach", "_blank")}>
          Pay ₹299 & Start Interview →
        </button>
        <p className="price-tag">One-time payment • 15 Questions • Any Role • Any Industry</p>
      </div>
    );
  }

  if (page === "role") {
    return (
      <div className="role-page">
        <div className="role-card">
          <h2>What role are you interviewing for?</h2>
          <p>Be specific for best results</p>
          <input
            type="text"
            placeholder="e.g. Senior Frontend Engineer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          <button
            className="btn-primary"
            onClick={startInterview}
            disabled={!role || loading}
          >
            {loading ? "Starting..." : "Begin Interview"}
          </button>
        </div>
      </div>
    );
  }

  if (page === "interview") {
    return (
      <div className="interview-page">
        <h2>Mock Interview — {role}</h2>
        <p style={{ color: "#6b7280" }}>Question {questionNum} of {TOTAL_QUESTIONS}</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(questionNum / TOTAL_QUESTIONS) * 100}%` }} />
        </div>
        {loading ? (
          <div className="loading">Please wait...</div>
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
                  {feedback}
                </div>
                <button className="btn-next" onClick={nextQuestion}>
                  {questionNum >= TOTAL_QUESTIONS ? "See Final Report" : "Next Question"}
                </button>
              </>
            )}
          </>
        )}
      </div>
    );
  }

  if (page === "report") {
    return (
      <div className="report-page">
        <h2>Your Final Report</h2>
        {loading ? (
          <div className="loading">Generating your report...</div>
        ) : (
          <>
            <div className="report-box">{report}</div>
            <button className="btn-restart" onClick={restart}>
              Start New Interview
            </button>
          </>
        )}
      </div>
    );
  }
}
