import React from "react";

const RoadReachTravelAccountArticle: React.FC = () => (
  <div className="printable hc-article-body">
    <p>RoadReach Travel sign in process now allows you to log in using your RoadReach.com email and password.</p>
    <h4>In this article:</h4>
    <ul>
      <li><a href="#create-account">Create an account</a></li>
      <li><a href="#reset-password">Resetting password</a></li>
      <li><a href="#troubleshooting">Troubleshooting</a></li>
      <li><a href="#update-account">Update your account</a></li>
    </ul>

    <h3 id="create-account" className="hc-article-sub">How to create an online account</h3>
    <ol>
      <li>Select <b>Create Account</b></li>
      <li>You must first create a RoadReach.com account for a one-time verification to set up a RoadReach Travel account</li>
      <li>On the Create Account page, enter:
        <ul>
          <li>Your email address</li>
          <li>Password; enter password again to confirm</li>
          <li>Membership number</li>
        </ul>
      </li>
      <li>Select <b>yes</b>, if you would like to receive emails from RoadReach</li>
      <li>Select <b>Create Account</b></li>
    </ol>
    <p>You must create a new RoadReach Travel account if your membership number changes due to a reported lost or stolen card or a new RoadReach Anywhere Citi Visa® Card.<br />
    Existing reservations on your account get transferred to your new account within 24 hours.</p>

    <h3 id="reset-password" className="hc-article-sub">Resetting your password</h3>
    <ol>
      <li>On the login page, select <b>Forgot Password?</b></li>
      <li>Enter your email address, then select <b>Send Verification Code</b></li>
      <li>Check your inbox for an email from no-reply@roadreach.com
        <ul>
          <li>If you don't receive the email, please call the number in the Contact Us section for assistance</li>
          <li>You may need to check your Spam or Junk folder</li>
        </ul>
      </li>
      <li>Enter the Verification Code, then select <b>Verify Code</b></li>
      <li>Enter your new password twice to confirm, then select <b>Update</b></li>
    </ol>
    <p>You'll receive a second confirmation email from RoadReach Customer Care advising that your password has changed.</p>

    <h3 id="troubleshooting" className="hc-article-sub">Troubleshooting your online account</h3>
    <ol>
      <li>Make sure you're entering <b>your</b> membership number
        <ul>
          <li>Your membership number is unique; your spouse/secondary will have a different number</li>
        </ul>
      </li>
      <li>Ensure that your email address is associated with your RoadReach Travel account
        <ul>
          <li>Each RoadReach Travel account requires a unique email address; spouse/secondary accounts need a different email than yours</li>
        </ul>
      </li>
      <li>If you have a RoadReach Travel account, you also need a RoadReach.com account
        <ul>
          <li>See the section above for details on creating an online account</li>
        </ul>
      </li>
    </ol>
    <p>If you're still experiencing login issues, please call the number in the Contact Us section for assistance.<br />
    1. Select option 1 for Rental Cars<br />
    2. Then select option 2 for help with your online account</p>
    <p>If your membership has expired, you must renew before attempting to log in.</p>

    <h3 id="update-account" className="hc-article-sub">Update your address or email</h3>
    <ol>
      <li><b>Sign in</b> to your account</li>
      <li>Click the dropdown arrow in the upper right-hand corner</li>
      <li>Select <b>Account</b></li>
      <li>Next to your address or email, select <b>Edit</b>
        <ul>
          <li>For address, make your edits and select <b>Update</b></li>
          <li>For email, follow the prompts</li>
        </ul>
      </li>
    </ol>
    <p>If you can no longer access your old email account, contact RoadReach Member Services at 1-800-774-2678.<br />
    Monday-Friday: 6 a.m.-6 p.m. PT<br />
    Saturday-Sunday: 8 a.m.-5 p.m. PT</p>
    <p>RoadReach Travel documents are digital; mailing address is for verification purposes only.</p>

    <div className="hc-answer-help">
      <span className="hc-answer-help-label">Is this answer helpful?</span>
      <div className="hc-inline-flex">
        <button className="hc-vote-btn" aria-label="Helpful">👍</button>
        <button className="hc-vote-btn" aria-label="Not helpful">👎</button>
      </div>
    </div>
    <div className="hc-related">
      <h4>Related Answers</h4>
      <ul>
        <li>Digital RoadReach Shop Card</li>
        <li>Rental Car Only Changes & Cancellations</li>
        <li>Membership</li>
      </ul>
    </div>
  </div>
);

export default RoadReachTravelAccountArticle;
