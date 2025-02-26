import { promises as fs } from 'fs';
import { createConnection } from '$lib/mysql.js';
import { BASIC_AUTH_USER, BASIC_AUTH_PASSWORD } from '$env/static/private';


// The GET request
export async function GET({ params }) {
    const connection = await createConnection();
    const [rows] = await connection.execute('SELECT * FROM Burg;');

    return new Response(JSON.stringify(rows), {
        status: 200,
        headers: { 'content-type': 'application/json' }
    });
}

// authenticate function
async function authenticate(request) {
    const auth = request.headers.get('authorization');
    if (!auth) {
        return new Response(null, {
            status: 401,
            headers: { 'www-authenticate': 'Basic realm="Restaurants API"' }
        });
    }
 
    const base64Credentials = auth.split(' ')[1];
    const credentials = atob(base64Credentials);
    const [username, password] = credentials.split(':');
 
    if (username !== BASIC_AUTH_USER || password !== BASIC_AUTH_PASSWORD) {
        return new Response(JSON.stringify({ message: 'Access denied' }), {
            status: 401,
            headers: { 'www-authenticate': 'Basic realm="Restaurants API"' }
        });
    }
 
    return null;
}

//  The POST requestgit 
export async function POST({ request }) {
    const authresponse = await authenticate(request);

    if(authresponse) return authresponse;

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
