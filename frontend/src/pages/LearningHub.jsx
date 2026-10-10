import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Search, Clock, ChevronRight, Award, Trophy, Brain,
  CheckCircle2, Bookmark, Volume2, VolumeX, X, Check,
  Compass, Car, CloudRain, HeartPulse, Wrench, Layers,
  RotateCw, ArrowRight, Lightbulb, UserCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { learning } from '@/services/api';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CardSkeleton } from '@/components/ui/skeleton';

// Visual Road Sign SVG Renderer Component
function RoadSignVisual({ sign, size = 140 }) {
  const name = sign?.name?.toLowerCase() || '';
  const id = sign?.id;

  // 1. Stop Sign (Octagon)
  if (id === 1 || name.includes('stop')) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md mx-auto select-none">
        <polygon points="30,4 70,4 96,30 96,70 70,96 30,96 4,70 4,30" fill="#DC2626" stroke="#FFFFFF" strokeWidth="3.5" />
        <polygon points="31,7 69,7 93,31 93,69 69,93 31,93 7,69 7,31" fill="#DC2626" stroke="#FFFFFF" strokeWidth="1.5" />
        <text x="50" y="58" fill="#FFFFFF" fontSize="21" fontWeight="900" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" letterSpacing="1">
          STOP
        </text>
      </svg>
    );
  }

  // 2. Give Way / Yield (Inverted Triangle)
  if (id === 2 || name.includes('give way') || name.includes('yield')) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md mx-auto select-none">
        <polygon points="10,14 90,14 50,86" fill="#FFFFFF" stroke="#DC2626" strokeWidth="12" strokeLinejoin="round" />
        <text x="50" y="38" fill="#DC2626" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="Arial, sans-serif">
          GIVE
        </text>
        <text x="50" y="52" fill="#DC2626" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="Arial, sans-serif">
          WAY
        </text>
      </svg>
    );
  }

  // 3. Speed Limit 50 (Circle)
  if (id === 3 || name.includes('speed limit') || name.includes('50')) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md mx-auto select-none">
        <circle cx="50" cy="50" r="44" fill="#FFFFFF" stroke="#DC2626" strokeWidth="11" />
        <text x="50" y="62" fill="#0F172A" fontSize="35" fontWeight="900" textAnchor="middle" fontFamily="Arial, sans-serif">
          50
        </text>
      </svg>
    );
  }

  // 4. No Overtaking
  if (id === 4 || name.includes('no overtaking')) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md mx-auto select-none">
        <circle cx="50" cy="50" r="44" fill="#FFFFFF" stroke="#DC2626" strokeWidth="10" />
        {/* Left Car (Red) */}
        <g transform="translate(24, 30) scale(0.65)">
          <rect x="5" y="10" width="22" height="36" rx="6" fill="#DC2626" />
          <rect x="7" y="15" width="18" height="8" rx="2" fill="#FFFFFF" opacity="0.8" />
          <rect x="7" y="32" width="18" height="6" rx="2" fill="#FFFFFF" opacity="0.6" />
          <circle cx="3" cy="16" r="3" fill="#1E293B" />
          <circle cx="3" cy="40" r="3" fill="#1E293B" />
          <circle cx="29" cy="16" r="3" fill="#1E293B" />
          <circle cx="29" cy="40" r="3" fill="#1E293B" />
        </g>
        {/* Right Car (Black) */}
        <g transform="translate(48, 30) scale(0.65)">
          <rect x="5" y="10" width="22" height="36" rx="6" fill="#1E293B" />
          <rect x="7" y="15" width="18" height="8" rx="2" fill="#FFFFFF" opacity="0.8" />
          <rect x="7" y="32" width="18" height="6" rx="2" fill="#FFFFFF" opacity="0.6" />
          <circle cx="3" cy="16" r="3" fill="#1E293B" />
          <circle cx="3" cy="40" r="3" fill="#1E293B" />
          <circle cx="29" cy="16" r="3" fill="#1E293B" />
          <circle cx="29" cy="40" r="3" fill="#1E293B" />
        </g>
      </svg>
    );
  }

  // 5. Pedestrian Crossing Ahead
  if (id === 5 || name.includes('pedestrian')) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md mx-auto select-none">
        <polygon points="50,10 92,85 8,85" fill="#FEF08A" stroke="#DC2626" strokeWidth="10" strokeLinejoin="round" />
        <circle cx="48" cy="38" r="4.5" fill="#1E293B" />
        <path d="M48,44 L45,58 L40,73 M45,58 L54,73 M44,46 L55,52 M44,46 L38,52" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
        <line x1="30" y1="76" x2="70" y2="76" stroke="#1E293B" strokeWidth="2.5" />
      </svg>
    );
  }

  // 6. Slippery Road Ahead
  if (id === 6 || name.includes('slippery')) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md mx-auto select-none">
        <polygon points="50,10 92,85 8,85" fill="#FEF08A" stroke="#DC2626" strokeWidth="10" strokeLinejoin="round" />
        <g transform="translate(34, 38) scale(0.65)">
          <path d="M5,18 L12,8 L32,8 L40,18 L46,20 C48,21 48,25 46,26 L3,26 C1,25 1,21 3,20 Z" fill="#1E293B" />
          <circle cx="12" cy="26" r="4" fill="#0F172A" />
          <circle cx="37" cy="26" r="4" fill="#0F172A" />
        </g>
        <path d="M38,60 Q45,64 38,69 Q31,74 40,78" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M54,60 Q61,64 54,69 Q47,74 56,78" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 7. Roundabout Ahead (Blue Disc)
  if (id === 7 || name.includes('roundabout')) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md mx-auto select-none">
        <circle cx="50" cy="50" r="44" fill="#2563EB" stroke="#FFFFFF" strokeWidth="3" />
        <path d="M50,22 A24,24 0 0,1 74,50" fill="none" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
        <polygon points="78,44 74,53 66,47" fill="#FFFFFF" />
        <path d="M74,50 A24,24 0 0,1 36,68" fill="none" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
        <polygon points="34,74 31,65 41,66" fill="#FFFFFF" />
        <path d="M36,68 A24,24 0 0,1 50,22" fill="none" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
        <polygon points="46,16 53,21 46,27" fill="#FFFFFF" />
      </svg>
    );
  }

  // 8. Hospital / First Aid Post (Blue Rectangle)
  if (id === 8 || name.includes('hospital') || name.includes('first aid')) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md mx-auto select-none">
        <rect x="8" y="8" width="84" height="84" rx="8" fill="#2563EB" stroke="#FFFFFF" strokeWidth="3" />
        <rect x="20" y="20" width="60" height="60" rx="4" fill="#FFFFFF" />
        <rect x="44" y="28" width="12" height="44" fill="#DC2626" />
        <rect x="28" y="44" width="44" height="12" fill="#DC2626" />
      </svg>
    );
  }

  // 9. No Entry (Red Circle with white bar)
  if (id === 9 || name.includes('no entry')) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md mx-auto select-none">
        <circle cx="50" cy="50" r="44" fill="#DC2626" stroke="#FFFFFF" strokeWidth="3" />
        <rect x="18" y="42" width="64" height="16" rx="2" fill="#FFFFFF" />
      </svg>
    );
  }

  // 10. School Zone Ahead
  if (id === 10 || name.includes('school')) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md mx-auto select-none">
        <polygon points="50,10 92,85 8,85" fill="#FEF08A" stroke="#DC2626" strokeWidth="10" strokeLinejoin="round" />
        <circle cx="43" cy="38" r="4" fill="#1E293B" />
        <path d="M43,44 L40,58 L36,73 M40,58 L46,73 M39,46 L48,52" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="56" cy="46" r="3.5" fill="#1E293B" />
        <path d="M56,51 L54,62 L50,73 M54,62 L60,73" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // 11. Compulsory Turn Left
  if (id === 11 || name.includes('turn left')) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md mx-auto select-none">
        <circle cx="50" cy="50" r="44" fill="#2563EB" stroke="#FFFFFF" strokeWidth="3" />
        <path d="M60,68 L60,46 Q60,34 46,34 L32,34" fill="none" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" />
        <polygon points="35,24 20,34 35,44" fill="#FFFFFF" />
      </svg>
    );
  }

  // 12. U-Turn Prohibited
  if (id === 12 || name.includes('u-turn')) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md mx-auto select-none">
        <circle cx="50" cy="50" r="44" fill="#FFFFFF" stroke="#DC2626" strokeWidth="10" />
        <path d="M42,65 L42,42 Q42,28 54,28 Q66,28 66,42 L66,65" fill="none" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" />
        <polygon points="34,60 42,72 50,60" fill="#1E293B" />
        <line x1="20" y1="20" x2="80" y2="80" stroke="#DC2626" strokeWidth="8" strokeLinecap="round" />
      </svg>
    );
  }

  // Fallback Traffic Sign
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md mx-auto select-none">
      <circle cx="50" cy="50" r="44" fill="#2563EB" stroke="#FFFFFF" strokeWidth="3" />
      <text x="50" y="58" fill="#FFFFFF" fontSize="24" fontWeight="bold" textAnchor="middle">
        🚦
      </text>
    </svg>
  );
}

