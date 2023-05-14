import React, { useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import LabelTab from "@/components/_styled/LabelTab";
import { useRecoilValue } from "recoil";
import { userInfoState } from "@/store/userInfoState";

const CompileInfo = () => {
  const userInfo = useRecoilValue(userInfoState);

  return (
    <>
      <LabelTab label="유저 정보" />
      <MainDiv>
        <InfoList>
          <Info>
            <InfoTitle>{userInfo.host ? "호스트" : "참여자"}</InfoTitle>
            <InfoData>{userInfo.username}</InfoData>
          </Info>
        </InfoList>
      </MainDiv>
    </>
  );
};

export default CompileInfo;

const MainDiv = tw.div`
w-full h-[calc(100%-32px)]
dark-2
rounded-[0_10px_10px_10px]
overflow-x-hidden 
`;

const InfoList = tw.div`
w-[100%-20px] h-fit
mx-[10px] my-[8px] p-[10px_0_10px_0]
flex flex-col justify-between gap-[14px]
rounded-[10px]
`;

const Info = tw.div`
flex flex-row justify-around
mx-4
`;

const InfoTitle = tw.div`
py-1
w-full text-left text-sm font-bold
`;

const InfoData = tw.div`
dark-1
rounded-[10px]
py-1
w-full text-center text-sm font-bold
`;
