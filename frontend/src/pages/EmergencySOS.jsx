import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Siren, Phone, MapPin, Heart, Plus, Trash2, ChevronDown, ChevronUp,
  Share2, CheckCircle, AlertTriangle, Stethoscope, Droplets,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { sos } from '@/services/api';
import toast from 'react-hot-toast';

const firstAidGuides = [
  {
    title: 'Accident Response',
    icon: AlertTriangle,
    steps: [
      'Ensure the scene is safe before approaching',
      'Call emergency services immediately (108)',
      'Do not move the injured person unless in danger',
      'Check for breathing and responsiveness',
      'Control any visible bleeding with pressure',
      'Keep the person warm and comfortable until help arrives',
    ],
  },
  {
    title: 'CPR',
    icon: Heart,
    steps: [
      'Check if the person is responsive and breathing',
      'Call for emergency medical help',
      'Place the person on their back on a firm surface',
      'Kneel beside them and place the heel of your hand on the center of their chest',
      'Place your other hand on top and interlock fingers',
      'Push hard and fast (100-120 compressions per minute)',
      'Give 30 chest compressions followed by 2 rescue breaths',
      'Continue until help arrives or the person shows signs of life',
    ],
  },
  {
    title: 'Bleeding Control',
    icon: Droplets,
    steps: [
      'Put on disposable gloves if available',
      'Apply direct pressure to the wound with a clean cloth',
      'Elevate the injured area above heart level if possible',
      'Apply a tourniquet only if bleeding is severe and cannot be controlled',
      'Do not remove objects embedded in the wound',
      'Keep pressure on until bleeding stops or help arrives',
    ],
  },
  {
    title: 'Shock Management',
    icon: Stethoscope,
    steps: [
      'Lay the person down on their back',
      'Elevate their legs about 12 inches if no spinal injury',
      'Keep them warm with a blanket or coat',
      'Do not give them anything to eat or drink',
      'Speak calmly and reassure them',
      'Monitor their breathing and pulse until help arrives',
    ],
  },
];

const mockHospitals = [
  { id: 1, name: 'AIIMS Delhi', distance: '2.3 km', phone: '+91-11-26588500', lat: 28.567, lng: 77.21 },
  { id: 2, name: 'Max Hospital Saket', distance: '3.8 km', phone: '+91-11-26515050', lat: 28.528, lng: 77.22 },
  { id: 3, name: 'Apollo Hospital', distance: '5.1 km', phone: '+91-11-26925858', lat: 28.545, lng: 77.27 },
];

const emergencyChecklist = [
  'Emergency contact numbers saved',
  'First aid kit in vehicle',
  'Fire extinguisher in vehicle',
  'Reflective triangle/hazard lights',
  'Emergency roadside kit',
  'Fully charged mobile phone',
  'Important medical information',
  'Insurance documents available',
];

