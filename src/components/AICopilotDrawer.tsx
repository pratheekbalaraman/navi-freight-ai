import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import {
  Sparkles,
  Send,
  FileText,
  Copy,
  Check,
  Bot,
  User,
  Lightbulb,
  Download,
  FileSpreadsheet,
  Anchor,
  ShieldCheck,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  Printer
} from 'lucide-react';
import { ProcurementInputs, ForecastResultData } from '../types';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  isMemo?: boolean;
}

interface AICopilotDrawerProps {
  currentScenario: ProcurementInputs;
  forecastResult?: ForecastResultData | null;
}

const STRATEGIC_QUICK_ACTIONS = [
  {
    title: 'Draft Full Executive Fixture Memo',
    prompt: 'Draft a formal Corporate Executive Memorandum recommending the chartering and fixture strategy for this cargo, comparing COA vs spot economics, vessel intake, and laytime clauses.',
    icon: FileText,
    badge: 'Executive Memo',
  },
  {
    title: 'Draft 3-Voyage COA Tender Term Sheet',
    prompt: 'Draft a comprehensive 3-voyage COA charter party tender term-sheet with bilateral BAF bunker formula, laycan spread, and owner compliance specifications.',
    icon: FileSpreadsheet,
    badge: 'Term Sheet',
  },
  {
    title: 'Haldia Hooghly Draft vs Sagar Transshipment',
    prompt: 'How do Haldia Hooghly river draft restrictions (7.8m-8.5m) impact vessel choice and parcel sizing vs Sagar Island / Sandheads offshore lightering?',
    icon: Anchor,
    badge: 'Port Draft',
  },
  {
    title: 'VLSFO Bunker Spike Stress-Test (+$80/MT)',
    prompt: 'Stress-test ocean freight from origin to destination if Singapore 0.5% VLSFO increases by $80/MT, calculating the net ton-mile freight escalation.',
    icon: SlidersHorizontal,
    badge: 'Bunker Sensitivity',
  },
  {
    title: '1x Capesize vs 2x Panamax Economics',
    prompt: 'Compare the total landed freight economics of fixing 1x Capesize to Gangavaram vs 2x Panamax to Visakhapatnam Inner Harbour.',
    icon: ShieldCheck,
    badge: 'Vessel Sizing',
  },
  {
    title: 'PWWD SHINC Laytime & Demurrage Terms',
    prompt: 'What are the essential PWWD SHINC laytime, reversible laytime, and BIMCO monsoon swell suspension clauses to protect charterers against demurrage?',
    icon: RefreshCw,
    badge: 'Charter Party',
  },
];

