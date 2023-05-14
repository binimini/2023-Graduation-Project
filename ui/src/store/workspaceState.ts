import { atom } from "recoil"

export interface StateType {
    value: boolean
}

const initialState: StateType = {
    value: false
}

export const workspaceState = atom({
    key: 'hasWorkspace',
    default: initialState
})