import React, { useState } from 'react';
import { Check, Sparkles, HelpCircle, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface PricingViewProps {
  currentUser: UserProfile | null;
  onOpenAuth: (isSignUp?: boolean) => void;
  onTriggerUpgrade: () => void;
}

export const PricingView: React.FC<PricingViewProps> = ({
  currentUser,
  onOpenAuth,
  onTriggerUpgrade
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const isPro = currentUser?.plan === 'pro';

  const faqs = [
    {
      q: 'How does the 5 free actions monthly quota work?',
      a: 'Free tier users receive 5 actions each month to view, sign, format, or convert documents. The quota refreshes automatically every 30 days.'
    },
    {
      q: 'What is included in the Pro Plan?',
      a: 'The Pro plan offers unlimited document processing, full digital signature pad placement, multi-page PDF compilation, spreadsheet and presentation viewing, and zero daily caps for just ₦700/month.'
    },
    {
      q: 'Is my data secure?',
      a: 'Yes. DocuStudio executes document rendering and cryptographic signature placement client-side in your browser. We never retain copies of your confidential files on remote servers.'
    },
    {
      q: 'How do payments work via Paystack?',
      a: 'We process payments securely via Paystack. You can pay with bank transfer, card, USSD, or mobile money. Your account is upgraded automatically once payment is verified.'
    }
  ];

  return (
    <div className="py-16 px-4 sm:px-6 max-w-6xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
          Flexible Pricing
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white">
          Simple, transparent plans for everyone
        </h1>
        <p className="text-sm text-slate-300">
          Start free with 5 actions per month, or upgrade to Pro for unlimited document power at ₦700/month.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="rounded-2xl bg-[#16181D] border border-white/10 p-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif text-xl font-bold text-white">Free Starter</h3>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-white/5 text-slate-400">
                Forever Free
              </span>
            </div>
            <div className="mb-6">
              <span className="font-serif text-4xl font-bold text-white">₦0</span>
              <span className="text-xs text-slate-400 ml-1">/ month</span>
              <p className="text-xs text-slate-400 mt-2">
                Ideal for light document viewing, casual signing, and quick edits.
              </p>
            </div>

            <ul className="space-y-3 text-xs text-slate-300 border-t border-white/5 pt-6">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>5 document actions every month</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Vector PDF Viewer &amp; Page Jumps</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Basic PDF text form filler</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Rich Text Editor with TXT &amp; HTML export</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Spreadsheet &amp; presentation previewer</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => currentUser ? null : onOpenAuth(false)}
            disabled={!!currentUser}
            className="mt-8 w-full py-3 rounded-xl border border-white/15 hover:bg-white/5 disabled:opacity-50 text-white font-semibold text-xs cursor-pointer transition-colors"
          >
            {currentUser && !isPro ? 'Current Plan' : 'Get Started Free'}
          </button>
        </div>

        {/* Pro Plan */}
        <div className="relative rounded-2xl bg-[#16181D] border-2 border-indigo-500 p-8 flex flex-col justify-between shadow-2xl shadow-indigo-500/10">
          <span className="absolute -top-3 right-6 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
            Recommended
          </span>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <span>Pro Membership</span>
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </h3>
            </div>
            <div className="mb-6">
              <span className="font-serif text-4xl font-bold text-white">₦700</span>
              <span className="text-xs text-slate-400 ml-1">/ month</span>
              <p className="text-xs text-slate-400 mt-2">
                For busy professionals, legal practitioners, consultants, and teams.
              </p>
            </div>

            <ul className="space-y-3 text-xs text-slate-300 border-t border-white/5 pt-6">
              <li className="flex items-center gap-2.5 font-medium text-white">
                <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Unlimited document actions &amp; signatures</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Digital touchscreen signature drawing pad</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Full PDF-Lib compilation &amp; high-res export</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Unlimited spreadsheet filtering &amp; slide decks</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Priority support from TeaJay Konsult</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => {
              if (!currentUser) onOpenAuth(false);
              else onTriggerUpgrade();
            }}
            disabled={isPro}
            className="mt-8 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-emerald-600 disabled:opacity-80 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 cursor-pointer transition-all hover:scale-101"
          >
            {isPro ? '✅ Pro Active' : 'Upgrade to Pro with Paystack (₦700)'}
          </button>
        </div>
      </div>

      {/* FAQs */}
      <div className="max-w-3xl mx-auto space-y-6 pt-10">
        <h2 className="font-serif text-2xl font-bold text-white text-center">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-[#16181D] border border-white/10 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between text-sm font-semibold text-white cursor-pointer hover:bg-white/5"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
