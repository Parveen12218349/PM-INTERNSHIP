import { Mail, MapPin, Phone } from 'lucide-react';

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-lg text-gray-600">Have questions or feedback? We'd love to hear from you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="glass-panel p-8">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#00A5EC] focus:ring-1 focus:ring-[#00A5EC]" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#00A5EC] focus:ring-1 focus:ring-[#00A5EC]" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea rows="4" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#00A5EC] focus:ring-1 focus:ring-[#00A5EC]" placeholder="How can we help?"></textarea>
            </div>
            <button type="button" className="btn-primary w-full">Send Message</button>
          </form>
        </div>

        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-50 text-[#00A5EC] rounded-full flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900">Email Us</h4>
              <p className="text-gray-600">support@pminternship.com</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-50 text-[#00A5EC] rounded-full flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900">Location</h4>
              <p className="text-gray-600">San Francisco, CA<br/>Remote First</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
