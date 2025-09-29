import Link from 'next/link';
import { Github, Linkedin, Mail, MapPin, Code, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <Code className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Ollie Does Is</h3>
                <p className="text-gray-400 text-sm">Web Developer & Cybersecurity Student</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Building secure, modern web applications while pursuing cybersecurity expertise. 
              Based in Henderson, Nevada.
            </p>
            <div className="flex items-center space-x-2 text-gray-400 mb-4">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">Henderson, Nevada</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  About Me
                </Link>
              </li>
              <li>
                <Link 
                  href="/projects" 
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Section */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Connect</h4>
            <div className="space-y-3">
              <a 
                href="https://github.com/odub30" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 text-sm group"
              >
                <Github className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                <span>GitHub</span>
              </a>
              <a 
                href="https://linkedin.com/in/yourprofile" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 text-sm group"
              >
                <Linkedin className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                <span>LinkedIn</span>
              </a>
              <a 
                href="mailto:702seopro@gmail.com"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 text-sm group"
              >
                <Mail className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 text-gray-400 text-sm mb-4 md:mb-0">
              <span>© {currentYear} Ollie Does Is. Built with</span>
              <Heart className="h-4 w-4 text-red-500 animate-pulse" />
              <span>using Next.js & Tailwind CSS</span>
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors duration-200">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors duration-200">
                Terms
              </Link>
              <Link href="/sitemap" className="hover:text-white transition-colors duration-200">
                Sitemap
              </Link>
            </div>
          </div>
          
          {/* Tech Stack */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              React • Next.js • TypeScript • Tailwind CSS • Vercel
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}