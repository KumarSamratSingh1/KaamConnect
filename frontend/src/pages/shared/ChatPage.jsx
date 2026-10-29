import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Send, MessageCircle, ShieldCheck, User } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import { setConversations, setActiveConversation, setMessages, addMessage } from '../../store/slices/chatSlice';
import { getInitials, timeAgo } from '../../utils/helpers';
import api from '../../utils/api';
import { getSocket, initSocket } from '../../utils/socket';

export default function ChatPage() {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const { conversations, activeConversation, messages } = useSelector(s => s.chat);
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) initSocket(token);
    api.get('/chat/conversations').then(r => dispatch(setConversations(r.data.data)));
  }, [dispatch]);

  useEffect(() => {
    if (!activeConversation) return;
    api.get(`/chat/messages/${activeConversation._id}`).then(r => {
      dispatch(setMessages({ convId: activeConversation._id, messages: r.data.data.messages }));
    });
    const socket = getSocket();
    if (socket) {
      socket.emit('join_conversation', activeConversation._id);
      socket.on('new_message', msg => dispatch(addMessage({ convId: activeConversation._id, message: msg })));
    }
    return () => {
      const s = getSocket();
      if (s) s.emit('leave_conversation', activeConversation._id);
    };
  }, [activeConversation, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeConversation]);

  const sendMessage = async () => {
    if (!text.trim() || !activeConversation) return;
    const msg = text;
    setText('');
    await api.post('/chat/message', { conversationId: activeConversation._id, content: msg });
  };

  const convMessages = activeConversation ? (messages[activeConversation._id] || []) : [];

  return (
    <div className="h-screen bg-[#FAF8F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col overflow-hidden">
      <Navbar />

      <div className="flex flex-1 overflow-hidden page-container py-4 gap-4">
        
        {/* Left Conversations Sidebar */}
        <div className="w-80 shrink-0 card overflow-hidden flex flex-col border border-stone-200/80 dark:border-stone-800 shadow-sm">
          <div className="p-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 flex items-center justify-between">
            <h2 className="font-extrabold text-base tracking-tight text-stone-900 dark:text-white">
              Direct Messages
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
              {conversations.length} Active
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800/60">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-stone-400 text-xs text-center px-4">
                <MessageCircle size={24} className="mb-2 opacity-40 text-emerald-600" />
                <p className="font-semibold text-stone-600 dark:text-stone-300">No active conversations</p>
                <p className="text-[11px] mt-0.5">Direct messages appear here when you book or contact a helper.</p>
              </div>
            ) : (
              conversations.map(conv => {
                const other = conv.participants?.find(p => p._id !== user?._id);
                const isActive = activeConversation?._id === conv._id;
                return (
                  <button
                    key={conv._id}
                    onClick={() => dispatch(setActiveConversation(conv))}
                    className={`w-full flex items-center gap-3 p-4 transition-colors text-left ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/70 border-l-4 border-l-emerald-600'
                        : 'hover:bg-stone-50 dark:hover:bg-stone-800/60'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-xs font-extrabold text-emerald-800 dark:text-emerald-300 shrink-0">
                      {getInitials(other?.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <p className="font-bold text-xs sm:text-sm text-stone-900 dark:text-white truncate">
                          {other?.name || 'Helper'}
                        </p>
                      </div>
                      <p className="text-xs text-stone-400 truncate">
                        {conv.lastMessage?.content || 'Tap to chat...'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Active Conversation Stage */}
        <div className="flex-1 card overflow-hidden flex flex-col border border-stone-200/80 dark:border-stone-800 shadow-sm">
          {!activeConversation ? (
            <div className="flex flex-col items-center justify-center h-full text-stone-400 p-8 text-center">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 mb-3 shadow-inner">
                <MessageCircle size={32} />
              </div>
              <p className="text-base font-extrabold text-stone-800 dark:text-stone-200">Select a Conversation</p>
              <p className="text-xs text-stone-400 max-w-xs mt-1">
                Chat securely with your assigned domestic professional to discuss requirements, schedules, and timing.
              </p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-900/50">
                {(() => {
                  const other = activeConversation.participants?.find(p => p._id !== user?._id);
                  return (
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-xs font-extrabold text-emerald-800 dark:text-emerald-300">
                        {getInitials(other?.name)}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-stone-900 dark:text-white">{other?.name}</p>
                        <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Verified Member
                        </span>
                      </div>
                    </div>
                  );
                })()}

                <div className="flex items-center gap-2 text-xs text-stone-400">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span className="hidden sm:inline">Protected Chat</span>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF8F5]/40 dark:bg-stone-950/40">
                {convMessages.map((msg, i) => {
                  const isMe = msg.sender?._id === user?._id || msg.sender === user?._id;
                  return (
                    <motion.div
                      key={msg._id || i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs sm:max-w-md px-4 py-2.5 rounded-2xl text-xs sm:text-sm ${
                          isMe
                            ? 'bg-emerald-600 text-white rounded-br-none shadow-sm'
                            : 'bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700 text-stone-800 dark:text-stone-100 rounded-bl-none shadow-sm'
                        }`}
                      >
                        <p className="leading-relaxed">{msg.content}</p>
                        <p
                          className={`text-[10px] mt-1 text-right ${
                            isMe ? 'text-emerald-100' : 'text-stone-400'
                          }`}
                        >
                          {timeAgo(msg.createdAt)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-3.5 border-t border-stone-100 dark:border-stone-800 flex gap-2.5 bg-white dark:bg-stone-900">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Type your message..."
                  className="input flex-1 text-xs sm:text-sm py-2"
                />
                <button
                  onClick={sendMessage}
                  disabled={!text.trim()}
                  className="btn-primary py-2 px-4 shadow-sm shrink-0"
                >
                  <Send size={15} />
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
