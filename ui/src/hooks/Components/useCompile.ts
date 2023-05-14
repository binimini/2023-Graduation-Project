import { ITestCase } from "./../../store/testCaseState";
import { useContext, useEffect } from "react";
import { usePost } from "@/hooks/useHttp";
import { testCaseResultState, testCaseState } from "@/store/testCaseState";
import { useRecoilState, useRecoilValue } from "recoil";
import { toastMsgState } from "@/store/toastMsgState";
import { WebSocketContext } from "@/context/WebSocketContext";
import { userInfoState } from "@/store/userInfoState";

interface PropType {
  code: string;
}

const useCompile = () => {
  const [, setToastObj] = useRecoilState(toastMsgState);
  const testCaseList = useRecoilValue(testCaseState);
  const [, setTestCaseResultList] = useRecoilState(testCaseResultState);
  const handleCompileResult = (res: any, testCaseList: ITestCase[]) => {
    const data = res;
    console.log(data);

    console.log("testCaseList", testCaseList);
    const newList = testCaseList.map((e: ITestCase) => ({
      output: e.output,
      testCaseId: e.testCaseId,
    }));
    const testCaseResultList = newList.map((e: any) => {
      if (e.testCaseId == data.testCaseId) {
        console.log("data", e, data);
          return data.output === e.output
            ? { ...e, time: data.time, success: true }
            : { ...e, time: data.time, success: false };
      }
      else return e
    });

    console.log(newList, testCaseResultList);

    setTestCaseResultList(testCaseResultList);
  };

  const { isLoading, error, sendRequest } = usePost(
    { url: "/api/compile" },
    handleCompileResult
  );

  const stompClient = useContext(WebSocketContext);
  const userInfo = useRecoilValue(userInfoState);

  const onCompile = ({ code }: PropType) => {
    const inputList = testCaseList.map((e) => e?.input);

    if (!code || code.length == 0) {
      setToastObj({ show: true, msg: "코드를 입력하세요." });
    } else if (!inputList || inputList.length == 0) {
      setToastObj({ show: true, msg: "테스트케이스를 등록하세요." });
    } else {
      // sendRequest({
      //   code,
      //   inputs: inputList,
      // });
      // stompClient.connect({}, () => {
      stompClient.send(
        `/pub/compile/${userInfo.workspaceId}`,
        JSON.stringify({ code: code })
      );
      // });
    }
  };

  useEffect(() => {
    if (stompClient.connected)
      stompClient.subscribe(
        `/sub/compile/${userInfo.workspaceId}`,
        async (res: any) => {
          const data = await JSON.parse(res.body);
          handleCompileResult(data, testCaseList);
        }
      );
  }, [stompClient.connected, testCaseList]);

  return { isLoading, error, onCompile };
};

export default useCompile;
