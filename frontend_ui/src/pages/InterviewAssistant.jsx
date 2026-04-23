import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

const PM_QUESTIONS = [
  "How would you improve our product?",
  "Tell me about a time you had to prioritize features with limited resources.",
  "How do you handle conflicting feedback from different stakeholders?",
  "Design an elevator for a 100-story building.",
  "What is your favorite product and why?",
  "How would you measure the success of a new feature launch?",
  "Estimate the number of bicycles sold in India last year."
];

export default function InterviewAssistant() {
  const location = useLocation();
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm your AI Interview Prep Assistant. I specialize in Product Management. We can do a mock interview. Are you ready for your first question?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    // Simulate AI delay and response (Jugad for AI Interview Assistant)
    setTimeout(() => {
      let aiResponse = "";
      const lowerInput = userMessage.toLowerCase();
      
      if (lowerInput.includes('yes') || lowerInput.includes('ready') || messages.length === 1) {
        // Give a random PM question
        const q = PM_QUESTIONS[Math.floor(Math.random() * PM_QUESTIONS.length)];
        aiResponse = `Great! Here is your question:\n\n**${q}**\n\nTake your time and type out your response. Think out loud!`;
      } else if (lowerInput.length < 20) {
        aiResponse = "Could you elaborate a bit more on that? In PM interviews, it's great to structure your answers using frameworks like STAR (Situation, Task, Action, Result) or CIRCLES.";
      } else {
        // Generic feedback
        const followUp = PM_QUESTIONS[Math.floor(Math.random() * PM_QUESTIONS.length)];
        aiResponse = `That's a solid approach. I like how you structured your thought process. One area to improve is mentioning metrics or KPIs you would track.\n\nReady for the next one? Here it is:\n\n**${followUp}**`;
      }

      setMessages(prev => [...prev, { role: 'assistant', text: aiResponse }]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-64px)] flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <Bot className="w-8 h-8 text-[#00A5EC]" />
            AI Interview Prep
          </h1>
          <p className="text-gray-500 font-medium text-sm mt-1">
            Simulate PM interviews with real-time feedback (Beta)
          </p>
        </div>
        <Link to="/results" className="text-sm font-semibold text-[#00A5EC] hover:underline">
          Back to Matches
        </Link>
      </div>

      <div className="flex-grow glass-panel overflow-hidden flex flex-col bg-white border border-gray-200 shadow-sm rounded-2xl relative">
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-3 border-b border-gray-100 flex items-center gap-3 text-sm font-medium text-indigo-800">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          <span>Practice mode activated. Your session is not recorded.</span>
        </div>

        {/* Chat Area */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-gray-50/50">
          {messages.map((msg, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-gray-800 text-white' : 'bg-[#00A5EC] text-white shadow-md'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={`p-4 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-gray-900 text-white rounded-tr-none' 
                    : 'bg-white border border-gray-100 shadow-sm text-gray-800 rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center bg-[#00A5EC] text-white shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm rounded-tl-none flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your answer here..." 
              className="w-full bg-gray-50 border border-gray-200 rounded-full py-3.5 pl-6 pr-14 text-sm focus:outline-none focus:border-[#00A5EC] focus:ring-1 focus:ring-[#00A5EC] transition-all"
              disabled={isTyping}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isTyping}
              className="absolute right-2 w-10 h-10 bg-[#00A5EC] hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
          <p className="text-[10px] text-center text-gray-400 mt-3 flex items-center justify-center gap-1">
            <AlertCircle className="w-3 h-3" />
            AI Assistant may produce inaccurate information. Please practice critically.
          </p>
        </div>
      </div>
    </div>
  );
}
