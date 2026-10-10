import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Plus, MessageSquare, Trash2, ChevronLeft, ChevronRight, Bot, User, Copy, Check, Clock, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { chat } from '@/services/api';
import { ListSkeleton } from '@/components/ui/skeleton';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format, isToday, isYesterday, parseISO } from 'date-fns';

const suggestions = [
  { category: 'Safety', items: ['How can I stay safe while driving at night?', 'What should I do in foggy weather?'] },
  { category: 'Rules', items: ['What do different road sign colors mean?', 'Explain right-of-way rules'] },
  { category: 'Emergency', items: ['How to handle a tire blowout?', 'What to do after a minor accident?'] },
  { category: 'Vehicle', items: ['How often should I check tire pressure?', 'What are essential car safety checks?'] },
];

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="glass-card px-4 py-3">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
              className="w-2 h-2 rounded-full bg-blue-400"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ msg, onCopy }) {
  const isUser = msg.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const timeStr = msg.created_at ? format(parseISO(msg.created_at), 'hh:mm a') : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex items-start gap-3 group', isUser ? 'flex-row-reverse' : '')}
    >
      <div className={cn(
        'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
        isUser ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gradient-to-br from-blue-500 to-cyan-500'
      )}>
        {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
      </div>
      <div className="max-w-[75%]">
        <div className={cn(
          'px-4 py-3 leading-relaxed text-sm',
          isUser
            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl rounded-tr-md'
            : 'glass-card rounded-2xl rounded-tl-md'
        )}>
          {isUser ? (
            msg.content
          ) : (
            <div className="prose prose-sm max-w-none prose-invert prose-headings:text-[var(--text-primary)] prose-p:text-[var(--text-secondary)] prose-li:text-[var(--text-secondary)] prose-strong:text-[var(--text-primary)] prose-code:text-blue-400 prose-pre:bg-[var(--input-bg)] prose-pre:border prose-pre:border-[var(--border-color)]">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
            </div>
          )}
        </div>
        <div className={cn('flex items-center gap-2 mt-1', isUser ? 'justify-end' : 'justify-start')}>
          {timeStr && (
            <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
              <Clock size={10} />
              {timeStr}
            </span>
          )}
          {!isUser && (
            <button
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all"
              title="Copy response"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function DateSeparator({ date }) {
  let label;
  const d = parseISO(date);
  if (isToday(d)) label = 'Today';
  else if (isYesterday(d)) label = 'Yesterday';
  else label = format(d, 'MMMM d, yyyy');

  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-[var(--border-color)]" />
      <span className="text-xs text-[var(--text-muted)] flex items-center gap-1.5 shrink-0">
        <CalendarDays size={12} />
        {label}
      </span>
      <div className="flex-1 h-px bg-[var(--border-color)]" />
    </div>
  );
}

export default function AIChat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m SafeGuard AI. Send me a message about road safety, hazard identification, or driving tips. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [currentChatId, setCurrentChatId] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    fetchHistory();
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      const res = await chat.getHistory();
      const items = res.data?.history || [];
      const grouped = {};
      items.forEach((item) => {
        const dateKey = item.created_at ? item.created_at.split('T')[0] : 'unknown';
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(item);
      });
      setHistory(grouped);
    } catch {
      // silently fail for history
    } finally {
      setHistoryLoading(false);
    }
  };

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isTyping) return;
    const userMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    try {
      const res = await chat.sendMessage(text);
      const aiResponse = { role: 'assistant', content: res.data?.response || 'I understand your concern. Stay safe on the road!', created_at: res.data?.created_at || new Date().toISOString() };
      setMessages((prev) => [...prev, aiResponse]);
      setCurrentChatId(res.data?.chat_id || null);
      fetchHistory();
    } catch (err) {
      const errorMsg = err?.response?.data?.error || err?.message || 'Something went wrong';
      toast.error(errorMsg);
      const fallback = err?.response?.data?.response || 'I understand your concern. Stay safe on the road!';
      setMessages((prev) => [...prev, { role: 'assistant', content: fallback }]);
    } finally {
      setIsTyping(false);
    }
  }, [isTyping]);

  const handleSuggestion = (text) => sendMessage(text);

  const newChat = () => {
    setMessages([{ role: 'assistant', content: 'Hello! I\'m SafeGuard AI. Send me a message about road safety, hazard identification, or driving tips. How can I help you today?' }]);
    setCurrentChatId(null);
    toast.success('New chat started');
  };

  const deleteChat = async (id, e) => {
    e.stopPropagation();
    try {
      await chat.deleteMessage(id);
      toast.success('Chat deleted');
      fetchHistory();
    } catch {
      toast.error('Failed to delete chat');
    }
  };

  const loadChat = (item) => {
    setMessages([
      { role: 'user', content: item.message },
      { role: 'assistant', content: item.response, created_at: item.created_at },
    ]);
    setCurrentChatId(item.id);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const autoResize = (e) => {
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  const groupedDates = Object.keys(history).sort().reverse();

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="glass-card p-4 flex items-center justify-between">
          <div className="h-6 w-32 bg-[var(--skeleton-bg)] animate-pulse rounded" />
          <div className="h-8 w-24 bg-[var(--skeleton-bg)] animate-pulse rounded" />
        </div>
        <ListSkeleton items={5} />
      </div>
    );
  }

  return (
    <div className="flex gap-4 h-[calc(100vh-8rem)]">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="glass-card rounded-2xl overflow-hidden shrink-0 hidden md:flex flex-col"
          >
            <div className="p-4 border-b border-[var(--border-color)]">
              <button onClick={newChat} className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl gradient-bg text-white text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all">
                <Plus className="w-4 h-4" />
                New Chat
              </button>
            </div>
            <div className="flex-1 p-3 space-y-1 overflow-y-auto">
              <p className="text-xs text-[var(--text-muted)] px-2 py-1 uppercase tracking-wider">Chat History</p>
              {historyLoading ? (
                <div className="space-y-2 px-2">
                  {[1,2,3].map((i) => (
                    <div key={i} className="h-14 bg-[var(--skeleton-bg)] animate-pulse rounded-xl" />
                  ))}
                </div>
              ) : groupedDates.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)] px-2 py-4 text-center">No chats yet. Start a conversation!</p>
              ) : (
                groupedDates.map((dateKey) => (
                  <div key={dateKey}>
                    <p className="text-[10px] text-[var(--text-muted)] px-2 py-1 mt-2 first:mt-0">
                      {isToday(parseISO(dateKey)) ? 'Today' : isYesterday(parseISO(dateKey)) ? 'Yesterday' : format(parseISO(dateKey), 'MMM d, yyyy')}
                    </p>
                    {history[dateKey].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => loadChat(item)}
                        className={cn(
                          'flex items-center justify-between w-full p-2.5 rounded-xl hover:bg-[var(--bg-card-hover)] text-left group transition-all',
                          currentChatId === item.id ? 'bg-[var(--bg-card-hover)]' : ''
                        )}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-[var(--text-primary)] truncate">{item.message}</p>
                          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                            {item.created_at ? format(parseISO(item.created_at), 'hh:mm a') : ''}
                          </p>
                        </div>
                        <Trash2
                          onClick={(e) => deleteChat(item.id, e)}
                          className="w-3.5 h-3.5 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all shrink-0"
                        />
                      </button>
                    ))}
                  </div>
                ))
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col glass-card rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] hidden md:block">
              {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">SafeGuard AI</h3>
                <p className="text-xs text-green-400">Online</p>
              </div>
            </div>
          </div>
          <button onClick={newChat} className="p-2 rounded-xl hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] md:hidden">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <React.Fragment key={i}>
              {i > 0 && msg.created_at && messages[i-1]?.created_at && (
                msg.created_at.split('T')[0] !== messages[i-1].created_at.split('T')[0] && (
                  <DateSeparator date={msg.created_at} />
                )
              )}
              <ChatMessage msg={msg} />
            </React.Fragment>
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-[var(--border-color)] space-y-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {suggestions.map((group) => (
              <div key={group.category} className="flex gap-2 shrink-0">
                {group.items.map((s, i) => (
                  <button
                    key={`${group.category}-${i}`}
                    onClick={() => handleSuggestion(s)}
                    className="shrink-0 px-3 py-1.5 text-xs text-[var(--text-secondary)] bg-[var(--input-bg)] rounded-full border border-[var(--border-color)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)] transition-all whitespace-nowrap"
                  >
                    {s}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => { setInput(e.target.value); autoResize(e); }}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={1}
              style={{ color: 'var(--text-primary)', backgroundColor: 'var(--input-bg)', borderColor: 'var(--border-color)' }}
              className="flex-1 px-4 py-3 rounded-xl text-sm placeholder-[var(--text-muted)] focus:outline-none transition-all resize-none"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              className="p-3 rounded-xl gradient-bg text-white disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/25 transition-all shrink-0"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </div>
          <p className="text-[10px] text-[var(--text-muted)] text-right">Enter to send · Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  );
}
