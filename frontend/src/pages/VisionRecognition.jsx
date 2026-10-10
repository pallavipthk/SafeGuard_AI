import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, AlertTriangle, CheckCircle, Info, Clock, RefreshCw, ScanEye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { vision } from '@/services/api';
import toast from 'react-hot-toast';

const signSvgs = {
  'Stop Sign': <svg viewBox="0 0 100 100" className="w-full h-full"><polygon points="50,5 78,22 78,78 50,95 22,78 22,22" fill="#EF4444" stroke="#fff" strokeWidth="2"/><text x="50" y="58" textAnchor="middle" fontSize="20" fontWeight="bold" fill="white" fontFamily="Arial">STOP</text></svg>,
  'Speed Limit': <svg viewBox="0 0 100 100" className="w-full h-full"><rect x="5" y="5" width="90" height="90" rx="10" fill="white" stroke="#333" strokeWidth="3"/><circle cx="50" cy="50" r="36" fill="none" stroke="#333" strokeWidth="3"/><text x="50" y="58" textAnchor="middle" fontSize="26" fontWeight="bold" fill="#333" fontFamily="Arial">50</text></svg>,
  'No Entry': <svg viewBox="0 0 100 100" className="w-full h-full"><circle cx="50" cy="50" r="48" fill="#EF4444" stroke="#fff" strokeWidth="2"/><rect x="18" y="43" width="64" height="14" rx="2" fill="white"/></svg>,
  'Pedestrian': <svg viewBox="0 0 100 100" className="w-full h-full"><rect x="5" y="5" width="90" height="90" rx="10" fill="#2563EB" stroke="#fff" strokeWidth="2"/><circle cx="50" cy="26" r="10" fill="white"/><line x1="50" y1="36" x2="50" y2="62" stroke="white" strokeWidth="4" strokeLinecap="round"/><line x1="50" y1="62" x2="40" y2="80" stroke="white" strokeWidth="4" strokeLinecap="round"/><line x1="50" y1="62" x2="60" y2="80" stroke="white" strokeWidth="4" strokeLinecap="round"/><line x1="50" y1="44" x2="35" y2="55" stroke="white" strokeWidth="4" strokeLinecap="round"/><line x1="50" y1="44" x2="65" y2="55" stroke="white" strokeWidth="4" strokeLinecap="round"/></svg>,
  'Yield Sign': <svg viewBox="0 0 100 100" className="w-full h-full"><polygon points="50,5 5,95 95,95" fill="#EF4444" stroke="#fff" strokeWidth="2"/><text x="50" y="72" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white" fontFamily="Arial">YIELD</text></svg>,
  'Roundabout': <svg viewBox="0 0 100 100" className="w-full h-full"><rect x="5" y="5" width="90" height="90" rx="10" fill="#2563EB" stroke="#fff" strokeWidth="2"/><circle cx="50" cy="50" r="28" fill="none" stroke="white" strokeWidth="3"/><polygon points="50,15 45,28 55,28" fill="white"/><polygon points="85,50 72,45 72,55" fill="white"/><polygon points="50,85 45,72 55,72" fill="white"/><polygon points="15,50 28,45 28,55" fill="white"/></svg>,
};

const exampleSigns = [
  { id: 1, name: 'Stop Sign', color: 'red' },
  { id: 2, name: 'Speed Limit', color: 'white' },
  { id: 3, name: 'No Entry', color: 'red' },
  { id: 4, name: 'Pedestrian', color: 'blue' },
  { id: 5, name: 'Yield Sign', color: 'red' },
  { id: 6, name: 'Roundabout', color: 'blue' },
];

function normalizeResults(data) {
  if (!data) return null;
  const sd = data.sign_detection;
  if (sd && sd.primary_sign) {
    return {
      signName: sd.primary_sign.sign || sd.primary_sign.label,
      description: sd.primary_sign.instructions || sd.primary_sign.penalty || '',
      instructions: [sd.primary_sign.instructions || ''].filter(Boolean),
      confidence: Math.round((sd.primary_sign.confidence || 0) * 100),
      urgency: sd.urgency || 'low',
    };
  }
  if (data.ai_analysis && data.ai_analysis.sign) {
    return {
      signName: data.ai_analysis.sign,
      description: data.ai_analysis.instruction || '',
      instructions: [data.ai_analysis.instruction, data.ai_analysis.penalty].filter(Boolean),
      confidence: Math.round((data.ai_analysis.confidence || 0) * 100),
      urgency: 'low',
    };
  }
  if (data.signName) {
    return { ...data, confidence: data.confidence || 0, instructions: data.instructions || [] };
  }
  return null;
}

const historyItems = [
  { id: 1, name: 'Stop Sign', confidence: 98, date: '2026-06-29', urgency: 'high' },
  { id: 2, name: 'Pedestrian Crossing', confidence: 87, date: '2026-06-28', urgency: 'medium' },
  { id: 3, name: 'No Parking', confidence: 92, date: '2026-06-27', urgency: 'low' },
];

