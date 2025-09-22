import React, { useState } from "react";
import "./HelpCenter.css";

const generalInfoPages = [
  // Page 1
  (
    <>
  {/* <div className="hc-article-title">General Information</div> */}
      <div className="hc-article-section">
        <div className="hc-article-subtitle">Digital Costco Shop Card</div>
        <div className="hc-article-body">Please visit Costco.com for general Shop Card FAQs. In this article: What is a Digital Costco Shop Card, Receiving your shop card, Locating your shop card, Missing shop card, Maximum shop...</div>
      </div>
      <div className="hc-article-section">
        <div className="hc-article-subtitle">Post Trip Feedback</div>
        <div className="hc-article-body">In this article: Inquiry form, Member review, Unfavorable reviews. When to complete a Post-Trip Inquiry form. If you encounter any issues during your trip, please fill out a Post-Trip...</div>
      </div>
      <div className="hc-article-section">
        <div className="hc-article-subtitle">Costco Anywhere Visa® Card By Citi</div>
        <div className="hc-article-body">In this article: Apply, Benefits, Cashback rewards, General questions, How to apply. Visit the membership counter of your local warehouse. Apply online at Costco.com. Call ...</div>
      </div>
      <div className="hc-article-section">
        <div className="hc-article-subtitle">Contact Us</div>
        <div className="hc-article-body">Costco Travel products and services are available online at Costcotravel.com or by phone. In this article: In-travel, Holiday closures, Post-travel, Contacting us while in-travel ...</div>
      </div>
      <div className="hc-article-section">
        <div className="hc-article-subtitle">Travel Insurance</div>
        <div className="hc-article-body">Costco Travel doesn't sell travel insurance, but we offer Costco preferred rates through our partner Zurich when you book your vacation with us. Most vacation packages...</div>
      </div>
      <div className="hc-article-section">
        <div className="hc-article-subtitle">Booking Requirements</div>
        <div className="hc-article-body">To make any type of booking with Costco Travel, you'll need the following information: Your membership number, Passenger names and date of birth (fees may apply for name corrections), A valid form of...</div>
      </div>
      <div className="hc-article-section">
        <div className="hc-article-subtitle">Membership</div>
        <div className="hc-article-body">In this article: Membership sign-up, Membership renewal, Upgrading your membership online, Find your membership number, Lost membership card, Membership sign-up. If you sign up at a...</div>
      </div>
      <div className="hc-article-section">
        <div className="hc-article-subtitle">Payment Information</div>
        <div className="hc-article-body">In this article: Accepted payments, Deposit payment, Make a payment, Split payments, Acceptable forms of payment. For online bookings, we accept the following: Visa® credit or debit...</div>
      </div>
      <div className="hc-article-section">
        <div className="hc-article-subtitle">Costco Travel Pricing</div>
        <div className="hc-article-body">In this article: Change Group rate, Matching Quotes, Taxes & fees, Price changes. If you find a lower price on Costcotravel.com after booking, please call the number in the...</div>
      </div>
      <div className="hc-article-section">
        <div className="hc-article-subtitle">Executive Membership 2% Rewards</div>
        <div className="hc-article-body">In this article: Travel rates, Details, Receiving rewards, Checking rewards balance, Travel rates. All Costco members get the same travel rates, but Executive Members may receive...</div>
      </div>
      <div className="hc-pagination-bar">
        <button className="hc-pagination-btn" disabled>1</button>
        <button className="hc-pagination-btn" data-testid="next" >2 Next &rsaquo;</button>
      </div>
    </>
  ),
  // Page 2
  (
    <>
  {/* <div className="hc-article-title">General Information</div> */}
      <div className="hc-article-section">
        <div className="hc-article-subtitle">Currency Exchange</div>
        <div className="hc-article-body">Before you travel, we recommend exchanging currency at your bank or credit union. They typically have access to the best exchange rates and charge fewer fees. A good rule of thumb is to carry at...</div>
      </div>
      <div className="hc-article-section">
        <div className="hc-article-subtitle">Deals & Promotions</div>
        <div className="hc-article-body">You'll find our latest deals and promotions here: Costcotravel.com, Warehouse Travel Booklets (pick one up at your local warehouse), Costco Coupon Booklets (mailed to you monthly), Costco...</div>
      </div>
      <div className="hc-article-section">
        <div className="hc-article-subtitle">Booking History</div>
        <div className="hc-article-body">View past bookings: Your booking history can help you plan your next trip. Simply click on the booking you wish to view. Sign in to your account. Click on your profile in the top-right corner...</div>
      </div>
      <div className="hc-article-section">
        <div className="hc-article-subtitle">Agent Appreciation</div>
        <div className="hc-article-body">Share your positive experience with our travel experts by completing the Member Compliment Form. We'll share your compliments with our agents and their leadership teams.</div>
      </div>
      <div className="hc-article-section">
        <div className="hc-article-subtitle">Scams and Fraud</div>
        <div className="hc-article-body">Beware of suspicious communications from Costco Travel and avoid clicking on links or sharing personal information. You can report travel scams, suspicious calls, emails and text messages to...</div>
      </div>
      <div className="hc-article-section">
        <div className="hc-article-subtitle">US & Canada Dual Residency</div>
        <div className="hc-article-body">If you have dual residency or dual citizenship (US and Canada), you may choose to book on either Costcotravel.com or Costcotravel.ca. However, you must have a valid Costco...</div>
      </div>
      <div className="hc-pagination-bar">
        <button className="hc-pagination-btn" data-testid="prev">&lsaquo; Previous 1</button>
        <button className="hc-pagination-btn" disabled>2</button>
      </div>
    </>
  )
];

const GeneralInformationArticle: React.FC = () => {
  const [page, setPage] = useState(0);

  return (
    <div>
      {generalInfoPages[page]}
      <div className="hc-pagination-bar">
        {page === 0 ? (
          <button className="hc-pagination-btn" onClick={() => setPage(1)}>2 Next &rsaquo;</button>
        ) : (
          <button className="hc-pagination-btn" onClick={() => setPage(0)}>&lsaquo; Previous 1</button>
        )}
      </div>
    </div>
  );
};

export default GeneralInformationArticle;
