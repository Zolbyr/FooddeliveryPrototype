export async function POST(req: Request){
    const {prompt} = await req.json();
    const encodedPrompt = encodeURIComponent(prompt.trim());
    const imageURL =`https://image.pollinations.ai/prompt/${encodedPrompt}`
    const imageRes = await fetch(imageURL);
    if (!imageRes.ok) {
        return new Response("Failed to generate image", {status: 500});
    }

    return new Response(imageRes.body, {
        headers: {"Content-Type": "image/png"},
    });
}