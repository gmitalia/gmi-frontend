import { forwardRef } from "react";
import { CloseIcon, SearchIcon } from "./Icons";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  ariaLabel: string;
  className?: string;
  autoFocus?: boolean;
};

/** Barra di ricerca condivisa dalle sezioni del sito. */
export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      value,
      onChange,
      onClear,
      placeholder = "Cerca...",
      ariaLabel,
      className = "",
      autoFocus = false,
    },
    ref
  ) => {
    const handleClear = onClear ?? (() => onChange(""));

    return (
      <div className={`relative w-full ${className}`}>
        <SearchIcon
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-content-muted"
        />
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-label={ariaLabel}
          autoFocus={autoFocus}
          className="h-12 w-full border border-default bg-surface pl-11 pr-11 text-base text-content outline-none transition-colors placeholder:text-content-muted/60 focus:border-content/40"
        />
        {value.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Cancella ricerca"
            className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center text-content-muted transition-colors hover:text-content"
          >
            <CloseIcon size={16} />
          </button>
        )}
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";

export default SearchBar;
