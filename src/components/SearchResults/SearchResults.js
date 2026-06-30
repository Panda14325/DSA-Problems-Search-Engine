import React, { useContext } from "react";
import appContext from "../../store/app-context";
import Spinner from "../Spinner/Spinner.js";
import "./SearchResults.css";
import codeforces from "../../assets/logos/codeforces.png";
import leetcode from "../../assets/logos/leetcode.png";
import cses from "../../assets/logos/cses.png";

const platformLogos = {
  codeforces: codeforces,
  leetcode: leetcode,
  cses: cses,
};

const SearchResults = () => {
  const { loading, results, hasSearched } = useContext(appContext);
  return (
    <div className="results">
      {loading && <Spinner />}
      {!loading && hasSearched && results.length === 0 && (
        <div>No Matches Found</div>
      )}
      {!loading &&
        results.length > 0 &&
        results.map((result, index) => (
          <div
            key={result.url}
            className={`card ${index === 0 ? "featured" : ""}`}
          >
            <div className="card-header">
              <img
                src={platformLogos[result.platform.toLowerCase()]}
                alt={`${result.platform} logo`}
                className="platform-logo"
              />
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card-title"
              >
                {result.title}
              </a>
            </div>
          </div>
        ))}
    </div>
  );
};

export default SearchResults;
