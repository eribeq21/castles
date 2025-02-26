import { createConnection } from "$lib/mysql";

export async function load({ locals }) {
	let connection = await createConnection();
	let [rows] = await connection.execute('SELECT * from Burg; ');

	return {
		castles: rows
	};
}