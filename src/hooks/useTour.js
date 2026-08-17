import { useState, useEffect, useCallback, useRef } from 'react';
import { trackEvent } from '../services/firebase';

export const TOUR_STEPS = [
  {
    target: '#sidebar-toggle',
    title: 'Sidebar Navigation Toggle',
    icon: 'GraduationCap',
    desc: 'Click here anytime to collapse or expand the navigation sidebar for a distraction-free learning experience.',
  },
  {
    target: '#btn-start-tour',
    title: 'Tour Guide Button',
    icon: 'Compass',
    desc: 'You can click this button at any time to replay this interactive guide whenever you need a quick overview of the features.',
  },
  {
    target: '.stats-row',
    title: 'Global Score & Accuracy',
    icon: 'PieChart',
    desc: 'Monitors your overall performance in real-time across all 210 questions in the master question bank.',
  },
  {
    target: '#chapter-list',
    title: 'Course Chapter Selection',
    icon: 'BookOpen',
    desc: 'Browse and select any of the 7 core chapters (30 questions each) to target specific subjects like ICT Professions, Ethics, Privacy, or IP.',
  },
  {
    target: '.progress-block',
    title: 'Chapter Progress & Reset',
    icon: 'RotateCcw',
    desc: 'Shows your active chapter completion bar. Click "Reset Chapter" if you want to wipe answers for this chapter and retake the questions.',
  },
  {
    target: '.pane-quick-jump',
    title: 'Quick Jump Navigation Grid',
    icon: 'LayoutGrid',
    desc: '30 interactive question dots showing real-time feedback: 🟢 Green (Correct), 🔴 Red (Wrong), or ⚪ Gray (Unanswered). Click any dot to jump directly to that question.',
  },
  {
    target: '#q-nav-buttons',
    title: 'Previous & Next Question Arrows',
    icon: 'ArrowLeftRight',
    desc: 'Click the left (←) or right (→) arrow buttons to navigate smoothly between questions within the current chapter.',
  },
  {
    target: '#options-container',
    title: 'Multiple-Choice Answer Cards',
    icon: 'ListChecks',
    desc: 'Select an option to test your knowledge! Submitting an answer instantly reveals if it is correct, complete with detailed explanations.',
  },
];

export function useTour() {
  const [isTourActive, setIsTourActive] = useState(false);
  const [isForcedTour, setIsForcedTour] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [spotlightStyle, setSpotlightStyle] = useState({});
  const [popoverStyle, setPopoverStyle] = useState({});

  const popoverRef = useRef(null);

  const calculatePositions = useCallback((stepIdx) => {
    const step = TOUR_STEPS[stepIdx];
    if (!step) return;

    const targetEl = document.querySelector(step.target);
    if (!targetEl) return;

    targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    const rect = targetEl.getBoundingClientRect();
    const padding = 6;
    const gap = 14;

    const spotTop = Math.max(0, rect.top - padding);
    const spotLeft = Math.max(0, rect.left - padding);
    const spotWidth = rect.width + padding * 2;
    const spotHeight = rect.height + padding * 2;
    const spotBottom = spotTop + spotHeight;
    const spotRight = spotLeft + spotWidth;

    setSpotlightStyle({
      top: `${spotTop}px`,
      left: `${spotLeft}px`,
      width: `${spotWidth}px`,
      height: `${spotHeight}px`,
      display: 'block',
      opacity: 1,
    });

    const popW = popoverRef.current?.offsetWidth || 360;
    const popH = popoverRef.current?.offsetHeight || 200;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = 12;

    const spaceBelow = vh - spotBottom - gap;
    const spaceAbove = spotTop - gap;
    const spaceRight = vw - spotRight - gap;
    const spaceLeft = spotLeft - gap;

    let popTop, popLeft;
    let placed = false;

    if (spaceBelow >= popH) {
      popTop = spotBottom + gap;
      popLeft = spotLeft + spotWidth / 2 - popW / 2;
      placed = true;
    } else if (spaceAbove >= popH) {
      popTop = spotTop - gap - popH;
      popLeft = spotLeft + spotWidth / 2 - popW / 2;
      placed = true;
    } else if (spaceRight >= popW) {
      popTop = spotTop + spotHeight / 2 - popH / 2;
      popLeft = spotRight + gap;
      placed = true;
    } else if (spaceLeft >= popW) {
      popTop = spotTop + spotHeight / 2 - popH / 2;
      popLeft = spotLeft - gap - popW;
      placed = true;
    }

    if (!placed) {
      popTop = spotBottom + gap;
      popLeft = spotLeft + spotWidth / 2 - popW / 2;
    }

    popTop = Math.max(margin, Math.min(popTop, vh - popH - margin));
    popLeft = Math.max(margin, Math.min(popLeft, vw - popW - margin));

    setPopoverStyle({
      top: `${popTop}px`,
      left: `${popLeft}px`,
      display: 'block',
      opacity: 1,
      transform: 'scale(1)',
    });
  }, []);

  const startTour = useCallback(
    (forceMandatory = false) => {
      setIsTourActive(true);
      setIsForcedTour(forceMandatory);
      setCurrentStepIndex(0);
      trackEvent('start_tour', { mandatory: forceMandatory });
    },
    []
  );

  const endTour = useCallback(
    (isCompleted = false) => {
      setIsTourActive(false);
      setIsForcedTour(false);
      trackEvent('end_tour', { last_step: currentStepIndex + 1, completed: isCompleted });

      try {
        localStorage.setItem('question_bank_tour_seen', 'true');
      } catch (e) {}
    },
    [currentStepIndex]
  );

  const nextStep = useCallback(() => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      endTour(true);
    }
  }, [currentStepIndex, endTour]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  // Recalculate positions on step changes & window resize
  useEffect(() => {
    if (!isTourActive) return;

    // Small delay to ensure DOM and popover layout is rendered
    const timeout = setTimeout(() => {
      calculatePositions(currentStepIndex);
    }, 50);

    const handleResize = () => calculatePositions(currentStepIndex);
    window.addEventListener('resize', handleResize);

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextStep();
      else if (e.key === 'ArrowLeft') prevStep();
      else if (e.key === 'Escape' && !isForcedTour) endTour(false);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isTourActive, currentStepIndex, isForcedTour, calculatePositions, nextStep, prevStep, endTour]);

  return {
    isTourActive,
    isForcedTour,
    currentStepIndex,
    currentStep: TOUR_STEPS[currentStepIndex],
    totalSteps: TOUR_STEPS.length,
    spotlightStyle,
    popoverStyle,
    popoverRef,
    startTour,
    endTour,
    nextStep,
    prevStep,
  };
}
