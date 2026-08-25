"use client";

import { useState, useEffect, useRef } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Search, Send, User, MessageCircle, Loader2, Paperclip, X, Image as ImageIcon } from "lucide-react";
import { webApi } from "@/lib/api";

type ConversationUser = {
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
  last_message: {
    id: number;
    content: string;
    created_at: string;
  } | null;
  unread_count: number;
};

type ChatMessage = {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string | null;
  images: string[] | null;
  created_at: string;
  is_read: boolean;
};

export default function MessagesPage() {
  const [conversations, setConversations] = useState<ConversationUser[]>([]);
  const [activeUser, setActiveUser] = useState<ConversationUser['user'] | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeUser) {
      fetchMessages(activeUser.id);
      // Mark as read when opening chat
      webApi.post(`/messages/${activeUser.id}/read`).catch(console.error);
    }
  }, [activeUser]);

  useEffect(() => {
    // Scroll to bottom when messages update
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const data = await webApi.get("/messages/conversations");
      setConversations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId: number) => {
    if (!chatLoading) setChatLoading(true);
    try {
      const data = await webApi.get(`/messages/${userId}`);
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setChatLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (selectedImages.length + filesArray.length > 5) {
        alert("You can only send up to 5 images per message.");
        return;
      }
      setSelectedImages((prev) => [...prev, ...filesArray]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if ((!inputText.trim() && selectedImages.length === 0) || !activeUser || isSending) return;
    
    setIsSending(true);
    const textToSend = inputText;
    const imagesToSend = [...selectedImages];
    
    setInputText("");
    setSelectedImages([]);
    
    try {
      let res;
      if (imagesToSend.length > 0) {
        const formData = new FormData();
        formData.append('sender_id', '22');
        formData.append('receiver_id', String(activeUser.id));
        if (textToSend.trim()) formData.append('content', textToSend);
        
        imagesToSend.forEach((img, index) => {
          formData.append(`images[${index}]`, img);
        });

        // Use standard fetch for FormData to avoid default JSON headers from webApi wrapper if it enforces it,
        // or if webApi supports FormData, just pass it. Let's assume standard fetch to be safe.
        const token = localStorage.getItem('token');
        const fetchRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          body: formData
        });
        
        if (!fetchRes.ok) throw new Error("Failed to send");
        res = { data: (await fetchRes.json()).data };
      } else {
        res = await webApi.post("/messages", {
          sender_id: 22,
          receiver_id: activeUser.id,
          content: textToSend,
        });
      }
      
      setMessages([...messages, res.data]);
    } catch (err) {
      console.error(err);
      setInputText(textToSend); // Restore if failed
      setSelectedImages(imagesToSend);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AdminShell>
      <div className="flex h-[calc(100vh-80px)] overflow-hidden pt-6 pb-6">
        
        {/* Left Sidebar - Conversations */}
        <div className="w-80 flex flex-col border border-border bg-card rounded-l-2xl shadow-sm">
          <div className="p-4 border-b border-border/50">
            <h2 className="font-bold text-white text-lg flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-purple-bright" />
              Messages
            </h2>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-2" />
              <input 
                type="text"
                placeholder="Search users..."
                className="w-full bg-bg-deep border border-border rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-purple-bright/50 transition-colors"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-purple-bright" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-2">
                No conversations yet.
              </div>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.user.id}
                  onClick={() => setActiveUser(c.user)}
                  className={`w-full flex items-start gap-3 p-4 border-b border-border/30 hover:bg-white/[0.02] transition-colors text-left ${activeUser?.id === c.user.id ? 'bg-purple-bright/10 border-l-2 border-l-purple-bright' : ''}`}
                >
                  <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-purple-soft to-purple-bright flex items-center justify-center text-white font-bold text-sm">
                    {c.user?.name?.substring(0, 2).toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-sm truncate ${activeUser?.id === c.user?.id ? 'text-white font-semibold' : c.unread_count > 0 ? 'text-white font-bold' : 'text-white/80 font-medium'}`}>
                        {c.user?.name || "Unknown User"}
                      </span>
                      {c.last_message && (
                        <span className="text-[10px] text-muted-2">
                          {new Date(c.last_message.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-2 truncate pr-2">
                      {c.last_message ? c.last_message.content : "Start a conversation"}
                    </p>
                  </div>
                  {c.unread_count > 0 && (
                    <div className="h-5 w-5 shrink-0 rounded-full bg-purple-bright flex items-center justify-center text-[10px] font-bold text-white">
                      {c.unread_count}
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Pane - Chat Window */}
        <div className="flex-1 flex flex-col border border-l-0 border-border bg-bg-deep rounded-r-2xl shadow-sm relative">
          {activeUser ? (
            <>
              {/* Chat Header */}
              <div className="h-16 border-b border-border bg-card/50 flex items-center px-6 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-purple-soft to-purple-bright flex items-center justify-center text-white font-bold text-[10px]">
                    {activeUser?.name?.substring(0, 2).toUpperCase() || "U"}
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white">
                      {activeUser?.name || "Unknown User"}
                    </h2>
                    <p className="text-xs text-muted-2">{activeUser.email}</p>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatLoading ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="h-6 w-6 animate-spin text-purple-bright" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <MessageCircle className="h-8 w-8 text-muted-2 mx-auto mb-3 opacity-50" />
                      <p className="text-sm text-muted-2">No messages yet. Send a message to start the chat.</p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => {
                    // If the sender is the active user we're chatting with, it's an incoming message.
                    // Otherwise, it's an outgoing message from the admin.
                    const isOutgoing = msg.sender_id !== activeUser.id;
                    return (
                      <div key={msg.id} className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'}`}>
                        <div 
                          className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
                            isOutgoing 
                              ? 'bg-purple-bright text-white rounded-tr-sm' 
                              : 'bg-card text-white border border-border rounded-tl-sm'
                          }`}
                        >
                          {msg.images && msg.images.length > 0 && (
                            <div className={`grid gap-2 mb-2 ${msg.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                              {msg.images.map((img, i) => (
                                <a key={i} href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000'}/${img}`} target="_blank" rel="noreferrer">
                                  <img 
                                    src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000'}/${img}`}
                                    alt="attachment" 
                                    className="rounded-lg max-h-48 object-cover w-full border border-white/10"
                                  />
                                </a>
                              ))}
                            </div>
                          )}
                          {msg.content && <p>{msg.content}</p>}
                          <p className={`text-[10px] mt-1 text-right ${isOutgoing ? 'text-white/70' : 'text-muted-2'}`}>
                            {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-card border-t border-border mt-auto">
                {selectedImages.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-4 p-3 bg-bg-deep rounded-xl border border-border/50">
                    {selectedImages.map((file, i) => (
                      <div key={i} className="relative group rounded-lg overflow-hidden border border-border h-16 w-16">
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt="preview" 
                          className="h-full w-full object-cover"
                        />
                        <button 
                          onClick={() => removeImage(i)}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="flex items-center gap-2"
                >
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-11 w-11 shrink-0 rounded-xl bg-bg-deep border border-border flex items-center justify-center text-muted-2 hover:text-purple-bright hover:border-purple-bright/30 transition-colors"
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-bg-deep border border-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-bright/50 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={(!inputText.trim() && selectedImages.length === 0) || isSending}
                    className="h-11 w-11 shrink-0 rounded-xl bg-purple-bright flex items-center justify-center text-white hover:bg-purple-bright/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5 -ml-1" />}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-col h-full items-center justify-center text-center p-8">
              <div className="h-16 w-16 rounded-full bg-card border border-border flex items-center justify-center mb-4">
                <MessageCircle className="h-8 w-8 text-muted-2" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Your Messages</h3>
              <p className="text-sm text-muted-2 max-w-sm">
                Select a conversation from the left sidebar to start chatting with your users.
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
