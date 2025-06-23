import { db } from "~/db"
import type { Route } from "./+types"
import { desc, sql } from "drizzle-orm";
import { posts } from "~/db/schema";

interface PaginationParams {
  limit: number;
  offset: number;
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const params: PaginationParams = {
    limit: Number(url.searchParams.get("limit")) || 10,
    offset: Number(url.searchParams.get("offset")) || 0
  };

  const [postsList, totalResult] = await Promise.all([
    db.query.posts.findMany({
      limit: params.limit,
      offset: params.offset,
      orderBy: [desc(posts.createdAt)],
      with: {
        user: {
          columns: {
            username: true,
            email: true
          }
        },
      },
      where: (post, { isNull }) => isNull(post.deletedAt)
    }),
    db.select({ count: sql<number>`count(*)` }).from(posts).get()
  ]);

  return {
    posts: postsList,
    total: totalResult?.count || 0
  };
}