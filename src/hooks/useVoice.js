import { useState, useEffect, useRef, useCallback } from 'react';

// Cấu hình Viettel AI TTS
const VIETTEL_TTS_CONFIG = {
  // API key từ biến môi trường
  apiKey: process.env.REACT_APP_VIETTEL_TTS_API_KEY || '',
  apiUrl: 'https://viettelai.vn/tts/speech_synthesis',
  // Danh sách giọng:
  // hn-quynhanh: Nữ miền Bắc | hcm-diemmy: Nữ miền Nam | hue-maingoc: Nữ miền Trung
  // hn-thanhtung: Nam miền Bắc | hcm-minhquan: Nam miền Nam | hue-baoquoc: Nam miền Trung
  voice: 'hcm-minhquan', // Giọng nam miền Nam - Minh Quân
  speed: 1.0, // Tốc độ đọc (0.8 - 1.2)
  tts_return_option: 3, // 2: wav, 3: mp3
  without_filter: false // true: chất lượng cao hơn nhưng chậm
};

// Custom hook cho Speech-to-Text và Text-to-Speech
const useVoice = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Kiểm tra trình duyệt có hỗ trợ Speech Recognition không
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'vi-VN'; // Tiếng Việt
      
      recognitionInstance.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        setIsListening(false);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }

    // Tạo audio element để phát Viettel TTS
    audioRef.current = new Audio();
    audioRef.current.onended = () => setIsSpeaking(false);
    audioRef.current.onerror = () => setIsSpeaking(false);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Bắt đầu nghe
  const startListening = () => {
    if (recognition) {
      setTranscript('');
      recognition.start();
      setIsListening(true);
    }
  };

  // Dừng nghe
  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  // Text-to-Speech với Viettel AI (giọng tự nhiên)
  const speakWithViettelAI = useCallback(async (text) => {
    if (!VIETTEL_TTS_CONFIG.apiKey) {
      console.log('Viettel AI API key not configured, falling back to Web Speech API');
      return false;
    }

    try {
      setIsSpeaking(true);
      console.log('Calling Viettel AI TTS with voice:', VIETTEL_TTS_CONFIG.voice);
      
      const response = await fetch(VIETTEL_TTS_CONFIG.apiUrl, {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: text,
          voice: VIETTEL_TTS_CONFIG.voice,
          speed: VIETTEL_TTS_CONFIG.speed,
          tts_return_option: VIETTEL_TTS_CONFIG.tts_return_option,
          token: VIETTEL_TTS_CONFIG.apiKey,
          without_filter: VIETTEL_TTS_CONFIG.without_filter
        })
      });

      // Kiểm tra response
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Viettel AI TTS error:', errorData);
        setIsSpeaking(false);
        return false;
      }

      // API trả về file âm thanh trực tiếp (blob)
      const audioBlob = await response.blob();
      
      if (audioBlob.size > 0) {
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Cleanup URL cũ nếu có
        if (audioRef.current.src && audioRef.current.src.startsWith('blob:')) {
          URL.revokeObjectURL(audioRef.current.src);
        }
        
        audioRef.current.src = audioUrl;
        await audioRef.current.play();
        console.log('Viettel AI TTS playing successfully');
        return true;
      }
      
      console.log('Viettel AI TTS returned empty audio');
      setIsSpeaking(false);
      return false;
    } catch (error) {
      console.error('Viettel AI TTS error:', error);
      setIsSpeaking(false);
      return false;
    }
  }, []);

  // Text-to-Speech với Web Speech API (fallback)
  const speakWithWebSpeechAPI = useCallback((text) => {
    if (!('speechSynthesis' in window)) {
      console.error('Web Speech API not supported');
      return;
    }

    // Cancel bất kỳ speech nào đang chạy
    window.speechSynthesis.cancel();
    setIsSpeaking(true);
    
    const speakWithVoice = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.85; // Tốc độ đọc chậm, rõ ràng cho người già
      utterance.pitch = 1.0;
      utterance.volume = 1;
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      // Tìm giọng tiếng Việt
      const voices = window.speechSynthesis.getVoices();
      
      // Ưu tiên tìm giọng vi-VN
      const vietnameseVoice = voices.find(voice => 
        voice.lang === 'vi-VN'
      ) || voices.find(voice => 
        voice.lang.startsWith('vi')
      ) || voices.find(voice => 
        voice.name.toLowerCase().includes('viet') || 
        voice.name.toLowerCase().includes('vietnamese')
      );
      
      if (vietnameseVoice) {
        console.log('Using Vietnamese voice:', vietnameseVoice.name);
        utterance.voice = vietnameseVoice;
      } else {
        console.log('No Vietnamese voice found, using default with vi-VN lang');
      }
      
      window.speechSynthesis.speak(utterance);
    };
    
    // Đợi voices load nếu chưa có
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        speakWithVoice();
      };
    } else {
      speakWithVoice();
    }
  }, []);

  // Hàm speak chính - thử Viettel AI trước, fallback sang Web Speech API
  const speak = useCallback(async (text) => {
    if (!text) return;
    
    // Clean text - loại bỏ markdown formatting
    const cleanText = text
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold **text**
      .replace(/\*([^*]+)\*/g, '$1')     // Remove italic *text*
      .replace(/#{1,6}\s/g, '')          // Remove headers
      .replace(/•/g, ',')                // Replace bullets
      .replace(/\n+/g, '. ')             // Replace newlines with pauses
      .trim();

    // Thử Viettel AI trước
    const viettelSuccess = await speakWithViettelAI(cleanText);
    
    // Nếu Viettel AI fail, dùng Web Speech API
    if (!viettelSuccess) {
      speakWithWebSpeechAPI(cleanText);
    }
  }, [speakWithViettelAI, speakWithWebSpeechAPI]);

  // Dừng đọc
  const stopSpeaking = useCallback(() => {
    // Stop Viettel AI audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    // Stop Web Speech API
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    setIsSpeaking(false);
  }, []);

  return {
    isListening,
    isSpeaking,
    transcript,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    supported: !!recognition,
  };
};

export default useVoice;
