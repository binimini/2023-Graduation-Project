import { useTheme } from "@/context/ThemeContext";
import { algoProbListState } from "@/store/algoProbState";
import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import tw from "tailwind-styled-components";
import { IconButton } from "@/components/_styled/Buttons";
import {IAlgoProbCategory} from "@/interface/IAlgoProbLevel";

const AlgoInfo = () => {
  const algoProblem = useRecoilValue(algoProbListState);
  const [probIndex, setProbIndex] = useState(0);

  return (
    <MainDiv className="w-full">
      {algoProblem.loading ? <BubbleDiv> 문제를 받아오는 중입니다... {Spinner} </BubbleDiv> : null}
      {algoProblem.error ? (
        <TempDiv>
          <i className="fa-solid fa-triangle-exclamation"></i>
          ༼;´༎ຶ ۝༎ຶ`༽ <br />
          검색 요청에 오류가 있거나 <br />
          해당하는 문제가 없습니다... <br />
          검색 조건을 변경해보세요 !
        </TempDiv>
      ) : algoProblem.length == 0 ? (
        <TempDiv>
          <i className="fa-solid fa-circle-exclamation"></i>
          필터를 설정해서 <br /> 문제를 탐색해보세요 !
        </TempDiv>
      ) : (
        <>
          <MenuController>
            <IconButton
              name="angle-left"
              width="auto"
              disabled={probIndex == 0}
              onClick={() => setProbIndex(probIndex - 1)}
            />
            <TitleHolder>
              {algoProblem.list[probIndex]?.number}{" "}
              {algoProblem.list[probIndex]?.title}
            </TitleHolder>
            <IconButton
              name="angle-right"
              width="auto"
              disabled={probIndex == algoProblem.length - 1}
              onClick={() => setProbIndex(probIndex + 1)}
            />
          </MenuController>
          <RestraintDiv>
            평균 시도 횟수
            <RestraintHolder>
              {algoProblem.list[probIndex].averageTries}
            </RestraintHolder>
          </RestraintDiv>
          <RestraintDiv>
            티어
            <RestraintHolder>
              {algoProblem.list[probIndex].level?.name}
            </RestraintHolder>
          </RestraintDiv>
          <RestraintDiv>
            <div> 카테고리 </div>
            <div className="flex flew-row whitespace-nowrap overflow-x-auto w-max=[23vw]">
              {(algoProblem.list[probIndex].categories as IAlgoProbCategory[])
                  .map(category => <div className="bright-1 rounded-[3px] text-dark mx-1 w-fit">{category.name}</div>)}
            </div>
          </RestraintDiv>
          <TitleDiv>· 문제</TitleDiv>
          <ContentP>{algoProblem.list[probIndex].description}</ContentP>
          <TitleDiv>· 입력</TitleDiv>
          <ContentP>{algoProblem.list[probIndex].input}</ContentP>
          <TitleDiv>· 출력</TitleDiv>
          <ContentP>{algoProblem.list[probIndex].output}</ContentP>{" "}
        </>
      )}
    </MainDiv>
  );
};

export default AlgoInfo;

const MainDiv = tw.div`
w-full h-full overflow-y-scroll overflow-x-hidden
px-[14px] py-[10px]
`;

const TempDiv = tw.div`
w-full h-full
flex flex-col gap-[10px] justify-center items-center
text-sm text-center
`;

const MenuController = tw.div`
w-full h-[30px]
flex justify-between items-center
`;

const TitleHolder = tw.span`
text-m font-bold
`;

const RestraintDiv = tw.div`
relative right-[2%]
w-[100%] h-[30px]
mt-[6px] px-[10px]
flex justify-between items-center
text-xs font-bold
bg-neutral rounded-[4px]
`;

const RestraintHolder = tw.span`
font-normal
`;

const TitleDiv = tw.div`
mt-[12px]
text-sm font-bold
`;

const ContentP = tw.p`
text-xs leading-5
`;

const BubbleDiv = tw.div`
    w-[full] h-fit min-h-[25px]
    bg-neutral 
    rounded-[5px]
    px-[8px] py-[5px]
    text-[10px]
    break-words
`;

const Spinner =
    <div className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
    </div>;