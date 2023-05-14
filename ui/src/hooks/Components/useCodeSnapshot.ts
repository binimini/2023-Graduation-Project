import { MutableRefObject } from 'react';
import { Monaco } from '@monaco-editor/react';
import { EditorView } from "codemirror";
import { usePost } from "@/hooks/useHttp";
import { snapshotLengthState } from "@/store/snapshotState";
import { toastMsgState } from "@/store/toastMsgState";
import { useRecoilState } from "recoil";

const useCodeSnapshot = (monacoRef:MutableRefObject<Monaco>) => {
  const { sendRequest: sendSnapshot } = usePost({
    url: "/api/snapshots",
  });

  const [toastObj, setToastObj] = useRecoilState(toastMsgState);

  const [snapshotLength, setSnapshotLength] =
    useRecoilState(snapshotLengthState);

  const onSnapshot = () => {
    const curContent = monacoRef.current?.getValue();
    setToastObj({ msg: "스냅샷 저장 완료", show: true });
    setSnapshotLength(snapshotLength + 1);
    sendSnapshot({ content: curContent });
  };

  return { sendSnapshot, onSnapshot };
};

export default useCodeSnapshot;
