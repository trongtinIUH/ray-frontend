/**
 * ChatPage - Trang Chat với AI
 * Giao diện hiện đại, font to, có hỗ trợ giọng nói
 * Mobile First, Elderly Friendly
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import VoiceButton from '../../components/common/VoiceButton';
import { chatService } from '../../services/chatService';
import useVoice from '../../hooks/useVoice';

const ChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { speak, stopSpeaking, isSpeaking } = useVoice();

  // State
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message
  const handleSend = useCallback(async (text = inputText) => {
    const messageText = typeof text === 'string' ? text.trim() : inputText.trim();
    if (!messageText || loading) return;

    setInputText('');

    const userMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: messageText,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await chatService.sendMessage(messageText);

      if (response.success && response.data) {
        const aiMessage = {
          id: response.data.messageId || `ai_${Date.now()}`,
          type: 'ai',
          content: response.data.aiResponse,
          intent: response.data.intent,
          keywords: response.data.keywords,
          relatedTopics: response.data.relatedTopics,
          timestamp: response.data.timestamp || new Date().toISOString()
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(response.message || 'Không nhận được phản hồi');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: `error_${Date.now()}`,
        type: 'ai',
        content: 'Xin lỗi bác, có lỗi xảy ra. Bác vui lòng thử lại sau nhé!',
        isError: true,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }, [inputText, loading]);

  // Load suggestions
  useEffect(() => {
    let isMounted = true;
    
    const fetchSuggestions = async () => {
      try {
        const response = await chatService.getSuggestions();
        if (isMounted && response.success && response.data) {
          setSuggestions(response.data);
        }
      } catch {
        if (isMounted) {
          setSuggestions([
            'Lúa bị vàng lá phải làm sao?',
            'Cách phòng trị đạo ôn?',
            'Khi nào nên bón phân?',
            'Thời tiết tuần này thế nào?'
          ]);
        }
      }
    };
    
    fetchSuggestions();
    
    setMessages([{
      id: 'welcome',
      type: 'ai',
      content: 'Xin chào bác! 👋 Tôi là trợ lý AI của FarmRay. Bác có thể hỏi tôi về:\n\n• Sâu bệnh hại lúa\n• Cách dùng thuốc BVTV\n• Dự báo thời tiết\n• Lịch chăm sóc mùa vụ\n\nBác cứ hỏi thoải mái nhé!',
      timestamp: new Date().toISOString()
    }]);
    
    return () => { isMounted = false; };
  }, []);

  // Handle initial message
  useEffect(() => {
    const initialMsg = location.state?.initialMessage;
    if (initialMsg) {
      setInputText(initialMsg);
      const timer = setTimeout(() => {
        handleSend(initialMsg);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [location.state?.initialMessage]); // eslint-disable-line react-hooks/exhaustive-deps

  // Voice input handler
  const handleVoiceInput = (transcript) => {
    if (transcript) {
      setInputText(transcript);
      setTimeout(() => handleSend(transcript), 300);
    }
  };

  // Text to speech
  const handleSpeak = (text) => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(text);
    }
  };

  // Mark as helpful
  const handleFeedback = async (messageId, isHelpful) => {
    try {
      if (isHelpful) {
        await chatService.markAsHelpful(messageId);
      } else {
        await chatService.markAsUnhelpful(messageId, 'Không hữu ích');
      }
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, feedback: isHelpful ? 'helpful' : 'unhelpful' }
          : msg
      ));
    } catch (error) {
      console.error('Feedback error:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-30">
        <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-4 py-4 shadow-lg">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
              >
                <i className="fa-solid fa-arrow-left text-white text-lg" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                  <i className="fa-solid fa-robot text-white text-2xl" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Trợ lý AI</h1>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm text-white/80">Đang hoạt động</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                chatService.startNewSession();
                setMessages([{
                  id: 'welcome',
                  type: 'ai',
                  content: 'Xin chào bác! Bác muốn hỏi gì ạ?',
                  timestamp: new Date().toISOString()
                }]);
              }}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
              title="Cuộc trò chuyện mới"
            >
              <i className="fa-solid fa-rotate text-white text-lg" />
            </button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message, index) => (
          <MessageBubble 
            key={message.id} 
            message={message}
            onSpeak={handleSpeak}
            onFeedback={handleFeedback}
            isSpeaking={isSpeaking}
            animationDelay={index * 0.1}
          />
        ))}

        {loading && (
          <div className="flex items-start gap-3 animate-fadeIn">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <i className="fa-solid fa-robot text-white" />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-md p-4 shadow-md">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2.5 h-2.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2.5 h-2.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2.5 h-2.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-gray-500 text-lg ml-2">Đang suy nghĩ...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && suggestions.length > 0 && (
        <div className="px-4 pb-3 animate-slideUp">
          <p className="text-gray-600 mb-2 flex items-center gap-2">
            <i className="fa-solid fa-lightbulb text-amber-500" />
            <span className="font-medium">Gợi ý câu hỏi:</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.slice(0, 4).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSend(suggestion)}
                className="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-700 hover:border-violet-400 hover:bg-violet-50 hover:text-violet-700 transition-all shadow-sm hover:shadow-md"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="sticky bottom-0 bg-white/80 backdrop-blur-lg border-t border-gray-200/50 p-4">
        <div className="max-w-4xl mx-auto flex items-end gap-3">
          {/* Voice Button */}
          <VoiceButton 
            size="medium" 
            onTranscript={handleVoiceInput}
          />

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Nhập câu hỏi của bác..."
              className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 resize-none bg-white shadow-sm transition-all"
              rows={1}
              style={{ minHeight: '56px', maxHeight: '120px' }}
            />
          </div>

          {/* Send Button */}
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || loading}
            className={`
              w-14 h-14 rounded-2xl flex items-center justify-center transition-all
              ${inputText.trim() && !loading
                ? 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                : 'bg-gray-200 text-gray-400'
              }
            `}
          >
            {loading 
              ? <i className="fa-solid fa-spinner fa-spin text-xl" />
              : <i className="fa-solid fa-paper-plane text-xl" />
            }
          </button>
        </div>
      </div>
    </div>
  );
};

