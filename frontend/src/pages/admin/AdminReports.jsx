import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle, Trash2, X, AlertTriangle, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { admin } from '@/services/api';
import { TableSkeleton } from '@/components/ui/skeleton';
import toast from 'react-hot-toast';

const mockReports = [
  { id: 1, type: 'Pothole', description: 'Large pothole on MG Road near bus stop', location: 'MG Road, Delhi', severity: 'high', status: 'pending', reporter: 'Ravi K.', date: '2026-06-28' },
  { id: 2, type: 'Broken Signal', description: 'Traffic signal not working at Rajpath', location: 'Rajpath, Delhi', severity: 'critical', status: 'verified', reporter: 'Priya S.', date: '2026-06-27' },
  { id: 3, type: 'Road Damage', description: 'Cracked road surface on Ring Road', location: 'Ring Road, Delhi', severity: 'medium', status: 'resolved', reporter: 'Amit S.', date: '2026-06-26' },
  { id: 4, type: 'Waterlogging', description: 'Waterlogged road near Karol Bagh market', location: 'Karol Bagh, Delhi', severity: 'low', status: 'pending', reporter: 'Sunita P.', date: '2026-06-25' },
  { id: 5, type: 'Accident', description: 'Multi-vehicle collision on highway', location: 'NH-8, Gurugram', severity: 'critical', status: 'rejected', reporter: 'Vijay G.', date: '2026-06-24' },
  { id: 6, type: 'Missing Sign', description: 'Stop sign missing at T-junction', location: 'Sector 12, Noida', severity: 'medium', status: 'pending', reporter: 'Neha V.', date: '2026-06-23' },
];

const severityColor = { low: 'text-green-400 bg-green-500/20', medium: 'text-yellow-400 bg-yellow-500/20', high: 'text-orange-400 bg-orange-500/20', critical: 'text-red-400 bg-red-500/20' };
const statusColor = { pending: 'text-yellow-400', verified: 'text-blue-400', resolved: 'text-green-400', rejected: 'text-red-400' };

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await admin.getAdminReports();
        setReports(res.data?.reports || []);
      } catch {
        setReports(mockReports);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const filtered = reports.filter((r) => {
    if (filterType !== 'All' && r.type !== filterType) return false;
    if (filterSeverity !== 'All' && r.severity !== filterSeverity) return false;
    if (filterStatus !== 'All' && r.status !== filterStatus) return false;
    if (search && !r.description.toLowerCase().includes(search.toLowerCase()) && !r.reporter.toLowerCase().includes(search.toLowerCase()) && !r.location.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleVerify = async (id) => {
    try {
      await admin.verifyReport(id);
    } catch {}
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'verified' } : r)));
    toast.success('Report verified');
  };

  const handleDelete = async (id) => {
    try {
      await admin.deleteAdminReport(id);
    } catch {}
    setReports((prev) => prev.filter((r) => r.id !== id));
    toast.success('Report deleted');
    setDeleteConfirm(null);
    setSelectedReport(null);
  };

  if (loading) return <TableSkeleton rows={6} />;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-theme-secondary border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Report Management</h2>
        <p className="text-gray-400 text-sm mt-1">Review, verify, and manage hazard reports.</p>
      </motion.div>

      <div className="bg-theme-secondary border border-white/10 rounded-2xl p-5">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search reports..." className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-[var(--text-primary)] placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-all" />
          </div>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-[var(--text-primary)]">
            {['All', 'Pothole', 'Broken Signal', 'Road Damage', 'Waterlogging', 'Accident', 'Missing Sign'].map((t) => <option key={t} value={t} className="bg-gray-900">{t}</option>)}
          </select>
          <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-[var(--text-primary)]">
            {['All', 'low', 'medium', 'high', 'critical'].map((s) => <option key={s} value={s} className="bg-gray-900">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-[var(--text-primary)]">
            {['All', 'pending', 'verified', 'resolved', 'rejected'].map((s) => <option key={s} value={s} className="bg-gray-900">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-white/10">
                <th className="text-left py-3 font-medium">Type</th>
                <th className="text-left py-3 font-medium">Description</th>
                <th className="text-left py-3 font-medium">Location</th>
                <th className="text-left py-3 font-medium">Severity</th>
                <th className="text-left py-3 font-medium">Status</th>
                <th className="text-left py-3 font-medium">Reporter</th>
                <th className="text-left py-3 font-medium">Date</th>
                <th className="text-right py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((report) => (
                <motion.tr key={report.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setSelectedReport(report)}>
                  <td className="py-3 text-[var(--text-primary)] font-medium">{report.type}</td>
                  <td className="py-3 text-gray-400 max-w-[200px] truncate">{report.description}</td>
                  <td className="py-3 text-gray-400">{report.location}</td>
                  <td className="py-3">
                    <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium', severityColor[report.severity])}>{report.severity}</span>
                  </td>
                  <td className="py-3">
                    <span className={cn('text-xs font-medium', statusColor[report.status])}>{report.status}</span>
                  </td>
                  <td className="py-3 text-gray-400">{report.reporter}</td>
                  <td className="py-3 text-gray-400">{report.date}</td>
                  <td className="py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      {report.status === 'pending' && (
                        <button onClick={() => handleVerify(report.id)} className="p-1.5 rounded-lg hover:bg-green-500/20 text-gray-500 hover:text-green-400 transition-all" title="Verify">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {deleteConfirm === report.id ? (
                        <>
                          <button onClick={() => handleDelete(report.id)} className="px-2 py-1 bg-red-500 text-white text-xs rounded-lg">Confirm</button>
                          <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 bg-white/10 text-[var(--text-primary)] text-xs rounded-lg">Cancel</button>
                        </>
                      ) : (
                        <button onClick={() => setDeleteConfirm(report.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-all" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <AlertTriangle className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No reports found</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedReport && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedReport(null)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-theme-secondary border border-white/10 rounded-2xl p-6 max-w-lg w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Report Details</h3>
                <button onClick={() => setSelectedReport(null)} className="p-1 rounded-lg hover:bg-white/10 text-gray-400"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-gray-400 text-sm">Type</span><span className="text-[var(--text-primary)] font-medium text-sm">{selectedReport.type}</span></div>
                <div className="flex justify-between"><span className="text-gray-400 text-sm">Severity</span><span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', severityColor[selectedReport.severity])}>{selectedReport.severity}</span></div>
                <div className="flex justify-between"><span className="text-gray-400 text-sm">Status</span><span className={cn('text-sm font-medium', statusColor[selectedReport.status])}>{selectedReport.status}</span></div>
                <div><span className="text-gray-400 text-sm block mb-1">Description</span><p className="text-[var(--text-primary)] text-sm bg-white/5 p-3 rounded-xl">{selectedReport.description}</p></div>
                <div className="flex items-center gap-2 text-sm text-gray-400"><MapPin className="w-4 h-4" /> {selectedReport.location}</div>
                <div className="flex justify-between text-sm text-gray-500"><span>Reported by: <span className="text-gray-300">{selectedReport.reporter}</span></span><span>{selectedReport.date}</span></div>
              </div>
              <div className="flex gap-2 mt-6">
                {selectedReport.status === 'pending' && (
                  <button onClick={() => { handleVerify(selectedReport.id); setSelectedReport(null); }} className="flex-1 py-2.5 bg-green-500 text-white text-sm font-medium rounded-xl hover:bg-green-600">Verify Report</button>
                )}
                <button onClick={() => { setDeleteConfirm(selectedReport.id); }} className="flex-1 py-2.5 bg-red-500 text-white text-sm font-medium rounded-xl hover:bg-red-600">Delete Report</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
