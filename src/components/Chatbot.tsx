import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { chatbotAPI } from '../services/api';
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles, Lightbulb, Target, Shield, AlertTriangle, TrendingUp } from 'lucide-react';

interface Message {
  role: 'string' | 'user' | 'assistant';
  content: string;
  timestamp: Date;
  insights?: string[];
  suggestions?: string[];
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your AI Fantasy Cricket Assistant. I can help you understand player selections, analyze pitch conditions, and suggest winning strategies. Ask me anything!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatMutation = useMutation({
    mutationFn: (message: string) => chatbotAPI.chat(message),
    onSuccess: (data: any) => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.data.response,
          timestamp: new Date()
        }
      ]);
    },
    onError: () => {
      // Generate intelligent fallback response
      const fallback = generateIntelligentResponse(input);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: fallback,
          timestamp: new Date()
        }
      ]);
    }
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');

    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      }
    ]);

    chatMutation.mutate(userMessage);
  };

  const quickQuestions = [
    { label: 'Captain advice', icon: Target },
    { label: 'Differential picks', icon: Sparkles },
    { label: 'Risk assessment', icon: Shield },
    { label: 'Pitch analysis', icon: Lightbulb }
  ];

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-glow-lg flex items-center justify-center transition-all duration-300 group ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute inset-0 w-full h-full rounded-full bg-primary-400 animate-ping opacity-20" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-dark-900 border border-dark-700 rounded-2xl shadow-dark-lg flex flex-col overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600/20 to-primary-900/20 px-5 py-4 flex items-center justify-between border-b border-dark-700">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 bg-primary-600/30 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-300" />
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-accent-emerald rounded-full border-2 border-dark-900" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Fantasy AI</h3>
                <p className="text-primary-400 text-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Explainable AI Assistant
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-dark-400 hover:text-white transition-colors p-1.5 hover:bg-dark-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 h-80 bg-dark-950/50">
            {messages.map((message, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 bg-primary-600/20 rounded-full flex items-center justify-center flex-shrink-0 border border-primary-500/20">
                    <Bot className="w-4 h-4 text-primary-400" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    message.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-dark-800 text-dark-200 border border-dark-700'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 bg-dark-800 rounded-full flex items-center justify-center flex-shrink-0 border border-dark-700">
                    <User className="w-4 h-4 text-dark-400" />
                  </div>
                )}
              </div>
            ))}

            {chatMutation.isPending && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-primary-600/20 rounded-full flex items-center justify-center border border-primary-500/20">
                  <Bot className="w-4 h-4 text-primary-400" />
                </div>
                <div className="bg-dark-800 rounded-2xl px-4 py-2.5 border border-dark-700 flex items-center gap-2">
                  <Loader2 className="w-5 h-5 text-primary-400 animate-spin" />
                  <span className="text-dark-400 text-sm">Analyzing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div className="px-4 py-3 bg-dark-900/50 border-t border-dark-700">
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(q.label);
                  }}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-dark-800 text-dark-300 rounded-full hover:bg-dark-700 hover:text-dark-100 transition-all border border-dark-700"
                >
                  <q.icon className="w-3 h-3" />
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-dark-700 bg-dark-900">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about fantasy strategies..."
                className="flex-1 bg-dark-850 border border-dark-700 rounded-lg px-4 py-2.5 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-all text-sm"
              />
              <button
                type="submit"
                disabled={chatMutation.isPending || !input.trim()}
                className="w-10 h-10 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

