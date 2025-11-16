import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './apps/landing/LandingPage';
import { UCIDApp } from './apps/ucid/UCIDApp';
import './styles/globals.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/ucid" element={<UCIDApp />} />
        <Route path="/ucid/*" element={<UCIDApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

