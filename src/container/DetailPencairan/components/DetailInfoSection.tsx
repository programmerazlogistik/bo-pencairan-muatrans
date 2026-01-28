import { cn } from "@muatmuat/lib/utils";
import { Input } from "@muatmuat/ui/Form";

export interface DetailField {
  label: string;
  value: string;
  isLink?: boolean;
  color?: "blue" | "green" | "black";
}

interface DetailInfoSectionProps {
  fields: DetailField[];
}

const DetailInfoSection = ({ fields }: DetailInfoSectionProps) => {
  const getTextColorClass = (field: DetailField) => {
    if (field.isLink) return "text-[#176CF7] underline";
    if (field.color === "green") return "text-[#3ECD00] font-bold";
    if (field.color === "blue") return "text-[#176CF7]";
    return "text-[#1B1B1B]";
  };

  return (
    <div className="flex w-full flex-col gap-[10px]">
      {fields.map((field, index) => {
        // Handle divider
        if (field.label === "divider") {
          return (
            <div
              key={index}
              className="my-[10px] h-[1px] w-full border-t border-[#C6CBD4]"
            />
          );
        }

        return (
          <div
            key={index}
            className="flex flex-row items-center gap-[21px] px-[10px] py-0 pl-[32px]"
          >
            <span className="w-[230px] min-w-[230px] text-[14px] font-semibold leading-[140%] text-[#868686]">
              {field.label}
            </span>
            <Input
              disabled
              value={field.value}
              className={cn("h-[32px] flex-1", getTextColorClass(field))}
              appearance={{
                containerClassName:
                  "h-[32px] rounded-[6px] bg-[#D7D7D7] border-[#A8A8A8]",
                inputClassName: cn(
                  "text-xs font-medium",
                  getTextColorClass(field)
                ),
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default DetailInfoSection;
