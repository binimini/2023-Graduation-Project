import { atom } from "recoil";

export interface StateType {
  msg: string;
  show: boolean;
}

const initialState: StateType = {
  msg: "",
  show: false,
};

export const toastMsgState = atom({
  key: "toastMsg",
  default: initialState,
});