const categoryTabs = [
  { id: 'all', label: 'All Topics', icon: BookOpen },
  { id: 'signs', label: 'Road Signs', icon: Compass },
  { id: 'driving', label: 'Defensive Driving', icon: Car },
  { id: 'weather', label: 'Weather & Monsoon', icon: CloudRain },
  { id: 'emergency', label: 'Emergency & First Aid', icon: HeartPulse },
  { id: 'maintenance', label: 'Vehicle Safety Check', icon: Wrench },
  { id: 'pedestrian', label: 'Pedestrians & Cyclists', icon: UserCheck },
];

const mainTabs = [
  { id: 'library', label: 'Knowledge Library', icon: BookOpen },
  { id: 'flashcards', label: 'Road Sign Flashcards', icon: Layers },
  { id: 'badges', label: 'Driver Badges', icon: Award },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
];

export default function LearningHub() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('library');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Data
  const [articles, setArticles] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [badges, setBadges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  // Bookmarks & Completed
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('safeguard_learning_bookmarks') || '[]');
    } catch {
      return [];
    }
  });

  const [completedArticles, setCompletedArticles] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('safeguard_completed_articles') || '[1, 2]');
    } catch {
      return [1, 2];
    }
  });

  // Modal
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Flashcards
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [artRes, cardRes, badgeRes, leadRes] = await Promise.allSettled([
        learning.getArticles(),
        learning.getFlashcards(),
        learning.getBadges(),
        learning.getLeaderboard(),
      ]);

      if (artRes.status === 'fulfilled' && artRes.value?.data?.articles) {
        setArticles(artRes.value.data.articles);
      }
      if (cardRes.status === 'fulfilled' && cardRes.value?.data?.flashcards) {
        setFlashcards(cardRes.value.data.flashcards);
      }
      if (badgeRes.status === 'fulfilled' && badgeRes.value?.data?.badges) {
        setBadges(badgeRes.value.data.badges);
      }
      if (leadRes.status === 'fulfilled' && leadRes.value?.data?.leaderboard) {
        setLeaderboard(leadRes.value.data.leaderboard);
      }
    } catch (err) {
      console.error('Failed to load learning data:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = (id, e) => {
    e?.stopPropagation();
    let updated;
    if (bookmarks.includes(id)) {
      updated = bookmarks.filter((b) => b !== id);
      toast.success('Removed from bookmarks');
    } else {
      updated = [...bookmarks, id];
      toast.success('Saved to bookmarks!');
    }
    setBookmarks(updated);
    localStorage.setItem('safeguard_learning_bookmarks', JSON.stringify(updated));
  };

  const toggleCompleted = (id) => {
    let updated;
    if (completedArticles.includes(id)) {
      updated = completedArticles.filter((c) => c !== id);
      toast('Marked as in progress', { icon: '🔄' });
    } else {
      updated = [...completedArticles, id];
      toast.success('Lesson marked as completed! (+10 XP)', { icon: '🎉' });
    }
    setCompletedArticles(updated);
    localStorage.setItem('safeguard_completed_articles', JSON.stringify(updated));
  };

  const toggleSpeech = (text) => {
    if (!('speechSynthesis' in window)) {
      toast.error('Voice narration is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[#*`_\[\]]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      toast.success('Reading guide aloud...');
    }
  };

  const filteredArticles = articles.filter((a) => {
    if (activeCategory !== 'all' && a.category !== activeCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = a.title?.toLowerCase().includes(q);
      const matchSummary = a.summary?.toLowerCase().includes(q);
      if (!matchTitle && !matchSummary) return false;
    }
    return true;
  });

  const progressPercent = articles.length > 0 ? Math.round((completedArticles.length / articles.length) * 100) : 0;
  const currentCard = flashcards[cardIndex] || flashcards[0];

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto py-4">
        <CardSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 text-slate-800 dark:text-slate-100">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-6 md:p-8 shadow-sm dark:shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-400 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              Learning Hub
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Road Safety & Driver Training Center
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base mt-2 leading-relaxed">
              Explore easy-to-read safety guides, test your sign memory with flashcards, and take quizzes to earn driver badges.
            </p>
          </div>

          {/* Action & Stats Widget */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 min-w-[140px]">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Your Progress</div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">{completedArticles.length} / {articles.length} Completed</div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-1.5">
                <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>

            <button
              onClick={() => navigate('/dashboard/quiz')}
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Brain className="w-4 h-4" />
              <span>Take Quiz</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap border',
                isActive
                  ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: KNOWLEDGE LIBRARY */}
      {activeTab === 'library' && (
        <div className="space-y-6">
          {/* Search & Topic Filters */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics or keywords..."
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Showing <strong className="text-slate-900 dark:text-white">{filteredArticles.length}</strong> safety guides
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categoryTabs.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all',
                    isActive
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Articles Grid */}
          {filteredArticles.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center text-slate-500 dark:text-slate-400 shadow-sm">
              <BookOpen className="w-12 h-12 mx-auto mb-3 text-slate-400" />
              <h4 className="text-lg font-bold text-slate-800 dark:text-white">No guides found</h4>
              <p className="text-sm mt-1">Try clearing your search query or choosing another category.</p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all shadow-sm"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredArticles.map((article) => {
                const isCompleted = completedArticles.includes(article.id);
                const isBookmarked = bookmarks.includes(article.id);

                return (
                  <div
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    className={cn(
                      'rounded-2xl border p-5 cursor-pointer flex flex-col justify-between transition-all duration-200 bg-white dark:bg-slate-900 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md dark:hover:shadow-blue-500/10 shadow-sm',
                      isCompleted ? 'border-emerald-300 dark:border-emerald-500/40 bg-emerald-50/20 dark:bg-slate-900/90' : 'border-slate-200 dark:border-slate-800'
                    )}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
                            {article.category}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium capitalize">
                            {article.difficulty}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {isCompleted && (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/40">
                              <Check className="w-3 h-3" /> Done
                            </span>
                          )}
                          <button
                            onClick={(e) => toggleBookmark(article.id, e)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 dark:hover:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Bookmark className={cn('w-4 h-4', isBookmarked && 'fill-amber-500 text-amber-500')} />
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h4 className="text-slate-900 dark:text-white font-bold text-base mb-2 hover:text-blue-600 dark:hover:text-blue-300 transition-colors line-clamp-2">
                        {article.title}
                      </h4>

                      {/* Excerpt */}
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 mb-4">
                        {article.summary || article.excerpt}
                      </p>
                    </div>

                    {/* Bottom Meta */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {article.read_time}
                      </span>
                      <span className="flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                        Read Lesson <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ROAD SIGN FLASHCARDS WITH REAL VISUAL ROAD SIGN GRAPHICS */}
      {activeTab === 'flashcards' && (
        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-center shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Road Sign Practice Flashcards</h3>
            <p className="text-slate-600 dark:text-slate-300 text-xs mt-1">
              Look at the official visual road sign, guess its meaning, and tap the card to verify the traffic rule.
            </p>
          </div>

          {flashcards.length > 0 && currentCard && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 px-2">
                <span>Sign {cardIndex + 1} of {flashcards.length}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  Mastered: {masteredCards.length} / {flashcards.length}
                </span>
              </div>

              {/* Main Interactive Flashcard */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="cursor-pointer min-h-[340px] rounded-2xl border-2 border-blue-200 dark:border-blue-500/40 bg-white dark:bg-slate-900 p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-lg dark:shadow-2xl relative hover:border-blue-500 dark:hover:border-blue-400 transition-all select-none group"
              >
                <div className="absolute top-4 right-4 text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                  <RotateCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500 text-blue-600 dark:text-blue-400" />
                  <span>Tap to Flip</span>
                </div>

                {!isFlipped ? (
                  /* FRONT OF FLASHCARD: ACTUAL ROAD SIGN GRAPHIC */
                  <div className="space-y-4 my-2">
                    {/* Visual Vector Road Sign */}
                    <div className="py-2">
                      <RoadSignVisual sign={currentCard} size={140} />
                    </div>

                    <div className="space-y-1.5">
                      <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-slate-700">
                        {currentCard.category} Sign
                      </div>
                      <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                        {currentCard.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Shape: <strong className="text-slate-800 dark:text-slate-200">{currentCard.shape}</strong> • Color: <strong className="text-slate-800 dark:text-slate-200">{currentCard.color}</strong>
                      </p>
                    </div>

                    <div className="text-[11px] text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center gap-1 pt-1">
                      <span>Click card to reveal legal meaning & penalty</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ) : (
                  /* BACK OF FLASHCARD: RULE & MEANING WITH MINI SIGN */
                  <div className="space-y-4 max-w-lg my-1">
                    <div className="flex items-center justify-center gap-3">
                      <div className="shrink-0">
                        <RoadSignVisual sign={currentCard} size={54} />
                      </div>
                      <div className="text-left">
                        <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40">
                          {currentCard.category} Rule
                        </div>
                        <h4 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
                          {currentCard.name}
                        </h4>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left space-y-2">
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Official Meaning:
                      </div>
                      <p className="text-sm text-slate-800 dark:text-slate-100 leading-relaxed font-medium">
                        {currentCard.meaning}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-xs text-amber-900 dark:text-amber-300 font-bold text-left shadow-sm">
                      ⚖️ Traffic Mandate: {currentCard.rule}
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between gap-4 pt-1">
                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setCardIndex((prev) => (prev > 0 ? prev - 1 : flashcards.length - 1));
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-white text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm"
                >
                  ← Previous
                </button>

                <button
                  onClick={() => {
                    const id = currentCard.id;
                    if (!masteredCards.includes(id)) {
                      setMasteredCards((prev) => [...prev, id]);
                      toast.success('Sign marked as mastered!');
                    } else {
                      setMasteredCards((prev) => prev.filter((c) => c !== id));
                    }
                  }}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all shadow-sm',
                    masteredCards.includes(currentCard.id)
                      ? 'border-emerald-500 bg-emerald-600 text-white'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  )}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {masteredCards.includes(currentCard.id) ? 'Mastered ✓' : 'Mark as Mastered'}
                </button>

                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setCardIndex((prev) => (prev + 1) % flashcards.length);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all"
                >
                  Next Sign →
                </button>
              </div>

              {/* Quick Sign Picker Grid */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
                <div className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                  All Practice Signs ({flashcards.length}):
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {flashcards.map((s, idx) => {
                    const isSelected = idx === cardIndex;
                    const isMastered = masteredCards.includes(s.id);
                    return (
                      <button
                        key={s.id || idx}
                        onClick={() => {
                          setCardIndex(idx);
                          setIsFlipped(false);
                        }}
                        className={cn(
                          'p-2 rounded-xl border flex flex-col items-center gap-1 transition-all text-center',
                          isSelected
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-500/20 ring-1 ring-blue-500'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                        )}
                      >
                        <RoadSignVisual sign={s} size={36} />
                        <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate w-full">
                          {s.name}
                        </span>
                        {isMastered && (
                          <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">✓ Mastered</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DRIVER BADGES */}
      {activeTab === 'badges' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Driver Mastery Badges</h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs mt-1">
                Complete modules and score high on safety quizzes to unlock badges.
              </p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-400 text-blue-700 dark:text-blue-300 text-sm font-bold">
              {badges.filter((b) => b.earned).length} / {badges.length} Badges Earned
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge, idx) => {
              const isEarned = badge.earned;
              return (
                <div
                  key={idx}
                  className={cn(
                    'p-6 rounded-2xl border transition-all duration-200 bg-white dark:bg-slate-900 shadow-sm',
                    isEarned
                      ? 'border-amber-300 dark:border-amber-400/50 bg-amber-50/20 dark:bg-slate-900 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 opacity-60'
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border',
                        isEarned
                          ? 'bg-amber-100 dark:bg-amber-500/20 border-amber-300 dark:border-amber-400 text-amber-700 dark:text-amber-300'
                          : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                      )}
                    >
                      <Award className="w-6 h-6" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className={cn('font-bold text-base', isEarned ? 'text-amber-800 dark:text-amber-300' : 'text-slate-700 dark:text-slate-300')}>
                          {badge.name}
                        </h4>
                        {isEarned ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-500/40">
                            Unlocked
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold border border-slate-200 dark:border-slate-700">
                            Locked
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{badge.description}</p>
                      {badge.earned_at && (
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 pt-1 font-medium">
                          Unlocked: {new Date(badge.earned_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex items-center justify-between shadow-sm">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Community Safety Leaderboard</h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs mt-1">Drivers ranked by assessment accuracy and safety knowledge.</p>
            </div>
            <button
              onClick={() => navigate('/dashboard/quiz')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all"
            >
              Compete Now
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {leaderboard.map((entry) => (
                <div
                  key={entry.user_id || entry.rank}
                  className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 border',
                        entry.rank === 1 && 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-400',
                        entry.rank === 2 && 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-500',
                        entry.rank === 3 && 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-400',
                        entry.rank > 3 && 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                      )}
                    >
                      {entry.rank}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{entry.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {entry.quizzes_taken} quizzes • {entry.badges} badges
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{entry.accuracy}%</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{entry.total_correct} correct</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ARTICLE READER MODAL */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-900/60 dark:bg-black/85 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xl overflow-hidden"
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-400">
                    {selectedArticle.category}
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {selectedArticle.read_time}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* TTS Voice Read */}
                  <button
                    onClick={() => toggleSpeech(selectedArticle.content || selectedArticle.summary)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-sm',
                      isSpeaking
                        ? 'border-red-500 bg-red-600 text-white'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                    )}
                  >
                    {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{isSpeaking ? 'Stop Audio' : 'Listen'}</span>
                  </button>

                  <button
                    onClick={(e) => toggleBookmark(selectedArticle.id, e)}
                    className="p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-amber-500 dark:hover:text-amber-300 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
                  >
                    <Bookmark className={cn('w-4 h-4', bookmarks.includes(selectedArticle.id) && 'fill-amber-500 text-amber-500')} />
                  </button>

                  <button
                    onClick={() => {
                      if (isSpeaking) {
                        window.speechSynthesis?.cancel();
                        setIsSpeaking(false);
                      }
                      setSelectedArticle(null);
                    }}
                    className="p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Modal Content Body */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-6">
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  {selectedArticle.title}
                </h2>

                {/* Key Takeaways Box */}
                {selectedArticle.key_takeaways && selectedArticle.key_takeaways.length > 0 && (
                  <div className="p-5 rounded-2xl bg-blue-50/80 dark:bg-slate-800/90 border border-blue-200 dark:border-blue-400/50 space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-500" /> Key Safety Rules
                    </h4>
                    <ul className="space-y-1.5 text-xs md:text-sm text-slate-800 dark:text-slate-100">
                      {selectedArticle.key_takeaways.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Markdown Content Container */}
                <div className="text-sm leading-relaxed text-slate-800 dark:text-slate-200 space-y-4">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {selectedArticle.content || selectedArticle.summary}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-wrap items-center justify-between gap-3 shrink-0">
                <button
                  onClick={() => toggleCompleted(selectedArticle.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all shadow-sm',
                    completedArticles.includes(selectedArticle.id)
                      ? 'border-emerald-500 bg-emerald-600 text-white'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                  )}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{completedArticles.includes(selectedArticle.id) ? 'Completed ✓' : 'Mark as Completed'}</span>
                </button>

                <button
                  onClick={() => {
                    if (isSpeaking) {
                      window.speechSynthesis?.cancel();
                      setIsSpeaking(false);
                    }
                    setSelectedArticle(null);
                    navigate('/dashboard/quiz');
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all"
                >
                  <Brain className="w-4 h-4" />
                  <span>Take Practice Quiz</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