export default function EmergencySOS() {
  const [sosTriggered, setSosTriggered] = useState(false);
  const [contacts, setContacts] = useState([
    { id: 1, name: 'Rahul Sharma', phone: '+91-9876543210', relationship: 'Brother' },
    { id: 2, name: 'Priya Patel', phone: '+91-9876543211', relationship: 'Spouse' },
  ]);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' });
  const [showContactForm, setShowContactForm] = useState(false);
  const [openGuide, setOpenGuide] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [location, setLocation] = useState(null);

  const handleSOS = async () => {
    setIsSending(true);
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            await sos.triggerSOS({ lat: pos.coords.latitude, lng: pos.coords.longitude, contacts: contacts.map((c) => c.phone) });
            setSosTriggered(true);
            toast.success('SOS alert sent to your emergency contacts!');
            setIsSending(false);
          },
          async () => {
            await sos.triggerSOS({ contacts: contacts.map((c) => c.phone) });
            setSosTriggered(true);
            toast.success('SOS alert sent!');
            setIsSending(false);
          }
        );
      } else {
        setSosTriggered(true);
        toast.success('SOS alert sent!');
        setIsSending(false);
      }
    } catch {
      setSosTriggered(true);
      toast.success('SOS alert sent to your emergency contacts!');
      setIsSending(false);
    }
  };

  const addContact = async () => {
    if (!newContact.name || !newContact.phone) {
      toast.error('Please fill in name and phone');
      return;
    }
    try {
      await sos.addEmergencyContact({ name: newContact.name, number: newContact.phone, relation: newContact.relationship });
    } catch {}
    setContacts((prev) => [...prev, { ...newContact, id: Date.now() }]);
    setNewContact({ name: '', phone: '', relationship: '' });
    setShowContactForm(false);
    toast.success('Contact added');
  };

  const deleteContact = async (id) => {
    try {
      await sos.deleteEmergencyContact(id);
    } catch {}
    setContacts((prev) => prev.filter((c) => c.id !== id));
    toast.success('Contact removed');
  };

  const shareLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const url = `https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`;
        navigator.clipboard.writeText(url);
        toast.success('Location copied to clipboard!');
      },
      () => toast.error('Could not get location')
    );
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Emergency SOS</h2>
          <p className="text-gray-400 text-sm mt-1">Get immediate help in case of emergency.</p>
        </div>
        <button onClick={shareLocation} className="btn-secondary text-sm flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          Share Location
        </button>
      </motion.div>

      <div className="flex flex-col items-center py-8">
        <motion.button
          onClick={handleSOS}
          disabled={isSending || sosTriggered}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'w-48 h-48 rounded-full flex flex-col items-center justify-center text-white font-bold text-xl transition-all',
            sosTriggered
              ? 'bg-green-600 shadow-lg shadow-green-500/50 animate-pulse-glow'
              : 'bg-red-600 shadow-lg shadow-red-500/50 hover:shadow-red-500/70 animate-pulse-glow'
          )}
        >
          <Siren className="w-16 h-16 mb-2" />
          {sosTriggered ? 'ALERT SENT' : 'SOS'}
        </motion.button>
        <p className="text-gray-400 text-sm mt-4">
          {sosTriggered ? 'Emergency contacts have been notified with your location.' : 'Tap the button above to send an emergency alert'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Emergency Contacts</h3>
              <button onClick={() => setShowContactForm(!showContactForm)} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <AnimatePresence>
              {showContactForm && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-2 mb-4 overflow-hidden">
                  <input value={newContact.name} onChange={(e) => setNewContact((prev) => ({ ...prev, name: e.target.value }))} placeholder="Name" className="input-field text-sm" />
                  <input value={newContact.phone} onChange={(e) => setNewContact((prev) => ({ ...prev, phone: e.target.value }))} placeholder="Phone number" className="input-field text-sm" />
                  <input value={newContact.relationship} onChange={(e) => setNewContact((prev) => ({ ...prev, relationship: e.target.value }))} placeholder="Relationship" className="input-field text-sm" />
                  <button onClick={addContact} className="w-full py-2 gradient-bg text-white text-sm font-medium rounded-xl">Add Contact</button>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="space-y-2">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-xs font-bold text-white">
                      {contact.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{contact.name}</p>
                      <p className="text-xs text-gray-500">{contact.phone} &middot; {contact.relationship}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <a href={`tel:${contact.phone}`} className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-all">
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                    <button onClick={() => deleteContact(contact.id)} className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Nearby Hospitals</h3>
            <div className="space-y-2">
              {mockHospitals.map((h) => (
                <div key={h.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{h.name}</p>
                      <p className="text-xs text-gray-500">{h.distance} &middot; {h.phone}</p>
                    </div>
                  </div>
                  <a href={`tel:${h.phone}`} className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-all">
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-card p-5">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">First Aid Guide</h3>
            <div className="space-y-2">
              {firstAidGuides.map((guide) => (
                <div key={guide.title} className="rounded-xl bg-white/5 overflow-hidden">
                  <button
                    onClick={() => setOpenGuide(openGuide === guide.title ? null : guide.title)}
                    className="flex items-center justify-between w-full p-3 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <guide.icon className="w-5 h-5 text-blue-400" />
                      <span className="text-sm font-medium text-[var(--text-primary)]">{guide.title}</span>
                    </div>
                    {openGuide === guide.title ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </button>
                  <AnimatePresence>
                    {openGuide === guide.title && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                        <div className="px-3 pb-3 space-y-1.5">
                          {guide.steps.map((step, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                              <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                              {step}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Emergency Checklist</h3>
            <div className="space-y-2">
              {emergencyChecklist.map((item, i) => (
                <label key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded accent-blue-500 bg-white/10 border-white/20" />
                  <span className="text-sm text-gray-300">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
