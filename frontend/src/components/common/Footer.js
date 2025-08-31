import React from 'react';
import { Rocket, Heart, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-16 relative z-10 shadow-lg">
      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Product Feedback Tool</h3>
                <p className="text-sm text-gray-600">Empowering teams with user insights</p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed max-w-md">
              A modern platform for collecting, managing, and analyzing user feedback. 
              Built with React, Laravel, and Tailwind CSS for the best user experience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors text-sm">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors text-sm">
                  Submit Feedback
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors text-sm">
                  Feedback List
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors text-sm">
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors text-sm">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors text-sm">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors text-sm">
                  Bug Report
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors text-sm">
                  Feature Request
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links & Newsletter */}
        <div className="border-t border-gray-200 pt-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Follow us:</span>
              <div className="flex gap-3">
                <a 
                  href="https://github.com/ryan7998/product-feedback-tool" 
                  className="w-10 h-10 bg-gray-100 hover:bg-indigo-100 rounded-lg flex items-center justify-center text-gray-600 hover:text-indigo-600 transition-all duration-200"
                  title="GitHub"
                  target='_blank'
                >
                  <Github className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-100 hover:bg-indigo-100 rounded-lg flex items-center justify-center text-gray-600 hover:text-indigo-600 transition-all duration-200"
                  title="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/fazle-ryan/" 
                  className="w-10 h-10 bg-gray-100 hover:bg-indigo-100 rounded-lg flex items-center justify-center text-gray-600 hover:text-indigo-600 transition-all duration-200"
                  title="LinkedIn"
                  target='_blank'
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-100 hover:bg-indigo-100 rounded-lg flex items-center justify-center text-gray-600 hover:text-indigo-600 transition-all duration-200"
                  title="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="flex items-center gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>© {currentYear} Product Feedback Tool. Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>for better user experiences.</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
