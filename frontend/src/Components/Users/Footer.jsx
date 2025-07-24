import { Heart } from 'lucide-react';
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-teal-500 text-black py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-6 w-6 text-black" />
              <span className="text-xl font-bold">EaseMind</span>
            </div>
            <p className="text-black text-sm">
              Connecting you with qualified mental health professionals for a healthier, happier
              life.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-black">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Find a Therapist
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Online Therapy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Group Sessions
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-black">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Mental Health Guide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Support Groups
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Crisis Resources
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-black">
              <li>Email: support@mindease.com</li>
              <li>Phone: + 91 8590927218</li>
              <li>Available 24/7 for emergencies</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-teal-500 mt-8 pt-8 text-center text-sm text-black">
          <p>&copy; 2025 EaseMind. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
