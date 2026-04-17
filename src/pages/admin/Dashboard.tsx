import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Users, ShoppingBag, MessageSquare, Package } from 'lucide-react';
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
    { title: 'Total Products', value: stats.products, icon: Package, color: 'bg-blue-500' },
    { title: 'Pending Orders / Quotes', value: stats.orders, icon: ShoppingBag, color: 'bg-green-500' },
    { title: 'Chat Sessions', value: stats.chats, icon: MessageSquare, color: 'bg-purple-500' },
    { title: 'Unique Visitors', value: stats.visitors, icon: Users, color: 'bg-yellow-500' },
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
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center"
          >
            <div className={`p-4 rounded-lg ${card.color} text-white mr-4`}>
              <card.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Welcome to ProPaint Dashboard</h2>
        <p className="text-gray-600 mb-6 max-w-2xl">
          From here you can manage your inventory, respond to customer inquiries, and track quote requests. Navigate using the sidebar to explore specific modules.
        </p>
      </div>
    </div>
  );
}
