import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const SESSION_DURATION = 2 * 60 * 1000; // 2 minutes
const INACTIVITY_DURATION = 1 * 60 * 1000; // 1 minute
const WARNING_DURATION = 30 * 1000; // 30 seconds

export function useSessionTimeout() {
    console.log("useSessionTimeout hook initialized");
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);
  const [timer, setTimer] = useState(WARNING_DURATION / 1000);
  const warningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inactivityTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset inactivity timer on user activity
  const resetInactivityTimer = () => {
    if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
    if (showWarning) return; // Don't reset if warning is showing
    inactivityTimeoutRef.current = setTimeout(() => {
      setShowWarning(true);
      setTimer(WARNING_DURATION / 1000);
    }, INACTIVITY_DURATION);
  };

  useEffect(() => {
    // Listen for user activity
    const events = ["mousemove", "keydown", "mousedown", "touchstart"];
    events.forEach(event =>
      window.addEventListener(event, resetInactivityTimer)
    );
    resetInactivityTimer();

    return () => {
      events.forEach(event =>
        window.removeEventListener(event, resetInactivityTimer)
      );
      if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
      if (warningTimeoutRef.current) clearInterval(warningTimeoutRef.current);
    };
    // eslint-disable-next-line
  }, [showWarning]);

  // Handle warning timer
  useEffect(() => {
    if (showWarning) {
      warningTimeoutRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(warningTimeoutRef.current!);
            localStorage.clear();
            sessionStorage.clear();
            navigate("/login");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (warningTimeoutRef.current) clearInterval(warningTimeoutRef.current);
    }
    // eslint-disable-next-line
  }, [showWarning, navigate]);

  // Session duration check (still log out after 2 min)
  useEffect(() => {
    const loginTime = parseInt(localStorage.getItem("loginTime") || "0", 10);
    if (!loginTime || Date.now() - loginTime > SESSION_DURATION) {
      localStorage.clear();
      sessionStorage.clear();
      navigate("/login");
    } else {
      const timeout = setTimeout(() => {
        localStorage.clear();
        sessionStorage.clear();
        navigate("/login");
      }, SESSION_DURATION - (Date.now() - loginTime));
      return () => clearTimeout(timeout);
    }
  }, [navigate]);

  // Render warning popup
  useEffect(() => {
    if (showWarning) {
      const popup = document.createElement("div");
      popup.id = "session-warning-popup";
      popup.style.position = "fixed";
      popup.style.top = "0";
      popup.style.left = "0";
      popup.style.width = "100vw";
      popup.style.height = "100vh";
      popup.style.background = "rgba(0,0,0,0.25)";
      popup.style.display = "flex";
      popup.style.alignItems = "center";
      popup.style.justifyContent = "center";
      popup.style.zIndex = "9999";

      popup.innerHTML = `
        <div style="
          background: #fff;
          padding: 32px 40px;
          border-radius: 12px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.18);
          text-align: center;
          font-size: 1.2em;
        ">
          <div style="margin-bottom: 18px;">
            <strong>Session is inactive.</strong><br>
            Ending in <span id="session-warning-timer" style="color:#c21c1c;font-weight:bold;">${timer}</span> seconds.
          </div>
          <button id="session-warning-continue" style="
            background: #0074d9;
            color: #fff;
            border: none;
            border-radius: 6px;
            padding: 10px 28px;
            font-size: 1em;
            cursor: pointer;
          ">Continue Session</button>
        </div>
      `;
      document.body.appendChild(popup);

      // Update timer every second
      const interval = setInterval(() => {
        const timerSpan = document.getElementById("session-warning-timer");
        if (timerSpan) timerSpan.textContent = timer.toString();
      }, 500);

      // Button handler
      const btn = document.getElementById("session-warning-continue");
      if (btn) {
        btn.onclick = () => {
          setShowWarning(false);
          setTimer(WARNING_DURATION / 1000);
          resetInactivityTimer();
          if (popup) document.body.removeChild(popup);
          clearInterval(interval);
        };
      }

      return () => {
        if (popup && document.body.contains(popup)) document.body.removeChild(popup);
        clearInterval(interval);
      };
    }
  }, [showWarning, timer]);
}