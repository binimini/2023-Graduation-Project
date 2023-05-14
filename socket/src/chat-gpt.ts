import process from "process";
import {ChatGPTUnofficialProxyAPI} from "chatgpt";

const onProgress = (partialResponse : any) => {
    console.log(`progress ${JSON.stringify(partialResponse)}`);
}

const init = async () => {
    const chatGPT = new ChatGPTUnofficialProxyAPI({
        accessToken: process.env.OPENAI_TOKEN as string,
        apiReverseProxyUrl: process.env.OPENAI_REVERSE_PROXY_URL,
    });

    const response = await chatGPT.sendMessage(process.env.CHAT_GPT_PRESET as string, {
        // parentMessageId: ''
        onProgress: onProgress
    })
    console.log(`response ${JSON.stringify(response)}`);
}

// init();