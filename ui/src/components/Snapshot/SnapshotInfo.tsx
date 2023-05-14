import { useDelete, useGet } from "@/hooks/useHttp";
import { ISnapshotDetail, ISnapshotInfo } from "@/interface/ISnapshot";
import {
  snapshotListState,
  snapshotState,
  snapshotLengthState,
} from "@/store/snapshotState";
import React, { useState } from "react";
import { useRecoilState } from "recoil";
import tw from "tailwind-styled-components";
import { IconButton } from "../_styled/Buttons";
import InputBox from "../_styled/Input";

interface PropType {
  data: ISnapshotInfo;
}

const SnapshotInfo = ({ data }: PropType) => {
  const [snapshotDetail, setSnapshotDetail] = useRecoilState(snapshotState);
  const [snapshotList, setSnapshotList] = useRecoilState(snapshotListState);
  const [editingMemo, setEditingMemo] = useState(false);
  const [memo, setMemo] = useState("");
  const [snapshotLength, setSnapshotLength] =
    useRecoilState(snapshotLengthState);

  const { sendRequest: sendGet } = useGet(
    { url: `/api/snapshots/${data.id}` },
    (data: ISnapshotDetail) => {
      setSnapshotDetail(() => data);
    }
  );

  const { sendRequest: sendDelete } = useDelete({
    url: `/api/snapshots/${data.id}`,
  });
  const onDeleteSnapshot = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    sendDelete();
    setSnapshotList(({ list }) => {
      console.log(list);
      list.filter((e: ISnapshotInfo) => e.id !== data.id);
      return { list: list.filter((e: ISnapshotInfo) => e.id !== data.id) };
    });
    setSnapshotLength(snapshotLength - 1);
  };
  const onAddMemo = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setEditingMemo(true);
  };

  const onClickSnapshot = () => {
    sendGet();
  };

  return (
    <MainDiv
      style={{ background: snapshotDetail.id == data.id ? "#29303b" : "" }}
      onClick={onClickSnapshot}
    >
      <TimeHolder>
        {new Date(data.createdDate).toLocaleString()}
        <IconButton
          size="xs"
          width="fit-content"
          name="x"
          onClick={onDeleteSnapshot}
        />
      </TimeHolder>
      {editingMemo ? (
        <InputBox setInput={setMemo} />
      ) : (
        <MemoHolder onClick={onAddMemo}>
          {!data.memo && "메모 추가하기"}
          {/* 이부분 클릭하면 input으로 바뀐다거나.. 하는 코드 추가 */}
          <i className="fa-solid fa-pen"></i>
        </MemoHolder>
      )}
    </MainDiv>
  );
};

export default SnapshotInfo;

const MainDiv = tw.div`
w-full h-fit
dark-1
mb-[10px] p-[10px]
rounded-[10px]
hover:bg-[#191f26] ease-linear
`;

const TimeHolder = tw.div`
flex justify-between
text-base font-bold
`;

const MemoHolder = tw.div`
w-fit
text-xs
flex items-center gap-[6px]
`;
