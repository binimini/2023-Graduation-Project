import { userInfoState } from "@/store/userInfoState";
import { WebSocketContext } from "@/context/WebSocketContext";
import { liveCodeContentSetter } from "@/store/liveCode";
import MonacoEditor, {
  useMonaco,
  OnMount,
  Monaco,
  OnChange,
} from "@monaco-editor/react";
import { useContext, useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

const useMonacoEditor = () => {
  const monaco = useMonaco();
  const monacoRef = useRef<Monaco>(null);
  const [, setliveCodeSetter] = useRecoilState(liveCodeContentSetter);
  const stompClient = useContext(WebSocketContext);
  const userInfo = useRecoilValue(userInfoState);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    monacoRef.current = editor;
  };

  const handleEditorChange: OnChange = (value) => {
    if(userInfo.host)
    stompClient.send(
      `/pub/code/${userInfo.workspaceId}`,
      JSON.stringify({ userId: userInfo.userId, content: value })
    );
    console.log("코드 전송");
  };

  useEffect(() => {
    if (!monaco) return;
    // console.log(monacoRef.current.setValue("hi"));

    setliveCodeSetter({
      func: (code: string) => {
        monacoRef.current?.setValue(code);
      },
    });
  }, [monaco]);

  useEffect(() => {
    if (stompClient.connected) {
      stompClient.subscribe(`/sub/code/${userInfo.workspaceId}`, (res) => {
        const data = JSON.parse(res.body);
        const { userId, content } = data;

        if (userId !== userInfo.userId) monacoRef.current.setValue(content);
      });
    }
  }, [stompClient.connected]);

  return {
    monaco,
    monacoRef,
    setliveCodeSetter,
    handleEditorDidMount,
    handleEditorChange,
  };
};

export default useMonacoEditor;
