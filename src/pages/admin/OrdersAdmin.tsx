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
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Quote Requests &amp; Orders</h2>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{order.customerName}</h3>
                <p className="text-sm text-gray-500 font-medium mt-1">Phone: {order.phone} | Email: {order.email}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : 'Just now'}
                </p>
              </div>
              <div>
                <select 
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className={`text-sm font-bold px-3 py-1.5 rounded-lg border outline-none ${
                    order.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                    order.status === 'contacted' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    'bg-green-50 text-green-700 border-green-200'
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed / Solved</option>
                </select>
              </div>
            </div>
            
            <h4 className="text-sm font-semibold uppercase text-gray-500 mb-4 tracking-wider">Requested Items</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {order.items.map((item: any, i: number) => (
                <div key={i} className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="w-12 h-12 bg-white rounded flex items-center justify-center border font-semibold text-gray-400 overflow-hidden">
                    {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : 'IMG'}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-bold text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.quantity} Liters at ${item.price}/L</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {orders.length === 0 && <p className="text-center text-gray-500 py-10">No orders yet.</p>}
      </div>
    </div>
  );
}
