import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function SettingsAdmin() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    storeName: 'ProPaint',
    whatsappNumber: ''
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const d = await getDoc(doc(db, 'settings', 'global'));
      if (d.exists()) {
        setFormData(d.data() as any);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setDoc(doc(db, 'settings', 'global'), formData, { merge: true });
      alert('Settings saved!');
    } catch (err) {
      console.error(err);
      alert('Error updating settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 font-serif">Store Settings</h2>

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 p-8">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Store Name</label>
            <input 
              type="text" 
              value={formData.storeName}
              onChange={e => setFormData({...formData, storeName: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none dark:text-white transition" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 mt-4 flex items-baseline">
                WhatsApp Number
                <span className="text-xs font-medium text-slate-500 ml-2 font-mono">(Country code required, no +)</span>
            </label>
            <input 
              type="text" 
              value={formData.whatsappNumber}
              onChange={e => setFormData({...formData, whatsappNumber: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none dark:text-white transition font-mono" 
              placeholder="1234567890"
            />
          </div>

          <div className="pt-8 border-t border-slate-200 dark:border-slate-700 mt-8">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-4 rounded-xl transition disabled:opacity-50 shadow-lg shadow-amber-500/20 active:scale-95 flex items-center justify-center"
            >
              {loading ? 'Saving Changes...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
