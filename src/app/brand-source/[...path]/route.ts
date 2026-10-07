import { serveMedia } from "@/lib/uploads";

/** Brand source raw files served from disk or database */
export async function GET(request: Request, ctx: RouteContext<"/brand-source/[...path]">) {
  const { path } = await ctx.params;
  return serveMedia(`/brand-source/${path.join("/")}`, request);
}
