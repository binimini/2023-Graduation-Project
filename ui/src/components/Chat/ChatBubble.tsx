import React, { useEffect } from "react";
import styled from "styled-components";
import tw from "tailwind-styled-components";

interface PropType {
  username: string;
  content: string;
  mine?: boolean;
  onEditDone: Function;
}

const ChatBubble = ({ username, content, mine, onEditDone }: PropType) => {
  useEffect(() => {
    onEditDone(true);
  }, []);

  return (
    <>
      {mine ? (
        <>
          <NicknameHolder className="text-right">
            나 ({username})
          </NicknameHolder>
          <FlexDiv1>
            <BubbleDiv>{content}</BubbleDiv>
            <TimeHolder>11:20</TimeHolder>
          </FlexDiv1>
        </>
      ) : (
        <>
          <NicknameHolder>{username}</NicknameHolder>
          <FlexDiv2>
            <BubbleDiv>{content}</BubbleDiv>
            <TimeHolder>11:20</TimeHolder>
          </FlexDiv2>
        </>
      )}
    </>
  );
};

const NicknameHolder = tw.div`
text-[11px] font-bold
`;

const FlexDiv = tw.div`
flex items-end
mx-[5px] mt-[2px] mb-[10px]
`;

const FlexDiv1 = tw(FlexDiv)`
justify-flex-end flex-row-reverse
`;

const FlexDiv2 = tw(FlexDiv)`
`;

const TimeHolder = tw.span`
px-[5px] text-[5px] text-base-300
`;

const BubbleDiv = tw.div`
    w-[100px] h-fit min-h-[25px]
    bg-neutral 
    rounded-[5px]
    px-[8px] py-[5px]
    text-[10px]
    break-words
`;

export default ChatBubble;
