import dotenv from "dotenv";
import process from "process";
import {ChatGPTUnofficialProxyAPI} from "chatgpt";
import {RoomInfo} from "./socket";

dotenv.config();

const chatGPT = new ChatGPTUnofficialProxyAPI({
    accessToken: process.env.OPENAI_TOKEN as string,
    apiReverseProxyUrl: process.env.OPENAI_REVERSE_PROXY_URL,
});

/* initialize ChatGPT with preset. return response id. conversation separated by room. */
const init = async () => {
    const response = await chatGPT.sendMessage(process.env.CHAT_GPT_PRESET as string);
    console.log(`response ${JSON.stringify(response)}`);
    return {parentMessageId: response.id, conversationId: response.conversationId!};
}

/* ask question to ChatGPT. handleProgress function process partial response. */
const ask = async (roomId:string, roomInfo: RoomInfo, text: string, handleProgress : any) => {
    return await chatGPT.sendMessage(text, {
        parentMessageId: roomInfo.parentMessageId,
        conversationId: roomInfo.conversationId,
        onProgress: ({role, id, text}) => handleProgress(roomId, role, id, text)
    });
}

const feedback = async (roomId:string, roomInfo: RoomInfo, code: string, handleProgress : any) => {
    return await chatGPT.sendMessage(`이 코드가 더 나아질 수 있도록 대한 피드백 해줘. ${code}`, {
        parentMessageId: roomInfo.parentMessageId,
        conversationId: roomInfo.conversationId,
        onProgress: ({role, id, text}) => handleProgress(roomId, role, id, text)
    });
}

export {init, ask}