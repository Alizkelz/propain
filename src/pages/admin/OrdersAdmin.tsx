import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';

export default function OrdersAdmin() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      let ords: any[] = [];
      snap.forEach(d => ords.push({ id: d.id, ...d.data() }));
      setOrders(ords);
    });
    return unsub;
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, 'orders', id), { status });
  };

  return (
    <div>
      <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 font-serif">Quote Requests &amp; Orders</h2>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 p-8">
            <div className="flex justify-between items-start mb-6 pb-6 border-b border-slate-100 dark:border-slate-700">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white capitalize">{order.customerName}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1 font-mono tracking-tight">Phone: {order.phone} | Email: {order.email}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-3 font-bold uppercase tracking-wider">
                  {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : 'Just now'}
                </p>
              </div>
              <div>
                <select 
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className={`text-sm font-black px-4 py-2 rounded-xl border outline-none shadow-sm transition-colors cursor-pointer ${
                    order.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800' :
                    order.status === 'contacted' ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' :
                    'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800'
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed / Solved</option>
                </select>
              </div>
            </div>
            
            <h4 className="text-sm font-black uppercase text-slate-900 dark:text-white mb-4 tracking-wider flex items-center">
                <span className="w-8 h-px bg-slate-200 dark:bg-slate-700 mr-4"></span>
                Requested Items
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {order.items.map((item: any, i: number) => (
                <div key={i} className="flex items-center bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700 font-semibold text-slate-400 overflow-hidden shadow-sm">
                    {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : 'IMG'}
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">{item.quantity}L &times; ${item.price}</p>
                        {item.color && (
                            <span className="flex items-center text-[10px] uppercase font-bold text-slate-400 border-l border-slate-300 dark:border-slate-700 pl-2 ml-1">
                                <span className="w-2 h-2 rounded-full mr-1 shadow-sm border border-slate-300 dark:border-slate-600" style={{ backgroundColor: item.color }}></span>
                                {item.color}
                            </span>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {orders.length === 0 && (
            <div className="bg-slate-50 dark:bg-slate-800 border items-center justify-center border-dashed border-slate-300 flex p-12 dark:border-slate-700 rounded-3xl">
                <p className="text-center text-slate-500 font-bold uppercase tracking-widest text-sm">No orders yet.</p>
            </div>
        )}
      </div>
    </div>
  );
}
