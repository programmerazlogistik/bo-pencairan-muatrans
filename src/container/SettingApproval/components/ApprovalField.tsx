import { Button } from "@muatmuat/ui/Button";
import { Input } from "@muatmuat/ui/Form";

import SelectApproval from "./SelectApproval";

interface ApprovalFieldProps {
  id: number;
  index: number;
  value: string;
  label?: string;
  logic: string;
  totalFields: number;
  isLast: boolean;
  onValueChange?: (value: string) => void;
  onLogicChange?: (value: string) => void;
  onRemove?: () => void;
  onAdd?: () => void;
  isDisabled?: boolean;
}

export default function ApprovalField({
  id,
  index,
  value,
  label,
  logic,
  totalFields,
  isLast,
  onValueChange,
  onLogicChange,
  onRemove,
  onAdd,
  isDisabled,
}: ApprovalFieldProps) {
  return (
    <div key={id}>
      <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-3">
        <div className="flex items-center">
          <label className="w-32 text-sm font-medium text-gray-700">
            {index === 0 ? "Approval 1*" : `Approval ${index + 1}*`}
          </label>
        </div>
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <SelectApproval
                placeholder="Pilih approval"
                value={value}
                options={label ? [{ label, value }] : []}
                onChange={onValueChange}
                disabled={isDisabled}
              />
            </div>
            {totalFields > 1 && !isLast && !isDisabled && (
              <Button
                type="button"
                variant="muatparts-error"
                className="h-10 w-10 rounded-full p-0"
                onClick={onRemove}
              >
                -
              </Button>
            )}
            {isLast && !isDisabled && (
              <Button
                type="button"
                variant="muatparts-primary-secondary"
                className={`h-10 w-10 rounded-full border-none p-0 text-white ${
                  index > 0
                    ? "bg-primary hover:bg-primary-800"
                    : "bg-success-400 hover:bg-success-500"
                }`}
                onClick={onAdd}
              >
                +
              </Button>
            )}
          </div>
        </div>
      </div>
      {totalFields > 1 && !isLast && (
        <div className="mt-3 grid grid-cols-1 items-center gap-3 md:grid-cols-3">
          <div className="flex items-center">
            <label className="w-32 text-sm font-medium text-gray-700">
              Logic
            </label>
          </div>
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="AND atau OR"
                  value={logic}
                  onChange={(e) => onLogicChange?.(e.target.value)}
                  disabled={isDisabled}
                />
              </div>
              {!isDisabled && <div className="w-[50px]" />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
