import { Input } from "@muatmuat/ui/Form";

interface NamaMenuInputProps {
  value: string;
  onChange?: (value: string) => void;
  isDisabled?: boolean;
}

export default function NamaMenuInput({
  value,
  onChange,
  isDisabled,
}: NamaMenuInputProps) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <div className="flex items-center">
        <label className="w-32 text-sm font-medium text-gray-700">
          Nama Menu*
        </label>
      </div>
      <div className="md:col-span-2">
        <Input
          type="text"
          placeholder="Pilih Menu"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={isDisabled}
        />
      </div>
    </div>
  );
}
