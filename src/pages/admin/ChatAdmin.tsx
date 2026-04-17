import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy, where, serverTimestamp, addDoc, updateDoc, doc } from 'firebase/firestore';
import { Send, User } from 'lucide-react';

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

  const sendMessage = async (e: React.FormEvent) => {
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
    <div className="h-[calc(100vh-10rem)] bg-white rounded-xl shadow-sm border border-gray-100 flex overflow-hidden">
      {/* Session List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col h-full bg-gray-50">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Conversations</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sessions.map(s => (
            <button 
              key={s.id}
              onClick={() => setActiveSession(s.id)}
              className={`w-full text-left p-4 border-b border-gray-100 transition hover:bg-gray-100 flex items-center ${activeSession === s.id ? 'bg-blue-50 hover:bg-blue-50' : ''}`}
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mr-3">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center mb-1">
                  <h3 className={`font-semibold truncate ${s.unreadCountAdmin > 0 && activeSession !== s.id ? 'text-gray-900 font-bold' : 'text-gray-700'}`}>
                    {s.customerName}
                  </h3>
                  {s.unreadCountAdmin > 0 && activeSession !== s.id && (
                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">New</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate">{s.lastMessage}</p>
              </div>
            </button>
          ))}
          {sessions.length === 0 && <div className="p-6 text-center text-gray-400">No chats yet.</div>}
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-2/3 flex flex-col h-full bg-white">
        {activeSession ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-white">
              <h3 className="font-bold text-lg">{sessions.find(s => s.id === activeSession)?.customerName}</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3 rounded-2xl ${m.sender === 'admin' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border text-gray-900 rounded-bl-none'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-white border-t border-gray-200">
              <form onSubmit={sendMessage} className="flex space-x-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..." 
                  className="flex-1 px-4 py-3 bg-gray-100 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
                <button type="submit" disabled={!input.trim()} className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition">
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 p-6 text-center">
            Select a conversation from the sidebar to view messages.
          </div>
        )}
      </div>
    </div>
  );
}
