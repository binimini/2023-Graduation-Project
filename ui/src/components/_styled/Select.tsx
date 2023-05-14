import React, { SetStateAction, Dispatch } from "react";

interface OptionPropType {
  name: string;
  id: string;
}

interface PropType {
  options?: Array<OptionPropType>;
  setSelection: Dispatch<SetStateAction<string>>;
  placeholder?: string;
  className?: string;
  label?: string;
  disabled?: boolean;
}

const SelectBox = ({
  options = [],
  setSelection,
  placeholder = "Select an option",
  className = "select select-xs select-ghost w-full max-w-xs",
  label,
  disabled
}: PropType) => {
  const onSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelection(e.target.value);
  };

  return (
    <div className="w-full py-[4px] pl-[12px]">
      <div className="w-full text-left text-xs font-bold">
        {label != undefined && `· ${label}`}
      </div>
      <select
        defaultValue={-1}
        className={className}
        onChange={onSelectionChange}
        disabled={disabled}
      >
        <option value={-1}>{placeholder}</option>
        {options.map((e) => (
          <option key={e.id} value={e.id}>
            {e.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectBox;
