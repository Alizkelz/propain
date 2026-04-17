import { Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store/useStore';
import { ShoppingCart, User, Globe, PaintBucket, MessageCircle, Phone } from 'lucide-react';
import ChatWidget from '../components/ChatWidget';
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function PublicLayout() {
  const { t, i18n } = useTranslation();
  const cart = useStore((state) => state.cart);
  const [whatsappNumber, setWhatsappNumber] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const d = await getDoc(doc(db, 'settings', 'global'));
        if (d.exists()) {
          setWhatsappNumber(d.data().whatsappNumber || '');
        }
      } catch(e) {}
    };
    fetchSettings();
  }, []);

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'ar' ? 'fr' : 'ar');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
              <PaintBucket className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl tracking-tight">ProPaint</span>
            </Link>
            
            <nav className="flex space-x-6 rtl:space-x-reverse items-center">
              <button onClick={toggleLang} className="flex items-center text-gray-600 hover:text-gray-900 font-medium bg-gray-100 px-3 py-1.5 rounded-full">
                <Globe className="h-4 w-4 mr-1.5 rtl:ml-1.5 rtl:mr-0" />
                <span>{i18n.language === 'ar' ? 'FR' : 'عربي'}</span>
              </button>
              
              <Link to="/cart" className="relative text-gray-600 hover:text-gray-900 flex items-center bg-gray-100 p-2.5 rounded-full transition-colors hover:bg-gray-200">
                <ShoppingCart className="h-5 w-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 rtl:-left-1 rtl:right-auto bg-blue-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold border-2 border-white">
                    {cart.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </Link>
              
              <Link to="/admin/login" className="text-gray-600 hover:text-gray-900 bg-gray-100 p-2.5 rounded-full transition-colors hover:bg-gray-200">
                <User className="h-5 w-5" />
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 border-t border-gray-800">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} ProPaint. All rights reserved.</p>
        </div>
      </footer>
      
      {whatsappNumber && (
        <a 
          href={`https://wa.me/${whatsappNumber}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="fixed bottom-6 left-6 rtl:right-6 rtl:left-auto bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-transform hover:scale-105 z-50 flex items-center justify-center"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
      )}
      
      <ChatWidget />
    </div>
  );
}
