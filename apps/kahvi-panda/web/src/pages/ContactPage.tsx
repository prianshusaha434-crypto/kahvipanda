import React, { useState } from 'react';
import { ApiClient } from '../services/api';
import { BRAND } from '@kahvi-panda/shared';
import { Phone, Mail, MapPin, Clock, MessageSquare, ExternalLink, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
    type: 'GENERAL' as const
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ referenceNumber: string; whatsAppClickUrl: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await ApiClient.submitEnquiry(formData);
      setResult({
        referenceNumber: res.referenceNumber,
        whatsAppClickUrl: res.whatsAppClickUrl
      });
    } catch (err: any) {
      setError(err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[11px] uppercase tracking-widest font-extrabold text-[#9CA88E]">
          Get In Touch
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#30231C]">Contact Kahvi Panda</h1>
        <p className="text-sm text-[#4B3428]/80">
          Have questions about our roasts, brewing grind sizes, or an existing order? Our Kolkata team is here.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Contact Information */}
        <div className="lg:col-span-5 bg-[#FAF7F2] p-8 sm:p-10 rounded-3xl border border-[#30231C]/10 space-y-6">
          <h2 className="font-serif text-2xl text-[#30231C]">Roastery & Support</h2>
          
          <div className="space-y-4 text-xs text-[#4B3428]">
            <div className="flex items-start gap-3">
              <MessageSquare className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#30231C] block">Official WhatsApp Support:</strong>
                <a href={BRAND.whatsappUrl} target="_blank" rel="noreferrer" className="text-[#25D366] font-bold hover:underline">
                  {BRAND.whatsappNumber}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-[#BC785C] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#30231C] block">Email Concierge:</strong>
                <a href={`mailto:${BRAND.supportEmail}`} className="hover:underline">
                  {BRAND.supportEmail}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#9CA88E] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#30231C] block">Roastery Headquarters:</strong>
                <span>Kolkata, West Bengal, India</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-[#4B3428] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#30231C] block">Operating Hours:</strong>
                <span>Monday – Saturday, 9:00 am – 6:00 pm IST</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#30231C]/10">
            <a
              href={BRAND.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-pill bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#20ba59] transition-colors"
            >
              <span>Instant WhatsApp Concierge</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#30231C]/10 shadow-soft">
          {result ? (
            <div className="text-center py-8 space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-[#9CA88E]/20 text-[#7E8C6F] flex items-center justify-center mx-auto text-3xl">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl text-[#30231C]">
                Message Sent #{result.referenceNumber}
              </h3>
              <p className="text-xs text-[#4B3428]/80 max-w-sm mx-auto">
                Thank you! We have logged your request. You can also chat directly on WhatsApp using the button below.
              </p>
              <div className="pt-4">
                <a
                  href={result.whatsAppClickUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white text-xs font-bold uppercase hover:bg-[#20ba59]"
                >
                  <span>Open WhatsApp Thread</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="font-serif text-2xl text-[#30231C] mb-2">Send Us a Note</h2>

              {error && <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs">{error}</div>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-[#30231C] block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#FAF7F2] border border-[#30231C]/15 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-[#30231C] block mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#FAF7F2] border border-[#30231C]/15 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#30231C] block mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#FAF7F2] border border-[#30231C]/15 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#30231C] block mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#FAF7F2] border border-[#30231C]/15 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#30231C] block mb-1">Message *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#FAF7F2] border border-[#30231C]/15 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-pill bg-[#30231C] text-[#F8F5EE] text-xs font-bold uppercase tracking-widest hover:bg-[#4B3428] transition-colors"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
