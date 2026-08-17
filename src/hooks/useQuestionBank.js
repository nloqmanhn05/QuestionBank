import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { QUESTION_BANK } from '../data/questionBank';
import { trackEvent, firestoreApi } from '../services/firebase';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'qb_user_state';

const initialUserState = {
  ch1: {},
  ch2: {},
  ch3: {},
  ch4: {},
  ch5: {},
  ch6: {},
  ch7: {},
};

export function useQuestionBank(currentUser = null) {
  const [currentChapterKey, setCurrentChapterKey] = useState('ch1');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userState, setUserState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return { ...initialUserState, ...parsed };
        }
      }
    } catch (e) {
      console.warn('Failed to load cached progress:', e);
    }
    return initialUserState;
  });

  const isInitialSyncDone = useRef(false);

  // Sync with Firestore when user logs in / changes
  useEffect(() => {
    if (!currentUser) {
      isInitialSyncDone.current = false;
      return;
    }

    let unsubscribe = () => {};

    const loadCloudProgress = async () => {
      try {
        const cloudProgress = await firestoreApi.getUserProgress(currentUser.uid);
        if (cloudProgress && typeof cloudProgress === 'object') {
          setUserState((prev) => {
            // Merge local and cloud progress (cloud takes precedence if both exist)
            const merged = { ...initialUserState };
            Object.keys(initialUserState).forEach((chKey) => {
              merged[chKey] = {
                ...(prev[chKey] || {}),
                ...(cloudProgress[chKey] || {}),
              };
            });
            return merged;
          });
        } else {
          // If no cloud progress exists yet, sync current local progress up to Firestore
          firestoreApi.saveUserProgress(currentUser, userState, QUESTION_BANK);
        }
      } catch (err) {
        console.warn('Error loading cloud progress:', err);
      } finally {
        isInitialSyncDone.current = true;
      }
    };

    loadCloudProgress();

    // Setup real-time listener for multi-device sync
    unsubscribe = firestoreApi.listenToUserProgress(currentUser.uid, (cloudProgress) => {
      if (cloudProgress && isInitialSyncDone.current) {
        setUserState((prev) => ({
          ...prev,
          ...cloudProgress,
        }));
      }
    });

    return () => {
      unsubscribe();
    };
  }, [currentUser]);

  // Save to localStorage on any state change, and to Firestore if authenticated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userState));
    } catch (e) {
      console.warn('Failed to save progress locally:', e);
    }

    if (currentUser && isInitialSyncDone.current) {
      firestoreApi.saveUserProgress(currentUser, userState, QUESTION_BANK);
    }
  }, [userState, currentUser]);

  // Current active chapter data
  const currentChapter = useMemo(() => {
    return QUESTION_BANK[currentChapterKey] || QUESTION_BANK.ch1;
  }, [currentChapterKey]);

  // Current active question data
  const currentQuestion = useMemo(() => {
    return currentChapter.questions[currentQuestionIndex] || currentChapter.questions[0];
  }, [currentChapter, currentQuestionIndex]);

  // Current saved answer for active question
  const currentAnswer = useMemo(() => {
    return userState[currentChapterKey]?.[currentQuestionIndex];
  }, [userState, currentChapterKey, currentQuestionIndex]);

  // Chapter statistics
  const chapterStats = useMemo(() => {
    const chapState = userState[currentChapterKey] || {};
    const answeredCount = Object.keys(chapState).length;
    let correctCount = 0;
    Object.values(chapState).forEach((ans) => {
      if (ans?.isCorrect) correctCount++;
    });
    return {
      answeredCount,
      correctCount,
      totalCount: 30,
      progressPercent: Math.round((answeredCount / 30) * 100),
      accuracyPercent: answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0,
      isComplete: answeredCount === 30,
    };
  }, [userState, currentChapterKey]);

  // Global statistics
  const globalStats = useMemo(() => {
    let totalAnswered = 0;
    let totalCorrect = 0;
    const totalQuestions = 210;

    Object.keys(QUESTION_BANK).forEach((cKey) => {
      const cState = userState[cKey] || {};
      Object.keys(cState).forEach((qIdx) => {
        totalAnswered++;
        if (cState[qIdx]?.isCorrect) {
          totalCorrect++;
        }
      });
    });

    const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    return {
      totalAnswered,
      totalCorrect,
      totalQuestions,
      accuracy,
    };
  }, [userState]);

  const selectChapter = useCallback((key) => {
    if (QUESTION_BANK[key]) {
      setCurrentChapterKey(key);
      setCurrentQuestionIndex(0);
      trackEvent('select_chapter', {
        chapter_key: key,
        chapter_title: QUESTION_BANK[key].title,
      });
    }
  }, []);

  const selectQuestion = useCallback((index) => {
    if (index >= 0 && index < 30) {
      setCurrentQuestionIndex(index);
    }
  }, []);

  const nextQuestion = useCallback(() => {
    setCurrentQuestionIndex((prev) => Math.min(prev + 1, 29));
  }, []);

  const prevQuestion = useCallback(() => {
    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const answerQuestion = useCallback(
    (chosenOptIndex) => {
      if (currentAnswer !== undefined) return; // already answered

      const isCorrect = chosenOptIndex === currentQuestion.answer;

      setUserState((prev) => {
        const nextChapterState = {
          ...(prev[currentChapterKey] || {}),
          [currentQuestionIndex]: {
            chosen: chosenOptIndex,
            isCorrect,
          },
        };

        const nextState = {
          ...prev,
          [currentChapterKey]: nextChapterState,
        };

        const newlyAnsweredCount = Object.keys(nextChapterState).length;
        if (newlyAnsweredCount === 30) {
          let cCount = 0;
          Object.values(nextChapterState).forEach((a) => {
            if (a?.isCorrect) cCount++;
          });
          trackEvent('complete_chapter', {
            chapter_key: currentChapterKey,
            score: cCount,
            total: 30,
            accuracy_pct: Math.round((cCount / 30) * 100),
          });

          // Celebration confetti
          try {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
          } catch (e) {}
        }

        return nextState;
      });

      trackEvent('answer_question', {
        chapter_key: currentChapterKey,
        question_index: currentQuestionIndex + 1,
        is_correct: isCorrect,
        chosen_option: chosenOptIndex,
      });
    },
    [currentAnswer, currentQuestion, currentChapterKey, currentQuestionIndex]
  );

  const resetChapter = useCallback(
    (chapterKeyToReset) => {
      const key = chapterKeyToReset || currentChapterKey;
      const chapNumber = key.replace('ch', '');
      if (window.confirm(`Are you sure you want to reset all progress for Chapter ${chapNumber}?`)) {
        setUserState((prev) => {
          const next = {
            ...prev,
            [key]: {},
          };
          if (currentUser) {
            firestoreApi.saveUserProgress(currentUser, next, QUESTION_BANK);
          }
          return next;
        });
        trackEvent('reset_chapter', { chapter_key: key });
      }
    },
    [currentChapterKey, currentUser]
  );

  return {
    chapters: QUESTION_BANK,
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
  };
}
