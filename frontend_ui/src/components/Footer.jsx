import { Link } from 'react-router-dom';
import { Target } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded bg-[#00A5EC] flex items-center justify-center text-white font-bold">
                IM
              </div>
              <span className="text-xl font-extrabold text-gray-900 tracking-tight">InternMatch</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              The premier platform for connecting ambitious students with verified roles under the Prime Minister's Internship Scheme.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/internships" className="hover:text-[#00A5EC]">Browse Jobs</Link></li>
              <li><Link to="/" className="hover:text-[#00A5EC]">Upload Resume</Link></li>
              <li><Link to="/my-applications" className="hover:text-[#00A5EC]">Application Tracker</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/about" className="hover:text-[#00A5EC]">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-[#00A5EC]">Contact</Link></li>
              <li><a href="#" className="hover:text-[#00A5EC]">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Subscribe</h4>
            <p className="text-xs text-gray-500 mb-3">Get the latest internship alerts delivered weekly.</p>
            <div className="flex">
              <input type="email" placeholder="Email address" className="w-full px-3 py-2 border border-gray-300 rounded-l-md text-sm focus:outline-none focus:border-[#00A5EC]" />
              <button className="bg-[#00A5EC] text-white px-3 py-2 rounded-r-md hover:bg-[#008bc7]">
                <Target className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 mt-12 pt-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} InternMatch. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
