import React from "react";

const RentalCarOnlyBookingsArticle: React.FC = () => (
  <div className="printable hc-article-body">
    <p>
      RoadReach offers members exclusive rental car rates and one free additional driver with our
      rental partners. Executive Members earn a 2% reward per rental.
    </p>
    <h4>In this article:</h4>
    <ul className="hc-article-toc">
      <li><a href="#additional-driver">Additional driver</a></li>
      <li><a href="#booking">Booking</a></li>
      <li><a href="#email-confirmations">Email confirmations</a></li>
      <li><a href="#insurance-options">Insurance options</a></li>
      <li><a href="#loyalty-numbers">Loyalty numbers</a></li>
      <li><a href="#optional-equipment">Optional equipment</a></li>
      <li><a href="#restrictions">Restrictions</a></li>
    </ul>
    <h3 id="additional-driver" className="hc-article-sub">Additional driver</h3>
    <p>
      When booking a Rental Car with RoadReach, one additional driver fee is waived for qualifying members:
    </p>
    <ul>
      <li><strong>Alamo &amp; Enterprise:</strong> U.S., Canada, UK, Puerto Rico, France, Germany, Ireland, Spain</li>
      <li><strong>Avis &amp; Budget:</strong> U.S. and Canada</li>
    </ul>
    <p>
      Additional drivers are added at pick‑up and must meet the rental agency’s requirements (license & major credit card). Charges may apply for drivers under 25.
    </p>
    <h3 id="booking" className="hc-article-sub">Booking a rental car</h3>
    <p>To book:</p>
    <ol>
      <li>Sign in to your account</li>
      <li>Select Rental Cars</li>
      <li>Enter pickup & drop off: location, dates, times</li>
      <li>Select if you are at least 25 years old</li>
      <li>Click Search</li>
      <li>Use filters to narrow</li>
    </ol>
    <p><em>Or</em></p>
    <ol start={7}>
      <li>Call RoadReach Travel (rental cars option)</li>
      <li>Select a rental partner to connect to a representative</li>
      <li>Follow prompts for account assistance if needed</li>
    </ol>
    <h3 id="email-confirmations" className="hc-article-sub">Email confirmations</h3>
    <p>
      You’ll receive a confirmation email with RoadReach and agency confirmation numbers. Check spam/junk if missing or resend from your account.
    </p>
    <h3 id="insurance-options" className="hc-article-sub">Insurance options</h3>
    <p>Insurance isn’t included; you may add coverage via:</p>
    <ul>
      <li>Third‑party travel insurance</li>
      <li>Rental agency insurance (pre‑book or at pick‑up)</li>
      <li>Credit card benefits</li>
      <li>Personal auto insurance</li>
    </ul>
    <h3 id="loyalty-numbers" className="hc-article-sub">Loyalty numbers</h3>
    <p>Enter supported loyalty numbers under Driver Details. Contact the rewards program for point eligibility.</p>
    <h3 id="optional-equipment" className="hc-article-sub">Optional equipment / add‑ons</h3>
    <p>
      Add navigation, child seats, satellite radio during booking (availability varies). To add later you may need to cancel/rebook or request at pick‑up (pricing may change).
    </p>
    <h3 id="restrictions" className="hc-article-sub">Restrictions</h3>
    <p>
      Review geographic & cross‑border restrictions. Confirm terms for international or one‑way trips.
    </p>
    <hr className="hc-article-sep" />
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
        <li>Rental Car Only General Information</li>
        <li>Rental Car Only Changes &amp; Cancellations</li>
        <li>RoadReach Rewards Program</li>
      </ul>
    </div>
  </div>
);

export default RentalCarOnlyBookingsArticle;
