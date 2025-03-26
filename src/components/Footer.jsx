import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full py-8 bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row md:justify-between items-center text-center md:text-left">
        
        {/* Logo and Name on the Left */}
        <div className="flex items-center space-x-3">
          <img src="/src/assets/kulinarya-logo.jpg" alt="Kulinarya Logo" className="w-10 h-10 rounded-full" />
          <h2 className="text-2xl font-bold" style={{ color: "#f7630c" }}>Kulinarya</h2>
        </div>

        {/* Description and Links in the Center */}
        <div>
          <p className="text-sm text-gray-400 mt-2 md:mt-0">
            Your virtual guide to Filipino gastronomy and experiences.
          </p>

          <div className="mt-4 flex justify-center md:justify-start space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a>
            <span className="text-gray-500">|</span>
            <a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a>
            <span className="text-gray-500">|</span>
            <a href="#" className="text-gray-400 hover:text-white transition">Contact Us</a>
          </div>
        </div>

        {/* Social Icons on the Right */}
        <div className="mt-4 md:mt-0 flex space-x-4">
          <a href="#" className="text-gray-400 hover:text-white transition">
            <FaFacebook className="w-6 h-6" />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition">
            <FaInstagram className="w-6 h-6" />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition">
            <FaTwitter className="w-6 h-6" />
          </a>
        </div>
      </div>

      {/* Copyright Text */}
      <p className="text-sm text-gray-500 mt-6 text-center">
        &copy; 2025 Kulinarya. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
