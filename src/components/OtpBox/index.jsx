import { useState, useRef, useEffect } from 'react';

const OtpBox = ({
  length = 6,
  onComplete,
  disabled = false,
  loading = false,
}) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [disabled]);

  const handleChange = (element, index) => {
    if (disabled || loading) return;
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Move to next input
    if (element.value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }

    // Call onComplete when all fields are filled
    if (newOtp.every((digit) => digit !== '')) {
      onComplete(newOtp.join(''));
    }
  };

  const handleKeyDown = (e, index) => {
    if (disabled || loading) return;

    // Move to previous input on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    if (disabled || loading) return;

    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length);
    const newOtp = [...otp];

    for (let i = 0; i < pastedData.length; i++) {
      if (!isNaN(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }

    setOtp(newOtp);

    // Focus on the next empty input or last input
    const nextIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextIndex].focus();

    if (newOtp.every((digit) => digit !== '')) {
      onComplete(newOtp.join(''));
    }
  };

  const handleVerify = () => {
    if (otp.every((digit) => digit !== '') && !disabled && !loading) {
      onComplete(otp.join(''));
    }
  };

  const handleClear = () => {
    if (!disabled && !loading) {
      setOtp(new Array(length).fill(''));
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }
  };

  return (
    <div className="mt-6">
      <div className="flex gap-2 justify-center mb-4">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            ref={(ref) => (inputRefs.current[index] = ref)}
            disabled={disabled || loading}
            className={`w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg 
                        focus:border-blue-500 focus:outline-none transition-colors
                        ${
                          disabled || loading
                            ? 'bg-gray-100 cursor-not-allowed opacity-60'
                            : ''
                        }`}
          />
        ))}
      </div>

      <button
        className={`w-full font-semibold py-2 px-4 rounded-lg transition-colors mt-4
                ${
                  disabled || loading || !otp.every((digit) => digit !== '')
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
        onClick={handleVerify}
        disabled={disabled || loading || !otp.every((digit) => digit !== '')}
      >
        {loading ? 'Verifying...' : 'Verify OTP'}
      </button>

      <div className="text-center mt-4">
        <button
          className={`text-sm text-[16px] ${
            disabled || loading
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-blue-600 hover:underline'
          }`}
          onClick={handleClear}
          disabled={disabled || loading}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default OtpBox;
