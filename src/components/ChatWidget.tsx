import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, getDocs, where, limit } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(localStorage.getItem('chatSessionId'));
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [customerName, setCustomerName] = useState('');

  useEffect(() => {
    if (!sessionId) return;
    const q = query(collection(db, 'messages'), where('sessionId', '==', sessionId), orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(q, (snapshot) => {
      let msgs: any[] = [];
      snapshot.forEach(doc => msgs.push({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });
    return unsub;
  }, [sessionId]);

  const startChat = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!customerName.trim()) return;
    
    // Create new session
    const docRef = await addDoc(collection(db, 'chatSessions'), {
      customerName,
      lastMessage: 'Chat started',
      unreadCountAdmin: 1,
      unreadCountCustomer: 0,
      updatedAt: serverTimestamp()
    });
    
    setSessionId(docRef.id);
    localStorage.setItem('chatSessionId', docRef.id);
  };

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || !sessionId) return;
    
    const text = input;
    setInput('');
    
    await addDoc(collection(db, 'messages'), {
      sessionId,
      sender: 'customer',
      text,
      createdAt: serverTimestamp()
    });
  };

  if (auth.currentUser) return null; // Admin doesn't need the frontend widget

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 rtl:left-6 rtl:right-auto bg-amber-500 text-slate-900 p-4 rounded-full shadow-2xl shadow-amber-500/30 hover:scale-110 active:scale-95 transition-all ${isOpen ? 'scale-0' : 'scale-100'} z-50`}
      >
        <MessageCircle className="w-7 h-7" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 rtl:left-6 rtl:right-auto w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-slate-950/20 overflow-hidden z-50 border border-slate-200 dark:border-slate-800 flex flex-col h-[500px] max-h-[80vh]"
          >
            <div className="bg-amber-500 p-4 flex justify-between items-center text-slate-900 rounded-t-3xl">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
                 <h3 className="font-bold tracking-wide">Live Support</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-amber-400 p-2 rounded-full transition-colors active:scale-95">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 bg-slate-50 dark:bg-slate-800 flex flex-col p-6 overflow-y-auto w-full">
              {!sessionId ? (
                <div className="flex-1 flex flex-col justify-center">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="w-8 h-8" />
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">Welcome to ProPaint! Please enter your name to start chatting with our experts.</p>
                  </div>
                  <form onSubmit={startChat} className="space-y-4">
                    <input 
                      type="text" 
                      placeholder="Your Full Name" 
                      required
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      className="w-full px-5 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none bg-white dark:bg-slate-900 dark:text-white transition-all shadow-sm"
                    />
                    <button type="submit" className="w-full bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-900 py-3 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-amber-400 transition shadow-lg active:scale-95">
                      Start Conversation
                    </button>
                  </form>
                </div>
              ) : (
                <div className="flex-1 flex flex-col space-y-4">
                  {messages.map(m => (
                    <div key={m.id} className={`flex ${m.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${m.sender === 'customer' ? 'bg-amber-500 text-slate-900 rounded-br-sm font-medium' : 'bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-sm'}`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {messages.length === 0 && <div className="flex-1 flex items-center justify-center"><p className="text-center text-slate-400 dark:text-slate-500 font-medium">Say hi to start the chat!</p></div>}
                </div>
              )}
            </div>

            {sessionId && (
              <form onSubmit={sendMessage} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Type a message..." 
                  className="flex-1 px-5 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 border border-transparent focus:border-amber-500/20 transition-all font-medium text-sm w-full"
                />
                <button type="submit" disabled={!input.trim()} className="p-3 bg-amber-500 text-slate-900 rounded-full hover:bg-amber-400 disabled:opacity-50 transition shadow-md active:scale-95 flex items-center justify-center shrink-0">
                  <Send className="w-5 h-5 rtl:mr-1 rtl:-ml-1" />
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
