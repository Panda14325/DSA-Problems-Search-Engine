import React from "react";
import "./Header.css";
import codeforces from "../../assets/logos/codeforces.png";
import leetcode from "../../assets/logos/leetcode.png";
import CSES from "../../assets/logos/cses.png";

const Header = () => {
  return (
    <div className="hero-content">
      <h1> Search 3500+ DSA Problems in Seconds</h1>
      <p className="tagline">
        Instantly find coding challenges across
        <img src={codeforces} alt="codeforces" className="platform-icon" />
        <img src={leetcode} alt="leetcode" className="platform-icon" />
        <img src={CSES} alt="CSES" className="platform-icon" />
        -all in one place
      </p>
    </div>
  );
};

export default Header;
