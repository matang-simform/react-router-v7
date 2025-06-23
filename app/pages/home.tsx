import { redirect, useActionData, useFetcher } from "react-router";
import type { Route } from "./+types/home";
import { db } from "~/db";
import { count, desc, eq, isNull, sql } from "drizzle-orm";
import { posts } from "~/db/schema";
import { useEffect, useRef, useState } from "react";
import { getUserId } from "~/services/session";
import { response } from "~/utils/responce";
import Post from "~/components/post-card";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Posts" },
    { name: "description", content: "Welcome to React Router v7" },
  ];
}


export async function action({ request }: Route.ActionArgs) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      throw redirect("/login");
    }

    let formData = await request.formData();
    let postId = parseInt(formData.get("id")?.toString() ?? "");

    const post = await db.query.posts.findFirst({
      where: (post, { eq }) => {
        return eq(post.id, postId) && eq(post.user_id, userId)
      }
    })

    if (!post) {
      return response(false, { message: "Post not found" });
    }

    await db.update(posts).set({ deletedAt: Math.floor(Date.now() / 1000) }).where(eq(posts.id, postId))
    return response(true, { message: "Deleted succesfully", deleted_id: postId });
  }
  catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return response(false, { message: errorMessage });
  }


}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const limit = Number(url.searchParams.get("limit")) || 10;
  const offset = Number(url.searchParams.get("offset")) || 0;


  const [postsList, totalResult] = await Promise.all([
    db.query.posts.findMany({
      limit,
      offset,
      orderBy: [desc(posts.createdAt)],
      with: {
        user: {
          columns: {
            id: true,
            username: true,
            email: true
          }
        },
      },

      where: (post, { isNull }) => {
        return isNull(post.deletedAt)
      }
    }),
    db.select({ count: count() }).from(posts).where(() => isNull(posts.deletedAt)).get()
  ]);

  return {
    posts: postsList,
    total: totalResult?.count || 0
  };
}

export default function Home({ loaderData, matches }: Route.ComponentProps) {
  const initialData = loaderData
  const actionData = useActionData();
  const layoutData = matches?.find(m => m?.id === "layouts/index") as { data: { userId: number } } | undefined

  const { data, state, load, Form } = useFetcher();
  const [postData, setPostData] = useState(initialData)

  const isLoading = state !== "idle";



  function loadMorePosts() {
    const offset = postData.posts.length;
    const url = new URL(location.href);
    url.searchParams.set("index", "");
    url.searchParams.set("limit", "5");
    url.searchParams.set("offset", offset.toString());
    load(url.search);
  }

  const hasMore = postData.posts.length < postData.total;
  useEffect(() => {
    if (!data) return
    setPostData((prev) => ({
      ...prev,
      posts: [...prev.posts, ...(data?.posts ?? [])],
      total: data?.total
    }))
  }, [data])

  useEffect(() => {
    if (!actionData) return
    setPostData((prev) => ({
      ...prev,
      posts: prev.posts.filter((post) => post.id !== actionData?.data.deleted_id),
      total: prev.total - 1
    }))
  }, [actionData])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-4">Posts</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {postData.posts.map((post) => (
          <Post key={post.id} post={post} userId={layoutData?.data?.userId ?? 0} />
        ))}
      </div>
      {hasMore && (
        <button
          onClick={loadMorePosts}
          disabled={isLoading}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isLoading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}
