import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import SearchResults from "./SearchResults";
import TrackDetail from "./TrackDetail";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/track/:id" element={<TrackDetail />} />
        </Routes>
    );
};

export default App;
