import React from "react";
import SearchBar from "../components/SearchBar";
import Section from "../components/Section";

function MainPage() {
  return (
    <main className="main-page">
      <div>
      <SearchBar />
      <Section title="다시 듣기" />
      <Section title="최신 음악" />
      <Section title="맞춤 추천 음악" />
      </div>
    </main>
  );
}

export default MainPage;