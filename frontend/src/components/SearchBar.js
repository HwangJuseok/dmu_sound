import React from "react";

function SearchBar() {
  return (
    <div style={{ marginBottom: "30px", paddingRight: "30px" }}>
          <input
            type="text"
            placeholder="Search"
            style={{ width: "100%", padding: "10px", fontSize: "16px" }}
          />
        </div>
  );
}

export default SearchBar;