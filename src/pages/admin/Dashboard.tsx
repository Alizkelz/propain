import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Users, ShoppingBag, MessageSquare, Package, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    chats: 0,
    visitors: 1204 // Mock value
  });

  useEffect(() => {
    const unsubProducts = onSnapshot(collection(db, 'products'), (snap) => {
      setStats(s => ({ ...s, products: snap.size }));
    });
    const unsubOrders = onSnapshot(collection(db, 'orders'), (snap) => {
      setStats(s => ({ ...s, orders: snap.size }));
    });
    const unsubChats = onSnapshot(collection(db, 'chatSessions'), (snap) => {
      setStats(s => ({ ...s, chats: snap.size }));
    });

    return () => {
      unsubProducts();
      unsubOrders();
      unsubChats();
    };
  }, []);

  const cards = [
    { title: 'Total Products', value: stats.products, icon: Package, color: 'text-blue-500 bg-blue-500/10 dark:bg-blue-500/20' },
    { title: 'Pending Orders / Quotes', value: stats.orders, icon: ShoppingBag, color: 'text-amber-500 bg-amber-500/10 dark:bg-amber-500/20' },
    { title: 'Chat Sessions', value: stats.chats, icon: MessageSquare, color: 'text-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20' },
    { title: 'Unique Visitors', value: stats.visitors, icon: Users, color: 'text-purple-500 bg-purple-500/10 dark:bg-purple-500/20' },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={card.title} 
            className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 p-8 flex flex-col justify-between"
          >
            <div className={`p-4 rounded-2xl ${card.color} w-16 h-16 flex items-center justify-center mb-6`}>
              <card.icon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{card.title}</p>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white font-serif">{card.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 p-8 lg:p-12 relative overflow-hidden">
        {/* Decorative Graphic */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
            <TrendingUp className="w-96 h-96 -mr-20 -mb-20 text-slate-900 dark:text-white" />
        </div>
        
        <div className="relative z-10">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6 font-serif tracking-tight">Welcome to ProPaint Dashboard</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            From here you can seamlessly manage your inventory, rapidly respond to customer inquiries, and track incoming quote requests. Access powerful tools through the sidebar navigation to keep your specialized paint business moving forward.
            </p>
        </div>
      </div>
    </div>
  );
}
