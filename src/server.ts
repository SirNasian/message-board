import * as express from "express";

const server_port = Number(process.env.SERVER_PORT ?? 3000);

const app = express();
app.use(express.static("public"));
app.listen(server_port);
