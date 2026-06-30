import React, { useContext, useRef } from "react";
import "./SearchBar.css";
import appContext from "../../store/app-context.js";

const SearchBar = () => {
  const { handleSubmit } = useContext(appContext);
  const inputRef = useRef();
  return (
    <div>
      <form
        className="search-form"
        onSubmit={async (event) => handleSubmit(event, inputRef.current)}
      >
        <input
          ref={inputRef}
          className="query-input"
          type="text"
          placeholder="Enter problem name"
        ></input>
        <button type="submit">Search</button>
      </form>
      <p className="cta">
        Type a topic, tag or title above to begin your search.
      </p>
    </div>
  );
};

export default SearchBar;
