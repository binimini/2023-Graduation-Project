import React, { useState } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import tw from "tailwind-styled-components";
import SelectBox from "@/components/_styled/Select";
import InputBox from "@/components/_styled/Input";
import Tabs from "@/components/_styled/Tabs";
import { algoProbListState, algoProbLevelState } from "@/store/algoProbState";
import axios from "axios";
import { cursorTo } from "readline";

const AlgoFilterContainer = () => {
  const [tabNum, setTabNum] = useState(0);
  const [algoProbLevelList] = useRecoilState(algoProbLevelState);
  const [, setAlgoProblemList] = useRecoilState(algoProbListState);
  const resetAlgoProblemList = useResetRecoilState(algoProbListState);

  const saveSearchedProbList = () => {};

  const onSearch = () => {
    console.log(problemNum, levelFilter);

    const url =
      tabNum == 0
        ? `/api/problems/random?standard=level&id=${levelFilter}`
        : `/api/problems?number=${problemNum}`;
    console.log(url);

    axios
      .get("http://163.180.146.59" + url)
      .then((res) => {
        const { data } = res;

        if (data == null) {
          setAlgoProblemList({ list: [], length: 0, error: true });
          return;
        }
        tabNum == 0
          ? setAlgoProblemList({
              list: data,
              length: data.length,
              error: false,
            })
          : setAlgoProblemList({ list: [data], length: 1, error: false });
      })
      .catch((e) => {
        setAlgoProblemList({ list: [], length: 0, error: true });
      });
  };

  const [levelFilter, setLevelFilter] = useState("");
  const [problemNum, setProblemNum] = useState("");

  return (
    <>
      <Tabs
        list={["필터검색", "번호검색"]}
        tabNum={tabNum}
        setTabNum={setTabNum}
      />
      <ContentDiv>
        {tabNum == 0 ? (
          <div className="flex justify-start">
            <SelectBox
              options={algoProbLevelList.list}
              placeholder="티어를 선택하세요"
              label="티어"
              setSelection={setLevelFilter}
            />
            <SelectBox
              placeholder="준비중인 기능입니다"
              label="유형"
              disabled={true}
              setSelection={() => {}}
            />
          </div>
        ) : (
          <InputBox
            placeholder="문제 번호를 검색하세요"
            label="문제 번호"
            setInput={setProblemNum}
          />
        )}
        <SearchBtn onClick={onSearch}> 검색 </SearchBtn>
      </ContentDiv>
    </>
  );
};

export default AlgoFilterContainer;

const ContentDiv = tw.div`
w-full h-[calc(100%-32px)]
py-[5px]
rounded-b-[15px]
dark-2
flex flex-col justify-between items-center gap-[4px]
`;

const SearchBtn = tw.button`
btn
h-fit min-h-[10px] w-[90%]
py-[4px]
bg-netural
text-xs
`;
