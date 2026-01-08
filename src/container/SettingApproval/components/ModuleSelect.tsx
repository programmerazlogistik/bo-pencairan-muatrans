import { Select } from "@muatmuat/ui/Form";

import { useGetModulesDropdown } from "@/services/settingApproval/getModulesDropdown";

interface ModuleSelectProps {
  value: string;
  onChange?: (value: string) => void;
  isDisabled?: boolean;
  search?: string;
}

export default function ModuleSelect({
  value,
  onChange,
  isDisabled,
  search,
}: ModuleSelectProps) {
  // Only fetch data if the component is not disabled (for edit/add views)
  // For detail views (disabled), we can skip the API call
  const shouldFetch = !isDisabled;
  const {
    data: moduleOptions,
    isLoading,
    error,
  } = useGetModulesDropdown(shouldFetch ? { search } : null);

  // Transform API response to match Select component format
  const transformedOptions =
    moduleOptions?.map((option) => ({
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
    // Try to find the label from the original moduleOptions first
    const originalOption = moduleOptions?.find((opt) => opt.id === value);
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
            Modul*
          </label>
        </div>
        <div className="md:col-span-2">
          <Select
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
    console.error("Error loading module options:", error);
    return (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="flex items-center">
          <label className="w-32 text-sm font-medium text-gray-700">
            Modul*
          </label>
        </div>
        <div className="md:col-span-2">
          <Select
            options={[]}
            value={value}
            onChange={onChange}
            placeholder="Error loading options"
            disabled={isDisabled}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <div className="flex items-center">
        <label className="w-32 text-sm font-medium text-gray-700">Modul</label>
      </div>
      <div className="md:col-span-2">
        <Select
          options={transformedOptions}
          value={value}
          onChange={onChange}
          placeholder="Pilih Modul"
          disabled={isDisabled}
        />
      </div>
    </div>
  );
}
