import React, { useState, useRef } from "react";
import { Search, ArrowRight, Loader2, User, Users } from "lucide-react";
import { validateName } from "../../lib/names/validateName";
import {
  searchFirstNameSuggestions,
  searchSurnameSuggestions,
  searchFullNameSuggestions,
} from "../../lib/names/nameSearch";

export interface SearchFormData {
  searchMode: "first_name" | "full_name";
  firstName: string;
  lastName: string;
}

interface NameCheckerFormProps {
  initialFirst?: string;
  initialLast?: string;
  initialMode?: "first_name" | "full_name";
  isLoading: boolean;
  onSubmit: (data: SearchFormData) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export const NameCheckerForm: React.FC<NameCheckerFormProps> = ({
  initialFirst = "",
  initialLast = "",
  initialMode = "first_name",
  isLoading,
  onSubmit,
  inputRef,
}) => {
  const [searchMode, setSearchMode] = useState<"first_name" | "full_name">(initialMode);
  const [firstName, setFirstName] = useState(initialFirst);
  const [lastName, setLastName] = useState(initialLast);
  const [errorMessage, setErrorMessage] = useState("");
  const [shake, setShake] = useState(false);

  // Suggestion states
  const [firstSuggestions, setFirstSuggestions] = useState<string[]>([]);
  const [lastSuggestions, setLastSuggestions] = useState<string[]>([]);
  const [highlightedFirstIndex, setHighlightedFirstIndex] = useState(-1);
  const [highlightedLastIndex, setHighlightedLastIndex] = useState(-1);
  const [isFirstFocused, setIsFirstFocused] = useState(false);
  const [isLastFocused, setIsLastFocused] = useState(false);

  const localFirstInputRef = useRef<HTMLInputElement | null>(null);
  const activeFirstRef = inputRef || localFirstInputRef;

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 450);
  };

  // Update suggestions on first name change
  const handleFirstChange = (val: string) => {
    setErrorMessage("");
    const trimmed = val.slice(0, 30);
    setFirstName(trimmed);
    setHighlightedFirstIndex(-1);

    if (searchMode === "first_name") {
      if (trimmed.includes(" ")) {
        // If user typed a space in first-name mode, search full-name combinations
        const fulls = searchFullNameSuggestions(trimmed, 6);
        setFirstSuggestions(fulls);
      } else if (trimmed.trim().length >= 1) {
        const matches = searchFirstNameSuggestions(trimmed, 6);
        setFirstSuggestions(matches.map((m) => m.name));
      } else {
        setFirstSuggestions([]);
      }
    } else {
      // Full Name mode - First Name input
      if (trimmed.trim().length >= 1) {
        const matches = searchFirstNameSuggestions(trimmed, 6);
        setFirstSuggestions(matches.map((m) => m.name));
      } else {
        setFirstSuggestions([]);
      }
    }
  };

  // Update suggestions on last name change
  const handleLastChange = (val: string) => {
    setErrorMessage("");
    const trimmed = val.slice(0, 30);
    setLastName(trimmed);
    setHighlightedLastIndex(-1);

    if (trimmed.trim().length >= 1) {
      const matches = searchSurnameSuggestions(trimmed, 6);
      setLastSuggestions(matches.map((m) => m.name));
    } else {
      setLastSuggestions([]);
    }
  };

  const handleSelectFirstSuggestion = (suggestion: string) => {
    if (searchMode === "first_name" && suggestion.includes(" ")) {
      // User selected a full name
      const [f, ...rest] = suggestion.split(" ");
      const l = rest.join(" ");
      setSearchMode("full_name");
      setFirstName(f);
      setLastName(l);
      setFirstSuggestions([]);
      setErrorMessage("");
      onSubmit({
        searchMode: "full_name",
        firstName: f,
        lastName: l,
      });
    } else {
      setFirstName(suggestion);
      setFirstSuggestions([]);
      setErrorMessage("");
      if (searchMode === "first_name") {
        onSubmit({
          searchMode: "first_name",
          firstName: suggestion,
          lastName: "",
        });
      }
    }
  };

  const handleSelectLastSuggestion = (suggestion: string) => {
    setLastName(suggestion);
    setLastSuggestions([]);
    setErrorMessage("");
    if (firstName.trim()) {
      onSubmit({
        searchMode: "full_name",
        firstName: firstName.trim(),
        lastName: suggestion,
      });
    }
  };

  // Keyboard navigation for First Name
  const handleFirstKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (firstSuggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedFirstIndex((prev) => (prev < firstSuggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedFirstIndex((prev) => (prev > 0 ? prev - 1 : firstSuggestions.length - 1));
    } else if (e.key === "Enter" && highlightedFirstIndex >= 0) {
      e.preventDefault();
      handleSelectFirstSuggestion(firstSuggestions[highlightedFirstIndex]);
    } else if (e.key === "Escape") {
      setFirstSuggestions([]);
      setHighlightedFirstIndex(-1);
    }
  };

  // Keyboard navigation for Last Name
  const handleLastKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (lastSuggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedLastIndex((prev) => (prev < lastSuggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedLastIndex((prev) => (prev > 0 ? prev - 1 : lastSuggestions.length - 1));
    } else if (e.key === "Enter" && highlightedLastIndex >= 0) {
      e.preventDefault();
      handleSelectLastSuggestion(lastSuggestions[highlightedLastIndex]);
    } else if (e.key === "Escape") {
      setLastSuggestions([]);
      setHighlightedLastIndex(-1);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setFirstSuggestions([]);
    setLastSuggestions([]);

    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();

    if (!trimmedFirst) {
      setErrorMessage("Please enter a first name.");
      triggerShake();
      return;
    }

    const firstValid = validateName(trimmedFirst.split(/\s+/)[0]);
    if (!firstValid.isValid) {
      setErrorMessage(firstValid.reason || "Please enter a valid first name.");
      triggerShake();
      return;
    }

    if (searchMode === "full_name" && !trimmedLast) {
      setErrorMessage("Please enter a last name for full-name analysis.");
      triggerShake();
      return;
    }

    if (trimmedLast) {
      const lastValid = validateName(trimmedLast);
      if (!lastValid.isValid) {
        setErrorMessage(lastValid.reason || "Please enter a valid last name.");
        triggerShake();
        return;
      }
    }

    setErrorMessage("");
    onSubmit({
      searchMode,
      firstName: trimmedFirst,
      lastName: trimmedLast,
    });
  };

  const handleSelectExample = (nameExample: string) => {
    setFirstSuggestions([]);
    setLastSuggestions([]);
    if (nameExample.includes(" ")) {
      const [f, ...rest] = nameExample.split(" ");
      const l = rest.join(" ");
      setSearchMode("full_name");
      setFirstName(f);
      setLastName(l);
      setErrorMessage("");
      onSubmit({
        searchMode: "full_name",
        firstName: f,
        lastName: l,
      });
    } else {
      setSearchMode("first_name");
      setFirstName(nameExample);
      setLastName("");
      setErrorMessage("");
      onSubmit({
        searchMode: "first_name",
        firstName: nameExample,
        lastName: "",
      });
    }
  };

  const showFirstDropdown = isFirstFocused && firstSuggestions.length > 0;
  const showLastDropdown = isLastFocused && lastSuggestions.length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left" noValidate>
      {/* Mode Switch Pills */}
      <div className="flex items-center gap-1.5 rounded-xl bg-secondary/80 p-1.5 border border-border/50">
        <button
          type="button"
          onClick={() => {
            setSearchMode("first_name");
            setFirstSuggestions([]);
            setLastSuggestions([]);
            setErrorMessage("");
          }}
          className={`flex-1 min-w-0 min-h-[48px] h-12 px-2 sm:px-3 py-2 text-[14px] sm:text-[16px] font-semibold rounded-lg transition-all flex items-center justify-center text-center gap-1.5 sm:gap-2 whitespace-nowrap ${
            searchMode === "first_name"
              ? "bg-card text-foreground shadow-sm shadow-black/5"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <User className="h-4 w-4 shrink-0" />
          <span className="truncate">First Name</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setSearchMode("full_name");
            setFirstSuggestions([]);
            setLastSuggestions([]);
            setErrorMessage("");
          }}
          className={`flex-1 min-w-0 min-h-[48px] h-12 px-2 sm:px-3 py-2 text-[14px] sm:text-[16px] font-semibold rounded-lg transition-all flex items-center justify-center text-center gap-1.5 sm:gap-2 whitespace-nowrap ${
            searchMode === "full_name"
              ? "bg-card text-foreground shadow-sm shadow-black/5"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="h-4 w-4 shrink-0" />
          <span className="sm:hidden truncate">Full Name</span>
          <span className="hidden sm:inline truncate">Full Name (First + Last)</span>
        </button>
      </div>

      {/* Input Fields */}
      <div className={`space-y-3 ${shake ? "animate-[shake_0.4s_ease-in-out]" : ""}`}>
        {/* First Name Field */}
        <div className="relative">
          <label htmlFor="first-name-input" className="block text-[16px] font-medium text-foreground/90 mb-1.5">
            {searchMode === "full_name" ? "First Name" : "First Name (or Full Name)"}
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
            <input
              id="first-name-input"
              ref={activeFirstRef}
              type="text"
              placeholder={searchMode === "full_name" ? "e.g. David, José, Rahul, Wei" : "e.g. David, Sophia, José, O'Connor"}
              value={firstName}
              onChange={(e) => handleFirstChange(e.target.value)}
              onKeyDown={handleFirstKeyDown}
              onFocus={() => {
                setIsFirstFocused(true);
                if (firstName.trim().length >= 1) handleFirstChange(firstName);
              }}
              onBlur={() => {
                setTimeout(() => setIsFirstFocused(false), 200);
              }}
              maxLength={30}
              autoComplete="off"
              role="combobox"
              aria-expanded={showFirstDropdown}
              aria-autocomplete="list"
              aria-controls="first-name-listbox"
              aria-invalid={Boolean(errorMessage)}
              className="w-full min-h-[48px] h-12 rounded-xl border-2 border-border bg-background pl-11 pr-4 text-foreground text-[17px] placeholder:text-muted-foreground/60 placeholder:text-[16px] focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all"
            />
          </div>

          {/* First Name Suggestions Dropdown */}
          {showFirstDropdown && (
            <ul
              id="first-name-listbox"
              role="listbox"
              className="absolute top-full left-0 right-0 mt-1.5 bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-2xl z-30 max-h-60 overflow-y-auto p-1.5 space-y-1"
            >
              {firstSuggestions.map((item, idx) => (
                <li
                  key={item}
                  role="option"
                  aria-selected={highlightedFirstIndex === idx}
                  onMouseDown={() => handleSelectFirstSuggestion(item)}
                  onMouseEnter={() => setHighlightedFirstIndex(idx)}
                  className={`min-h-[44px] px-3.5 py-2.5 sm:py-3 text-[16px] rounded-lg cursor-pointer flex items-center justify-between transition-colors ${
                    highlightedFirstIndex === idx
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-foreground hover:bg-secondary"
                  }`}
                >
                  <span>{item}</span>
                  <span className="text-xs opacity-75">
                    {item.includes(" ") ? "Full Name" : "First Name"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Last Name Field (Full Name Mode) */}
        {searchMode === "full_name" && (
          <div className="relative animate-in fade-in duration-200">
            <label htmlFor="last-name-input" className="block text-[16px] font-medium text-foreground/90 mb-1.5">
              Last Name / Surname
            </label>
            <input
              id="last-name-input"
              type="text"
              placeholder="e.g. Smith, Garcia, Sharma, O'Connor"
              value={lastName}
              onChange={(e) => handleLastChange(e.target.value)}
              onKeyDown={handleLastKeyDown}
              onFocus={() => {
                setIsLastFocused(true);
                if (lastName.trim().length >= 1) handleLastChange(lastName);
              }}
              onBlur={() => {
                setTimeout(() => setIsLastFocused(false), 200);
              }}
              maxLength={30}
              autoComplete="off"
              role="combobox"
              aria-expanded={showLastDropdown}
              aria-autocomplete="list"
              aria-controls="last-name-listbox"
              aria-label="Last Name"
              className="w-full min-h-[48px] h-12 rounded-xl border-2 border-border bg-background px-4 text-foreground text-[17px] placeholder:text-muted-foreground/60 placeholder:text-[16px] focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all"
            />

            {/* Last Name Suggestions Dropdown */}
            {showLastDropdown && (
              <ul
                id="last-name-listbox"
                role="listbox"
                className="absolute top-full left-0 right-0 mt-1.5 bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-2xl z-30 max-h-60 overflow-y-auto p-1.5 space-y-1"
              >
                {lastSuggestions.map((item, idx) => (
                  <li
                    key={item}
                    role="option"
                    aria-selected={highlightedLastIndex === idx}
                    onMouseDown={() => handleSelectLastSuggestion(item)}
                    onMouseEnter={() => setHighlightedLastIndex(idx)}
                    className={`min-h-[44px] px-3.5 py-2.5 sm:py-3 text-[16px] rounded-lg cursor-pointer flex items-center justify-between transition-colors ${
                      highlightedLastIndex === idx
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    <span>{item}</span>
                    <span className="text-xs opacity-75">Surname</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {errorMessage && (
        <p role="alert" className="text-xs text-destructive font-medium -mt-1">
          {errorMessage}
        </p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !firstName.trim()}
        className="group relative w-full min-h-[48px] h-12 rounded-xl font-semibold text-[18px] sm:text-[19px] text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary)), hsl(280 60% 55%))",
        }}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Analyzing Demographics...
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
            Check Now
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        )}
      </button>

      {/* Example Chips */}
      <div className="pt-2">
        <p className="block text-[16px] font-medium text-muted-foreground mb-2.5">Try an example search:</p>
        <div className="flex flex-wrap gap-2">
          {["James", "Mary", "Olivia", "Liam", "David Smith", "Sophia Johnson"].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => handleSelectExample(n)}
              className="min-h-[36px] px-3.5 py-2 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground text-[15px] font-medium border border-border/70 transition-colors text-foreground inline-flex items-center justify-center"
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
};
