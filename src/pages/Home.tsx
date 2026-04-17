import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Paintbrush, Star, Search, Shield, Leaf, Droplet, ArrowRight, PaintBucket, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const { t, i18n } = useTranslation();
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

  const trendingProducts = products.filter(p => p.isTrending);
  const displayProducts = filteredProducts;

  return (
    <div className="flex flex-col">
      {/* Premium Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1562184552-997c461abbe6?auto=format&fit=crop&q=80" 
            alt="Premium Interior" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/40 dark:from-slate-950/95 dark:to-slate-950/70"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-amber-400 px-4 py-2 rounded-full mb-6">
              <Award className="w-4 h-4" />
              <span className="text-sm font-bold tracking-wide uppercase">Award-winning quality</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 font-serif leading-tight">
              Masterpieces <br/><span className="text-amber-400 italic">in Every Stroke.</span>
            </h1>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed font-light">
              Elevate your spaces with our premium selection of highly durable, flawlessly finished professional paints.
            </p>
            <button 
              onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-4 px-8 rounded-2xl text-lg transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                  Explore Collection
                  <ArrowRight className="ml-2 w-5 h-5 rtl:mr-2 rtl:ml-0 rtl:rotate-180 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Icons Component */}
      <section className="py-20 bg-white dark:bg-slate-900 z-10 relative -mt-10 mx-4 sm:mx-8 lg:mx-auto max-w-7xl rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-10">
          {[
            { icon: Shield, title: "Maximum Durability", desc: "Formulated to outlast harsh conditions." },
            { icon: Leaf, title: "Eco Friendly", desc: "Low VOCs to keep your indoor air safe." },
            { icon: Droplet, title: "Waterproof Shield", desc: "Ultimate protection from moisture." }
          ].map((feat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                <feat.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 font-serif">{feat.title}</h3>
              <p className="text-slate-600 dark:text-slate-400">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section id="products-section" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white font-serif mb-4">
              Our Collection
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl text-lg">
              Find the perfect shade and finish for your next project. 
            </p>
          </div>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder={t('search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 rtl:pr-10 rtl:pl-4 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none dark:text-white shadow-sm transition-all"
              />
              <Search className="absolute left-4 rtl:right-4 rtl:left-auto top-3.5 h-5 w-5 text-slate-400" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
              {['all', 'interior', 'exterior', 'waterproof', 'premium'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-5 py-3 rounded-full whitespace-nowrap text-sm font-bold transition-all shadow-sm ${
                    category === cat 
                      ? 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-900 shadow-lg scale-105' 
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {cat === 'all' ? t('allCategories') : t(cat as any)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayProducts.map((product, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: (i % 4) * 0.1 }}
              key={product.id}
            >
              <Link to={`/product/${product.id}`} className="group block bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-2xl dark:hover:shadow-amber-500/10 transition-all duration-500 hover:-translate-y-2">
                <div className="aspect-[4/5] bg-slate-100 dark:bg-slate-900 relative overflow-hidden">
                  {product.images && product.images[0] ? (
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-700">
                      <PaintBucket className="w-16 h-16 mb-2" />
                    </div>
                  )}
                  {/* Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-6 pb-6 flex flex-col justify-end">
                     <span className="text-white font-bold tracking-wider flex items-center">View Details <ArrowRight className="ml-2 w-4 h-4 rtl:mr-2 rtl:rotate-180"/></span>
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 rtl:right-4 rtl:left-auto flex flex-col gap-2">
                    {product.isTrending && (
                      <span className="bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">Trending</span>
                    )}
                    {product.isRecommended && (
                      <span className="bg-blue-500 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">Recommended</span>
                    )}
                  </div>

                  {product.stock <= 0 && (
                    <div className="absolute top-4 right-4 rtl:left-4 rtl:right-auto bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">
                      {t('outOfStock')}
                    </div>
                  )}
                </div>
                <div className="p-6 relative">
                  <div className="absolute -top-6 right-6 rtl:left-6 rtl:right-auto bg-white dark:bg-slate-800 rounded-full p-2 shadow-lg flex items-center">
                     <div className="flex items-center text-amber-400 bg-amber-50 dark:bg-slate-900 px-2 py-1 rounded-full text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-current mr-1 rtl:ml-1" />
                      <span>{product.averageRating?.toFixed(1) || '0.0'}</span>
                    </div>
                  </div>
                  
                  <span className="text-xs font-bold text-amber-500 dark:text-amber-400 uppercase tracking-widest block mb-2">{t(product.category.toLowerCase() as any) || product.category}</span>
                  <h3 className="font-bold text-xl text-slate-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors mb-2 line-clamp-1 font-serif">{product.name}</h3>
                  <p className="font-light text-slate-500 dark:text-slate-400 line-clamp-2 text-sm mb-4">{product.description}</p>
                  
                  <div className="flex items-end justify-between mt-4">
                     <p className="text-2xl font-black text-slate-900 dark:text-white">${product.price}<span className="text-sm font-medium text-slate-400">/L</span></p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        {displayProducts.length === 0 && (
          <div className="text-center py-20 text-slate-500 dark:text-slate-400 text-lg">
            No products found matching your search.
          </div>
        )}
      </section>

      {/* Before and After Section */}
      <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500 via-slate-900 to-slate-900"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6">See The Difference</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">One coat is all it takes to completely revive your environment.</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-stretch h-[400px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex-1 relative group overflow-hidden">
               <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80" alt="Before" className="w-full h-full object-cover filter grayscale group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute inset-0 bg-black/40"></div>
               <div className="absolute bottom-8 left-8 bg-slate-900/80 backdrop-blur-md px-6 py-2 rounded-full font-bold tracking-widest uppercase border border-slate-700">Before</div>
            </div>
            <div className="flex-1 relative group overflow-hidden">
               <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80" alt="After" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute inset-0 bg-amber-500/10"></div>
               <div className="absolute bottom-8 left-8 bg-amber-500 text-slate-900 px-6 py-2 rounded-full font-bold tracking-widest uppercase shadow-lg shadow-amber-500/20">After</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white font-serif mb-4">Trusted by Professionals</h2>
              <p className="text-slate-500 dark:text-slate-400">Hear from contractors and homeowners who choose ProPaint.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Ahmed C.", role: "Interior Designer", text: "The coverage and color consistency are completely unmatched. It makes my projects look incredibly high-end." },
                { name: "Sarah L.", role: "Homeowner", text: "Transformed my living room in one weekend. The paint was smooth, lacked any harsh smell, and dried beautifully." },
                { name: "Hassan R.", role: "Lead Contractor", text: "We exclusively specify ProPaint for all our exterior jobs. The weather resistance holds up perfectly over the years." }
              ].map((test, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                   <div className="flex text-amber-400 mb-6">
                      {[1,2,3,4,5].map(s => <Star key={s} className="w-5 h-5 fill-current" />)}
                   </div>
                   <p className="text-slate-600 dark:text-slate-300 text-lg mb-8 leading-relaxed font-light italic">"{test.text}"</p>
                   <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-lg">{test.name}</h4>
                      <p className="text-slate-400 text-sm font-medium">{test.role}</p>
                   </div>
                </div>
              ))}
            </div>
         </div>
      </section>
    </div>
  );
}
