// GET "/"
export function GET(req: Request, ctx: Context) {
  const url = new URL(req.url);
  return Response.json({
    "name": "dnote-web-api",
    "version": "0.0.1",
    "url": url.href,
  });
}
