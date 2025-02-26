import { promises as fs } from 'fs';
import { createConnection } from '$lib/mysql.js';

// The GET request 
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

// The PUT  request
export async function PUT({ params, request }) {
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




// Delete Request

export async function DELETE({ params }) {
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
