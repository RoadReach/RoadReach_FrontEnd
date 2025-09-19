import React from "react";

const TroubleshootArticle: React.FC = () => (
  <div className="printable hc-article-body">
    <h3>Troubleshoot</h3>
    <p>Here are some tips that may help resolve the problem:</p>
    <ul>
      <li>Check your Wi-Fi or internet connection</li>
      <li>Clear your browser's cache and cookies</li>
      <li>Ensure your browser is up to date</li>
      <li>Log in using only one device at a time</li>
    </ul>
    <p>If you continue to experience issues, please contact support for further assistance.</p>
    <div className="hc-answer-help">
      <span className="hc-answer-help-label">Is this answer helpful?</span>
      <div className="hc-inline-flex">
        <button className="hc-vote-btn" aria-label="Helpful">👍</button>
        <button className="hc-vote-btn" aria-label="Not helpful">👎</button>
      </div>
    </div>
  </div>
);

export default TroubleshootArticle;
