import React from 'react';
import { 
  Compass, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  GraduationCap, 
  PieChart, 
  BookOpen, 
  RotateCcw, 
  LayoutGrid, 
  ArrowLeftRight, 
  ListChecks 
} from 'lucide-react';
import { TOUR_STEPS } from '../hooks/useTour';

const ICON_MAP = {
  GraduationCap,
  Compass,
  PieChart,
  BookOpen,
  RotateCcw,
  LayoutGrid,
  ArrowLeftRight,
  ListChecks,
};

export function TourModal({
  isTourActive,
  isForcedTour,
  currentStepIndex,
  currentStep,
  spotlightStyle,
  popoverStyle,
  popoverRef,
  onNext,
  onPrev,
  onSkip,
}) {
  if (!isTourActive || !currentStep) return null;

  const isLastStep = currentStepIndex === TOUR_STEPS.length - 1;
  const StepIcon = ICON_MAP[currentStep.icon] || Compass;

  return (
    <>
      {/* Backdrop */}
      <div
        id="tour-backdrop"
        onClick={() => !isForcedTour && onSkip()}
        className="fixed inset-0 z-[9997] bg-black/40 backdrop-blur-[2px] transition-opacity duration-300"
      />

      {/* Spotlight Cutout Ring */}
      <div
        id="tour-spotlight"
        style={spotlightStyle}
        className="fixed z-[9998] rounded-2xl pointer-events-none transition-all duration-300 ring-4 ring-[var(--index)] shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]"
      />

      {/* Popover Card */}
      <div
        ref={popoverRef}
        id="tour-popover"
        style={popoverStyle}
        className="fixed z-[10000] w-[90vw] max-w-[390px] p-4 sm:p-5 rounded-2xl bento shadow-2xl transition-all duration-300 transform"
      >
        <div className="flex items-center justify-between mb-2">
          <span
            id="tour-step-badge"
            className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider"
            style={{ background: 'var(--index-soft)', color: 'var(--index)' }}
          >
            Step {currentStepIndex + 1} of {TOUR_STEPS.length}
          </span>
          {!isForcedTour && (
            <button
              id="tour-btn-skip"
              onClick={onSkip}
              className="text-xs font-semibold px-2 py-1 rounded-lg hover:bg-black/5 transition cursor-pointer"
              style={{ color: 'var(--ink-soft)' }}
            >
              Skip Tour
            </button>
          )}
        </div>

        <h3
          id="tour-title"
          className="font-display text-base sm:text-lg font-bold flex items-center gap-2 mb-1.5"
          style={{ color: 'var(--ink)' }}
        >
          <StepIcon className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--index)' }} />
          <span>{currentStep.title}</span>
        </h3>

        <p id="tour-desc" className="text-xs sm:text-sm leading-relaxed mb-4" style={{ color: 'var(--ink-soft)' }}>
          {currentStep.desc}
        </p>

        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--card-line)' }}>
          <button
            id="tour-btn-prev"
            onClick={onPrev}
            disabled={currentStepIndex === 0}
            className="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: 'var(--paper)',
              border: '1px solid var(--card-line)',
              color: 'var(--ink)',
            }}
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1">
            {TOUR_STEPS.map((_, idx) => (
              <div
                key={idx}
                className={`tour-dot ${idx === currentStepIndex ? 'active' : ''}`}
              />
            ))}
          </div>

          <button
            id="tour-btn-next"
            onClick={onNext}
            className="px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md hover:scale-105 active:scale-95"
            style={{ background: 'var(--index)', color: '#fff' }}
          >
            <span>{isLastStep ? 'Got It!' : 'Next'}</span>
            {isLastStep ? <Check className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </>
  );
}
