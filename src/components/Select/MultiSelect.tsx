"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { cn } from "@muatmuat/lib/utils";
import { Checkbox, Input } from "@muatmuat/ui/Form";
import { ScrollArea } from "@muatmuat/ui/ScrollArea";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { ChevronDown, X } from "lucide-react";

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectContextProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedValues: string[];
  toggleValue: (value: string) => void;
  toggleAllValues: () => void;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  options: MultiSelectOption[];
  placeholder: string;
  selectAllText?: string;
  clearSearch: () => void;
  enableSelectAll: boolean;
  disabled: boolean;
}

const MultiSelectContext = createContext<MultiSelectContextProps | null>(null);

const useMultiSelect = () => {
  const context = useContext(MultiSelectContext);
  if (!context) {
    throw new Error("useMultiSelect must be used within a MultiSelect.Root");
  }
  return context;
};

// --- Compound Components ---

interface MultiSelectComponents {
  Root: React.FC<MultiSelectRootProps>;
  Trigger: React.ForwardRefExoticComponent<
    React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger> &
      React.RefAttributes<HTMLButtonElement>
  >;
  Content: React.ForwardRefExoticComponent<
    React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
      children?: React.ReactNode;
    } & React.RefAttributes<HTMLDivElement>
  >;
  Search: React.ForwardRefExoticComponent<
    SearchProps & React.RefAttributes<HTMLInputElement>
  >;
  List: React.ForwardRefExoticComponent<
    Omit<React.ComponentPropsWithoutRef<typeof ScrollArea>, "children"> &
      React.RefAttributes<HTMLDivElement>
  >;
}

/**
 * Root component: Manages state for the multi-select dropdown.
 */
interface MultiSelectRootProps {
  children: React.ReactNode;
  options: MultiSelectOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  selectAllText?: string;
  enableSelectAll?: boolean;
  disabled?: boolean;
}

const Root: React.FC<MultiSelectRootProps> = ({
  children,
  options,
  value,
  onValueChange,
  placeholder = "Select options...",
  selectAllText = "Select All",
  enableSelectAll = true,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Clear search when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
    }
  }, [isOpen]);

  // Memoize callback functions to prevent unnecessary re-renders
  const toggleValue = useCallback(
    (valueToToggle: string) => {
      onValueChange(
        value.includes(valueToToggle)
          ? value.filter((v) => v !== valueToToggle)
          : [...value, valueToToggle]
      );
    },
    [value, onValueChange]
  );

  const toggleAllValues = useCallback(() => {
    const allValues = options.map((option) => option.value);
    const allSelected = allValues.every((val) => value.includes(val));
    onValueChange(allSelected ? [] : allValues);
  }, [options, value, onValueChange]);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  const contextValue = {
    isOpen,
    setIsOpen,
    selectedValues: value,
    toggleValue,
    toggleAllValues,
    searchTerm,
    setSearchTerm,
    options,
    placeholder,
    selectAllText,
    clearSearch,
    enableSelectAll,
    disabled,
  };

  return (
    <MultiSelectContext.Provider value={contextValue}>
      <PopoverPrimitive.Root
        open={isOpen}
        onOpenChange={disabled ? undefined : setIsOpen}
      >
        {children}
      </PopoverPrimitive.Root>
    </MultiSelectContext.Provider>
  );
};

/**
 * Trigger component: Renders the dropdown trigger, showing placeholder or selected tags.
 */
const Trigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const {
    isOpen,
    selectedValues,
    options,
    placeholder,
    toggleValue,
    disabled,
  } = useMultiSelect();

  const selectedOptions = useMemo(
    () => options.filter((opt) => selectedValues.includes(opt.value)),
    [options, selectedValues]
  );

  return (
    <PopoverPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex h-8 w-full min-w-0 items-center justify-between gap-2 rounded-[6px] border border-[#A8A8A8] bg-white px-2 py-[7px] text-xs font-medium transition-colors",
        "focus:outline-none focus:ring-1 focus:ring-offset-0",
        isOpen
          ? "border-[#176CF7]"
          : "hover:border-primary-700 data-[state=closed]:border-[#A8A8A8]",
        disabled && "cursor-not-allowed border border-black bg-neutral-200",
        className
      )}
      {...props}
    >
      <div className="flex flex-1 flex-wrap items-center gap-1 overflow-hidden">
        {selectedOptions.length === 0 ? (
          <span className="font-medium text-[#868686]">{placeholder}</span>
        ) : (
          selectedOptions.map((option) => (
            <div
              key={option.value}
              className="flex h-[22px] items-center justify-center gap-[4px] rounded-[16px] border border-[#176CF7] bg-white px-[12px] py-[6px]"
            >
              <span
                className={cn(
                  "font-['Avenir_Next_LT_Pro'] text-[10px] font-semibold leading-[12px] text-[#176CF7]",
                  disabled && "border-gray-400 text-gray-400"
                )}
              >
                {option.label}
              </span>
              <X
                className={cn(
                  "h-[12px] w-[12px] cursor-pointer text-[#176CF7]",
                  disabled && "text-gray-400"
                )}
                strokeWidth={3}
                onClick={(e) => {
                  if (disabled) return;
                  e.stopPropagation(); // Prevent dropdown from opening/closing
                  toggleValue(option.value);
                }}
              />
            </div>
          ))
        )}
      </div>
      <ChevronDown
        className={cn(
          "h-4 w-4 text-[#868686] transition-transform",
          isOpen && "rotate-180",
          disabled && "opacity-50"
        )}
      />
    </PopoverPrimitive.Trigger>
  );
});
Trigger.displayName = "MultiSelect.Trigger";

/**
 * Content component: The popover content area.
 */
const Content = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
    children?: React.ReactNode;
  }
>(({ className, children, ...props }, ref) => {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        className={cn(
          "z-50 w-[var(--radix-popover-trigger-width)] rounded-[6px] border border-[#176CF7] bg-white p-3 shadow-md",
          "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        sideOffset={5}
        align="start"
        {...props}
      >
        {children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
});
Content.displayName = "MultiSelect.Content";

/**
 * Search component: The search input inside the popover.
 */
interface SearchProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof Input>,
    "onChange" | "placeholder"
  > {
  placeholder?: string;
}

const Search = React.forwardRef<HTMLInputElement, SearchProps>(
  ({ className, placeholder = "Cari disini...", ...props }, ref) => {
    const { searchTerm, setSearchTerm, disabled } = useMultiSelect();
    return (
      <Input
        ref={ref}
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => {
          if (disabled) return;
          setSearchTerm(e.target.value);
        }}
        appearance={{
          containerClassName: "h-8 border-[#A8A8A8]",
          inputClassName: "text-xs placeholder:text-[#868686]",
        }}
        disabled={disabled}
        className={cn("mb-3 w-full", className)}
        {...props}
      />
    );
  }
);
Search.displayName = "MultiSelect.Search";

/**
 * List component: The scrollable list of options.
 */
const List = React.forwardRef<
  HTMLDivElement,
  Omit<React.ComponentPropsWithoutRef<typeof ScrollArea>, "children">
>(({ className, ...props }, ref) => {
  const {
    options,
    searchTerm,
    selectedValues,
    toggleValue,
    toggleAllValues,
    selectAllText,
    enableSelectAll,
    disabled,
  } = useMultiSelect();

  const filteredOptions = useMemo(() => {
    // If no search term, return all options
    if (!searchTerm.trim()) {
      return options;
    }
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  return (
    <ScrollArea
      ref={ref}
      className={cn("h-[144px] w-full", className)}
      {...props}
    >
      <div className="flex flex-col gap-3 pr-3">
        {enableSelectAll && (
          <div className="flex items-center gap-2">
            <Checkbox
              label={selectAllText}
              checked={
                options.length > 0 &&
                options.every((option) => selectedValues.includes(option.value))
              }
              onCheckedChange={() => {
                if (disabled) return;
                toggleAllValues();
              }}
              appearance={{
                labelClassName: "font-bold",
              }}
              disabled={disabled}
            />
          </div>
        )}
        {filteredOptions.length === 0 ? (
          <div className="flex items-center justify-center py-4 text-xs text-gray-500">
            No options found
          </div>
        ) : (
          filteredOptions.map((option) => (
            <Checkbox
              key={`${option.value}-${option.label}`}
              label={option.label}
              checked={selectedValues.includes(option.value)}
              onCheckedChange={() => {
                if (disabled) return;
                toggleValue(option.value);
              }}
              appearance={{
                labelClassName: "font-['Avenir_Next_LT_Pro'] text-[12px] font-normal ",
              }}
              disabled={disabled}
            />
          ))
        )}
      </div>
    </ScrollArea>
  );
});
List.displayName = "MultiSelect.List";

export const MultiSelect: MultiSelectComponents = {
  Root,
  Trigger,
  Content,
  Search,
  List,
};
