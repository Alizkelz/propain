import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Star, Share2, ArrowLeft } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const addToCart = useStore((state) => state.addToCart);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const d = await getDoc(doc(db, 'products', id));
        if (d.exists()) {
          setProduct({ id: d.id, ...d.data() });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="py-20 text-center">Loading...</div>;
  if (!product) return <div className="py-20 text-center">Product not found.</div>;

  const handleAdd = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: qty,
      image: product.images?.[0] || ''
    });
    navigate('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors">
        <ArrowLeft className={`w-5 h-5 mr-2 ${i18n.language === 'ar' ? 'rotate-180 ml-2 mr-0' : ''}`} />
        Back
      </button>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col md:flex-row mb-12">
        <div className="md:w-1/2 p-8 lg:p-12 bg-gray-50 flex items-center justify-center">
          <motion.img 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80'} 
            alt={product.name} 
            className="w-full max-w-md rounded-2xl shadow-xl"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <div className="flex items-center space-x-2 text-sm text-blue-600 font-semibold uppercase tracking-wider mb-4">
            <span>{t(product.category.toLowerCase() as any) || product.category}</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center text-yellow-500">
              <Star className="w-5 h-5 fill-current" />
              <span className="ml-1 rtl:mr-1 font-bold text-gray-700">{product.averageRating?.toFixed(1) || '0.0'}</span>
            </div>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500 text-sm">{product.reviewCount || 0} Reviews</span>
          </div>

          <p className="text-3xl font-extrabold text-gray-900 mb-6">${product.price}</p>
          
          <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>
          
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">Quantity (Liters)</span>
              <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {product.stock > 0 ? t('stockLeft', { count: product.stock }) : t('outOfStock')}
              </span>
            </div>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button 
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                  disabled={product.stock <= 0}
                >-</button>
                <div className="w-12 text-center font-medium">{qty}</div>
                <button 
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                  disabled={product.stock <= 0}
                >+</button>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 rtl:space-x-reverse">
            <button 
              onClick={handleAdd}
              disabled={product.stock <= 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl font-bold flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
              {t('addToCart')}
            </button>
            <button className="p-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section Placeholder */}
      <div className="bg-white rounded-3xl p-8 lg:p-12 border border-gray-100 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
        <div className="text-gray-500 text-center py-10">
          Reviews are currently being integrated. Check back soon for updates!
        </div>
      </div>
    </div>
  );
}
