import dotenv from "dotenv";
import Koa, {Context} from 'koa';
import * as process from "process";

dotenv.config();

const app = new Koa();

const port = 8000;

app.use((ctx: Context) => {
    ctx.body = process.env.OPENAI_API_KEY;
})

app.listen(port, () => {
    console.log(`listening to port ${port}`);
})