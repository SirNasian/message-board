import { RowDataPacket } from "mysql2";
import { db_pool } from ".";

interface GeneratedCodeRow extends RowDataPacket {
	code: string;
}

export const generateAuthorizationCode = async (
	client_id: string,
	username: string,
	scope: string
): Promise<string> => {
	return await db_pool
		.query<GeneratedCodeRow[]>(
			`
				SET @code = UUID();
				INSERT INTO authorization_code (code, client_id, username, scope)
				VALUES (@code, :client_id, :username, :scope);
				SELECT @code AS code;
			`,
			{
				client_id: client_id,
				username: username,
				scope: scope,
			}
		)
		.then((response) => response[0][2][0].code);
};
