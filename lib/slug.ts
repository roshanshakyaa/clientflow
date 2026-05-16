/* eslint-disable @typescript-eslint/no-explicit-any */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function uniqueSlug(
  ctx: any,
  userId: string,
  title: string,
): Promise<string> {
  const base = generateSlug(title);
  let slug = base;
  let count = 1;

  while (true) {
    const existing = await ctx.db
      .query("projects")
      .withIndex("by_slug", (q: any) => q.eq("userId", userId).eq("slug", slug))
      .first();

    if (!existing) return slug;
    slug = `${base}-${count++}`;
  }
}
