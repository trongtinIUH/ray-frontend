import React from 'react';
import useVoice from '../../hooks/useVoice';

// Component nút Micro để ghi âm giọng nói
const VoiceButton = ({ onTranscript, size = 'large' }) => {
  const { isListening, transcript, startListening, stopListening, supported } = useVoice();

  React.useEffect(() => {
    if (transcript && onTranscript) {
      onTranscript(transcript);
    }
  }, [transcript, onTranscript]);

  if (!supported) {
    return (
      <div className="text-center p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
        <p className="text-yellow-800 text-lg">
          ⚠️ Trình duyệt không hỗ trợ ghi âm
        </p>
      </div>
    );
  }

  const sizeClasses = {
    small: 'w-12 h-12 text-xl',
    medium: 'w-16 h-16 text-2xl',
    large: 'w-20 h-20 text-3xl',
    xl: 'w-24 h-24 text-4xl',
  };

  return (
    <button
      onClick={isListening ? stopListening : startListening}
      className={`
        ${sizeClasses[size]}
        rounded-full 
        ${isListening 
          ? 'bg-red-500 animate-pulse shadow-lg shadow-red-300' 
          : 'bg-primary-500 hover:bg-primary-600'
        }
        text-white
        flex items-center justify-center
        transition-all duration-200
        active:scale-95
        shadow-xl
      `}
      aria-label={isListening ? 'Dừng ghi âm' : 'Bắt đầu ghi âm'}
    >
      {isListening ? '🔴' : '🎤'}
    </button>
  );
};

export default VoiceButton;
