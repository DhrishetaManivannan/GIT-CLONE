import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GitHubAuth from "@views/login";
import Dashboard from "@views/home/dashBoard/main";



const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GitHubAuth />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/:owner/:repo/*" element={<Dashboard />} />
       

      </Routes>
    </BrowserRouter>
  );
};

export default App;

