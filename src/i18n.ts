import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  ar: {
    translation: {
      "home": "الرئيسية",
      "products": "المنتجات",
      "cart": "الطلب & عرض السعر",
      "loginADMIN": "دخول الإدارة",
      "adminDashboard": "لوحة القيادة",
      "manageProducts": "إدارة المنتجات",
      "orders": "الطلبات",
      "chat": "المحادثات",
      "settings": "الإعدادات",
      "search": "بحث...",
      "allCategories": "كل الأقسام",
      "interior": "داخلي",
      "exterior": "خارجي",
      "waterproof": "مقاوم للماء",
      "premium": "ممتاز",
      "addToCart": "أضف للطلب",
      "outOfStock": "نفذت الكمية",
      "inStock": "متوفر",
      "stockLeft": "المتبقي: {{count}} لتر",
      "sendOrder": "إرسال الطلب",
      "name": "الاسم",
      "phone": "رقم الهاتف",
      "email": "البريد الإلكتروني",
      "emptyCart": "سلة الطلبات فارغة",
      "price": "السعر",
      "logout": "تسجيل الخروج",
      "total": "المجموع",
      "requestQuote": "طلب عرض سعر"
    }
  },
  fr: {
    translation: {
      "home": "Accueil",
      "products": "Produits",
      "cart": "Devis",
      "loginADMIN": "Connexion Admin",
      "adminDashboard": "Tableau de Bord",
      "manageProducts": "Gérer les Produits",
      "orders": "Commandes",
      "chat": "Discussions",
      "settings": "Paramètres",
      "search": "Rechercher...",
      "allCategories": "Toutes Catégories",
      "interior": "Intérieur",
      "exterior": "Extérieur",
      "waterproof": "Étanche",
      "premium": "Premium",
      "addToCart": "Ajouter au devis",
      "outOfStock": "Rupture de Stock",
      "inStock": "En Stock",
      "stockLeft": "Reste: {{count}} L",
      "sendOrder": "Envoyer la demande",
      "name": "Nom",
      "phone": "Téléphone",
      "email": "E-mail",
      "emptyCart": "Votre liste est vide",
      "price": "Prix",
      "logout": "Déconnexion",
      "total": "Total",
      "requestQuote": "Demander un Devis"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
