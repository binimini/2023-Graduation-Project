import React, { useState } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import tw from "tailwind-styled-components";
import SelectBox from "@/components/_styled/Select";
import InputBox from "@/components/_styled/Input";
import Tabs from "@/components/_styled/Tabs";
import {algoProbListState, algoProbLevelState, algoProbCategoryState} from "@/store/algoProbState";
import axios from "axios";
import { cursorTo } from "readline";
import {toastMsgState} from "@/store/toastMsgState";
import {IAlgoProbInfo} from "@/interface/IAlgoProbLevel";
import * as process from "process";

interface UserInfo {
    userId: string
    solvedCount: number;
    profileImageUrl: string;
    level: {
        name: string
    }
}

const AlgoFilterContainer = () => {
    // 0 : 사용자 정보, 1 : 알고리즘 필터, 2 : 알고리즘 검색
  const [tabNum, setTabNum] = useState(0);
  const [algoProbLevelList] = useRecoilState(algoProbLevelState);
  const [algoProbCategoryList] = useRecoilState(algoProbCategoryState);
  const [, setAlgoProblemList] = useRecoilState(algoProbListState);
  const [, setToastObj] = useRecoilState(toastMsgState);
  const [levelFilter, setLevelFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [problemNum, setProblemNum] = useState("");
  const [accountId, setAccountId] = useState("");
  const [userInfo, setUserInfo] = useState<UserInfo>();


    const transformAlgoProbList = ({ list, length, error }: { list: IAlgoProbInfo[], length: number, error:boolean }) => {
        const newList = list.map((prob) => {
            prob.categories = (prob.categories as string)
                .split(";,")
                .map(category => category.replaceAll(/;| |,|\[|\]/g,""))
                .map((categoryId: string) => algoProbCategoryList.list.filter(category => category.id == categoryId)[0]);
            return prob
        })
        setAlgoProblemList({ list: newList, length: length, error: error })
    }
  const onSearch = () => {
    const url =
      tabNum == 0
        ? `/api/problems/user/${accountId}` :
          tabNum==1 ? `/api/problems/random?standard=level&level=${levelFilter}` :
              tabNum==2 ? `/api/problems/random?standard=category&category=${categoryFilter}` : `/api/problems?number=${problemNum}`;

    if (tabNum == 0 && accountId=="") {
        setToastObj({show:true, msg: '사용자 아이디를 정확히 입력해주세요!'})
        return
    }

    axios
      .get("http://localhost:8080" + url)
      .then((res) => {
        const { data } = res;

        if (data == null) {
            if (tabNum==0) {
                setUserInfo({});
            }
            else transformAlgoProbList({ list: [], length: 0, error: true });
          return;
        }
        tabNum == 0
            ? setUserInfo(data) : tabNum !=3
            ? transformAlgoProbList({
              list: data,
              length: data.length,
              error: false,
            })
          : transformAlgoProbList({ list: [data], length: 1, error: false });
      })
      .catch((e) => {
          transformAlgoProbList({ list: [], length: 0, error: true });
      });
  };


  return (
    <>
      <Tabs
        list={["사용자정보","티어검색","카테고리검색","번호검색"]}
        tabNum={tabNum}
        setTabNum={setTabNum}
      />
      <ContentDiv>
        {tabNum == 0 ? (
            <div className="flex justify-start h-[full-20px] w-full">
                <div className="w-full h-[full-5px]">
                <InputBox className="h-[20%]"
                    placeholder="아이디를 입력하세요"
                    label="사용자 아이디"
                    setInput={setAccountId}
                />
                {userInfo==null ? null :
                <div className="w-full h-[52%] flex flex-row justify-around mx-4">
                    <img  className="w-[20%] h-fit text-xs font-bold" src={userInfo.profileImageUrl} alt="프로필"/>
                    <div className="w-[70%] h-auto">
                        <div className="text-xs font-bold flex flex-row h-[50%]">
                            <div className="w-[40%]">해결한 문제 수</div>
                            <div className="dark-1 w-[55%] text-center rounded-[10px] h-fit">{userInfo.solvedCount} </div>
                        </div>
                        <div className="text-xs font-bold flex flex-row h-[50%]">
                            <div className="w-[40%]">티어</div>
                            <div className="dark-1 w-[55%] text-center rounded-[10px] h-fit">{userInfo.level?.name ?? "None"}</div>
                        </div>
                        <div className="text-xs font-bold h-fit w-[80%] rounded-[10px] flex justify-center -my-1 dark-1 ">
                            <button> 문제추천 </button>
                        </div>
                    </div>
                </div>
                }
                </div>
            </div>) :
            tabNum == 1 ? (
          <div className="flex justify-start w-full">
            <SelectBox
              options={algoProbLevelList.list}
              placeholder="티어를 선택하세요"
              label="티어"
              setSelection={setLevelFilter}
            />
          </div>
        ) :
        tabNum == 2 ? (<div className="flex justify-start w-full">
            <SelectBox
                options={algoProbCategoryList.list}
                placeholder="카테고리를 선택하세요"
                label="카테고리"
                setSelection={setCategoryFilter}
            />
        </div>) : (
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
