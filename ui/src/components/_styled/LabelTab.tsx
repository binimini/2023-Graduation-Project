import React from "react";
import tw from "tailwind-styled-components";

interface PropType {
  label: string;
}

const LabelTab = ({ label }: PropType) => {
  return (
    <div className="dark-1 tabs w-full">
      <TitleDiv className={`tab tab-active  tab-lifted w-2/3 border-none`}>
        {label}
      </TitleDiv>
    </div>
  );
};

export default LabelTab;

const TitleDiv = tw.div`
text-sm font-bold`;
