import { ISnapshotDetail, ISnapshotInfo } from "@/interface/ISnapshot";
import { atom, selector } from "recoil";

const initialState: ISnapshotDetail = {
  id: null,
  memo: "",
  content: "",
  createdDate: "",
};

const initialListState: { list: Array<ISnapshotInfo> } = {
  list: [],
};

export const snapshotState = atom({
  key: "snapshotState",
  default: initialState,
});

export const snapshotListState = atom({
  key: "snapshotListState",
  default: initialListState,
});

export const snapshotLengthState = atom({
  key: "snapshotLengthState",
  default: 0,
})