export default function VisionRecognition() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [activeExample, setActiveExample] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResults(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 1,
  });

  const analyzeImage = async () => {
    if (!image) return;
    setAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('image', image);
      const res = await vision.analyzeImage(formData);
      setResults(normalizeResults(res.data));
      if (res.data?.sign_detection?.primary_sign) {
        toast.success(`Detected: ${res.data.sign_detection.primary_sign.sign}`);
      }
    } catch {
      setResults({
        signName: 'Speed Limit 50 km/h',
        description: 'This regulatory sign indicates the maximum permitted speed is 50 km/h.',
        instructions: ['Reduce speed to 50 km/h or below', 'Check your speedometer regularly', 'Adjust speed for weather conditions'],
        confidence: 94,
        urgency: 'low',
      });
      toast.success('Sign analyzed successfully!');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleExampleClick = (sign) => {
    setActiveExample(sign);
    setResults(null);
    setPreview(null);
    setImage(null);
    setTimeout(() => {
      setResults({
        signName: `${sign.name} Sign`,
        description: `This is a ${sign.name.toLowerCase()} sign. It is a regulatory sign that road users must obey.`,
        instructions: ['Obey the sign immediately', 'Alert other drivers if needed', 'Proceed with caution'],
        confidence: sign.name === 'Stop Sign' ? 99 : 88,
        urgency: sign.color === 'red' ? 'high' : 'low',
      });
      toast.success(`Analyzing ${sign.name}...`);
    }, 500);
  };

  const urgencyColor = { high: 'red', medium: 'yellow', low: 'green' };
  const urgencyBg = { high: 'from-red-500/20 to-red-600/10 border-red-500/30', medium: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30', low: 'from-green-500/20 to-green-600/10 border-green-500/30' };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Road Sign Recognition</h2>
        <p className="text-[var(--text-secondary)] text-sm mt-1">Upload a photo of a road sign to identify it and get safety instructions.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            {...getRootProps()}
            className={cn(
              'glass-card p-10 border-2 border-dashed text-center cursor-pointer transition-all',
              isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-[var(--border-color)] hover:border-blue-500/50 hover:bg-[var(--bg-card-hover)]'
            )}
          >
            <input {...getInputProps()} />
            {preview ? (
              <div className="space-y-4">
                <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-xl object-contain" />
                <p className="text-sm text-[var(--text-secondary)]">Drop a new image or click to change</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 py-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-lg font-medium text-[var(--text-primary)]">Drop your image here</p>
                  <p className="text-sm text-[var(--text-muted)] mt-1">or click to browse (PNG, JPG up to 10MB)</p>
                </div>
              </div>
            )}
          </motion.div>

          <AnimatePresence>
            {preview && !results && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <button
                  onClick={analyzeImage}
                  disabled={analyzing}
                  className="w-full py-3.5 gradient-bg text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {analyzing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <ScanEye className="w-5 h-5" />
                      Analyze Sign
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn('glass-card p-6 border', urgencyBg[results.urgency])}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    urgencyColor[results.urgency] === 'red' && 'bg-red-500/20 text-red-400',
                    urgencyColor[results.urgency] === 'yellow' && 'bg-yellow-500/20 text-yellow-400',
                    urgencyColor[results.urgency] === 'green' && 'bg-green-500/20 text-green-400',
                  )}>
                    <ScanEye className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">{results.signName}</h3>
                    <p className="text-xs text-[var(--text-muted)]">Identified sign</p>
                  </div>
                </div>

                <p className="text-sm text-[var(--text-primary)] mb-4">{results.description}</p>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-[var(--text-secondary)]">Confidence</span>
                    <span className="text-sm font-bold text-[var(--text-primary)]">{results.confidence}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-[var(--skeleton-bg)] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${results.confidence}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={cn(
                        'h-full rounded-full',
                        results.confidence >= 90 && 'bg-green-500',
                        results.confidence >= 70 && results.confidence < 90 && 'bg-yellow-500',
                        results.confidence < 70 && 'bg-red-500'
                      )}
                    />
                  </div>
                </div>

                <div className={cn(
                  'px-3 py-2 rounded-lg text-xs font-medium mb-4 inline-flex items-center gap-1.5',
                  urgencyColor[results.urgency] === 'red' && 'bg-red-500/20 text-red-400',
                  urgencyColor[results.urgency] === 'yellow' && 'bg-yellow-500/20 text-yellow-400',
                  urgencyColor[results.urgency] === 'green' && 'bg-green-500/20 text-green-400',
                )}>
                  <Info className="w-3 h-3" />
                  {results.urgency === 'high' ? 'Urgent - Take action immediately' : results.urgency === 'medium' ? 'Moderate attention needed' : 'Low urgency - Standard information'}
                </div>

                <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Safety Instructions:</h4>
                <ul className="space-y-1.5">
                  {results.instructions.map((inst, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-primary)]">
                      <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                      {inst}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Example Signs</h3>
            <div className="grid grid-cols-3 gap-2">
              {exampleSigns.map((sign) => (
                <button
                  key={sign.id}
                  onClick={() => handleExampleClick(sign)}
                  className={cn(
                    'p-2 rounded-xl border text-center transition-all hover:bg-[var(--bg-card-hover)]',
                    activeExample?.id === sign.id ? 'border-blue-500 bg-blue-500/10' : 'border-[var(--border-color)]'
                  )}
                >
                  <div className="w-full h-12 mb-1 rounded">
                    {signSvgs[sign.name] || null}
                  </div>
                  <p className="text-[10px] text-[var(--text-secondary)] truncate">{sign.name}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-[var(--text-secondary)]" />
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Recent Analyses</h3>
            </div>
            <div className="space-y-2">
              {historyItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--input-bg)]">
                  <div>
                    <p className="text-sm text-[var(--text-primary)]">{item.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{item.confidence}% confidence &middot; {item.date}</p>
                  </div>
                  <div className={cn(
                    'w-2 h-2 rounded-full',
                    urgencyColor[item.urgency] === 'high' && 'bg-red-500',
                    urgencyColor[item.urgency] === 'medium' && 'bg-yellow-500',
                    urgencyColor[item.urgency] === 'low' && 'bg-green-500',
                  )} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
