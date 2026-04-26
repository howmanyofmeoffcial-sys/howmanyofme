import { useState, forwardRef, InputHTMLAttributes } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { validateSingleName } from "@/lib/nameValidation";

interface NameInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: string;
  onChange: (val: string) => void;
  onValidSubmit?: (val: string) => void;
  showError?: boolean;
  inputClassName?: string;
}

/**
 * Single-name input. Enforces: A–Z only, 2–20 chars, no spaces.
 * Shows a sonner toast warning when the user types a space.
 * Adds a shake animation + red border on invalid submit attempts.
 */
const NameInput = forwardRef<HTMLInputElement, NameInputProps>(
  ({ value, onChange, onValidSubmit: _onValidSubmit, showError = true, inputClassName, className, ...rest }, ref) => {
    const [shake, setShake] = useState(false);
    const [touched, setTouched] = useState(false);

    const validation = validateSingleName(value);
    const isInvalid = touched && !validation.ok && value.length > 0;

    const triggerShake = () => {
      setShake(true);
      window.setTimeout(() => setShake(false), 450);
    };

    const handleChange = (raw: string) => {
      // Strip illegal chars live but allow trailing space to surface a toast.
      if (/\s/.test(raw)) {
        toast.warning("Please enter first or last name only", { duration: 1500 });
        triggerShake();
        onChange(raw.replace(/\s+/g, ""));
        return;
      }
      // Enforce alpha-only as user types
      const cleaned = raw.replace(/[^A-Za-z]/g, "");
      if (cleaned !== raw) triggerShake();
      onChange(cleaned.slice(0, 20));
    };

    return (
      <div className={cn("w-full", className)}>
        <input
          ref={ref}
          type="text"
          value={value}
          onBlur={() => setTouched(true)}
          onChange={(e) => handleChange(e.target.value)}
          aria-invalid={isInvalid}
          aria-describedby={isInvalid ? "name-input-error" : undefined}
          placeholder="Enter a single name (e.g., Rahul)"
          className={cn(
            "w-full transition-all",
            isInvalid && "border-destructive ring-destructive/30 focus:ring-destructive/40",
            shake && "animate-[shake_0.4s_ease-in-out]",
            inputClassName,
          )}
          {...rest}
        />
        {isInvalid && showError && !validation.ok && (
          <p id="name-input-error" className="mt-1.5 text-xs text-destructive" role="alert">
            {validation.reason}
          </p>
        )}
      </div>
    );
  },
);

NameInput.displayName = "NameInput";

export default NameInput;
