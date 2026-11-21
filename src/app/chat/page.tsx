'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  RotateCcw, 
  Play, 
  Pause, 
  Globe, 
  ExternalLink, 
  AlertTriangle, 
  ShieldCheck, 
  Scale, 
  Plus, 
  Sparkles,
  Info
} from 'lucide-react';
import { PublicNavbar } from '@/components/PublicNav';
import { getAppLanguage, setAppLanguage, AppLanguage } from '@/lib/langStore';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: { title: string; authority: string; url: string; citation: string }[];
  audioAvailable?: boolean;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    content: `Namaste! I am your CaseKeeper Legal Assistant. 

I can help clarify statutory procedures in India, government schemes (such as PMFBY, Tele-Law, e-Jagriti & e-Daakhil), cooperative society by-laws, and explain how to engage a legal aid or private advocate.

You can ask me questions in **English** or **हिंदी**, or use the microphone button below to record your voice.`,
    timestamp: 'Just now',
    sources: [
      {
        title: 'NALSA Legal Services Authorities Act, 1987',
        authority: 'National Legal Services Authority',
        url: 'https://nalsa.gov.in',
        citation: 'Section 12 (Citizen entitlement)'
      }
    ],
    audioAvailable: true
  },
  {
    id: 'msg-2',
    role: 'user',
    content: 'What documents do I need to file a consumer complaint against an e-commerce seller for sending a defective phone?',
    timestamp: '2 mins ago'
  },
  {
    id: 'msg-3',
    role: 'assistant',
    content: `To file a consumer complaint against an e-commerce seller or manufacturer under the **Consumer Protection Act, 2019**, here is the verified statutory checklist:

1. **Proof of Transaction / Tax Invoice:** Purchase invoice, order confirmation email with Order ID, and digital payment transaction slip.
2. **Evidence of Defect:** High-resolution photographs/videos showing the physical defect or malfunctioning screen, along with the device IMEI number.
3. **Manufacturer / Service Center Job Sheet:** If you submitted it for repair, obtain the official rejection or repair denial inspection sheet.
4. **Copy of Written Communication / Legal Notice:** Proof that you notified customer support (via email or registered letter) giving them at least 15 days to refund or replace the device.
5. **Affidavit / Verification Form:** Formal statement signed by complainant confirming the facts stated in the petition are true.

**Next Procedural Steps:**
You can file this directly online on the **e-Jagriti / e-Daakhil** portal (no advocate mandatory for District Commission claims up to Rs. 50 Lakhs) or visit your District Consumer Commission.`,
    timestamp: '1 min ago',
    sources: [
      {
        title: 'Consumer Protection Act, 2019',
        authority: 'Ministry of Consumer Affairs',
        url: 'https://consumeraffairs.nic.in',
        citation: 'Section 35 (Manner in which complaint shall be made)'
      },
      {
        title: 'National Consumer Helpline & e-Jagriti / e-Daakhil Rules',
        authority: 'National Consumer Disputes Redressal Commission',
        url: 'https://edaakhil.nic.in',
        citation: 'Practice Direction 2020 on Electronic Pleadings'
      }
    ],
    audioAvailable: true
  }
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [language, setLanguageState] = useState<AppLanguage>('EN');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLanguageState(getAppLanguage());
    const onLangChanged = (e: any) => {
      if (e.detail) setLanguageState(e.detail);
      else setLanguageState(getAppLanguage());
    };
    window.addEventListener('casekeeper_lang_changed', onLangChanged);
    window.addEventListener('storage', onLangChanged);
    return () => {
      window.removeEventListener('casekeeper_lang_changed', onLangChanged);
      window.removeEventListener('storage', onLangChanged);
    };
  }, []);

  const changeLanguage = (newLang: AppLanguage) => {
    setLanguageState(newLang);
    setAppLanguage(newLang);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string | React.MouseEvent) => {
    const rawText = typeof textToSend === 'string' ? textToSend : input;
    const messageText = rawText.trim();
    if (!messageText || isTyping) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          language: language === 'HI' ? 'hi' : 'en'
        })
      });

      if (!res.ok) throw new Error('API request failed');

      const data = await res.json();
      const assistantMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.answer || (language === 'HI' ? 'कानूनी प्रावधानों के अनुसार उत्तर तैयार किया जा रहा है।' : 'Information retrieved from statutory sources.'),
        timestamp: 'Just now',
        sources: data.sources || [],
        audioAvailable: true
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      const fallbackMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: language === 'HI'
          ? 'माफ़ कीजिए, कानूनी सहायक से संपर्क करने में समस्या हुई। कृपया पुनः प्रयास करें।'
          : 'Unable to reach the legal assistant backend right now. Please try again.',
        timestamp: 'Just now',
        audioAvailable: false
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }
    setIsRecording(true);
    // Simulate speech-to-text recognition after 2 seconds
    setTimeout(() => {
      setIsRecording(false);
      const recognized = language === 'HI'
        ? 'उपभोक्ता फोरम (ई-जागृति / ई-दाखिल) में ऑनलाइन शिकायत दर्ज करने की प्रक्रिया क्या है?'
        : 'What is the procedure to file a complaint on e-Jagriti / e-Daakhil consumer portal?';
      setInput(recognized);
    }, 2000);
  };

  const starterPrompts = [
    'How do I claim crop insurance under PMFBY?',
    'What is the procedure for illegal maintenance charge in cooperative society?',
    'How to check CNR case status on e-Courts portal?',
    'Who is eligible for free NALSA legal aid?'
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <PublicNavbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Left Sidebar (260px) */}
        <aside className="hidden lg:flex flex-col w-64 bg-white rounded-xl border border-slate-200 p-4 shadow-sm shrink-0 justify-between">
          <div className="space-y-4">
            <button
              onClick={() => setMessages(INITIAL_MESSAGES.slice(0, 1))}
              className="w-full py-2.5 px-3 rounded-lg bg-[#1B4FD8] hover:bg-blue-600 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Conversation</span>
            </button>

            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Active Topics</p>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li className="p-2 rounded bg-blue-50 text-blue-700 font-medium border border-blue-100 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                  Consumer Protection Act 2019
                </li>
                <li className="p-2 rounded hover:bg-slate-50 transition-colors cursor-pointer">
                  PMFBY Crop Calamity 72-Hr Rule
                </li>
                <li className="p-2 rounded hover:bg-slate-50 transition-colors cursor-pointer">
                  Cooperative Society By-Law Surcharge
                </li>
                <li className="p-2 rounded hover:bg-slate-50 transition-colors cursor-pointer">
                  RERA Builder Delay Interest (Sec 18)
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Language Model</p>
              <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => changeLanguage('EN')}
                  className={`flex-1 py-1 rounded transition-colors ${
                    language === 'EN' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => changeLanguage('HI')}
                  className={`flex-1 py-1 rounded transition-colors ${
                    language === 'HI' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  हिंदी (Hindi)
                </button>
              </div>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200/80 text-[11px] text-amber-800 leading-tight">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <Info className="w-3.5 h-3.5 text-amber-600" />
              <span>Statutory Rule</span>
            </div>
            All answers cite published Indian statutes. Do not disclose confidential case materials in public chat.
          </div>
        </aside>

        {/* Main Chat Interface */}
        <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
          
          {/* Top Bar with Audio Controls & Banner */}
          <div className="p-3.5 border-b border-slate-200 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-white p-0.5 border border-slate-200 shadow-xs">
                <Image 
                  src="/logo.png" 
                  alt="CaseKeeper Logo" 
                  width={30} 
                  height={30} 
                  className="object-contain w-full h-full"
                />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-[#0F172A] flex items-center gap-2">
                  CaseKeeper Statutory Legal Assistant
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                    Active • Grounded
                  </span>
                </h2>
                <p className="text-[11px] text-slate-500">Based on published Acts & Gazette Guidelines</p>
              </div>
            </div>

            {/* Sarvam AI Audio Bar (Mock UI conforming to PRD 4.4) */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs shadow-sm">
              <Volume2 className="w-4 h-4 text-blue-600" />
              <span className="text-[11px] font-medium text-slate-600">Sarvam Audio</span>
              <button
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="p-1 rounded hover:bg-slate-100 text-slate-700"
                title="Play Audio"
              >
                {isPlayingAudio ? <Pause className="w-3.5 h-3.5 text-blue-600" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsPlayingAudio(false)}
                className="p-1 rounded hover:bg-slate-100 text-slate-700"
                title="Replay"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className={`h-full bg-blue-600 ${isPlayingAudio ? 'w-2/3 transition-all duration-1000' : 'w-0'}`}></div>
              </div>
              <span className="text-[10px] font-mono text-slate-400">1.0x</span>
            </div>
          </div>

          {/* Yellow Disclaimer Banner */}
          <div className="bg-[#FEF9C3] px-4 py-2 border-b border-amber-200 text-[11px] text-amber-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-700" />
            <span>
              <strong>General Information Notice:</strong> CaseKeeper provides statutory guidance, not formal advocate representation. For filed litigations, consult an empaneled advocate.
            </span>
          </div>

          {/* Chat Messages Stream */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
            {messages.map((m) => {
              const isAssistant = m.role === 'assistant';
              return (
                <div
                  key={m.id}
                  className={`flex gap-3 max-w-3xl ${isAssistant ? '' : 'ml-auto justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1B4FD8] flex items-center justify-center shrink-0 mt-0.5">
                      <Scale className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`rounded-xl p-4 text-xs sm:text-sm leading-relaxed ${
                      isAssistant
                        ? 'bg-slate-50 border border-slate-200 text-[#0F172A]'
                        : 'bg-[#1B4FD8] text-white shadow-sm'
                    }`}
                  >
                    <div className="whitespace-pre-line">{m.content}</div>

                    {/* Sources citation section */}
                    {isAssistant && m.sources && m.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-200/80">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          Approved Statutory Sources:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {m.sources.map((s, i) => (
                            <a
                              key={i}
                              href={s.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-slate-200 text-[11px] font-semibold text-blue-700 hover:border-blue-400 shadow-2xs"
                            >
                              <span>{s.title} ({s.citation})</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-2 text-[10px] opacity-70 text-right">
                      {m.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-500 italic p-2 bg-slate-50 rounded-lg w-fit">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                <span>Searching approved statutory records and composing guidance...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Starter Chips */}
          <div className="px-4 py-2 bg-slate-50/50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-slate-400 font-semibold shrink-0">Try asking:</span>
            {starterPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => setInput(p)}
                className="shrink-0 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-blue-700 hover:border-blue-300 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Bottom Input Bar with Mic & Send */}
          <div className="p-4 border-t border-slate-200 bg-white">
            <div className="flex items-center gap-2">
              {/* Sarvam STT Microphone Button */}
              <button
                onClick={handleToggleRecord}
                className={`p-2.5 rounded-lg border transition-all ${
                  isRecording 
                    ? 'bg-red-500 text-white border-red-600 animate-pulse' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                }`}
                title={isRecording ? 'Listening (Click to stop)' : 'Voice Input (Hindi / English)'}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={
                  isRecording 
                    ? 'Listening in Hindi / English... (Sarvam AI STT active)' 
                    : language === 'HI' ? 'कानूनी सवाल पूछें...' : 'Ask a legal question in plain English or Hindi...'
                }
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B4FD8] focus:border-transparent bg-slate-50/50"
              />

              {/* Send Button */}
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="p-2.5 rounded-lg bg-[#1B4FD8] hover:bg-blue-600 disabled:opacity-50 text-white font-semibold transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[10px] text-center text-slate-400 mt-2">
              CaseKeeper public assistant answers are grounded in official Indian Gazettes and court rulings. Never submit confidential client documents here.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
