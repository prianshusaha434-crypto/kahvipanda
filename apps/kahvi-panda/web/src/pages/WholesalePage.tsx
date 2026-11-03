import React, { useState } from 'react';
import { ApiClient } from '../services/api';
import { BRAND } from '@kahvi-panda/shared';
import { Coffee, ShieldCheck, CheckCircle2, MessageSquare, ExternalLink, ArrowRight } from 'lucide-react';

export const WholesalePage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    businessName: '',
    city: 'Kolkata',
    estimatedMonthlyKg: 20,
    productsOfInterest: 'Kolkata Classic & Nordic Dawn Whole Beans',
    subject: 'Wholesale B2B Coffee Supply Enquiry',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    referenceNumber: string;
    whatsAppClickUrl: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await ApiClient.submitEnquiry({
        ...formData,
        type: 'WHOLESALE_B2B'
      });
      setResult({
        referenceNumber: res.referenceNumber,
        whatsAppClickUrl: res.whatsAppClickUrl
      });
    } catch (err: any) {
      setError(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      
      {/* Hero Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-[11px] uppercase tracking-widest font-extrabold text-[#9CA88E]">
          Commercial Coffee Roasting
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#30231C] leading-tight">
          BETTER COFFEE FOR BETTER BUSINESSES.
        </h1>
        <p className="text-base text-[#4B3428] leading-relaxed">
          We roast small-batch specialty beans in Kolkata for high-volume cafes, boutique hotels, creative agencies, and modern workspaces.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left: Enquiry Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-[#30231C]/10 shadow-soft">
          
          {result ? (
            <div className="text-center py-8 space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-[#9CA88E]/20 text-[#7E8C6F] flex items-center justify-center mx-auto text-3xl">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl text-[#30231C]">
                Enquiry Registered #{result.referenceNumber}
              </h3>
              <p className="text-xs text-[#4B3428]/80 max-w-sm mx-auto leading-relaxed">
                Thank you! Our wholesale team has logged your cafe requirements. A complimentary sample kit will be dispatched to your location.
              </p>

              <div className="pt-4">
                <a
                  href={result.whatsAppClickUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#20ba59] transition-colors"
                >
                  <span>Chat on WhatsApp (+91 9874199454)</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="font-serif text-2xl text-[#30231C] mb-2">Request Wholesale Consultation & Tasting Box</h2>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs">{error}</div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-[#30231C] block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Anirban Sengupta"
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#FAF7F2] border border-[#30231C]/15 focus:outline-none focus:border-[#30231C]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-[#30231C] block mb-1">Business Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="The Salt Lake Roastery"
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#FAF7F2] border border-[#30231C]/15 focus:outline-none focus:border-[#30231C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-[#30231C] block mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@business.com"
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#FAF7F2] border border-[#30231C]/15 focus:outline-none focus:border-[#30231C]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-[#30231C] block mb-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98300 00000"
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#FAF7F2] border border-[#30231C]/15 focus:outline-none focus:border-[#30231C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-[#30231C] block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#FAF7F2] border border-[#30231C]/15 focus:outline-none focus:border-[#30231C]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-[#30231C] block mb-1">Est. Monthly Coffee (kg)</label>
                  <input
                    type="number"
                    min="5"
                    value={formData.estimatedMonthlyKg}
                    onChange={(e) => setFormData({ ...formData, estimatedMonthlyKg: parseInt(e.target.value, 10) || 10 })}
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#FAF7F2] border border-[#30231C]/15 focus:outline-none focus:border-[#30231C]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#30231C] block mb-1">Tell Us About Your Setup</label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Espresso machine model, grinders, target cup profile, opening date..."
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#FAF7F2] border border-[#30231C]/15 focus:outline-none focus:border-[#30231C]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-pill bg-[#30231C] text-[#F8F5EE] text-xs font-bold uppercase tracking-widest hover:bg-[#4B3428] shadow-elevated transition-colors"
              >
                {loading ? 'Submitting...' : 'Submit Wholesale Request'}
              </button>
            </form>
          )}

        </div>

        {/* Right: Partner Benefits */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FAF7F2] p-8 rounded-3xl border border-[#30231C]/10 space-y-4">
            <h3 className="font-serif text-2xl text-[#30231C]">Why Partner with Kahvi Panda?</h3>
            <div className="space-y-4 text-xs text-[#4B3428] leading-relaxed">
              <div className="flex gap-3">
                <Coffee className="w-5 h-5 text-[#BC785C] shrink-0" />
                <div>
                  <strong className="text-[#30231C] block">Tailored Espresso Curves</strong>
                  We dial in custom roast profiles calibrated to your specific grinder and portafilter pressure.
                </div>
              </div>
              <div className="flex gap-3">
                <ShieldCheck className="w-5 h-5 text-[#9CA88E] shrink-0" />
                <div>
                  <strong className="text-[#30231C] block">Direct Roastery Pricing</strong>
                  Generous tiered wholesale pricing with no middleman margins.
                </div>
              </div>
              <div className="flex gap-3">
                <MessageSquare className="w-5 h-5 text-[#BC785C] shrink-0" />
                <div>
                  <strong className="text-[#30231C] block">Direct WhatsApp Dispatch</strong>
                  Instant communication on +91 9874199454 for re-orders, emergency stock, and barista guidance.
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
