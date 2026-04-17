import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';
import { Trash2, ArrowRight } from 'lucide-react';
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

  const handleSubmit = async (e: React.FormEvent) => {
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
      <div className="max-w-2xl mx-auto py-20 text-center px-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-green-100 text-green-700 p-8 rounded-2xl mb-8">
          <h2 className="text-2xl font-bold mb-2">Request Submitted Successfully!</h2>
          <p>We will contact you shortly.</p>
        </motion.div>
        <Link to="/" className="text-blue-600 font-medium hover:underline flex items-center justify-center">
          Back to store
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">{t('cart')}</h1>
      
      {cart.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 mb-6 text-lg">{t('emptyCart')}</p>
          <Link to="/" className="inline-block bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-2/3">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
              <ul className="divide-y divide-gray-100">
                {cart.map((item) => (
                  <li key={item.id} className="p-6 flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div className="h-20 w-20 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                        )}
                      </div>
                      <div className="ml-6 rtl:mr-6 rtl:ml-0 flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-gray-500 font-medium">
                          {item.quantity} L &times; ${item.price}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end pl-6 rtl:pr-6 rtl:pl-0">
                      <p className="text-xl font-extrabold text-gray-900 mb-2">${item.price * item.quantity}</p>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="p-6 bg-gray-50 flex justify-between items-center border-t border-gray-100">
                <span className="text-lg font-medium text-gray-600">{t('total')}</span>
                <span className="text-2xl font-extrabold text-gray-900">${total}</span>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{t('requestQuote')}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')} *</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone')} *</label>
                  <input 
                    required 
                    type="tel" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition" 
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg mt-6 transition disabled:opacity-50"
                >
                  {loading ? 'Sending...' : t('sendOrder')}
                  <ArrowRight className={`ml-2 w-5 h-5 ${i18n.language === 'ar' ? 'rotate-180 mr-2 ml-0' : ''}`} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
