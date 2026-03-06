import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ArchitecturePage from './pages/ArchitecturePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/architecture" element={<ArchitecturePage />} />
      </Routes>
    </BrowserRouter>
  );
}
