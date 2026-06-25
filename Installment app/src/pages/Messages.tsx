import React, { useState, useEffect } from 'react';
import { mockDb } from '../lib/supabaseClient';
import { Card, Button, Badge } from '../components/ui';
import { Send, Users, ShieldAlert, Sparkles, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface MessagesProps {
  user: any;
}

export const Messages: React.FC<MessagesProps> = ({ user }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [threads, setThreads] = useState<any[]>([]);
  const [selectedThreadUser, setSelectedThreadUser] = useState<any | null>(null);
  const [inputText, setInputText] = useState('');
  
  const loadMessages = async () => {
    try {
      const msgs = await mockDb.getTable('messages');
      const profiles = await mockDb.getTable('profiles');

      if (user.role === 'admin') {
        // Group by user who sent/received messages to see threads
        const clientThreads = profiles.filter((p: any) => p.role !== 'admin');
        setThreads(clientThreads);
        if (clientThreads.length > 0 && !selectedThreadUser) {
          setSelectedThreadUser(clientThreads[0]);
        }
      } else {
        // Find admin to chat
        const admin = profiles.find((p: any) => p.role === 'admin');
        setSelectedThreadUser(admin || { id: 'admin-id-1', full_name: 'Support Representative' });
      }

      setMessages(msgs);
    } catch (e) {
      console.error("Failed to load messages.");
    }
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 5000); // Poll messages every 5 seconds for simulated chat
    return () => clearInterval(interval);
  }, [user, selectedThreadUser]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedThreadUser) return;

    const newMessage = {
      sender_id: user.id,
      receiver_id: selectedThreadUser.id,
      content: inputText,
      is_read: false
    };

    try {
      await mockDb.insert('messages', newMessage);
      setInputText('');
      loadMessages();

      // Trigger instant mock reply if customer chatting with admin support
      if (user.role !== 'admin') {
        setTimeout(async () => {
          await mockDb.insert('messages', {
            sender_id: selectedThreadUser.id,
            receiver_id: user.id,
            content: `Hi ${user.full_name}, thank you for contacting EasyInstall credit verification support. We have received your query and one of our manual validation experts is looking into it.`,
            is_read: false
          });
          loadMessages();
        }, 2000);
      }
    } catch {
      toast.error("Failed to send message.");
    }
  };

  const filteredMessages = messages.filter((m: any) => 
    (m.sender_id === user.id && m.receiver_id === selectedThreadUser?.id) ||
    (m.sender_id === selectedThreadUser?.id && m.receiver_id === user.id)
  );

  return (
    <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
      <Card className="flex flex-col md:flex-row bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow-xl overflow-hidden min-h-[600px] p-0">
        
        {/* Thread list for admin */}
        {user.role === 'admin' && (
          <div className="w-full md:w-80 border-r border-slate-200 dark:border-slate-800 p-4 space-y-4 shrink-0 bg-slate-50/50 dark:bg-slate-950/20">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-extrabold text-base text-foreground">Active Chat Threads</h3>
            </div>
            
            <div className="space-y-1.5 overflow-y-auto max-h-[480px]">
              {threads.map((tUser) => {
                const isActive = selectedThreadUser?.id === tUser.id;
                return (
                  <button
                    key={tUser.id}
                    onClick={() => setSelectedThreadUser(tUser)}
                    className={`w-full text-left p-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-650/15'
                        : 'text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-foreground'
                    }`}
                  >
                    <p className="font-bold">{tUser.full_name}</p>
                    <p className={`text-[10px] mt-0.5 capitalize ${isActive ? 'text-indigo-200' : 'text-muted-foreground'}`}>
                      {tUser.role} | {tUser.phone}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Main chat window */}
        <div className="flex-1 flex flex-col h-[600px]">
          {selectedThreadUser ? (
            <>
              {/* Header info */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-foreground">{selectedThreadUser.full_name}</h4>
                  <p className="text-xs text-muted-foreground capitalize">{selectedThreadUser.role || 'Support Representative'}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Online</span>
                </div>
              </div>

              {/* Bubble list */}
              <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/20">
                {filteredMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-2 pt-8">
                    <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400 opacity-60 animate-bounce" />
                    <p className="text-xs text-muted-foreground">No messages. Say hello to start the chat support thread!</p>
                  </div>
                ) : (
                  filteredMessages.map((msg: any) => {
                    const isMe = msg.sender_id === user.id;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-3.5 rounded-2xl text-sm ${
                          isMe
                            ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-650/15'
                            : 'bg-white dark:bg-slate-800 text-foreground border border-slate-200/50 dark:border-slate-700/80 rounded-bl-none shadow-sm'
                        }`}>
                          <p className="leading-relaxed">{msg.content}</p>
                          <span className={`block text-[9px] mt-1 text-right font-semibold ${isMe ? 'text-indigo-200' : 'text-muted-foreground'}`}>
                            {msg.created_at?.split('T')[1]?.substring(0,5) || 'Now'}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Input field */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 dark:border-slate-800 flex space-x-2 bg-slate-50 dark:bg-slate-950">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 p-3 border border-slate-200 dark:border-slate-800 bg-card rounded-xl text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                />
                <Button
                  type="submit"
                  icon={<Send className="w-4 h-4" />}
                >
                  Send
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground space-y-2">
              <Users className="w-10 h-10 opacity-40" />
              <p className="text-sm">Select a client thread to start chatting.</p>
            </div>
          )}
        </div>

      </Card>
    </div>
  );
};
