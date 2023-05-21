import React, {useContext, useEffect, useState} from "react";
import tw from "tailwind-styled-components";
import MonacoEditor from "@monaco-editor/react";
import CompileFloatBtn from "@/components/LiveCode/CompileBtn";
import SnapshotFloatBtn from "@/components/LiveCode/SnapshotBtn";
import useMonacoEditor from "@/hooks/Components/useMonacoEditor";
import useCodeSnapshot from "@/hooks/Components/useCodeSnapshot";
import SelectBox from "../_styled/Select";
import {useRecoilState, useRecoilValue} from "recoil";
import {userInfoState} from "@/store/userInfoState";
import Tooltip from "@/components/_styled/Tooltip";
import FeedbackFloadBtn from "@/components/LiveCode/FeedbackBtn";
import {SocketIOContext} from "@/context/SocketIOContext";
import {Socket} from "socket.io-client";
import {toastMsgState} from "@/store/toastMsgState";
import {ITestCase, ITestCaseResult, testCaseResultState, testCaseState} from "@/store/testCaseState";
import {WebSocketContext} from "@/context/WebSocketContext";

const LiveCode = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [, setToastObj] = useRecoilState(toastMsgState);
  const testCaseList = useRecoilValue(testCaseState);
  const [testCaseResultList, setTestCaseResultList] = useRecoilState(testCaseResultState);
  const userInfo = useRecoilValue(userInfoState);
  const { monaco, monacoRef, setliveCodeSetter, handleEditorDidMount, handleEditorChange } = useMonacoEditor();
  const { onSnapshot } = useCodeSnapshot(monacoRef);
  const socketIOClient = useContext<Socket>(SocketIOContext);
  const stompClient = useContext(WebSocketContext);
  const [subscribeId, setSubscribeId] = useState("");

  const onFeedback = () => {
    const code = monacoRef.current?.getValue();
    socketIOClient.emit('feedback', userInfo.workspaceId, code);
  }

  function handleCompileResult(res: { output: string, time:number, testCaseId:string }, testList: ITestCase[]) {
    const target = testList.filter(t => t.testCaseId as string == res.testCaseId);
    if (target.length == 0) return;

    const result : ITestCaseResult = {
      testCaseId: target[0].testCaseId!,
      success: target[0].output == res.output,
      time: res.time,
      output: res.output
    }

    setTestCaseResultList( (prev) => {
      return [...prev.filter(t => t.testCaseId != result.testCaseId), result]
    });
  };

  const onCompile = ({ code }: any) => {
    const inputList = testCaseList.map((e) => e?.input);

    if (!code || code.length == 0) {
      setToastObj({ show: true, msg: "코드를 입력하세요." });
    } else if (!inputList || inputList.length == 0) {
      setToastObj({ show: true, msg: "테스트케이스를 등록하세요." });
    } else {
      stompClient.send(
          `/pub/compile/${userInfo.workspaceId}`,
          JSON.stringify({ code: code })
      );
    }
  };

  useEffect(() => {
    if (stompClient.connected)
      if (subscribeId != "") stompClient.unsubscribe(subscribeId);
      setSubscribeId(stompClient.subscribe(
          `/sub/compile/${userInfo.workspaceId}`,
          async (res: any) => {
            const data = await JSON.parse(res.body);
            handleCompileResult(data, testCaseList);
          }
      ).id);
  }, [stompClient.connected, testCaseList]);

  return (
    <>
      <MainDiv>
        <FlexDiv>
          <Tooltip tip="다른 언어는 준비중입니다.">
            <SelectBox
              setSelection={() => {}}
              disabled={true}
              placeholder="python"
              className="select select-xs mb-[4px] h-[30px] w-fit"
            />
          </Tooltip>
          <Tooltip tip="호스트만 사용할 수 있는 기능입니다.">
            <input
              type="checkbox"
              className="toggle"
              disabled={!userInfo.host}
              checked={isEditable}
              onClick={() => {
                setIsEditable(!isEditable);
              }}
            />
          </Tooltip>
        </FlexDiv>
        <MonacoEditor
          width="100%"
          height="calc(100% - 60px)"
          language="python"
          theme="vs-dark"
          options={{"read-only": !userInfo.host && !isEditable}}
          ref={monacoRef}
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
        />
      </MainDiv>
      <FloatButtonDiv style={{ transform: "translate(-50%, 0)" }}>
        <CompileFloatBtn onClick={() => onCompile({ code: monacoRef.current.getValue() })} />
        <SnapshotFloatBtn onClick={onSnapshot} />
        <FeedbackFloadBtn onClick={onFeedback} />
      </FloatButtonDiv>
    </>
  );
};

export default LiveCode;

const MainDiv = tw.div`
w-full h-full
`;

const FloatButtonDiv = tw.div`
relative
bottom-[60px] left-[50%]
w-fit h-[60px]
px-[10px]
rounded-[15px]
dark-1
flex gap-[10px]
justify-around
z-100
`;

const FlexDiv = tw.div`
w-full h-fit
flex items-center justify-between
pr-[10px]
`;
