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
      <div className="text-center p-4 bg-amber-50 rounded-xl border border-amber-200">
        <p className="text-amber-700 flex items-center gap-2">
          <i className="fa-solid fa-triangle-exclamation" />
          Trình duyệt không hỗ trợ ghi âm
        </p>
      </div>
    );
  }

  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-14 h-14',
    large: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  const iconSizes = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <button
      onClick={isListening ? stopListening : startListening}
      className={`
        ${sizeClasses[size]}
        rounded-2xl 
        ${isListening 
          ? 'bg-gradient-to-br from-red-500 to-rose-600 animate-pulse shadow-lg shadow-red-300/50' 
          : 'bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg shadow-emerald-300/50'
        }
        text-white
        flex items-center justify-center
        transition-all duration-300
        active:scale-95
        hover:scale-105
      `}
      aria-label={isListening ? 'Dừng ghi âm' : 'Bắt đầu ghi âm'}
    >
      <i className={`fa-solid ${isListening ? 'fa-stop' : 'fa-microphone'} ${iconSizes[size]}`} />
    </button>
  );
};

export default VoiceButton;
