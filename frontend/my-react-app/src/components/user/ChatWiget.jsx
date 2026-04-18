import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { sendChatMessage } from 'api/chatApi';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Chào bạn! Mình có thể tư vấn dòng laptop nào cho bạn hôm nay?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Tự động cuộn xuống tin nhắn mới nhất
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await sendChatMessage(userMsg);
      setMessages(prev => [...prev, { role: 'ai', text: res.data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Hệ thống AI đang bận, vui lòng thử lại sau!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1050 }}>
      {/* Nút bật/tắt chat */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="btn btn-primary rounded-circle shadow d-flex align-items-center justify-content-center"
          style={{ width: '60px', height: '60px' }}
        >
          <MessageCircle size={28} color="white" />
        </button>
      )}

      {/* Khung chat */}
      {isOpen && (
        <div className="card shadow-lg" style={{ width: '350px', height: '450px', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h6 className="mb-0 fw-bold">Trợ lý ảo AI</h6>
            <button className="btn btn-sm btn-primary text-white p-0" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>
          
          {/* Body chứa tin nhắn */}
          <div className="card-body bg-light overflow-auto p-3" style={{ flex: 1 }}>
            {messages.map((m, i) => (
              <div key={i} className={`d-flex mb-3 ${m.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                <div 
                  className={`p-2 rounded-3 shadow-sm ${m.role === 'user' ? 'bg-primary text-white' : 'bg-white text-dark border'}`} 
                  style={{ maxWidth: '85%', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}
                >
                  {m.text}
                </div>
              </div>
            ))}
{isLoading && (
              <div className="d-flex justify-content-start mb-3">
                <div className="p-2 rounded-3 bg-white text-dark border shadow-sm">
                  <Loader2 className="text-primary" style={{ animation: 'spin 1s linear infinite' }} size={18} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer chứa ô nhập text */}
          <div className="card-footer bg-white p-2 d-flex align-items-center">
            <input 
              type="text" 
              className="form-control border-0 shadow-none bg-light rounded-pill px-3" 
              placeholder="Nhập yêu cầu tư vấn..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
            />
            <button 
              className="btn text-primary ms-2 p-1" 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
            >
              <Send size={22} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;