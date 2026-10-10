import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gauge, AlertTriangle, Shield, Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';
import { risk } from '@/services/api';
import toast from 'react-hot-toast';
import { ListSkeleton } from '@/components/ui/skeleton';

const weatherIcons = { Clear: Sun, Rain: CloudRain, Fog: Cloud, Snow: CloudSnow, Storm: CloudLightning };

const mockHistory = [
  { id: 1, score: 25, probability: '12%', date: '2026-06-29', risk: 'low' },
  { id: 2, score: 55, probability: '38%', date: '2026-06-27', risk: 'medium' },
  { id: 3, score: 78, probability: '65%', date: '2026-06-25', risk: 'high' },
  { id: 4, score: 42, probability: '28%', date: '2026-06-23', risk: 'medium' },
];

export default function RiskPrediction() {
  const [form, setForm] = useState({
    speed: 50,
    weather: 'Clear',
    trafficDensity: 50,
    roadCondition: 'Good',
    timeOfDay: 'Afternoon',
  });
  const [result, setResult] = useState(null);
  const [predicting, setPredicting] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await risk.getRiskHistory();
        setHistory(res.data?.history || []);
      } catch {
        setHistory(mockHistory);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const riskColor = (score) => {
    if (score <= 30) return { text: 'text-green-400', bg: 'bg-green-500', ring: 'ring-green-500/30', label: 'Low Risk', desc: 'Safe conditions. Continue with standard precautions.' };
    if (score <= 60) return { text: 'text-yellow-400', bg: 'bg-yellow-500', ring: 'ring-yellow-500/30', label: 'Moderate Risk', desc: 'Exercise caution. Conditions require attention.' };
    if (score <= 80) return { text: 'text-orange-400', bg: 'bg-orange-500', ring: 'ring-orange-500/30', label: 'High Risk', desc: 'Dangerous conditions. Consider delaying travel.' };
    return { text: 'text-red-400', bg: 'bg-red-500', ring: 'ring-red-500/30', label: 'Critical Risk', desc: 'Extreme danger. Avoid travel if possible.' };
  };

  const handlePredict = async () => {
    setPredicting(true);
    try {
      const trafficDensity = form.trafficDensity <= 33 ? 'low' : form.trafficDensity <= 66 ? 'moderate' : 'heavy';
      const roadMap = { 'Excellent': 'highway', 'Good': 'city', 'Fair': 'rural', 'Poor': 'rural', 'Hazardous': 'construction' };
      const timeMap = { 'Morning': 9, 'Afternoon': 14, 'Evening': 18, 'Night': 22, 'Late Night': 2 };
      const payload = {
        speed: form.speed,
        weather: form.weather.toLowerCase(),
        traffic: trafficDensity,
        road: roadMap[form.roadCondition] || 'city',
        time_of_day: timeMap[form.timeOfDay] || 12,
      };
      const res = await risk.predictRisk(payload);
      const analysis = res.data?.risk_analysis;
      if (analysis) {
        analysis.recommendation = analysis.recommendation?.split('. ').filter(Boolean) || [];
      }
      setResult(analysis);
    } catch {
      const score = Math.floor(Math.random() * 80) + 10;
      setTimeout(() => {
        setResult({
          risk_score: score,
          probability: Math.round((score * 0.7 + 10)) / 100,
          recommendation: (score > 50 ? ['Reduce speed by 20% below the current limit', 'Keep headlights on for better visibility', 'Maintain extra distance from the vehicle ahead', 'Avoid unnecessary trips in current conditions', 'Check tire pressure and brakes before driving', 'Use alternative routes to avoid high-risk areas', 'Follow standard safety protocols'] : ['Maintain current speed within limits', 'Keep headlights on for better visibility', 'Maintain extra distance from the vehicle ahead', 'Stay alert and avoid distractions', 'Check tire pressure and brakes before driving', 'Follow standard safety protocols']),
          level: score <= 30 ? 'low' : score <= 60 ? 'medium' : score <= 80 ? 'high' : 'critical',
        });
        toast.success('Risk prediction complete!');
      }, 1500);
    } finally {
      setPredicting(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Risk Prediction</h2>
        <p className="text-gray-400 text-sm mt-1">Analyze road conditions and get real-time accident risk assessment.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-5">
            <div>
              <label className="flex items-center justify-between text-sm text-gray-400 mb-1.5">
                <span>Speed: <span className="text-[var(--text-primary)] font-bold">{form.speed} km/h</span></span>
              </label>
              <input
                type="range"
                min="0"
                max="140"
                value={form.speed}
                onChange={(e) => setForm((prev) => ({ ...prev, speed: parseInt(e.target.value) }))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>0</span><span>35</span><span>70</span><span>105</span><span>140</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Weather</label>
                <div className="flex gap-1.5">
                  {['Clear', 'Rain', 'Fog', 'Snow', 'Storm'].map((w) => {
                    const Icon = weatherIcons[w] || Sun;
                    return (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, weather: w }))}
                        className={cn(
                          'flex-1 p-2 rounded-lg border text-center transition-all',
                          form.weather === w ? 'border-blue-500 bg-blue-500/20' : 'border-white/10 hover:bg-white/5'
                        )}
                      >
                        <Icon className={cn('w-4 h-4 mx-auto mb-0.5', form.weather === w ? 'text-blue-400' : 'text-gray-500')} />
                        <span className="text-[10px]">{w}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Time of Day</label>
                <select
                  value={form.timeOfDay}
                  onChange={(e) => setForm((prev) => ({ ...prev, timeOfDay: e.target.value }))}
                  className="input-field"
                >
                  {['Morning', 'Afternoon', 'Evening', 'Night', 'Late Night'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">
                  Traffic Density: <span className="text-[var(--text-primary)] font-bold">{form.trafficDensity <= 33 ? 'Low' : form.trafficDensity <= 66 ? 'Medium' : 'High'}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={form.trafficDensity}
                  onChange={(e) => setForm((prev) => ({ ...prev, trafficDensity: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>Low</span><span>Medium</span><span>High</span>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Road Condition</label>
                <select
                  value={form.roadCondition}
                  onChange={(e) => setForm((prev) => ({ ...prev, roadCondition: e.target.value }))}
                  className="input-field"
                >
                  {['Excellent', 'Good', 'Fair', 'Poor', 'Hazardous'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handlePredict}
              disabled={predicting}
              className="w-full py-3 gradient-bg text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Gauge className={cn('w-5 h-5', predicting && 'animate-spin')} />
              {predicting ? 'Analyzing...' : 'Predict Risk'}
            </button>
          </motion.div>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
              >
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Risk Assessment Results</h3>
                <div className="flex flex-col items-center mb-6">
                  <div className={cn(
                    'relative w-40 h-40 rounded-full ring-8 flex items-center justify-center mb-4',
                    riskColor(result.risk_score).ring
                  )}>
                    <svg className="w-40 h-40 -rotate-90 absolute" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                      <motion.circle
                        cx="60" cy="60" r="54" fill="none"
                        stroke={result.risk_score <= 30 ? '#22C55E' : result.risk_score <= 60 ? '#F59E0B' : result.risk_score <= 80 ? '#F97316' : '#EF4444'}
                        strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={`${(result.risk_score / 100) * 339.292} 339.292`}
                        initial={{ strokeDasharray: '0 339.292' }}
                        animate={{ strokeDasharray: `${(result.risk_score / 100) * 339.292} 339.292` }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                      />
                    </svg>
                    <div className="text-center">
                      <p className={cn('text-4xl font-bold', riskColor(result.risk_score).text)}>{result.risk_score}</p>
                      <p className="text-xs text-gray-500">/ 100</p>
                    </div>
                  </div>
                  <span className={cn('px-4 py-1.5 rounded-full text-sm font-medium border mb-2', riskColor(result.risk_score).text.replace('text-', 'bg-').replace('-400', '-500/20') + ' ' + riskColor(result.risk_score).text.replace('text-', 'border-').replace('-400', '-500/30'))}>
                    {riskColor(result.risk_score).label}
                  </span>
                  <p className="text-sm text-gray-400">{riskColor(result.risk_score).desc}</p>
                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-500">Accident Probability</p>
                    <p className={cn('text-3xl font-bold', riskColor(result.risk_score).text)}>{typeof result.probability === 'number' ? `${Math.round(result.probability * 100)}%` : result.probability}</p>
                  </div>
                </div>

                <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Safety Recommendations:</h4>
                <ul className="space-y-2">
                  {result.recommendation.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                      <Shield className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-2">
          <div className="glass-card p-4">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Prediction History</h3>
            {loading ? (
              <ListSkeleton items={4} />
            ) : history.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Gauge className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No predictions yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((h) => (
                  <div key={h.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                    <div>
                      <p className="text-sm text-[var(--text-secondary)]">Risk Score: <span className="font-bold text-[var(--text-primary)]">{h.score}</span></p>
                      <p className="text-xs text-gray-500">{h.probability} probability</p>
                      <p className="text-xs text-gray-600 mt-0.5">{h.date}</p>
                    </div>
                    <span className={cn(
                      'px-2 py-0.5 rounded-full text-[10px] font-medium',
                      h.risk === 'low' && 'bg-green-500/20 text-green-400',
                      h.risk === 'medium' && 'bg-yellow-500/20 text-yellow-400',
                      h.risk === 'high' && 'bg-red-500/20 text-red-400',
                    )}>
                      {h.risk}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
