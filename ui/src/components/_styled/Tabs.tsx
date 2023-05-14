import { Dispatch, SetStateAction, useState } from "react";

interface PropType {
  list: Array<string>;
  tabNum: number;
  setTabNum: Dispatch<SetStateAction<number>>;
}

const Tabs = ({ list, tabNum, setTabNum }: PropType) => {
  const onClickTab = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e.target);

    setTabNum(e.target.id);
  };

  return (
    <>
      <div className="tabs w-full">
        {list.map((label, idx) => {
          return (
            <a
              id={String(idx)}
              key={idx}
              className={`tab tab-lifted border-none ${
                tabNum == idx && "tab-active font-bold"
              } w-[${(1 / list.length) * 100}%]`}
              onClick={onClickTab}
            >
              {label}
            </a>
          );
        })}
      </div>
    </>
  );
};

export default Tabs;
