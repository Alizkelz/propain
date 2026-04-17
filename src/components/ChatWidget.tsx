import { useState, useEffect } from 'react';
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

  const startChat = async (e: React.FormEvent) => {
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

  const sendMessage = async (e: React.FormEvent) => {
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
        className={`fixed bottom-6 right-6 rtl:left-6 rtl:right-auto bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-transform ${isOpen ? 'scale-0' : 'scale-100'} z-50`}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 rtl:left-6 rtl:right-auto w-80 sm:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-gray-100 flex flex-col h-[500px] max-h-[80vh]"
          >
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white rounded-t-2xl">
              <h3 className="font-bold">Chat with us</h3>
              <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 bg-gray-50 flex flex-col p-4 overflow-y-auto">
              {!sessionId ? (
                <div className="flex-1 flex flex-col justify-center">
                  <div className="text-center mb-6">
                    <MessageCircle className="w-12 h-12 text-blue-300 mx-auto mb-2" />
                    <p className="text-gray-600">Please enter your name to start chatting.</p>
                  </div>
                  <form onSubmit={startChat} className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="Your Name" 
                      required
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                      Start Chat
                    </button>
                  </form>
                </div>
              ) : (
                <div className="flex-1 flex flex-col space-y-4">
                  {messages.map(m => (
                    <div key={m.id} className={`flex ${m.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-2xl ${m.sender === 'customer' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-900 rounded-bl-none'}`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {messages.length === 0 && <p className="text-center text-gray-400 mt-10">Say hi!</p>}
                </div>
              )}
            </div>

            {sessionId && (
              <form onSubmit={sendMessage} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Type a message..." 
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" disabled={!input.trim()} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition">
                  <Send className="w-5 h-5 ml-1" />
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
