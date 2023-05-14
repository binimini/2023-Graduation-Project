import { atom, selector } from "recoil";

export interface ITestCase {
  input: string;
  output: string;
  testCaseId?: string;
}
export interface ITestCaseResult{
  testCaseId: string;
  success: boolean;
  output: string;
  time: number;
}

const testCaseInitialState: Array<ITestCase> = []
const testCaseResultInitialState: Array<ITestCaseResult> = []

export const testCaseState = atom({
  key: "testCaseState",
  default: testCaseInitialState,
});

export const testCaseResultState = atom({
  key: "testCaseResultState",
  default: testCaseResultInitialState,
});
