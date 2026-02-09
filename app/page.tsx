"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("English");
  const [showLang, setShowLang] = useState(false);
  const [step, setStep] = useState<"app" | "feedback" | "donation">("app");
  const [rating, setRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [copied, setCopied] = useState(false);


  async function handleFix() {
    const feedbackGiven = localStorage.getItem("feedback-given") === "true";
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/duzelt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error?.includes("Usage limit")) {
  if (feedbackGiven) {
    setError("Demo usage limit reached.");
    return;
  }

  setStep("feedback");
  return;
}


        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      setResult(data.result);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <main className="container">
        <div className="blob blob1" />
        <div className="blob blob2" />

        {step === "app" && (
          <div className="card">
            <div className="lang-wrapper">
              <button className="lang-btn" onClick={() => setShowLang(true)}>
                🌍 {language}
              </button>

              {showLang && (
                <div className="lang-modal">
                  <h3>Select Language</h3>
                  <ul>
                    <li onClick={() => { setLanguage("Türkçe"); setShowLang(false); }}>🇹🇷 Türkçe</li>
                    <li onClick={() => { setLanguage("English"); setShowLang(false); }}>🇬🇧 English</li>
                    <li onClick={() => { setLanguage("Français"); setShowLang(false); }}>🇫🇷 Français</li>
                    <li onClick={() => { setLanguage("Español"); setShowLang(false); }}>🇪🇸 Español</li>
                    <li onClick={() => { setLanguage("Русский"); setShowLang(false); }}>🇷🇺 Русский</li>
                  </ul>
                </div>
              )}
            </div>

            <h1>FIXx.ai</h1>
            <p className="subtitle">
              Fix punctuation, capitalization and grammar instantly. <br />
              WARNING: YOU ARE CURRENTLY USING A 'DEMO' VERSION. IF YOU RUN INTO ANY ERRORS OR HAVE SUGGESTIONS FOR IMPROVEMENT, WE’D LOVE TO HEAR YOUR FEEDBACK.
            </p>

            <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your text here..."
            maxLength={500} // limit input to 500 characters
            />
            <p style={{ fontSize: "12px", opacity: 0.6, marginBottom: "10px" }}>
            {text.length} / 500 characters
            </p>

            <button onClick={handleFix} disabled={loading}>
              {loading ? "Fixing..." : "Fix Text"}
            </button>

            <button
            onClick={() => setStep("feedback")}
            style={{
            marginTop: "10px",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.25)",
            fontSize: "15px",
            }}
            >
           💬 Send Feedback
           </button>


            {error && <p className="error">{error}</p>}

            {result && (
           <div className="result">
           <h3>Corrected Text</h3>

           <button
  onClick={() => {
    navigator.clipboard.writeText(result);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  }}
  style={{
    position: "absolute",
    top: "10px",
    right: "10px",
    width: "auto",
    background: copied
      ? "linear-gradient(135deg, #22c55e, #16a34a)"
      : "rgba(255,255,255,0.12)",
    border: "none",
    borderRadius: "8px",
    padding: "4px 8px",
    fontSize: "12px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  }}
>
  {copied ? "Copied" : "Copy"}
</button>



    <p>{result}</p>

  </div>
)}

            <div style={{ marginTop: "20px", opacity: 0.85 }}>
              <p style={{ fontSize: "13px", marginBottom: "8px" }}>
                ☕ Support <b>FIXx.ai</b> on Buy Me a Coffee
              </p>

              <a
                href="https://www.buymeacoffee.com/aitextfixer"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    fontSize: "14px",
                  }}
                >
                  Buy Me a Coffee
                </button>
              </a>
            </div>
          </div>
        )}

        {step === "feedback" && (
          <div className="card">
            <h1>Give Us Feedback</h1>
            <p className="subtitle">
               You’ve reached the demo limit.  
                <br />
                 Support FIXx.ai to keep this tool alive ☕
            </p>

            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  style={{
                    cursor: "pointer",
                    fontSize: "24px",
                    color: star <= rating ? "#facc15" : "#6b7280",
                  }}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              placeholder="Optional feedback..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            />

            <button
              onClick={async () => {
                await fetch("/api/feedback", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ rating, message: feedbackText }),
                });
                localStorage.setItem("feedback-given", "true");


                setStep("donation");
              }}
              disabled={rating === 0}
            >
              Send Feedback
            </button>
          </div>
        )}

        {step === "donation" && (
          <div className="card">
            <h1>Support the Project</h1>
            <p 
            className="subtitle">
               Thanks for supporting FIXx.ai ❤️  
               <br />
               Your support helps keep the demo online.
            </p>

            <p>
              FIXx.ai is a free demo project.  
              If you like it, you can support its development.
            </p>

            <a
              href="https://www.buymeacoffee.com/aitextfixer"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button style={{ marginTop: "16px" }}>
                ☕ Buy Me a Coffee
              </button>
            </a>
            <button
            onClick={() => setStep("app")}
            style={{
            marginTop: "12px",
            background: "rgba(255,255,255,0.08)",
            fontSize: "14px",
            }}
            >
            ← Return to Homepage
            </button>
          </div>
        )}
         
      <style jsx>{`
      .result {
          position: relative;
          
        }
        .container {
          min-height: 100vh;
          background: #0b0614;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          font-family: system-ui, sans-serif;
        }

        .blob {
          position: absolute;
          width: 420px;
          height: 420px;
          background: radial-gradient(circle, #7c3aed, #4c1d95);
          filter: blur(120px);
          opacity: 0.35;
          animation: float 18s infinite ease-in-out;
        }

        .blob1 {
          top: -120px;
          left: -120px;
        }

        .blob2 {
          bottom: -120px;
          right: -120px;
          animation-delay: 6s;
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-40px); }
          100% { transform: translateY(0px); }
        }

        .card {
          position: relative;
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          padding: 32px;
          width: 100%;
          max-width: 520px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          color: #fff;
          z-index: 1;
          text-align: center;
        }

        h1 {
          margin: 0 0 8px;
          font-size: 28px;
        }

        .subtitle {
          margin-bottom: 20px;
          color: #c4b5fd;
        }

        textarea {
          width: 100%;
          min-height: 120px;
          border-radius: 10px;
          border: none;
          padding: 12px;
          font-size: 14px;
          margin-bottom: 14px;
          outline: none;
          resize: vertical;
          box-sizing: border-box;
          display: block;
        }

        button {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #7c3aed, #9333ea);
          color: white;
          font-size: 15px;
          cursor: pointer;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error {
          margin-top: 12px;
          color: #fca5a5;
        }

        .result {
          margin-top: 20px;
          background: rgba(0, 0, 0, 0.3);
          padding: 14px;
          border-radius: 10px;
        }

        .result h3 {
          margin: 0 0 6px;
          font-size: 14px;
          color: #d7b5fd;
        }

        .result p {
          margin: 0;
          font-size: 14px;
          line-height: 1.5;
        }

        .lang-btn {
          position: absolute;
          top: -36px;
          right: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 110px;
          gap: 6px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 999px;
          padding: 6px 12px;
          color: white;
          cursor: pointer;
          font-size: 13px;
        }

        .lang-modal {
          position: fixed;
          top: 6px;
          left: 50%;
          transform: translateX(-50%);
          background: #0f0a1f;
          border-radius: 20px;
          padding: 18px 22px;
          width: 260px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
          z-index: 20;
          
        }

      `}</style>

    </main>
  </>
  );
}

