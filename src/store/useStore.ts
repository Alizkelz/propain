import { create } from 'zustand';

interface CartItem {
  id: string; // product id
  name: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
}

interface StoreState {
  cart: CartItem[];
  darkMode: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleDarkMode: () => void;
}

export const useStore = create<StoreState>((set) => ({
  cart: [],
  darkMode: false,
  addToCart: (item) => set((state) => {
    const existing = state.cart.find((i) => i.id === item.id);
    if (existing) {
      return {
        cart: state.cart.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i)
      };
    }
    return { cart: [...state.cart, item] };
  }),
  removeFromCart: (id) => set((state) => ({
    cart: state.cart.filter((i) => i.id !== id)
  })),
  clearCart: () => set({ cart: [] }),
  toggleDarkMode: () => set((state) => {
    const newDark = !state.darkMode;
    if (newDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { darkMode: newDark };
  })
}));
