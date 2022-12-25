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
	await db_pool
		.execute(
			`
				INSERT INTO user (username, password)
				VALUES (:username, :password);
			`,
			{
				username: username,
				// TODO: hash password
				password: password,
			}
		)
		.catch((e: { code: string }) => {
			switch (e.code) {
				case "ER_DUP_ENTRY":
					throw new RegistrationError("Username Exists", 409);
				default:
					console.error(e);
					throw e;
			}
		});
};

interface SuccessRow extends RowDataPacket {
	success: boolean;
}

export const validateCredentials = async (
	username: string,
	password: string
): Promise<boolean> => {
	return db_pool
		.query<SuccessRow[]>(
			"SELECT (COUNT(*) = 1) AS success FROM user WHERE (username = :username) AND (password = :password);",
			// TODO: hash password
			{ username: username, password: password }
		)
		.then((response) => response[0][0].success);
};
