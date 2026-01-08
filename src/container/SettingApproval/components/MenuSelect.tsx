import { useGetMenusDropdown } from "@/services/settingApproval/getMenusDropdown";

import SelectSearch from "@/components/Select/SelectSearch";

interface MenuSelectProps {
  value: string;
  onChange?: (value: string) => void;
  isDisabled?: boolean;
  moduleId?: string; // Added moduleId to filter menus
  search?: string;
}

export default function MenuSelect({
  value,
  onChange,
  isDisabled,
  moduleId,
  search,
}: MenuSelectProps) {
  // Only fetch data if component is not disabled
  const shouldFetch = !isDisabled;
  const {
    data: menuOptions,
    isLoading,
    error,
  } = useGetMenusDropdown(shouldFetch ? { moduleId, search } : null);

  // Transform API response to match SelectSearch component format
  const transformedOptions =
    menuOptions?.map((option) => ({
      value: option.id,
      label: option.name,
    })) || [];

  // If component is disabled and has a value that's not in the options,
  // we need to ensure it displays properly in the disabled state
  if (
    isDisabled &&
    value &&
    !transformedOptions.find((opt) => opt.value === value)
  ) {
    // Try to find the label from the original menuOptions first
    const originalOption = menuOptions?.find((opt) => opt.id === value);
    if (originalOption) {
      // Add the option with the proper label
      transformedOptions.push({
        value: originalOption.id,
        label: originalOption.name,
      });
    } else {
      // If we can't find the original, add it with value as label
      transformedOptions.push({
        value: value,
        label: value, // In a real implementation, you might want to fetch the specific value
      });
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="flex items-center">
          <label className="w-32 text-sm font-medium text-gray-700">
            Menu*
          </label>
        </div>
        <div className="md:col-span-2">
          <SelectSearch
            options={[]}
            value={value}
            onChange={onChange}
            placeholder="Loading..."
            disabled={true}
          />
        </div>
      </div>
    );
  }

  if (error) {
    console.error("Error loading menu options:", error);
    return (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="flex items-center">
          <label className="w-32 text-sm font-medium text-gray-700">
            Menu*
          </label>
        </div>
        <div className="md:col-span-2">
          <SelectSearch
            options={[]}
            value={value}
            onChange={onChange}
            placeholder="Pilih Modul Terlebih Dahulu"
            disabled={isDisabled}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <div className="flex items-center">
        <label className="w-32 text-sm font-medium text-gray-700">Menu*</label>
      </div>
      <div className="md:col-span-2">
        <SelectSearch
          options={transformedOptions}
          value={value}
          onChange={onChange}
          placeholder="Pilih Menu"
          disabled={isDisabled}
        />
      </div>
    </div>
  );
}
