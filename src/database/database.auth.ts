import { RowDataPacket } from "mysql2";
import { db_pool } from ".";

interface GeneratedCodeRow extends RowDataPacket {
	code: string;
}

export const generateAuthorizationCode = async (
	username: string,
	scope: string
): Promise<string> => {
	return await db_pool
		.query<GeneratedCodeRow[]>(
			`
				SET @code = UUID();
				INSERT INTO authorization_code (code, username, scope)
				VALUES (@code, :username, :scope);
				SELECT @code AS code;
			`,
			{
				username: username,
				scope: scope,
			}
		)
		.then((response) => response[0][2][0].code);
};
