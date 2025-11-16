import { Link } from 'react-router-dom';
import SparxionLanding from '../../assets/Sparxion_Landing-001.svg';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-large">
      <div className="max-w-7xl mx-auto text-center relative">
        {/* Full Landing Page SVG */}
        <div className="w-full">
          <img 
            src={SparxionLanding} 
            alt="SparXion - connecting humans with ai" 
            className="w-full h-auto"
          />
        </div>

        {/* CTA Buttons Overlay - positioned over the SVG */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-medium">
          <Link 
            to="/ucid" 
            className="btn text-body px-xlarge py-medium inline-block bg-white border-bold border-black hover:bg-black hover:text-white transition-standard"
          >
            Explore UCID App →
          </Link>
          <a 
            href="https://aitunerapp.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn text-body px-xlarge py-medium inline-block bg-white border-bold border-black hover:bg-black hover:text-white transition-standard"
          >
            AI Tuner App →
          </a>
        </div>
      </div>
    </div>
  );
}

