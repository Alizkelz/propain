import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Star, Share2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const addToCart = useStore((state) => state.addToCart);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const d = await getDoc(doc(db, 'products', id));
        if (d.exists()) {
          const data = { id: d.id, ...d.data() } as any;
          setProduct(data);
          if (data.colors && data.colors.length > 0) {
            setSelectedColor(data.colors[0]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="py-20 text-center dark:text-slate-400">Loading...</div>;
  if (!product) return <div className="py-20 text-center dark:text-slate-400">Product not found.</div>;

  const handleAdd = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: qty,
      image: product.images?.[0] || '',
      color: selectedColor || undefined
    });
    navigate('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-32">
      <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-amber-500 font-bold mb-8 transition-colors group">
        <ArrowLeft className={`w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform ${i18n.language === 'ar' ? 'rotate-180' : ''}`} />
        {t('backToProducts')}
      </button>

      <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row mb-12">
        <div className="md:w-1/2 p-8 lg:p-12 bg-slate-50 dark:bg-slate-800 flex items-center justify-center relative">
          <motion.img 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80'} 
            alt={product.name} 
            className="w-full max-w-md rounded-2xl shadow-2xl z-10"
            referrerPolicy="no-referrer"
          />
          {/* Decorative backdrop */}
          <div className="absolute inset-0 z-0 opacity-20 dark:opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500 via-transparent to-transparent blur-3xl"></div>
          
          {product.isTrending && (
             <div className="absolute top-8 left-8 rtl:right-8 rtl:left-auto bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg z-20">Trending</div>
          )}
        </div>
        
        <div className="md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <div className="flex items-center space-x-2 text-sm text-amber-500 dark:text-amber-400 font-bold uppercase tracking-widest mb-4">
            <span>{t(product.category.toLowerCase() as any) || product.category}</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white font-serif mb-4 leading-tight">{product.name}</h1>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center text-amber-400">
              <Star className="w-5 h-5 fill-current" />
              <span className="ml-1 rtl:mr-1 font-bold text-slate-700 dark:text-slate-300">{product.averageRating?.toFixed(1) || '0.0'}</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">{product.reviewCount || 0} Reviews</span>
          </div>

          <div className="flex items-end mb-8">
             <p className="text-4xl font-extrabold text-slate-900 dark:text-white">${product.price}</p>
             <span className="text-lg text-slate-500 mb-1 ml-1 rtl:mr-1 font-medium">/ Liter</span>
          </div>
          
          <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed font-light text-lg">{product.description}</p>
          
          {/* Color Previews */}
          {product.colors && product.colors.length > 0 && (
             <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Available Colors</h3>
                <div className="flex flex-wrap gap-4">
                   {product.colors.map((color: string, i: number) => (
                      <button
                         key={i}
                         onClick={() => setSelectedColor(color)}
                         className={`w-12 h-12 rounded-full cursor-pointer shadow-md relative transition-all hover:scale-110 ${selectedColor === color ? 'ring-4 ring-offset-4 ring-amber-500 dark:ring-offset-slate-900 scale-110' : 'border border-slate-200 dark:border-slate-700'}`}
                         style={{ backgroundColor: color }}
                         title={color}
                      >
                         {selectedColor === color && (
                            <CheckCircle2 className="w-6 h-6 absolute inset-0 m-auto text-white drop-shadow-md mix-blend-difference" />
                         )}
                      </button>
                   ))}
                </div>
             </div>
          )}

          <div className="mb-10">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">Quantity</span>
              <span className={`text-sm font-bold tracking-wide ${product.stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                {product.stock > 0 ? t('stockLeft', { count: product.stock }) : t('outOfStock')}
              </span>
            </div>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 p-1">
                <button 
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-4 py-3 text-slate-600 hover:text-amber-500 dark:text-slate-400 dark:hover:text-amber-400 rounded-lg transition-colors"
                  disabled={product.stock <= 0}
                >-</button>
                <div className="w-16 text-center font-bold text-lg text-slate-900 dark:text-white">{qty}</div>
                <button 
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  className="px-4 py-3 text-slate-600 hover:text-amber-500 dark:text-slate-400 dark:hover:text-amber-400 rounded-lg transition-colors"
                  disabled={product.stock <= 0}
                >+</button>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 rtl:space-x-reverse">
            <button 
              onClick={handleAdd}
              disabled={product.stock <= 0}
              className={`flex-1 py-4 px-6 rounded-xl font-bold flex items-center justify-center transition-all shadow-lg overflow-hidden relative group ${product.stock > 0 ? 'bg-amber-500 hover:bg-amber-400 text-slate-900 active:scale-95 shadow-amber-500/20' : 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600 shadow-none'}`}
            >
              <span className="relative z-10 flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0 group-hover:scale-110 transition-transform" />
                  {t('addToCart')}
              </span>
              {product.stock > 0 && <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>}
            </button>
            <button className="p-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition-colors border border-slate-200 dark:border-slate-700 active:scale-95">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section Placeholder */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 lg:p-12 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-slate-950/20">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 font-serif">Customer Reviews</h2>
        <div className="text-slate-500 dark:text-slate-400 text-center py-16 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 border-dashed">
          <Star className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <p className="font-medium text-lg">Reviews are currently being integrated. Check back soon for updates!</p>
        </div>
      </div>
    </div>
  );
}
