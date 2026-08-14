import React, { useState } from "react";
import { Search, ArrowRight, Loader2, User, Users } from "lucide-react";
import { validateName } from "../../lib/names/validateName";

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

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 450);
  };

  const handleFirstChange = (val: string) => {
    setErrorMessage("");
    // Do NOT strip valid Unicode characters
    setFirstName(val.slice(0, 30));
  };

  const handleLastChange = (val: string) => {
    setErrorMessage("");
    setLastName(val.slice(0, 30));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left" noValidate>
      {/* Mode Switch Pills */}
      <div className="flex items-center gap-1 rounded-xl bg-secondary/80 p-1 border border-border/50">
        <button
          type="button"
          onClick={() => setSearchMode("first_name")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
            searchMode === "first_name"
              ? "bg-card text-foreground shadow-sm shadow-black/5"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <User className="h-3.5 w-3.5" />
          First Name
        </button>
        <button
          type="button"
          onClick={() => setSearchMode("full_name")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
            searchMode === "full_name"
              ? "bg-card text-foreground shadow-sm shadow-black/5"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          Full Name (First + Last)
        </button>
      </div>

      {/* Input Fields */}
      <div className={`space-y-3 ${shake ? "animate-[shake_0.4s_ease-in-out]" : ""}`}>
        <div>
          <label htmlFor="first-name-input" className="block text-xs font-medium text-muted-foreground mb-1.5">
            {searchMode === "full_name" ? "First Name" : "First Name (or Full Name)"}
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
            <input
              id="first-name-input"
              ref={inputRef}
              type="text"
              placeholder={searchMode === "full_name" ? "e.g. David, José, Rahul, Wei" : "e.g. David, Sophia, José, O'Connor"}
              value={firstName}
              onChange={(e) => handleFirstChange(e.target.value)}
              maxLength={30}
              autoComplete="given-name"
              aria-invalid={Boolean(errorMessage)}
              className="w-full h-13 rounded-xl border-2 border-border bg-background pl-11 pr-4 text-foreground text-base placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all"
            />
          </div>
        </div>

        {searchMode === "full_name" && (
          <div className="animate-in fade-in duration-200">
            <label htmlFor="last-name-input" className="block text-xs font-medium text-muted-foreground mb-1.5">
              Last Name / Surname
            </label>
            <input
              id="last-name-input"
              type="text"
              placeholder="e.g. Smith, Garcia, Sharma, O'Connor"
              value={lastName}
              onChange={(e) => handleLastChange(e.target.value)}
              maxLength={30}
              autoComplete="family-name"
              aria-label="Last Name"
              className="w-full h-13 rounded-xl border-2 border-border bg-background px-4 text-foreground text-base placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all"
            />
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
        className="group relative w-full h-13 rounded-xl font-semibold text-base text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
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
        <p className="text-xs text-muted-foreground mb-2">Try an example search:</p>
        <div className="flex flex-wrap gap-1.5">
          {["James", "Mary", "Olivia", "Liam", "David Smith", "Sophia Johnson"].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => handleSelectExample(n)}
              className="px-2.5 py-1 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground text-xs font-medium border border-border/70 transition-colors text-foreground"
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
};
