import * as bcryptjs from "bcryptjs";
import { RowDataPacket } from "mysql2";
import { db_pool } from ".";

export class RegistrationError {
	message: string;
	http_status_code: number;
	constructor(message: string, http_status_code: number) {
		this.message = message;
		this.http_status_code = http_status_code;
	}
}

export const registerUser = async (
	username: string,
	password: string
): Promise<void> => {
	const password_hash = await bcryptjs.hash(password, 10);
	await db_pool
		.execute(
			`
				INSERT INTO user (username, password)
				VALUES (:username, :password);
			`,
			{
				username: username,
				password: password_hash,
			}
		)
		.catch((e: { code: string }) => {
			switch (e.code) {
				case "ER_DUP_ENTRY":
					throw new RegistrationError("username already exists", 409);
				default:
					console.error(e);
					throw e;
			}
		});
};

interface PasswordHashRow extends RowDataPacket {
	password: string;
}

export const validateCredentials = async (
	username: string,
	password: string
): Promise<boolean> => {
	return db_pool
		.query<PasswordHashRow[]>(
			"SELECT password FROM user WHERE (username = :username);",
			{ username: username }
		)
		.then((response) => response[0][0].password)
		.then((password_hash) => bcryptjs.compare(password, password_hash));
};
