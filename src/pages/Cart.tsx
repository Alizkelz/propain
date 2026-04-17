import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';
import { Trash2, ArrowRight, PaintBucket } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from 'framer-motion';

export default function Cart() {
  const { t, i18n } = useTranslation();
  const { cart, removeFromCart, clearCart } = useStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setLoading(true);
    
    try {
      await addDoc(collection(db, 'orders'), {
        customerName: formData.name,
        phone: formData.phone,
        email: formData.email,
        items: cart,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setSuccess(true);
      clearCart();
    } catch (err) {
      console.error(err);
      alert('Error submitting request');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto py-32 text-center px-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-8 rounded-3xl mb-8 border border-green-100 dark:border-green-800 shadow-xl shadow-green-100/50 dark:shadow-green-900/10">
          <h2 className="text-3xl font-bold mb-4 font-serif">Request Submitted Successfully!</h2>
          <p className="text-lg">We have received your quote request and will contact you shortly to confirm details.</p>
        </motion.div>
        <Link to="/" className="text-amber-500 font-bold hover:text-amber-400 transition-colors flex items-center justify-center text-lg group">
          <ArrowRight className="mr-2 rtl:ml-2 rtl:mr-0 rtl:rotate-180 w-5 h-5 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
          Back to store
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-32">
      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-10 font-serif">Quote Request</h1>
      
      {cart.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-16 text-center rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 flex flex-col items-center">
          <PaintBucket className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-6" />
          <p className="text-slate-500 dark:text-slate-400 mb-8 text-xl font-light">Your quote request is currently empty.</p>
          <Link to="/" className="inline-flex items-center bg-amber-500 text-slate-950 font-bold px-8 py-4 rounded-full hover:bg-amber-400 hover:scale-105 transition-all shadow-lg shadow-amber-500/20">
            Explore Collection
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-2/3">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 overflow-hidden mb-6">
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {cart.map((item) => (
                  <li key={item.id} className="p-8 flex flex-col sm:flex-row items-center justify-between gap-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center flex-1 w-full sm:w-auto">
                      <div className="h-24 w-24 flex-shrink-0 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-slate-400 dark:text-slate-600 text-xs text-center px-2">No Image</div>
                        )}
                      </div>
                      <div className="ml-6 rtl:mr-6 rtl:ml-0 flex-1">
                        <Link to={`/product/${item.id}`} className="text-xl font-bold text-slate-900 dark:text-white mb-2 font-serif hover:text-amber-500 transition-colors line-clamp-1">{item.name}</Link>
                        <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 font-medium font-mono text-sm">
                          <span>{item.quantity}L &times; ${item.price}</span>
                          {item.color && (
                            <span className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-700 pl-4 rtl:pr-4 rtl:pl-0 rtl:border-r rtl:border-l-0">
                                <span className="w-4 h-4 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm" style={{ backgroundColor: item.color }}></span>
                                {item.color.toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pl-0 sm:pl-6 rtl:pr-6 rtl:pl-0">
                      <p className="text-2xl font-black text-slate-900 dark:text-white mb-0 sm:mb-4">${item.price * item.quantity}</p>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 p-2 rounded-full transition-colors self-end"
                        title="Remove from request"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="p-8 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center border-t border-slate-100 dark:border-slate-800">
                <span className="text-lg font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Estimated Total</span>
                <span className="text-4xl font-black text-slate-900 dark:text-white">${total}</span>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/3">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 p-8 sticky top-28">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 font-serif">Your Details</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('name')} <span className="text-red-500">*</span></label>
                  <input 
                    required 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none transition dark:text-white" 
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('phone')} <span className="text-red-500">*</span></label>
                  <input 
                    required 
                    type="tel" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none transition dark:text-white" 
                    placeholder="e.g. +1 234 567 8900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('email')}</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none transition dark:text-white" 
                    placeholder="For quote confirmation"
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full flex items-center justify-center bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-4 rounded-xl mt-8 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-lg shadow-amber-500/20 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                      {loading ? 'Processing...' : 'Submit Request'}
                      {!loading && <ArrowRight className={`ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform ${i18n.language === 'ar' ? 'rotate-180 mr-2 ml-0 group-hover:-translate-x-1' : ''}`} />}
                  </span>
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
                </button>
                <p className="text-center text-xs text-slate-500 dark:text-slate-400 font-medium">No payment required. We will contact you with a final quote.</p>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
