import feed from '../feed.js';

export async function GET(context) {
    const response = await feed(context);
    return new Response(response.rss2(), {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/rss+xml"
        }
    });
}