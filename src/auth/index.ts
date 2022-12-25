import { Request, Response } from "express";
import { AuthenticationError } from "./AuthenticationError";
import { ensureValidScope } from "./Scope";
import { generateAuthorizationCode } from "../database/database.auth";
import {
	validateCredentials,
	registerUser as dbRegisterUser,
	RegistrationError,
} from "../database/database.user";

export { AuthenticationError } from "./AuthenticationError";

export const requestAuthorizationGrant = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { response_type, scope, code } = req.body;
		switch (response_type) {
			case "code":
				const [username, password] = parseAuthorizationHeader(
					req.headers?.authorization ?? ""
				);

				if (!code && !(await validateCredentials(username, password)))
					throw new AuthenticationError("incorrect username/password");

				const valid_scope = ensureValidScope(scope);
				const new_code = await generateAuthorizationCode(username, valid_scope);
				res.status(200).send(new_code);
				break;

			case "token":
				// TODO: implement this
				res.status(501).send(code);
				break;

			default:
				res.status(400).send("unknown response_type");
		}
	} catch (e: unknown) {
		if (e instanceof AuthenticationError)
			res.set("WWW-Authenticate", "Basic").status(401).send(e.message);
		else {
			res.sendStatus(500);
			throw e;
		}
	}
};

export const registerUser = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { username, password } = req.body;
	dbRegisterUser(username, password)
		.then(() => res.status(200).send("Registration Successful"))
		.catch((e: unknown) => {
			if (e instanceof RegistrationError)
				res
					.status(e.http_status_code)
					.send(`Registration Failure: ${e.message}`);
			else {
				res.status(500).send("Registration Error");
				throw e;
			}
		});
};

const parseAuthorizationHeader = (authorization: string): string[] => {
	if (!authorization.startsWith("Basic "))
		throw new AuthenticationError("Unsupported Authorization Method");

	const credentials: string[] = Buffer.from(
		authorization.replace("Basic ", ""),
		"base64"
	)
		.toString("ascii")
		.split(":", 2);

	if (credentials.length !== 2)
		throw new AuthenticationError("Malformed Authorization Header");

	return credentials;
};
