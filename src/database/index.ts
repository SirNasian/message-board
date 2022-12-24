import { createPool } from "mysql2/promise";

export const db_pool = createPool({
	user: process.env?.DATABASE_USER ?? "messageboard_user",
	password: process.env?.DATABASE_PASS ?? "messageboard_pass",
	database: process.env?.DATABASE_NAME ?? "messageboard",
	namedPlaceholders: true,
});