// Generate intelligent response for cricket queries
function generateIntelligentResponse(question: string): string {
  const lowerQuestion = question.toLowerCase();

  // Captain selection queries
  if (lowerQuestion.includes('captain') || lowerQuestion.includes('vc') || lowerQuestion.includes('vice captain')) {
    return `Captain Selection Strategy:

1. **All-rounders make great captains** - They can score through both batting and bowling
2. **Consider pitch conditions** - Batting-friendly? Pick a top-order batsman
3. **Recent form matters** - Check last 5 matches, not just reputation
4. **Matchup analysis** - How has the player performed against this opponent?

**Pro Tip:** For T20s, death-over specialists and finishers often deliver big points due to bonus scoring.

Should I help analyze a specific player for captaincy?`;
  }

  // Differential pick queries
  if (lowerQuestion.includes('differential') || lowerQuestion.includes('differential') || lowerQuestion.includes('low selection')) {
    return `Finding Differential Picks:

1. **Look for venue specialists** - Players who perform well at specific grounds but aren't popular choices
2. **Check opposition weakness** - A batsman might have a great record against today's bowling attack
3. **Form over fame** - Players in good recent form but overlooked by others
4. **Weather impact** - Dew favors pacers in second innings; this knowledge is your edge

**Key Insight:** Differential picks win grand leagues. Your 8% selected player scoring big while everyone's 70% pick fails = massive rank jump!

Need specific player recommendations?`;
  }

  // Risk assessment queries
  if (lowerQuestion.includes('risk') || lowerQuestion.includes('safe')) {
    return `Risk Management in Fantasy:

**Safe Picks (Low Risk):**
- Consistent performers (>70% consistency score)
- Players with good record at this venue
- Top-order batsmen in batting-friendly conditions

**Risky Picks (High Reward):**
- Coming back from injury
- Poor recent form but historically strong at venue
- Unpredictable performers

**Balance Strategy:**
Safe Team: 3-4 risky max
Grand League: 5-6 risky picks with potential

Want me to assess a specific player's risk level?`;
  }

  // Pitch analysis queries
  if (lowerQuestion.includes('pitch') || lowerQuestion.includes('wicket') || lowerQuestion.includes('surface')) {
    return `Pitch Analysis Guide:

**Spin-Friendly Pitches:**
- Load up on spinners
- Pick subcontinent players
- Avoid pace-heavy bowling teams
- Batsmen who play spin well are gold

**Pace-Friendly Pitches:**
- Fast bowlers get more wickets
- Swing and seam movement helpful
- Check if team has quality pace attack
- Top-order batsmen face difficult new ball

**Batting Paradises:**
- Stack your team with batsmen
- Death-over specialists valuable
- Bowl-first team has advantage

**Pro Tip:** Check venue average first innings score. Low score = bowler-friendly, high score = batsman-friendly.

Need specific pitch analysis for today's match?`;
  }

  // Toss impact queries
  if (lowerQuestion.includes('toss') || lowerQuestion.includes('batting first') || lowerQuestion.includes('chasing')) {
    return `Toss Impact Analysis:

**When Team Bats First:**
- Pacers get movement with new ball
- Openers face toughest conditions
- Consider bowling attack strength

**When Team Chases:**
- Dew helps batsmen later
- Spinners struggle with wet ball
- Finishers and death-over specialists key

**Toss-Update Strategy:**
Wait for toss before finalizing team!
- If chasing: Add death-over bowlers
- If defending: Add top-order batsmen

**Quick Rule:** In T20s with dew, chasing team has 55-60% win probability.

Should I help adjust your team based on toss?`;
  }

  // Grand league queries
  if (lowerQuestion.includes('grand league') || lowerQuestion.includes('gl') || lowerQuestion.includes('big prize')) {
    return `Grand League Winning Strategy:

**1. Differential Picks (Low Selection %)**
Take 2-3 players with <10% selection but high potential
- Key: If they fail, you don't lose much rank
- If they succeed, you jump thousands of ranks

**2. Unpopular Captain**
Most pick the obvious captain. If a different player scores big, you soar.

**3. Risk Distribution**
- 5-6 calculated risks
- Balance with safe performers

**4. Research Edge**
- Venue records
- Head-to-head stats
- Weather impact
- Recent form trends

Want specific differential recommendations for today?`;
  }

  // Wicketkeeper queries
  if (lowerQuestion.includes('wicketkeeper') || lowerQuestion.includes('wk') || lowerQuestion.includes('wicket-keeper')) {
    return `Wicketkeeper Selection Guide:

**Top WK Choice Factors:**
1. **Batting position** - Openers or #3 face most balls
2. **Recent batting form** - Check last 5 innings
3. **Boundary-hitting ability** - Catch bonuses add up
4. **Team total** - Higher team score = more catches

**Safe WK:** Proven performer, good recent form
**Risky WK:** Inconsistent but high ceiling

**Pro Insight:** WK captains can be gold in T20s due to batting + keeping points!

Need help choosing between two wicketkeepers?`;
  }

  // Default comprehensive response
  return `I'm your AI Fantasy Cricket Expert! I can help you with:

🎯 Player Selection - Who's the best captain?
📊 Pitch Analysis - Spin or pace friendly?
⚡ Risk Assessment - Safe vs differential picks
🏏 Match Predictions - Win probability & key factors
💡 Strategy Tips - Grand league vs small league approach

**Quick Tips:**
- Always check pitch conditions before team creation
- Wait for toss for final adjustments
- Mix safe picks with differential players
- Form > Reputation (always!)

What would you like to know about fantasy cricket today?`;
}
