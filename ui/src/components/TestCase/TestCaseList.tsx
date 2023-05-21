import React, { useContext, useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import TestCase from "@/components/TestCase/TestCase";
import { IconButton } from "@/components/_styled/Buttons";
import LabelTab from "@/components/_styled/LabelTab";
import { useRecoilState, useRecoilValue } from "recoil";
import { testCaseResultState, testCaseState } from "@/store/testCaseState";
import { WebSocketContext } from "@/context/WebSocketContext";
import { userInfoState } from "@/store/userInfoState";

const TestCaseList = () => {
  const [testCases, setTestCases] = useRecoilState(testCaseState);
  const [isAdding, setIsAdding] = useState(false);
  const [subscribe, setSubscribe] = useState<{createId:string, deleteId:string}>();
  const [testCaseResultList, setTestCaseResultList] =
    useRecoilState(testCaseResultState);

  const stompClient = useContext(WebSocketContext);
  const userInfo = useRecoilValue(userInfoState);

  const showAddBtn = () => {
    return (testCases.length == 0 && !isAdding) || !isAdding;
  };

  const sortedTestCases = [...testCases].reverse();

  const onAddTestCase = () => {
    setIsAdding(true);
  };

  useEffect(() => {
    if (stompClient.connected) {

      if (subscribe != undefined) {
          stompClient.unsubscribe(subscribe.createId);
          stompClient.unsubscribe(subscribe.deleteId);
      }

      const createId = stompClient.subscribe(
        `/sub/testcases/create/${userInfo.workspaceId}`,
        async (res: any) => {
          const data = await JSON.parse(res.body);
          setTestCases((prev) => [...prev.filter((e) => e.testCaseId != data.testCaseId), data])
        }
      ).id;

      const deleteId = stompClient.subscribe(
        `/sub/testcases/delete/${userInfo.workspaceId}`,
        async (res: any) => {
          const data = await JSON.parse(res.body);
            setTestCases((prev) => [...prev.filter((e) => e.testCaseId != data.testCaseId), data])
        }
      ).id;

      setSubscribe({createId, deleteId});
    }
  }, [stompClient.connected, testCases]);

  useEffect(() => {
    console.log("watching", testCases);
  }, [testCases]);

  return (
    <>
      <LabelTab label="테스트 케이스" />
      <MainDiv>
        {showAddBtn() && (
          <AddTestCase onClick={onAddTestCase}>
            <IconButton name="circle-plus" />
          </AddTestCase>
        )}
        {isAdding && (
          <TestCase
            testCaseNo={sortedTestCases.length}
            isAdding={isAdding}
            setIsAdding={setIsAdding}
          />
        )}
        {sortedTestCases.map((e, idx) => {
          const compileResult =
            testCaseResultList.filter(result => result.testCaseId == e.testCaseId)[0];
          return (
            <TestCase
              key={sortedTestCases.length - idx}
              testCaseNo={sortedTestCases.length - 1 - idx}
              disabled={true}
              inputVal={e.input}
              outputVal={e.output}
              compileResult={compileResult}
              isAdding={false}
              setIsAdding={() => {}}
            />
          );
        })}
      </MainDiv>
    </>
  );
};

export default TestCaseList;

const MainDiv = tw.div`
w-full h-[calc(100%-32px)]
dark-2
rounded-[0_10px_10px_10px]
overflow-x-hidden overflow-y-scroll
`;

const AddTestCase = tw.div`
dark-1 rounded-[10px]
w-[100%-20px] h-[50px]
mx-[10px] my-[10px]
`;
