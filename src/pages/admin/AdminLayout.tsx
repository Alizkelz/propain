import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { LayoutDashboard, Package, ShoppingBag, MessageSquare, Settings, LogOut, PaintBucket } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin/login');
  };

  const navItems = [
    { name: t('adminDashboard'), path: '/admin', icon: LayoutDashboard },
    { name: t('manageProducts'), path: '/admin/products', icon: Package },
    { name: t('orders'), path: '/admin/orders', icon: ShoppingBag },
    { name: t('chat'), path: '/admin/chat', icon: MessageSquare },
    { name: t('settings'), path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden font-sans" dir="ltr">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 dark:bg-slate-950 border-r border-slate-800 flex flex-col hidden md:flex shadow-2xl z-20">
        <div className="h-20 flex items-center px-6 border-b border-slate-800 text-white bg-slate-950/50">
          <PaintBucket className="w-8 h-8 text-amber-500 mr-3 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
          <span className="text-xl font-black tracking-tight font-serif">ProPaint <span className="text-amber-500 font-sans text-xs uppercase tracking-widest ml-1 opacity-80">Admin</span></span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto pt-8">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3.5 rounded-xl font-bold transition-all duration-300 ${
                  isActive 
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 translate-x-1' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-slate-950' : 'text-slate-500'}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-800 bg-slate-950/30">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 pl-5 text-slate-400 hover:text-amber-500 hover:bg-slate-800 rounded-xl transition-all font-bold group"
          >
            <LogOut className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
            {t('logout')}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
         {/* Background gradient decorative */}
         <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[500px] h-[500px] bg-amber-500/10 dark:bg-amber-500/5 rounded-full filter blur-[100px] pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-500/5 rounded-full filter blur-[100px] pointer-events-none"></div>

        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 z-10 sticky top-0">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white font-serif tracking-tight">
            {navItems.find(i => i.path === location.pathname)?.name || 'Dashboard Overview'}
          </h1>
          <div className="flex items-center gap-6">
             <Link to="/" className="text-sm font-bold text-slate-500 hover:text-amber-500 transition-colors uppercase tracking-wider flex items-center">
                 View Live Store
             </Link>
             <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-500 flex items-center justify-center font-black text-lg shadow-lg border border-slate-700">
               P
             </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
