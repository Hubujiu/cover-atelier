import { useEffect, useId, useRef, useState } from "react";
import { CaretDown, Check } from "@phosphor-icons/react";
import { getNextSelectIndex } from "../lib/selectNavigation";

export type StyledSelectOption = {
  value: string;
  label: string;
};

type StyledSelectProps = {
  value: string;
  options: StyledSelectOption[];
  ariaLabel: string;
  className?: string;
  onChange: (value: string) => void;
};

export function StyledSelect({
  value,
  options,
  ariaLabel,
  className = "",
  onChange,
}: StyledSelectProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value));
  const [activeIndex, setActiveIndex] = useState(selectedIndex);
  const selectedOption = options[selectedIndex];

  useEffect(() => {
    setActiveIndex(selectedIndex);
  }, [selectedIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  const openWithIndex = (index: number) => {
    setActiveIndex(index);
    setIsOpen(true);
  };

  const commit = (index: number) => {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    setActiveIndex(index);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? "next" : "previous";
      const startingIndex = isOpen ? activeIndex : selectedIndex;
      openWithIndex(getNextSelectIndex(startingIndex, direction, options.length));
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (isOpen) {
        commit(activeIndex);
      } else {
        openWithIndex(selectedIndex);
      }
      return;
    }

    if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      setIsOpen(false);
      return;
    }

    if (event.key === "Tab") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={rootRef} className={`styled-select ${isOpen ? "is-open" : ""} ${className}`.trim()}>
      <button
        className="select-trigger"
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        onClick={() => (isOpen ? setIsOpen(false) : openWithIndex(selectedIndex))}
        onKeyDown={handleKeyDown}
      >
        <span>{selectedOption?.label ?? value}</span>
        <CaretDown className="select-chevron" size={15} weight="bold" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="select-menu" id={listId} role="listbox" aria-label={ariaLabel}>
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;
            return (
              <button
                key={option.value}
                className={`select-option ${isActive ? "is-active" : ""} ${isSelected ? "is-selected" : ""}`.trim()}
                type="button"
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => commit(index)}
              >
                <span>{option.label}</span>
                {isSelected && <Check size={15} weight="bold" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
