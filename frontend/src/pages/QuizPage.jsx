import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Brain, CheckCircle, XCircle, RefreshCw, Trophy,
  BarChart3, Clock, ArrowLeft, Award,
  Check, BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { learning } from '@/services/api';
import toast from 'react-hot-toast';

const quizCategories = [
  { id: 'all', label: 'All Topics', desc: 'Mix of all road safety and driving questions' },
  { id: 'signs', label: 'Road Signs & Markings', desc: 'Mandatory, cautionary, and informatory road signs' },
  { id: 'driving', label: 'Defensive Driving', desc: 'Space cushions, overtaking, and hazard prevention' },
  { id: 'weather', label: 'Weather & Monsoon', desc: 'Hydroplaning, fog, and night driving safety' },
  { id: 'emergency', label: 'Emergency & First Aid', desc: 'Crash response, Golden Hour, and emergency 112' },
  { id: 'maintenance', label: 'Vehicle Safety Check', desc: 'Tire health, brakes, and pre-drive inspection' },
];

export default function QuizPage() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState('start'); // 'start' | 'quiz' | 'result'
  const [category, setCategory] = useState('all');
  const [questionLimit, setQuestionLimit] = useState(10);
  const [enableTimer, setEnableTimer] = useState(true);

  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 30 seconds timer
  const [timeLeft, setTimeLeft] = useState(30);

  // Result
  const [quizResult, setQuizResult] = useState(null);
  const [showReview, setShowReview] = useState(false);

  const startQuiz = async () => {
    setLoading(true);
    try {
      const res = await learning.getQuizQuestions({
        category: category === 'all' ? undefined : category,
        limit: questionLimit,
      });

      const fetched = res.data?.questions || [];
      if (fetched.length === 0) {
        toast.error('No questions found for this category. Loading all questions.');
        const allRes = await learning.getQuizQuestions({ limit: questionLimit });
        setQuestions(allRes.data?.questions || []);
      } else {
        setQuestions(fetched);
      }

      setCurrentQ(0);
      setUserAnswers([]);
      setSelectedAnswer(null);
      setQuizResult(null);
      setShowReview(false);
      setTimeLeft(30);
      setScreen('quiz');
    } catch (err) {
      toast.error('Failed to load quiz questions. Please check connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (screen !== 'quiz' || !enableTimer || selectedAnswer !== null) return;

    if (timeLeft <= 0) {
      handleSelectOption(-1);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [screen, enableTimer, timeLeft, selectedAnswer]);

  const handleSelectOption = (optionIndex) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(optionIndex);

    const currentQuestion = questions[currentQ];
    const newAnswers = [
      ...userAnswers,
      { question_id: currentQuestion.id, selected: optionIndex },
    ];
    setUserAnswers(newAnswers);

    setTimeout(() => {
      if (currentQ + 1 < questions.length) {
        setCurrentQ((prev) => prev + 1);
        setSelectedAnswer(null);
        setTimeLeft(30);
      } else {
        finishAndSubmitQuiz(newAnswers);
      }
    }, 500);
  };

  const finishAndSubmitQuiz = async (finalAnswers) => {
    setSubmitting(true);
    try {
      const payload = {
        category,
        answers: finalAnswers,
      };

      const res = await learning.submitQuiz(payload);
      setQuizResult(res.data);
      setScreen('result');

      if (res.data?.new_badges && res.data.new_badges.length > 0) {
        toast.success(`🎉 You unlocked ${res.data.new_badges.length} new badge(s)!`, {
          duration: 5000,
        });
      } else if (res.data?.passed) {
        toast.success(`Great job! You passed with ${res.data.percentage}%`);
      } else {
        toast('Quiz completed! Review your answers below.', { icon: '📝' });
      }
    } catch (err) {
      toast.error('Error submitting quiz score.');
      console.error(err);
      setScreen('result');
    } finally {
      setSubmitting(false);
    }
  };

  const getGradeInfo = (pct) => {
    if (pct >= 90) return { grade: 'A+', label: 'Master Driver', color: 'text-emerald-600 dark:text-emerald-400' };
    if (pct >= 75) return { grade: 'A', label: 'Safety Guardian', color: 'text-blue-600 dark:text-blue-400' };
    if (pct >= 60) return { grade: 'B', label: 'Competent Driver', color: 'text-yellow-600 dark:text-yellow-400' };
    return { grade: 'C', label: 'Needs Practice', color: 'text-red-600 dark:text-red-400' };
  };

  if (loading || submitting) {
    return (
      <div className="space-y-6 max-w-xl mx-auto py-16 text-center text-slate-800 dark:text-white">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 space-y-4 shadow-sm">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <h3 className="text-xl font-bold">
            {submitting ? 'Analyzing & Submitting Score...' : 'Loading Safety Questions...'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-300">Syncing with SafeGuard AI</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 text-slate-800 dark:text-slate-100">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard/learning')}
          className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Learning Hub
        </button>

        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Road Safety Assessment
        </span>
      </div>

      {/* SCREEN 1: START */}
      {screen === 'start' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 md:p-8 text-center max-w-2xl mx-auto space-y-3 shadow-sm dark:shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white mx-auto shadow-md shadow-blue-500/25">
              <Brain className="w-7 h-7" />
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
              Driver Safety Knowledge Assessment
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
              Test your knowledge on road signs, defensive driving techniques, and emergency response.
            </p>
          </div>

          {/* Domain Selection */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 space-y-3 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              1. Choose Category
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {quizCategories.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={cn(
                      'text-left p-4 rounded-xl border transition-all shadow-sm',
                      isSelected
                        ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-500'
                    )}
                  >
                    <div className="text-sm font-bold">{cat.label}</div>
                    <div className={cn('text-xs mt-1', isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400')}>
                      {cat.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Settings & Launch */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Number of Questions</h4>
              <div className="flex gap-2">
                {[5, 10, 15].map((count) => (
                  <button
                    key={count}
                    onClick={() => setQuestionLimit(count)}
                    className={cn(
                      'px-4 py-2 rounded-xl text-xs font-bold border transition-all shadow-sm',
                      questionLimit === count
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                    )}
                  >
                    {count} Questions
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Timer Mode</h4>
              <button
                onClick={() => setEnableTimer(!enableTimer)}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all shadow-sm',
                  enableTimer
                    ? 'border-emerald-500 bg-emerald-600 text-white'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                )}
              >
                <Clock className="w-3.5 h-3.5" />
                {enableTimer ? '30s / Question (ON)' : 'Untimed (OFF)'}
              </button>
            </div>

            <button
              onClick={startQuiz}
              className="w-full md:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Start Assessment →
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 2: ACTIVE QUIZ */}
      {screen === 'quiz' && questions.length > 0 && (
        <div className="space-y-5 max-w-2xl mx-auto">
          {/* Progress Header */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-white bg-blue-600 px-3 py-1 rounded-full shadow-sm">
                Question {currentQ + 1} of {questions.length}
              </span>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 capitalize">
                {questions[currentQ]?.category}
              </span>
            </div>

            {enableTimer && (
              <div className={cn(
                'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors',
                timeLeft <= 5
                  ? 'border-red-500 bg-red-600 text-white animate-pulse'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
              )}>
                <Clock className="w-3.5 h-3.5" />
                <span>{timeLeft}s</span>
              </div>
            )}
          </div>

          {/* Progress Line */}
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Box */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 md:p-8 space-y-5 shadow-sm dark:shadow-xl">
            <h3 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white leading-relaxed">
              {questions[currentQ]?.question}
            </h3>

            {/* Options */}
            <div className="space-y-3">
              {questions[currentQ]?.options.map((opt, idx) => {
                const isSelected = selectedAnswer === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={selectedAnswer !== null}
                    className={cn(
                      'w-full text-left p-4 rounded-xl border text-sm font-semibold transition-all flex items-center justify-between shadow-sm',
                      isSelected
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500'
                    )}
                  >
                    <span>{opt}</span>
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 3: RESULTS */}
      {screen === 'result' && quizResult && (
        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 text-center space-y-6 shadow-sm dark:shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white mx-auto shadow-md shadow-blue-500/25">
              <Trophy className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
                Assessment Results
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">Your driver knowledge score has been recorded</p>
            </div>

            {/* Score Display */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-around shadow-sm">
              <div>
                <div className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
                  {quizResult.score} / {quizResult.total}
                </div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-300 mt-1">Correct Answers</div>
              </div>

              <div className="h-10 w-px bg-slate-200 dark:bg-slate-700" />

              <div>
                <div className={cn('text-3xl md:text-4xl font-black', getGradeInfo(quizResult.percentage).color)}>
                  {quizResult.percentage}%
                </div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-300 mt-1">
                  Grade {getGradeInfo(quizResult.percentage).grade} ({getGradeInfo(quizResult.percentage).label})
                </div>
              </div>
            </div>

            {/* Badges Alert */}
            {quizResult.new_badges && quizResult.new_badges.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/20 border border-amber-200 dark:border-amber-400 text-left space-y-2">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
                  <Award className="w-5 h-5" />
                  <span>New Badges Unlocked!</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {quizResult.new_badges.map((b, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-amber-200 dark:bg-amber-400/30 text-amber-900 dark:text-amber-200 text-xs font-bold">
                      🏆 {b.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={startQuiz}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retake Quiz</span>
              </button>

              <button
                onClick={() => setShowReview(!showReview)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs border border-slate-200 dark:border-slate-700 transition-all shadow-sm"
              >
                <BarChart3 className="w-4 h-4" />
                <span>{showReview ? 'Hide Review' : 'Review Answers'}</span>
              </button>

              <button
                onClick={() => navigate('/dashboard/learning')}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold text-xs border border-slate-200 dark:border-slate-700 transition-all shadow-sm"
              >
                <BookOpen className="w-4 h-4" />
                <span>Learning Hub</span>
              </button>
            </div>
          </div>

          {/* Detailed Question Review */}
          {showReview && quizResult.results && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                Detailed Answers & Explanations
              </h4>

              <div className="space-y-3">
                {quizResult.results.map((item, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      'p-4 rounded-xl border space-y-2',
                      item.is_correct
                        ? 'border-emerald-200 dark:border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20'
                        : 'border-red-200 dark:border-red-500/50 bg-red-50/50 dark:bg-red-950/20'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        Q{idx + 1}: {item.question}
                      </span>
                      {item.is_correct ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                      )}
                    </div>

                    <div className="text-xs space-y-1 pt-1 font-medium">
                      <div className={item.is_correct ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}>
                        Your answer: {item.selected >= 0 ? item.options?.[item.selected] : 'Timed Out'}
                      </div>
                      {!item.is_correct && (
                        <div className="text-emerald-700 dark:text-emerald-300 font-bold">
                          Correct answer: {item.options?.[item.correct]}
                        </div>
                      )}
                      {item.explanation && (
                        <div className="text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-200 dark:border-slate-700/60 text-xs">
                          💡 <em>{item.explanation}</em>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
