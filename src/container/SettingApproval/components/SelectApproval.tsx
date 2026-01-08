import React, { useEffect, useMemo, useRef, useState } from "react";

import { Check, ChevronDown, Plus, Search } from "@muatmuat/icons";
import { cn } from "@muatmuat/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@muatmuat/ui/Popover";
import { X } from "lucide-react";

import { useGetPositionsDropdown } from "@/services/settingApproval/getPositionsDropdown";
import { useGetUsersDropdown } from "@/services/settingApproval/getUsersDropdown";

export interface Option {
  label: string;
  value: string;
  description?: string;
}

interface SelectSearchProps {
  options?: Option[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onCreate?: (searchTerm: string) => void;
  className?: string;
  search?: string;
}

/**
 * SelectSearch Component
 */
const SelectApproval: React.FC<SelectSearchProps> = ({
  options = [],
  value,
  onChange,
  placeholder = "Select item...",
  disabled = false,
  onCreate,
  className,
  search,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(search || "");
  const inputRef = useRef(null);
  const triggerRef = useRef(null);
  const [triggerWidth, setTriggerWidth] = useState(0);
  const [activeTab, setActiveTab] = useState<"user" | "position">("user"); // Removed 'all' option

  // Fetch users and positions from API
  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
  } = useGetUsersDropdown({ search: searchTerm });
  const {
    data: positionsData,
    isLoading: positionsLoading,
    error: positionsError,
  } = useGetPositionsDropdown({ search: searchTerm });

  // Sync Popover width with Trigger width
  useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [triggerRef.current, isOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 50);
    }
  }, [isOpen]);

  // Transform user and position data
  const userOptions = useMemo(() => {
    return (
      usersData?.map((user) => ({
        value: `user-${user.id}`,
        label: user.label,
        description: undefined,
      })) || []
    );
  }, [usersData]);

  const positionOptions = useMemo(() => {
    return (
      positionsData?.map((position) => ({
        value: `position-${position.id}`,
        label: position.label,
        description: undefined,
      })) || []
    );
  }, [positionsData]);

  // Determine which options to show based on active tab
  const filteredOptions = useMemo(() => {
    if (options && options.length > 0) {
      // If options are passed externally, use those
      return options;
    }

    if (activeTab === "user") {
      return userOptions;
    } else {
      // 'position' tab
      return positionOptions;
    }
  }, [options, userOptions, positionOptions, activeTab]);

  // Filter options based on search term
  const searchFilteredOptions = useMemo(() => {
    if (!searchTerm) return filteredOptions;
    return filteredOptions.filter((opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [filteredOptions, searchTerm]);

  const selectedOption =
    options && options.length > 0
      ? options.find((opt) => opt.value === value)
      : [...userOptions, ...positionOptions].find((opt) => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  // Show loading state when fetching data
  const isLoading =
    (activeTab === "user" && usersLoading) ||
    (activeTab === "position" && positionsLoading);
  const hasError =
    (activeTab === "user" && usersError) ||
    (activeTab === "position" && positionsError);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <button
          ref={triggerRef}
          type="button"
          className={cn(
            "group flex h-8 w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-xs font-medium transition-all",
            "border-neutral-600 text-neutral-900", // Default state
            "hover:border-primary-500", // Hover state
            "focus:outline-none focus:ring-0", // Remove default ring
            isOpen && "border-primary-700 ring-1 ring-primary-700", // Active/Open state
            disabled && "cursor-not-allowed bg-neutral-100 text-neutral-500",
            className
          )}
        >
          <span
            className={cn(
              "truncate",
              selectedOption ? "text-neutral-900" : "text-neutral-600"
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-neutral-500 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="rounded-md border border-neutral-400 bg-white p-0 shadow-[0px_4px_11px_rgba(65,65,65,0.25)]"
        style={{ width: triggerWidth || "auto" }}
        align="start"
        sideOffset={4}
      >
        <div className="flex flex-col">
          <div className="flex border-neutral-200 px-3 pb-1 pt-3 text-xs font-medium text-neutral-900">
            <div className="flex w-full max-w-[200px] rounded-md border border-[#A8A8A8]">
              <div
                className={`w-1/2 cursor-pointer rounded-l-md px-2 py-1 text-center ${activeTab === "user" ? "bg-[#A8A8A8]" : "hover:bg-neutral-100"}`}
                onClick={() => setActiveTab("user")}
              >
                User
              </div>
              <div
                className={`w-1/2 cursor-pointer rounded-r-md px-2 py-1 text-center ${activeTab === "position" ? "bg-[#A8A8A8]" : "hover:bg-neutral-100"}`}
                onClick={() => setActiveTab("position")}
              >
                Jabatan
              </div>
            </div>
          </div>
          {/* Search Header */}
          <div className="flex items-center gap-2 p-2.5">
            <div className="relative flex flex-1 items-center">
              <Search className="absolute left-2 h-4 w-4 text-neutral-500" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari Disini..."
                className={cn(
                  "h-8 w-full rounded-md border border-primary-700 bg-white pl-8 pr-8 text-xs font-medium text-neutral-900 placeholder:text-neutral-600",
                  "focus:outline-none focus:ring-0"
                )}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 flex items-center justify-center text-neutral-500 hover:text-neutral-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Options List */}
          <div className="scrollbar-custom max-h-[200px] min-h-0 flex-1 overflow-y-auto py-1">
            {isLoading ? (
              <div className="px-3 py-4 text-center text-xs text-neutral-500">
                Loading...
              </div>
            ) : hasError ? (
              <div className="px-3 py-4 text-center text-xs text-neutral-500">
                Error loading options
              </div>
            ) : searchFilteredOptions.length > 0 ? (
              searchFilteredOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "flex h-8 w-full items-center justify-between px-3 py-2 text-xs font-medium text-neutral-900 hover:bg-neutral-100",
                    value === option.value && "bg-primary-50 text-primary-700"
                  )}
                >
                  <span>
                    {"description" in option && option.description ? (
                      <>
                        {option.label}, {option.description}
                      </>
                    ) : (
                      option.label
                    )}
                  </span>
                  {value === option.value && (
                    <Check className="h-3 w-3 text-primary-700" />
                  )}
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-center text-xs text-neutral-500">
                Tidak ada hasil ditemukan
              </div>
            )}
          </div>

          {/* Add New Item Footer */}
          {onCreate && (
            <div className="border-t border-neutral-200 p-2">
              <button
                onClick={() => {
                  onCreate(searchTerm);
                  setIsOpen(false);
                }}
                className="flex h-8 w-full items-center gap-2 rounded-md px-2 text-left hover:bg-neutral-100"
              >
                <div className="flex h-4 w-4 items-center justify-center rounded bg-primary-700 text-white">
                  <Plus className="h-3 w-3" />
                </div>
                <span className="text-xs font-semibold text-neutral-900">
                  Tambah "{searchTerm || "Item Baru"}"
                </span>
              </button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SelectApproval;
