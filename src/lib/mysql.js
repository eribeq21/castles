import { createConnection } from "mysql2/promise"

let connection = null;
export function createConnection() {
	if (!connection) {
		connection = mysql.createConnection({
			host: DB_HOST,
			user: DB_USER,
			port: DB_PORT,
			password: DB_PASSWORD,
			database: DB_NAME
		});
	}
	return connection;

}
