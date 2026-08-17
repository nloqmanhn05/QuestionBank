import React, { useState, useEffect } from 'react';
import { useQuestionBank } from './hooks/useQuestionBank';
import { useTour } from './hooks/useTour';
import { Sidebar } from './components/Sidebar';
import { QuickJumpGrid } from './components/QuickJumpGrid';
import { QuestionHeader } from './components/QuestionHeader';
import { QuestionCard } from './components/QuestionCard';
import { TourModal } from './components/TourModal';
import { AuthModal } from './components/AuthModal';
import { authApi, trackEvent } from './services/firebase';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Initialize Firebase Auth listener
  useEffect(() => {
    trackEvent('app_initialized');
    const unsubscribe = authApi.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const {
    chapters,
    currentChapterKey,
    currentChapter,
    currentQuestionIndex,
    currentQuestion,
    currentAnswer,
    userState,
    chapterStats,
    globalStats,
    selectChapter,
    selectQuestion,
    nextQuestion,
    prevQuestion,
    answerQuestion,
    resetChapter,
  } = useQuestionBank(currentUser);

  const {
    isTourActive,
    isForcedTour,
    currentStepIndex,
    currentStep,
    spotlightStyle,
    popoverStyle,
    popoverRef,
    startTour,
    endTour,
    nextStep,
    prevStep,
  } = useTour();

  const handleSignOut = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      try {
        await authApi.signOut();
        trackEvent('auth_sign_out');
      } catch (e) {
        console.warn('Sign out error:', e);
      }
    }
  };

  const handleAuthSuccess = (user, isNewUser) => {
    setCurrentUser(user);
    // If newly registered, optionally guide through the tour
    if (isNewUser) {
      setTimeout(() => {
        startTour(true);
      }, 500);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden custom-scrollbar bg-[var(--paper)] text-[var(--ink)]">
      {/* Main Container */}
      <div className="main-container flex-grow flex flex-col lg:flex-row w-full flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar
          chapters={chapters}
          currentChapterKey={currentChapterKey}
          onSelectChapter={selectChapter}
          chapterStats={chapterStats}
          globalStats={globalStats}
          userState={userState}
          onResetChapter={resetChapter}
          onOpenAuth={() => setIsAuthOpen(true)}
          currentUser={currentUser}
          onSignOut={handleSignOut}
        />

        {/* Main Content Column */}
        <div className="main-content-column flex-grow flex flex-col h-full overflow-hidden">
          {/* Content Body */}
          <div className="content-body flex-1 w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 flex flex-col overflow-hidden">
            {/* Two Pane Container */}
            <div className="two-pane-container flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-5 w-full items-start flex-grow h-full overflow-hidden">
              {/* Pane 1: Quick Jump Navigation */}
              <QuickJumpGrid
                currentChapterKey={currentChapterKey}
                currentQuestionIndex={currentQuestionIndex}
                onSelectQuestion={selectQuestion}
                userState={userState}
              />

              {/* Pane 2: Questions and Answer */}
              <div className="pane-question w-full lg:w-[78%] flex-grow flex flex-col gap-2 sm:gap-3 h-full overflow-hidden">
                <QuestionHeader
                  currentChapterKey={currentChapterKey}
                  currentChapterTitle={currentChapter.title}
                  currentQuestionIndex={currentQuestionIndex}
                  onPrev={prevQuestion}
                  onNext={nextQuestion}
                  onStartTour={() => startTour(false)}
                />

                <QuestionCard
                  question={currentQuestion}
                  questionIndex={currentQuestionIndex}
                  currentAnswer={currentAnswer}
                  onSelectOption={answerQuestion}
                />
              </div>
            </div>
          </div>

          {/* Pinned Footer */}
          <footer
            className="w-full py-2 text-center text-[11px] flex-shrink-0"
            style={{
              borderTop: '1px solid var(--card-line)',
              background: 'var(--paper-raised)',
              color: 'var(--ink-soft)',
            }}
          >
            <p>
              Developed by <strong>xebvyawkxrkusw(key10)</strong>
            </p>
          </footer>
        </div>
      </div>

      {/* Interactive Tour Guide Modal */}
      <TourModal
        isTourActive={isTourActive}
        isForcedTour={isForcedTour}
        currentStepIndex={currentStepIndex}
        currentStep={currentStep}
        spotlightStyle={spotlightStyle}
        popoverStyle={popoverStyle}
        popoverRef={popoverRef}
        onNext={nextStep}
        onPrev={prevStep}
        onSkip={() => endTour(false)}
      />

      {/* Account / Cloud Sync Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
