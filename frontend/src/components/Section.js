import React from "react";
import SongGrid from "./SongGrid";

function Section({ title }) {
  return (
    <section className="section">
      <h3>{title}</h3>
      <SongGrid />
    </section>
  );
}

export default Section;