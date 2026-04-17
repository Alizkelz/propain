import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store/useStore';
import { ShoppingCart, User, Globe, PaintBucket, MessageCircle, Moon, Sun, Home } from 'lucide-react';
import ChatWidget from '../components/ChatWidget';
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function PublicLayout() {
  const { t, i18n } = useTranslation();
  const { cart, darkMode, toggleDarkMode } = useStore();
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

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

    const handleScroll = () => {
        setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'ar' ? 'fr' : 'ar');
  };

  const isTransparent = isHomePage && !scrolled;

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isTransparent ? 'bg-transparent py-6' : 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-sm border-b border-slate-200/50 dark:border-slate-800/50 py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse group">
              <div className={`p-2 rounded-xl transition-transform shadow-lg ${isTransparent ? 'bg-amber-500/20 backdrop-blur-md shadow-amber-500/10' : 'bg-amber-400 group-hover:rotate-12 shadow-amber-400/20'}`}>
                <PaintBucket className={`h-6 w-6 ${isTransparent ? 'text-amber-400' : 'text-slate-900'}`} />
              </div>
              <span className={`font-bold text-2xl tracking-tight font-serif ${isTransparent ? 'text-white drop-shadow-md' : 'text-slate-900 dark:text-white'}`}>ProPaint</span>
            </Link>
            
            <nav className="flex space-x-4 rtl:space-x-reverse items-center">
              <button 
                onClick={toggleLang} 
                className={`flex items-center space-x-1.5 font-bold px-4 py-2.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-sm ${
                  isTransparent 
                    ? 'text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800'
                }`}
              >
                <Globe className="h-4 w-4" />
                <span className="uppercase text-xs tracking-wider">{i18n.language === 'ar' ? 'FR' : 'عربي'}</span>
              </button>
              
              <button 
                onClick={toggleDarkMode} 
                className={`p-2.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-sm ${
                  isTransparent 
                    ? 'text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800'
                }`}
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              
              <Link 
                to="/cart" 
                className={`relative p-2.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-sm ${
                  isTransparent 
                    ? 'text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800'
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 rtl:-left-1 rtl:right-auto bg-amber-500 text-slate-900 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold border-2 border-white dark:border-slate-800">
                    {cart.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </Link>
              
              <Link 
                to="/admin/login" 
                className={`p-2.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-sm ${
                  isTransparent 
                    ? 'text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800'
                }`}
              >
                <User className="h-5 w-5" />
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col pt-0">
        <Outlet />
      </main>

      <footer className="bg-slate-950 text-white pt-20 pb-12 overflow-hidden relative border-t border-slate-900">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-slate-800 pb-12 mb-8">
            <div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse mb-6">
                <PaintBucket className="h-8 w-8 text-amber-400" />
                <span className="font-bold text-3xl tracking-tight text-white font-serif">ProPaint</span>
              </div>
              <p className="text-slate-400 max-w-sm leading-relaxed font-light text-lg">
                Elevating spaces with premium quality paints. Durability, elegance, and endless color possibilities for your home and business.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold mb-6 tracking-widest text-slate-300 uppercase">Quick Links</h4>
              <ul className="space-y-4 font-medium text-slate-400">
                <li><Link to="/" className="hover:text-amber-400 transition-colors flex items-center"><Home className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0"/> Home</Link></li>
                <li><Link to="/cart" className="hover:text-amber-400 transition-colors flex items-center"><ShoppingCart className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0"/> Quote Request</Link></li>
                <li><Link to="/admin/login" className="hover:text-amber-400 transition-colors flex items-center"><User className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0"/> Admin Portal</Link></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-slate-500 flex flex-col md:flex-row justify-between items-center font-medium">
            <p>&copy; {new Date().getFullYear()} ProPaint. All rights reserved.</p>
            <p className="mt-4 md:mt-0 text-sm tracking-widest uppercase flex items-center">
              Premium Finishes
            </p>
          </div>
        </div>
      </footer>
      
      {whatsappNumber && (
        <a 
          href={`https://wa.me/${whatsappNumber}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="fixed bottom-6 left-6 rtl:right-6 rtl:left-auto bg-[#25D366] text-white p-4 rounded-full shadow-[0_8px_30px_rgb(37,211,102,0.4)] hover:bg-[#20bd5a] transition-all hover:scale-110 z-50 flex items-center justify-center group"
        >
          <MessageCircle className="w-7 h-7" />
          <span className="absolute left-full rtl:right-full rtl:left-auto top-1/2 -translate-y-1/2 ml-4 rtl:mr-4 bg-slate-900/90 text-white px-3 py-1.5 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Chat with us
          </span>
        </a>
      )}
      
      <ChatWidget />
    </div>
  );
}
