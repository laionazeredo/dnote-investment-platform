// GET "/"
export function GET(req: Request) {
  const url = new URL(req.url);
  return Response.json({
    "name": "dnote-web-api",
    "version": "1.0.0",
    "url": url.href,
  });
}
