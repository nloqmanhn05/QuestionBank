import React, { useEffect, useRef } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Lightbulb } from 'lucide-react';

export function QuestionCard({
  question,
  questionIndex,
  currentAnswer,
  onSelectOption,
}) {
  const optionLetters = ['A', 'B', 'C', 'D'];
  const feedbackRef = useRef(null);

  const isAnswered = currentAnswer !== undefined;

  // Auto-scroll to explanation on mobile devices when answered
  useEffect(() => {
    if (isAnswered && window.innerWidth < 1024 && feedbackRef.current) {
      setTimeout(() => {
        feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 80);
    }
  }, [isAnswered]);

  return (
    <div className="bento question-card p-3 sm:p-4 lg:p-5 flex-1 flex flex-col justify-between overflow-y-auto custom-scrollbar">
      <div>
        {/* Question Prompt */}
        <div className="flex items-start gap-3 mb-3">
          <span
            id="q-badge"
            className="flex-shrink-0 font-mono text-lg sm:text-xl font-bold"
            style={{ color: 'var(--flag)' }}
          >
            {questionIndex + 1}.
          </span>
          <h3
            id="question-text"
            className="font-display text-lg sm:text-xl font-medium leading-snug"
            style={{ color: 'var(--ink)' }}
          >
            {question.q}
          </h3>
        </div>

        {/* Options List */}
        <div id="options-container" className="grid grid-cols-1 gap-2.5 my-3">
          {question.options.map((optText, i) => {
            const isCorrectOption = i === question.answer;
            const isSelectedOption = currentAnswer?.chosen === i;

            let cardClasses = 'option-card p-2.5 sm:p-3 rounded-xl flex items-center gap-3 text-sm sm:text-base font-medium leading-snug ';

            if (!isAnswered) {
              cardClasses += 'cursor-pointer';
            } else {
              cardClasses += 'disabled cursor-default ';
              if (isCorrectOption) {
                cardClasses += 'highlight-correct ';
              } else if (isSelectedOption && !currentAnswer.isCorrect) {
                cardClasses += 'selected-wrong ';
              }
            }

            let badgeColor = 'var(--ink-soft)';
            if (isAnswered) {
              if (isCorrectOption) badgeColor = 'var(--correct)';
              else if (isSelectedOption && !currentAnswer.isCorrect) badgeColor = 'var(--wrong)';
            }

            return (
              <div
                key={i}
                onClick={() => !isAnswered && onSelectOption(i)}
                className={cardClasses}
              >
                <div
                  className="option-badge font-mono font-bold text-base sm:text-lg flex-shrink-0 min-w-[1.25rem]"
                  style={{ color: badgeColor }}
                >
                  {optionLetters[i]}.
                </div>
                <div className="flex-1" style={{ color: 'var(--ink)' }}>
                  {optText}
                </div>

                {isAnswered && isCorrectOption && (
                  <CheckCircle2 className="w-5 h-5 ml-2 flex-shrink-0" style={{ color: 'var(--correct)' }} />
                )}
                {isAnswered && isSelectedOption && !currentAnswer.isCorrect && (
                  <XCircle className="w-5 h-5 ml-2 flex-shrink-0" style={{ color: 'var(--wrong)' }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Explanation & Feedback Panel */}
      {isAnswered && (
        <div
          ref={feedbackRef}
          id="feedback-panel"
          className="mt-3 p-4 rounded-xl transition-all duration-300 shadow-xs"
          style={{
            background: currentAnswer.isCorrect ? 'var(--correct-soft)' : 'var(--wrong-soft)',
            border: currentAnswer.isCorrect ? '1.5px solid #c7ddd2' : '1.5px solid #e8cec3',
          }}
        >
          <div
            id="feedback-status-header"
            className="flex items-center justify-between mb-2 text-base font-bold"
            style={{
              color: currentAnswer.isCorrect ? 'var(--correct)' : 'var(--wrong)',
            }}
          >
            <div className="flex items-center gap-2">
              {currentAnswer.isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5" /> Correct Answer
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5" /> Incorrect Answer
                </>
              )}
            </div>

            {question.ref && (
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-black/5 opacity-80">
                {question.ref}
              </span>
            )}
          </div>

          <div
            className="text-xs sm:text-sm leading-relaxed p-3 rounded-lg max-h-[260px] sm:max-h-[140px] overflow-y-auto custom-scrollbar"
            style={{
              background: 'var(--paper)',
              border: '1px solid var(--card-line)',
              color: 'var(--ink)',
            }}
          >
            <div className="flex items-center gap-1 mb-1 font-bold text-[10px] uppercase tracking-widest" style={{ color: 'var(--ink-soft)' }}>
              <Lightbulb className="w-3 h-3" /> Detailed Explanation
            </div>
            <p id="explanation-text">{question.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
