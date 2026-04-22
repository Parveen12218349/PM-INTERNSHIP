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
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#00A5EC] flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Email</h4>
                  <p className="text-gray-500 text-sm">
                    support@internmatch.in<br />
                    Response time: 24-48 hours
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#00A5EC] flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Office</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    WeWork Galaxy, 43 Residency Road<br />
                    Bengaluru, Karnataka 560025<br />
                    India
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#00A5EC] flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Phone</h4>
                  <p className="text-gray-500 text-sm">
                    +91 (80) 4567-8900<br />
                    Mon-Fri from 9am to 6pm IST
                  </p>
                </div>
              </div>
        </div>
      </div>
    </div>
  );
}