// Format message content với markdown đơn giản
const formatMessageContent = (content) => {
  if (!content) return null;
  
  // Tách theo dòng
  const lines = content.split('\n');
  
  return lines.map((line, lineIdx) => {
    // Xử lý dòng trống
    if (!line.trim()) {
      return <br key={lineIdx} />;
    }
    
    // Xử lý numbered list (1. 2. 3. etc)
    const numberedMatch = line.match(/^(\d+)\.\s*\*\*(.+?)\*\*:?\s*(.*)/);
    if (numberedMatch) {
      return (
        <div key={lineIdx} className="flex items-start gap-3 my-3 p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border-l-4 border-emerald-500">
          <span className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
            {numberedMatch[1]}
          </span>
          <div className="flex-1">
            <p className="font-bold text-emerald-800 text-base">{numberedMatch[2]}</p>
            {numberedMatch[3] && <p className="text-gray-700 mt-1">{numberedMatch[3]}</p>}
          </div>
        </div>
      );
    }
    
    // Xử lý bullet point (• hoặc - hoặc *)
    const bulletMatch = line.match(/^[•\-*]\s*(.+)/);
    if (bulletMatch) {
      return (
        <div key={lineIdx} className="flex items-start gap-2 my-1.5 ml-2">
          <i className="fa-solid fa-leaf text-emerald-500 mt-1 text-sm" />
          <span>{formatInlineText(bulletMatch[1])}</span>
        </div>
      );
    }
    
    // Dòng thường - xử lý **bold** inline
    return (
      <p key={lineIdx} className="my-1">
        {formatInlineText(line)}
      </p>
    );
  });
};

// Format inline text (bold, etc)
const formatInlineText = (text) => {
  if (!text) return text;
  
  // Tách text theo pattern **bold**
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return (
        <strong key={idx} className="font-bold text-emerald-700">
          {boldText}
        </strong>
      );
    }
    return part;
  });
};

// Message Bubble Component
const MessageBubble = ({ message, onSpeak, onFeedback, isSpeaking, animationDelay }) => {
  const isUser = message.type === 'user';
  const isError = message.isError;

  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
      style={{ animationDelay: `${animationDelay}s` }}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 mr-3 ${
          isError 
            ? 'bg-gradient-to-br from-red-400 to-rose-500' 
            : 'bg-gradient-to-br from-violet-500 to-purple-600'
        }`}>
          <i className={`fa-solid ${isError ? 'fa-circle-exclamation' : 'fa-robot'} text-white`} />
        </div>
      )}

      <div 
        className={`
          max-w-[80%] rounded-2xl p-4 shadow-md
          ${isUser 
            ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-tr-md' 
            : isError
              ? 'bg-red-50 border border-red-200 rounded-tl-md'
              : 'bg-white rounded-tl-md'
          }
        `}
      >
        {/* Message Content */}
        {isUser ? (
          <p className="text-lg leading-relaxed whitespace-pre-wrap text-white">
            {message.content}
          </p>
        ) : (
          <div className="text-lg leading-relaxed text-gray-800">
            {formatMessageContent(message.content)}
          </div>
        )}

        {/* Keywords */}
        {!isUser && message.keywords && message.keywords.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {message.keywords.map((keyword, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1 bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 rounded-full text-sm font-medium"
                >
                  <i className="fa-solid fa-hashtag text-xs mr-1" />{keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        {!isUser && !isError && message.id !== 'welcome' && (
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={() => onSpeak(message.content)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                isSpeaking 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              <i className={`fa-solid ${isSpeaking ? 'fa-stop' : 'fa-volume-high'}`} />
              <span className="text-sm font-medium">
                {isSpeaking ? 'Dừng' : 'Đọc'}
              </span>
            </button>

            {!message.feedback && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onFeedback(message.id, true)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-green-100 text-gray-400 hover:text-green-600 transition-all"
                  title="Hữu ích"
                >
                  <i className="fa-solid fa-thumbs-up" />
                </button>
                <button
                  onClick={() => onFeedback(message.id, false)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-red-100 text-gray-400 hover:text-red-600 transition-all"
                  title="Không hữu ích"
                >
                  <i className="fa-solid fa-thumbs-down" />
                </button>
              </div>
            )}

            {message.feedback && (
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <i className={`fa-solid ${message.feedback === 'helpful' ? 'fa-check-circle text-green-500' : 'fa-pen text-gray-400'}`} />
                {message.feedback === 'helpful' ? 'Cảm ơn bác!' : 'Đã ghi nhận'}
              </span>
            )}
          </div>
        )}

        {/* Timestamp */}
        <p className={`text-xs mt-2 ${isUser ? 'text-white/70' : 'text-gray-400'}`}>
          {new Date(message.timestamp).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center flex-shrink-0 ml-3">
          <i className="fa-solid fa-user text-white" />
        </div>
      )}
    </div>
  );
};

export default ChatPage;
