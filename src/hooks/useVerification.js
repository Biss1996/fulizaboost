import { useState, useCallback } from 'react';
import { VERIFICATION_STEPS } from '../utils/constants';

export function useVerification() {
  const [verificationState, setVerificationState] = useState({
    isVerifying: false,
    currentStep: 0,
    phoneNumber: '',
    isEligible: false,
    error: null,
  });

  const [selectedLimit, setSelectedLimit] = useState(null);
  const [selectedFee, setSelectedFee] = useState(null);

  // Start verification process
  const startVerification = useCallback((phone) => {
    if (!phone || phone.length < 10) {
      setVerificationState(prev => ({
        ...prev,
        error: 'Enter valid Safaricom number',
      }));
      return false;
    }

    setVerificationState({
      isVerifying: true,
      currentStep: 0,
      phoneNumber: phone,
      isEligible: false,
      error: null,
    });

    // Simulate verification steps
    const steps = VERIFICATION_STEPS;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      setVerificationState(prev => ({
        ...prev,
        currentStep: Math.min(currentStep, steps.length - 1),
      }));

      if (currentStep >= steps.length) {
        clearInterval(interval);
        // Verification complete - user is eligible
        setVerificationState(prev => ({
          ...prev,
          isVerifying: false,
          isEligible: true,
        }));
      }
    }, 1500);

    return true;
  }, []);

  // Select a limit
  const selectLimit = useCallback((limit, fee) => {
    setSelectedLimit(limit);
    setSelectedFee(fee);
  }, []);

  // Reset verification
  const resetVerification = useCallback(() => {
    setVerificationState({
      isVerifying: false,
      currentStep: 0,
      phoneNumber: '',
      isEligible: false,
      error: null,
    });
  }, []);

  // Get current status text
  const getCurrentStatus = useCallback(() => {
    return VERIFICATION_STEPS[verificationState.currentStep] || 'Processing...';
  }, [verificationState.currentStep]);

  return {
    verificationState,
    selectedLimit,
    selectedFee,
    startVerification,
    selectLimit,
    resetVerification,
    getCurrentStatus,
  };
}