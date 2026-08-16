const assetRequest = (request, pathname) => {
  const url = new URL(request.url);
  url.pathname = pathname;
  return new Request(url, {
    method: "GET",
    headers: request.headers,
  });
};

export default {
  async fetch(request, env) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { Allow: "GET, HEAD" },
      });
    }

    if (!env.ASSETS) {
      return new Response("Static assets are unavailable.", { status: 503 });
    }

    const url = new URL(request.url);
    const direct = await env.ASSETS.fetch(request);
    if (direct.status !== 404) return direct;

    if (url.pathname === "/" || url.pathname.endsWith("/")) {
      const index = await env.ASSETS.fetch(assetRequest(request, "/index.html"));
      if (index.status !== 404) return index;
    }

    const fallback = await env.ASSETS.fetch(assetRequest(request, "/404.html"));
    if (fallback.status === 404) return new Response("Not Found", { status: 404 });

    return new Response(fallback.body, {
      status: 404,
      headers: fallback.headers,
    });
  },
};
