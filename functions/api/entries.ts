import type { Env } from "../types";

export const onRequest: PagesFunction<Env> = async (context) => {
  const { keys } = await context.env.UPLOADS.list();

  const entries = await Promise.all(
    keys.map(async ({ name }) => {
      const raw = await context.env.UPLOADS.get(name);
      return raw ? JSON.parse(raw) : null;
    })
  );

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  return new Response(JSON.stringify(entries.filter(Boolean)), {
    status: 200,
    headers,
  });
};
