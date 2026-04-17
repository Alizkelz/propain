import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy, where, serverTimestamp, addDoc, updateDoc, doc } from 'firebase/firestore';
import { Send, User, MessageSquare } from 'lucide-react';

export default function ChatAdmin() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'chatSessions'), orderBy('updatedAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      let sess: any[] = [];
      snap.forEach(d => sess.push({ id: d.id, ...d.data() }));
      setSessions(sess);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!activeSession) {
      setMessages([]);
      return;
    }
    const q = query(collection(db, 'messages'), where('sessionId', '==', activeSession), orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      let msgs: any[] = [];
      snap.forEach(d => msgs.push({ id: d.id, ...d.data() }));
      setMessages(msgs);
    });
    
    // reset unread
    updateDoc(doc(db, 'chatSessions', activeSession), { unreadCountAdmin: 0 });
    
    return unsub;
  }, [activeSession]);

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || !activeSession) return;
    
    const text = input;
    setInput('');
    
    await addDoc(collection(db, 'messages'), {
      sessionId: activeSession,
      sender: 'admin',
      text,
      createdAt: serverTimestamp()
    });
    
    await updateDoc(doc(db, 'chatSessions', activeSession), {
      lastMessage: text,
      updatedAt: serverTimestamp(),
      unreadCountCustomer: 1
    });
  };

  return (
    <div className="h-[calc(100vh-10rem)] bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 flex overflow-hidden">
      {/* Session List */}
      <div className="w-1/3 border-r border-slate-200 dark:border-slate-700 flex flex-col h-full bg-slate-50 dark:bg-slate-800/50">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">Conversations</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sessions.map(s => (
            <button 
              key={s.id}
              onClick={() => setActiveSession(s.id)}
              className={`w-full text-left p-6 border-b border-slate-100 dark:border-slate-700/50 transition flex items-center ${activeSession === s.id ? 'bg-amber-50 dark:bg-amber-900/10 border-l-4 border-l-amber-500 border-b-slate-100 dark:border-b-slate-700/50' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 shadow-sm font-bold ${activeSession === s.id ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-500' : 'bg-white text-slate-400 dark:bg-slate-700 border border-slate-200 dark:border-slate-600'}`}>
                 <User className="w-5 h-5" />
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center mb-1">
                  <h3 className={`font-bold truncate text-lg ${s.unreadCountAdmin > 0 && activeSession !== s.id ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                    {s.customerName}
                  </h3>
                  {s.unreadCountAdmin > 0 && activeSession !== s.id && (
                    <span className="bg-amber-500 text-slate-900 text-[10px] uppercase tracking-wider font-black px-2 py-0.5 rounded-full shadow-sm">New</span>
                  )}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{s.lastMessage}</p>
              </div>
            </button>
          ))}
          {sessions.length === 0 && <div className="p-12 text-center text-slate-400 dark:text-slate-500 font-medium">No active chats.</div>}
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-2/3 flex flex-col h-full bg-white dark:bg-slate-800">
        {activeSession ? (
          <>
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 flex items-center justify-center mr-4 border border-amber-200 dark:border-amber-800/50">
                    <User className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white capitalize">{sessions.find(s => s.id === activeSession)?.customerName}</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900/20">
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-4 rounded-2xl shadow-sm leading-relaxed ${m.sender === 'admin' ? 'bg-amber-500 text-slate-900 rounded-br-sm font-medium' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-sm'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
              <form onSubmit={sendMessage} className="flex space-x-3 rtl:space-x-reverse">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..." 
                  className="flex-1 px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-slate-800 dark:text-white transition-all shadow-inner"
                />
                <button type="submit" disabled={!input.trim()} className="px-8 py-4 bg-amber-500 text-slate-900 font-bold rounded-2xl hover:bg-amber-400 disabled:opacity-50 transition-all shadow-lg shadow-amber-500/20 active:scale-95 flex items-center">
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 p-6 text-center">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                <MessageSquare className="w-10 h-10 opacity-50" />
            </div>
            <h3 className="text-xl font-bold text-slate-600 dark:text-slate-300 mb-2">No Conversation Selected</h3>
            <p className="max-w-xs">Select a conversation from the sidebar to view messages and respond to customers.</p>
          </div>
        )}
      </div>
    </div>
  );
}
