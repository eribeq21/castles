import { promises as fs } from 'fs';
import { createConnection } from '$lib/mysql.js';

// The GET request
export async function GET({ params }) {
    const connection = await createConnection();
    const [rows] = await connection.execute('SELECT * FROM Burg;');

    return new Response(JSON.stringify(rows), {
        status: 200,
        headers: { 'content-type': 'application/json' }
    });
}

//  The POST requestgit 
export async function POST({ request }) {
    const data = await request.json(); 
    const connection = await createConnection();

    try {
        const [result] = await connection.execute(
            'INSERT INTO Burg (name, ort, baujahr, eintrittspreis, oeffnungszeiten) VALUES (?, ?, ?, ?, ?);',
            [data.name, data.ort, data.baujahr, data.eintrittspreis, data.oeffnungszeiten]
        );

        const [newBurg] = await connection.execute(
            'SELECT * FROM Burg WHERE id = ?;',
            [result.insertId]
        );

        return new Response(JSON.stringify(newBurg[0]), {
            status: 201,
            headers: { 'content-type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
