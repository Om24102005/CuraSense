/* Six separate boxes for a 6-digit code (sign-in, sign-up authenticator step, password reset). One real <input> lies invisibly
   over the boxes (the input-otp package), so typing, paste, password-manager autofill, the numeric phone keypad, selection and
   screen readers all behave as in a normal field; the boxes only draw what it holds. Styles: styles/site.css (.cb-*). */
import { useEffect, useRef, type ClipboardEvent } from 'react';
import { OTPInput, REGEXP_ONLY_DIGITS } from 'input-otp';

const LENGTH = 6;
const digitsOf = (text: string) => text.replace(/\D/g, '');

interface CodeBoxesProps {
  value: string;
  onChange: (value: string) => void;
  /** Fires the moment the sixth digit is typed or pasted. */
  onComplete?: (value: string) => void;
  disabled?: boolean;
  /** Red outline and a shake. The owner clears it when the visitor types again. */
  invalid?: boolean;
  autoFocus?: boolean;
}

export function CodeBoxes({ value, onChange, onComplete, disabled, invalid, autoFocus }: CodeBoxesProps) {
  const input = useRef<HTMLInputElement>(null);

  // The caret goes into the boxes when they unlock: on arrival (a disabled input cannot autofocus) and after a wrong code.
  useEffect(() => { if ((autoFocus || invalid) && !disabled) input.current?.focus(); }, [autoFocus, invalid, disabled]);

  // The package inserts a paste at the caret and cuts it to six, so a full code pasted over a half-typed one would come out wrong.
  // Selecting everything first makes a full code replace what is there.
  const replaceOnFullPaste = (e: ClipboardEvent<HTMLElement>) => {
    if (digitsOf(e.clipboardData.getData('text')).length >= LENGTH) input.current?.select();
  };

  return (
    <div className="cb" data-invalid={invalid || undefined} data-busy={disabled || undefined} data-no-cs-transition onPasteCapture={replaceOnFullPaste}>
      <OTPInput
        ref={input}
        className="cb-input"
        containerClassName="cb-row"
        maxLength={LENGTH}
        value={value}
        onChange={onChange}
        onComplete={onComplete}
        pattern={REGEXP_ONLY_DIGITS}
        inputMode="numeric"
        autoComplete="one-time-code"
        pasteTransformer={(pasted) => digitsOf(pasted).slice(0, LENGTH)}   // "372 110", "372-110" and "Your code: 372110" all paste as 372110
        disabled={disabled}
        autoFocus={autoFocus}
        aria-label="6-digit code"
        aria-invalid={invalid || undefined}
        render={({ slots }) => (
          <>
            {slots.map((slot, i) => (
              <div key={i} className="cb-box" data-active={slot.isActive || undefined} data-filled={slot.char ? '' : undefined}>
                {slot.char && <span className="cb-ch">{slot.char}</span>}
                {slot.hasFakeCaret && <i className="cb-caret" />}
              </div>
            ))}
          </>
        )}
      />
    </div>
  );
}
