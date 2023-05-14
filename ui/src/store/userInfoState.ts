import { atom } from "recoil";

export interface StateType {
  userId: string;
  username: string;
  workspaceId: string;
  host: boolean;
}

const initialState: StateType = {
  userId: "",
  username: "",
  workspaceId: "",
  host: false,
};

export const userInfoState = atom({
  key: "userInfo",
  default: initialState,
});
