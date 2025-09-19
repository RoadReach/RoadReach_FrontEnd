import { useEffect, useRef, useCallback, useState } from "react";

export function useSessionTimeout({
  timeout = 3 * 60 * 1000, // 3 minutes
  autoLogout = 3 * 60 * 1000, // 3 minutes after modal
  onLogout,
}: {
  timeout?: number;
  autoLogout?: number;
  onLogout: () => void;
}) {
  const [showSessionTimeout, setShowSessionTimeout] = useState(false);
  const sessionTimeoutRef = useRef<number | null>(null);
  const autoLogoutTimeoutRef = useRef<number | null>(null);

  // Reset session timer on user activity
  useEffect(() => {
    const resetTimer = () => {
      if (sessionTimeoutRef.current) clearTimeout(sessionTimeoutRef.current);
      sessionTimeoutRef.current = window.setTimeout(() => {
        setShowSessionTimeout(true);
      }, timeout);
    };
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    resetTimer();
    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      if (sessionTimeoutRef.current) clearTimeout(sessionTimeoutRef.current);
      if (autoLogoutTimeoutRef.current) clearTimeout(autoLogoutTimeoutRef.current);
    };
  }, [timeout]);

  // Auto-logout effect when modal is shown
  useEffect(() => {
    if (showSessionTimeout) {
      autoLogoutTimeoutRef.current = window.setTimeout(() => {
        onLogout();
      }, autoLogout);
    } else {
      if (autoLogoutTimeoutRef.current) clearTimeout(autoLogoutTimeoutRef.current);
    }
    return () => {
      if (autoLogoutTimeoutRef.current) clearTimeout(autoLogoutTimeoutRef.current);
    };
  }, [showSessionTimeout, autoLogout, onLogout]);

  const handleStaySignedIn = useCallback(() => {
    setShowSessionTimeout(false);
    if (sessionTimeoutRef.current) clearTimeout(sessionTimeoutRef.current);
    if (autoLogoutTimeoutRef.current) clearTimeout(autoLogoutTimeoutRef.current);
    sessionTimeoutRef.current = window.setTimeout(() => {
      setShowSessionTimeout(true);
    }, timeout);
  }, [timeout]);

  return {
    showSessionTimeout,
    setShowSessionTimeout,
    handleStaySignedIn,
  };
}
