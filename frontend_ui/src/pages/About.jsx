import { motion } from 'framer-motion';
import { Target, Users, ShieldCheck } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Empowering Youth Through the Prime Minister's Internship Scheme</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We bridge the gap between talented students and top-tier companies by parsing skills and matching them with live opportunities under the Prime Minister's Internship Scheme.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="glass-panel p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 text-[#00A5EC] rounded-full flex items-center justify-center mx-auto mb-6">
            <Target className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Precision Matching</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Our AI engine maps your unique skills to the exact requirements of top internship roles under the PM Scheme.
          </p>
        </div>
        <div className="glass-panel p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 text-[#00A5EC] rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">For Students & Grads</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Built specifically to help entry-level candidates break into tech without the noise of generic job boards.
          </p>
        </div>
        <div className="glass-panel p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 text-[#00A5EC] rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Verified Opportunities</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            We scrape and verify roles daily, ensuring you only apply to active, legitimate positions.
          </p>
        </div>
      </div>
    </div>
  );
}
