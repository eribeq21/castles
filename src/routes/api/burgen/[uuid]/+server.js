import { promises as fs } from 'fs';
import { createConnection } from '$lib/mysql.js';
import { BASIC_AUTH_USER, BASIC_AUTH_PASSWORD } from '$env/static/private';

// Authentication function
async function authenticate(request) {
    const auth = request.headers.get('authorization');
    if (!auth) {
        return new Response(null, {
            status: 401,
            headers: { 'www-authenticate': 'Basic realm="Burg API"' }
        });
    }

    const base64Credentials = auth.split(' ')[1];
    const credentials = atob(base64Credentials);
    const [username, password] = credentials.split(':');

    if (username !== BASIC_AUTH_USER || password !== BASIC_AUTH_PASSWORD) {
        return new Response(JSON.stringify({ message: 'Access denied' }), {
            status: 401,
            headers: { 'www-authenticate': 'Basic realm="Burg API"' }
        });
    }

    return null; // Successful authentication
}

// The GET request (public)
export async function GET({ params }) {
    const { uuid } = params;
    const connection = await createConnection();

    const [rows] = await connection.execute('SELECT * FROM Burg WHERE id = ?;', [uuid]);


    const brg = rows[0];

    return new Response(JSON.stringify(brg), {
        status: 200,
        headers: { 'content-type': 'application/json' }
    });
}

// The PUT request (protected)
export async function PUT({ params, request }) {
    const authResponse = await authenticate(request);
    if (authResponse) return authResponse;

    const { uuid } = params;
    const data = await request.json();
    const connection = await createConnection();

    try {
        const [result] = await connection.execute(
            `UPDATE Burg 
             SET 
                name = COALESCE(?, name), 
                ort = COALESCE(?, ort), 
                baujahr = COALESCE(?, baujahr), 
                eintrittspreis = COALESCE(?, eintrittspreis), 
                oeffnungszeiten = COALESCE(?, oeffnungszeiten) 
             WHERE id = ?;`,
            [
                data.name ?? null,
                data.ort ?? null,
                data.baujahr ?? null,
                data.eintrittspreis ?? null,
                data.oeffnungszeiten ?? null,
                uuid
            ]
        );

        if (result.affectedRows === 0) {
            return new Response(JSON.stringify({ error: 'Castle not found or no changes made' }), { status: 404 });
        }

        const [updatedCastle] = await connection.execute(
            'SELECT * FROM Burg WHERE id = ?;',
            [uuid]
        );


        return new Response(JSON.stringify(updatedCastle[0]), {
            status: 200,
            headers: { 'content-type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

// Delete Request (protected)
export async function DELETE({ params, request }) {
    const authResponse = await authenticate(request);
    if (authResponse) return authResponse;

    const { uuid } = params;
    const connection = await createConnection();

    try {
        const [result] = await connection.execute(
            'DELETE FROM Burg WHERE id = ?;',
            [uuid]
        );


        if (result.affectedRows === 0) {
            return new Response(JSON.stringify({ error: 'Castle not found' }), { status: 404 });
        }

        return new Response(null, { status: 204 });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
