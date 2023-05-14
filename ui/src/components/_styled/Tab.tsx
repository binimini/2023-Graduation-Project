import React, { SetStateAction, Dispatch } from "react";

interface PropType {
  onClick: Dispatch<SetStateAction<string>>;
  placeholder: string;
  className: string;
  label: string;
}

const SelectBox = ({
  options,
  setSelection,
  placeholder = "Select an option",
  className = "select select-xs select-ghost w-full max-w-xs",
  label,
}: PropType) => {
  const onSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target);

    setSelection(e.target.value);
  };
  return (
    <div className="tabs w-full">
      <a
        id="0"
        className={`tab tab-lifted border-none ${
          tabNum == 0 && "tab-active"
        } w-1/2`}
        onClick={onClickTab}
      >
        필터검색
      </a>
      <a
        id="1"
        className={`tab tab-lifted border-none ${
          tabNum == 1 && "tab-active"
        } w-1/2`}
        onClick={onClickTab}
      >
        번호검색
      </a>
    </div>
  );
};

export default SelectBox;
