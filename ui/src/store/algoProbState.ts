import {
  IAlgoProbCategory,
  IAlgoProbInfo,
  IAlgoProbLevel,
} from "@/interface/IAlgoProbLevel";
import { atom } from "recoil";

/* initial states */
const algoProbListInitialState: {
  list: Array<IAlgoProbInfo>;
  length: number;
  error: boolean;
  loading: boolean
} = {
  list: [],
  length: 0,
  error: false,
  loading: false
};

const algoProbLevelInitialState: { list: Array<IAlgoProbLevel> } = {
  list: [],
};

const algoProbCategoryInitialState: { list: Array<IAlgoProbCategory> } = {
  list: [],
};

/* atoms */
export const algoProbListState = atom({
  key: "algoProbList",
  default: algoProbListInitialState,
});

export const algoProbLevelState = atom({
  key: "algoProbLevel",
  default: algoProbLevelInitialState,
});

export const algoProbCategoryState = atom({
  key: "algoProbCategory",
  default: algoProbCategoryInitialState,
});
