import React from "react";

const RentalCarOnlyChangesArticle: React.FC = () => (
  <div className="printable hc-article-body">
    <p>Canceled reservations can't be reinstated. Be sure you're ready to cancel before completing the process.</p>
    <h4>In this article:</h4>
    <ul>
      <li><a href="#cancel">Cancel</a></li>
      <li><a href="#change">Change</a></li>
    </ul>

    <h3 id="cancel" className="hc-article-sub">Canceling rental car only bookings</h3>
    <p>You can cancel your booking at any time without penalties. Payment isn't required to book, if you forget to cancel and don't pick up your rental, there's no penalty.</p>
    <p>There are three ways to cancel:</p>
    <ol>
      <li>Online through your RoadReach Travel account</li>
      <li>Call the number in the Contact Us section for assistance</li>
      <li>Call the rental car company</li>
    </ol>
    <p>Click the bottom right hand corner to view in fullscreen or for closed captioning.</p>
    <h4>To cancel a booking online:</h4>
    <ol>
      <li><b>Sign in</b> to your account</li>
      <li>Under Upcoming Bookings, locate your booking and select <b>Cancel</b></li>
      <li>On the Review and Cancel page, select the reason for the cancellation</li>
      <li>Select the I acknowledge... box, then select <b>Cancel Booking</b>
        <ul>
          <li>The Reservation Details will show <i>This booking was canceled on [today's date]</i></li>
          <li>You'll also receive an email confirming the cancellation</li>
        </ul>
      </li>
    </ol>
    <p>To cancel a package rental car see <a href="#">Vacation Package Cancellation</a></p>

    <h3 id="change" className="hc-article-sub">Change/modify</h3>
    <p>We can't modify existing rental car only bookings. You'll need to cancel your current booking and make a new one with the changes you want.</p>
    <ul>
      <li>Because pricing and availability are subject to change, we encourage you to confirm a new booking before canceling your original</li>
    </ul>

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
        <li>Rental Car Only Bookings</li>
        <li>Rental Car Only General Information</li>
        <li>Post Trip Feedback</li>
      </ul>
    </div>
  </div>
);

export default RentalCarOnlyChangesArticle;