export const AICopilotDrawer: React.FC<AICopilotDrawerProps> = ({
  currentScenario,
  forecastResult,
}) => {
  const [activeView, setActiveView] = useState<'chat' | 'memo'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: `### Welcome to NAVI-FREIGHT AI Strategic Chartering Advisor & Memo Drafter

I am your dry bulk chartering specialist and maritime legal analyst for Indian East Coast import fixtures (**Paradip, Visakhapatnam, Gangavaram, Gopalpur, Dhamra, Haldia, Sagar/Sandheads**).

**Active Fixture Scenario:**
- **Cargo:** ${currentScenario.cargoVolumeMT.toLocaleString()} MT ${currentScenario.commodity}
- **Route:** ${currentScenario.originPort} (${currentScenario.originCountry}) → ${currentScenario.dischargePort}
- **Strategy:** ${currentScenario.contractType}
- **Benchmark Freight:** $${currentScenario.currentSpotFreightPerMT.toFixed(2)}/MT | Bunker: $${currentScenario.bunkerPricePerMT.toFixed(2)}/MT (VLSFO)

Select a quick action above to generate a **Board-Ready Executive Memorandum**, structure **Tender Term Sheets**, or test **Bunker & Port Draft Sensitivities**.`,
      timestamp: new Date(),
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeDraftMemo, setActiveDraftMemo] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (queryText?: string) => {
    const text = queryText || inputQuery;
    if (!text.trim() || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: Message = {
      id: userMsgId,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    const isMemoRequest =
      /\b(draft\s+(a\s+)?(full\s+)?(executive\s+)?memo|write\s+(a\s+)?memo|prepare\s+(a\s+)?memo|executive\s+memorandum|board\s+memo|fixture\s+memo|tender\s+term[- ]?sheet|draft\s+(a\s+)?(tender|term[- ]?sheet))\b/i.test(text) ||
      (/\bmemo\b/i.test(text) && /\b(draft|prepare|generate|write|create)\b/i.test(text));

    try {
      const res = await fetch('/api/co-pilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: text,
          scenarioContext: {
            ...currentScenario,
            vesselRecommendation: forecastResult?.vesselRecommendation,
            contractComparison: forecastResult?.contractComparison,
            idleManagement: forecastResult?.idleManagement,
            forwardRateCurve: forecastResult?.forwardRateCurve,
          },
          chatHistory: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      const replyContent = data.reply || 'No response generated from the chartering intelligence engine.';
      const newModelMsgId = `model-${Date.now()}`;
      const isMemoContent =
        replyContent.includes('# MEMORANDUM: CHARTERING STRATEGY') ||
        replyContent.includes('### 1. EXECUTIVE SUMMARY & COMMERCIAL RECOMMENDATION');
      const isMemo = isMemoRequest || isMemoContent;

      setMessages((prev) => [
        ...prev,
        {
          id: newModelMsgId,
          role: 'model',
          content: replyContent,
          timestamp: new Date(),
          isMemo,
        },
      ]);

      if (isMemo) {
        setActiveDraftMemo(replyContent);
      }
    } catch (err) {
      console.error('Co-pilot request error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `model-err-${Date.now()}`,
          role: 'model',
          content: 'Unable to communicate with the chartering model. Please check network connectivity or retry.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (text: string, filenamePrefix = 'Chartering_Advisory') => {
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filenamePrefix}_${currentScenario.dischargePort.replace(/\s+/g, '_')}_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Generate an instant memo if user clicks "Draft Memo"
  const handleTriggerMemoDraft = () => {
    setActiveView('memo');
    handleSend('Draft a formal Corporate Executive Memorandum recommending the chartering and fixture strategy for this cargo, comparing COA vs spot economics, vessel intake, and laytime clauses.');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[780px]">
      {/* Top Header */}
      <div className="p-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-tight text-white">AI Chartering Advisor & Memo Drafter</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                Gemini Intelligence Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Contract formulation, laytime & demurrage analysis, and board-ready procurement memos
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setActiveView('chat')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeView === 'chat'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Advisory Chat</span>
          </button>
          <button
            onClick={handleTriggerMemoDraft}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeView === 'memo'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-300" />
            <span>Executive Memo Drafter</span>
          </button>
        </div>
      </div>

      {/* Suggested Quick Strategic Action Pills */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 overflow-x-auto">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold flex items-center gap-1 flex-shrink-0 text-[11px]">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Directives:
          </span>
          {STRATEGIC_QUICK_ACTIONS.map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                onClick={() => {
                  if (action.title.includes('Memo')) {
                    setActiveView('memo');
                  }
                  handleSend(action.prompt);
                }}
                disabled={isLoading}
                className="text-[11px] px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/60 text-slate-700 font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50"
              >
                <Icon className="w-3 h-3 text-indigo-600" />
                <span>{action.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      {activeView === 'memo' && activeDraftMemo ? (
        /* Dedicated Executive Memo Drafter View */
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-100">
          <div className="p-3 bg-white border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-800">
                Generated Executive Chartering Memorandum
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                {currentScenario.cargoVolumeMT.toLocaleString()} MT {currentScenario.commodity}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(activeDraftMemo, 'active-memo')}
                className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md border border-slate-300 flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedId === 'active-memo' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedId === 'active-memo' ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={() => handleDownload(activeDraftMemo, 'Executive_Chartering_Memo')}
                className="px-2.5 py-1 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Memo (.md)</span>
              </button>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-xs border border-slate-200">
              <div className="prose prose-slate prose-sm max-w-none">
                <div className="markdown-body text-slate-800 text-xs leading-relaxed space-y-4">
                  <Markdown>{activeDraftMemo}</Markdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Conversational Advisory Chat Log View */
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white shadow-xs ${
                  msg.role === 'user' ? 'bg-indigo-600' : 'bg-slate-900 border border-slate-800'
                }`}
              >
                {msg.role === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4 text-amber-400" />
                )}
              </div>

              <div
                className={`relative max-w-[88%] rounded-xl p-4.5 leading-relaxed shadow-2xs ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-800'
                }`}
              >
                {/* Action icons for assistant responses */}
                {msg.role === 'model' && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors border border-transparent hover:border-slate-200"
                      title="Copy text to clipboard"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDownload(msg.content, msg.isMemo ? 'Chartering_Memo' : 'Advisory_Brief')}
                      className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors border border-transparent hover:border-slate-200"
                      title="Download as Markdown"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Message Content */}
                {msg.role === 'user' ? (
                  <div className="whitespace-pre-wrap font-medium text-xs text-white">
                    {msg.content}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="markdown-body pr-14 text-slate-800 text-xs leading-relaxed">
                      <Markdown>{msg.content}</Markdown>
                    </div>
                    {msg.isMemo && activeView === 'chat' && (
                      <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-indigo-700 font-medium flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5" />
                          Formatted Executive Fixture Memo
                        </span>
                        <button
                          onClick={() => {
                            setActiveDraftMemo(msg.content);
                            setActiveView('memo');
                          }}
                          className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded transition-colors cursor-pointer"
                        >
                          View in Memo Drafter &rarr;
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-600 flex items-center gap-3 shadow-2xs">
                <div className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <span>
                  Analyzing chartering parameters & generating advisory for {currentScenario.dischargePort}...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Query Input Bar */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask any chartering question (e.g., 'What is the draft at Paradip?', 'Explain PWWD SHINC') or request a memo..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 placeholder:text-slate-400 outline-none transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !inputQuery.trim()}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xs flex-shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
