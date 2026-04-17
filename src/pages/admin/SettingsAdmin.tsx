import { useState, useEffect } from 'react';
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

  const handleSave = async (e: React.FormEvent) => {
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
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Store Settings</h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
            <input 
              type="text" 
              value={formData.storeName}
              onChange={e => setFormData({...formData, storeName: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
            <p className="text-xs text-gray-500 mb-2">Include country code without + or 00 (e.g. 1234567890)</p>
            <input 
              type="text" 
              value={formData.whatsappNumber}
              onChange={e => setFormData({...formData, whatsappNumber: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="1234567890"
            />
          </div>

          <div className="pt-6 border-t border-gray-100">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
