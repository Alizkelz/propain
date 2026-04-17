import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Paintbrush, Star, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      let prods: any[] = [];
      snapshot.forEach((doc) => prods.push({ id: doc.id, ...doc.data() }));
      setProducts(prods);
    }, (error) => {
      console.error(error);
    });
    return unsub;
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = category === 'all' || p.category.toLowerCase() === category.toLowerCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Professional Paint Solutions
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          High-quality products for interior, exterior, and waterproof applications.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder={t('search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 rtl:pr-10 rtl:pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-2.5 h-5 w-5 text-gray-400" />
        </div>
        
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2">
          {['all', 'interior', 'exterior', 'waterproof', 'premium'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                category === cat ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat === 'all' ? t('allCategories') : t(cat as any)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.map((product, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={product.id}
          >
            <Link to={`/product/${product.id}`} className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                {product.images && product.images[0] ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <Paintbrush className="w-12 h-12 mb-2 opacity-50" />
                  </div>
                )}
                {product.stock <= 0 && (
                  <div className="absolute top-3 right-3 rtl:left-3 rtl:right-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {t('outOfStock')}
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{t(product.category.toLowerCase() as any) || product.category}</span>
                  <div className="flex items-center text-yellow-400 text-sm">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1 rtl:mr-1 font-medium text-gray-700">{product.averageRating?.toFixed(1) || '0.0'}</span>
                  </div>
                </div>
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-1">{product.name}</h3>
                <p className="font-semibold text-gray-900">${product.price}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No products found.
        </div>
      )}
    </div>
  );
}
