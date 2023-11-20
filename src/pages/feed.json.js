import feed from '../feed.js';

export async function GET(context) {
    const response = await feed(context);
    return new Response(response.json1(), {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        },
    });
}