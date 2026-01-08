import { TextArea } from "@muatmuat/ui/Form";

interface QueryDetailInputProps {
  value: string;
  onChange?: (value: string) => void;
  isDisabled?: boolean;
}

export default function QueryDetailInput({
  value,
  onChange,
  isDisabled,
}: QueryDetailInputProps) {
  // Calculate rows based on content
  const lineCount = value ? value.split("\n").length : 1;
  const rows = Math.max(10, lineCount + 2);

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <div className="flex items-start pt-2">
        <label className="w-32 text-sm font-medium text-gray-700">
          Query Detail*
        </label>
      </div>
      <div className="md:col-span-2">
        <TextArea
          placeholder="Masukkan Query SELECT"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={isDisabled}
          rows={rows}
        />
      </div>
    </div>
  );
}
