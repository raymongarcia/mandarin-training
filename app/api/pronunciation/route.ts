const permittedCharacters = /^[\p{Script=Han}\p{Script=Latin}\p{M}\s。，！？!?.…:;'"“”‘’（）()-]+$/u;

export async function GET(request: Request) {
  const text = new URL(request.url).searchParams.get("text")?.trim();
  if (!text || text.length > 120 || !permittedCharacters.test(text)) {
    return Response.json({ error: "Provide a short Mandarin phrase to pronounce." }, { status: 400 });
  }

  const speechUrl = new URL("https://translate.google.com/translate_tts");
  speechUrl.searchParams.set("ie", "UTF-8");
  speechUrl.searchParams.set("client", "tw-ob");
  speechUrl.searchParams.set("tl", "zh-CN");
  speechUrl.searchParams.set("q", text);

  let upstream: Response;
  try {
    upstream = await fetch(speechUrl, {
      headers: { Accept: "audio/mpeg" },
      signal: AbortSignal.timeout(10000),
    });
  } catch (error) {
    console.error("Mandarin pronunciation service request failed.", error);
    return Response.json({ error: "Mandarin audio is temporarily unavailable." }, { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    console.error("Mandarin pronunciation service returned an unsuccessful response.", upstream.status);
    return Response.json({ error: "Mandarin audio is temporarily unavailable." }, { status: 502 });
  }

  return new Response(upstream.body, {
    headers: {
      "Cache-Control": "public, max-age=86400",
      "Content-Type": "audio/mpeg",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
