import { Link } from 'react-router-dom';
import SparxionLanding from '../../assets/Sparxion_Landing-001.svg';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-large">
      <div className="w-full max-w-7xl mx-auto text-center">
        {/* Full Landing Page SVG */}
        <div className="w-full mb-small flex justify-center">
          <img 
            src={SparxionLanding} 
            alt="SparXion - connecting humans with ai" 
            className="w-full max-w-7xl h-auto"
            style={{ minHeight: '625px', objectFit: 'contain' }}
          />
        </div>

        {/* CTA Buttons - positioned below the SVG with proper spacing */}
        <div className="flex gap-medium justify-center items-center flex-wrap mt-small">
          <Link 
            to="/signin" 
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
          <a 
            href="mailto:john@sparxion.com"
            className="btn text-body px-xlarge py-medium inline-block bg-white border-bold border-black hover:bg-black hover:text-white transition-standard"
          >
            Contact →
          </a>
        </div>
      </div>
    </div>
  );
}

