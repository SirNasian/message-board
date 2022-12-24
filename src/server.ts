import * as bodyParser from "body-parser";
import * as express from "express";

import { requestAuthorizationGrant, registerUser } from "./auth";

const urlencodedParser = bodyParser.urlencoded({ extended: false });
const server = express();
server.use(express.static("public"));
server.post("/api/auth", urlencodedParser, requestAuthorizationGrant);
server.post("/api/auth/register", urlencodedParser, registerUser);
server.listen(Number(process.env.SERVER_PORT ?? 3000));
