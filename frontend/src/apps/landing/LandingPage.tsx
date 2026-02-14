import { Link } from 'react-router-dom';
import SparxionLanding from '../../assets/Sparxion_Landing-001.svg';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-medium md:p-large">
      <div className="w-full max-w-[1600px] mx-auto text-center">
        {/* Full Landing Page SVG */}
        {/* Increased container padding and logo size, especially on mobile */}
        <div className="w-full mb-large md:mb-xlarge flex justify-center">
          <img 
            src={SparxionLanding} 
            alt="SparXion - connecting humans with ai" 
            className="w-full h-auto"
            style={{ 
              minHeight: '500px',
              maxWidth: '1600px',
              objectFit: 'contain'
            }}
            // Responsive sizing handled via CSS
          />
        </div>

        {/* CTA Buttons - positioned below the SVG with proper spacing */}
        {/* Increased spacing on mobile to prevent badges from covering logo */}
        <div className="flex gap-medium justify-center items-center flex-wrap mt-large md:mt-xlarge">
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
      
      {/* Add custom styles for mobile responsiveness */}
      <style>{`
        @media (max-width: 768px) {
          /* Make logo larger on mobile - ensure it's prominent */
          img[alt="SparXion - connecting humans with ai"] {
            min-height: 550px !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 8px;
            display: block;
            margin: 0 auto;
          }
          
          /* Ensure buttons don't overlap logo - add more space */
          .flex.flex-wrap {
            margin-top: 50px !important;
            gap: 16px;
            position: relative;
            z-index: 1;
          }
          
          /* Logo container - ensure it's above buttons */
          .w-full.mb-large {
            position: relative;
            z-index: 2;
            margin-bottom: 50px !important;
          }
        }
        
        @media (min-width: 769px) and (max-width: 1024px) {
          /* Tablet size - medium logo */
          img[alt="SparXion - connecting humans with ai"] {
            min-height: 650px !important;
          }
        }
        
        @media (min-width: 1025px) {
          /* Larger logo on desktop */
          img[alt="SparXion - connecting humans with ai"] {
            min-height: 750px !important;
          }
        }
      `}</style>
    </div>
  );
}

