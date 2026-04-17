import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Plus, Edit2, Trash2, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductsAdmin() {
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'interior',
    price: 0,
    stock: 0,
    imageUrl: '',
    isTrending: false,
    isRecommended: false,
    colors: '' // comma separated hex
  });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), (snap) => {
      let prods: any[] = [];
      snap.forEach(d => prods.push({ id: d.id, ...d.data() }));
      setProducts(prods);
    });
    return unsub;
  }, []);

  const openAdd = () => {
    setFormData({ name: '', description: '', category: 'interior', price: 0, stock: 0, imageUrl: '', isTrending: false, isRecommended: false, colors: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEdit = (p: any) => {
    setFormData({
      name: p.name,
      description: p.description,
      category: p.category,
      price: p.price,
      stock: p.stock,
      imageUrl: p.images?.[0] || '',
      isTrending: p.isTrending || false,
      isRecommended: p.isRecommended || false,
      colors: (p.colors || []).join(', ')
    });
    setEditingId(p.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const colorArray = formData.colors.split(',').map(c => c.trim()).filter(c => c && c.startsWith('#'));
    
    const payload = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      price: Number(formData.price),
      stock: Number(formData.stock),
      images: formData.imageUrl ? [formData.imageUrl] : [],
      isTrending: formData.isTrending,
      isRecommended: formData.isRecommended,
      colors: colorArray,
      updatedAt: serverTimestamp()
    };

    if (editingId) {
      await updateDoc(doc(db, 'products', editingId), payload);
    } else {
      await addDoc(collection(db, 'products'), {
        ...payload,
        createdAt: serverTimestamp(),
        averageRating: 0,
        reviewCount: 0
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteDoc(doc(db, 'products', id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-serif">Products Catalog</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Manage inventory, colors, and featured collections</p>
        </div>
        <button 
          onClick={openAdd}
          className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-5 py-2.5 rounded-full font-bold flex items-center transition shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
          Add Product
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-900/50">
            <tr>
              <th className="px-8 py-5 text-left text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Product</th>
              <th className="px-8 py-5 text-left text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Category</th>
              <th className="px-8 py-5 text-left text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Price/L</th>
              <th className="px-8 py-5 text-left text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Stock</th>
              <th className="px-8 py-5 text-right text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-100 dark:divide-slate-700">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                <td className="px-8 py-6 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-14 w-14 flex-shrink-0 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                      {p.images?.[0] && <img src={p.images[0]} alt="" className="h-full w-full object-cover" />}
                    </div>
                    <div className="ml-5 rtl:mr-5 rtl:ml-0">
                      <div className="text-base font-bold text-slate-900 dark:text-white capitalize tracking-tight">{p.name}</div>
                      <div className="flex gap-2 mt-2">
                        {p.isTrending && <span className="text-[10px] bg-amber-500 text-slate-900 px-2 py-0.5 rounded-full font-black tracking-wider uppercase shadow-sm">Trending</span>}
                        {p.isRecommended && <span className="text-[10px] bg-blue-500 text-slate-900 px-2 py-0.5 rounded-full font-black tracking-wider uppercase shadow-sm">Recommended</span>}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 whitespace-nowrap">
                  <span className="px-4 py-1.5 inline-flex text-xs leading-5 font-bold rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                    {p.category}
                  </span>
                </td>
                <td className="px-8 py-6 whitespace-nowrap text-sm text-slate-900 dark:text-white font-bold font-mono">
                  ${p.price}
                </td>
                <td className="px-8 py-6 whitespace-nowrap text-sm font-mono">
                  <span className={`font-bold ${p.stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{p.stock} L</span>
                </td>
                <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => openEdit(p)} className="text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 mr-4 rtl:ml-4 rtl:mr-0 transition-colors active:scale-95">
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors active:scale-95">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <div className="p-16 text-center text-slate-500 font-bold uppercase tracking-widest text-sm border-2 border-dashed border-slate-200 dark:border-slate-700 m-8 rounded-3xl">No products available. Start by adding one.</div>}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-3xl relative p-8 max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 rtl:left-6 rtl:right-auto text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-full p-2 transition">
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 font-serif">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Product Name <span className="text-red-500">*</span></label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none dark:text-white transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Category <span className="text-red-500">*</span></label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none dark:text-white transition">
                      <option value="interior">Interior</option>
                      <option value="exterior">Exterior</option>
                      <option value="waterproof">Waterproof</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Image URL</label>
                    <input type="url" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none dark:text-white transition" placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Price per Liter ($) <span className="text-red-500">*</span></label>
                    <input required type="number" min="0" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none dark:text-white transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Current Stock (Liters) <span className="text-red-500">*</span></label>
                    <input required type="number" min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none dark:text-white transition" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Color Previews (Hex Codes)</label>
                    <div className="flex items-start bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-3">
                       <Info className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                       <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">Enter hex color codes separated by commas (e.g. #FF0000, #00FF00). These will be displayed as interactive swatches on the product page.</p>
                    </div>
                    <input type="text" value={formData.colors} onChange={e => setFormData({...formData, colors: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none dark:text-white transition font-mono text-sm" placeholder="#2C3E50, #E74C3C..." />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Description <span className="text-red-500">*</span></label>
                    <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none dark:text-white transition" />
                  </div>
                  
                  <div className="col-span-2 flex space-x-6 rtl:space-x-reverse bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" checked={formData.isTrending} onChange={e => setFormData({...formData, isTrending: e.target.checked})} className="w-5 h-5 rounded text-amber-500 focus:ring-amber-500 bg-slate-100 border-slate-300 dark:border-slate-600 dark:bg-slate-700" />
                      <span className="ml-2 rtl:mr-2 text-sm font-bold text-slate-700 dark:text-slate-300">Mark as Trending</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" checked={formData.isRecommended} onChange={e => setFormData({...formData, isRecommended: e.target.checked})} className="w-5 h-5 rounded text-amber-500 focus:ring-amber-500 bg-slate-100 border-slate-300 dark:border-slate-600 dark:bg-slate-700" />
                      <span className="ml-2 rtl:mr-2 text-sm font-bold text-slate-700 dark:text-slate-300">Mark as Recommended</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end pt-6 border-t border-slate-200 dark:border-slate-700 mt-8">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl mr-4 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold transition">Cancel</button>
                  <button type="submit" className="px-8 py-3 bg-amber-500 text-slate-900 rounded-xl font-bold hover:bg-amber-400 transition shadow-lg shadow-amber-500/20">{editingId ? 'Save Changes' : 'Create Product'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
