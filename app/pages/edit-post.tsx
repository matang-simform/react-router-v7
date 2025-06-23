import { redirect, useFetcher } from "react-router";
import type { Route } from "./+types/edit-post";
import { response } from "~/utils/responce";
import { getUserId } from "~/services/session";
import { posts } from "~/db/schema";
import { db } from "~/db";
import { eq } from "drizzle-orm";



interface CreatePostError {
    message: string;
}

export async function action({ request }: Route.ActionArgs) {
    try {
        const userId = await getUserId(request);        
        
        if(!userId) {
            throw redirect("/login");
        }

        const form = await request.formData();
        const postId = form.get("id")?.toString() ?? "";
        const postContent = form.get("post")?.toString() ?? "";
    
        const post = db.query.posts.findFirst({
            where: (post, { eq }) => {
                return eq(post.id, parseInt(postId)) && eq(post.user_id, userId)
            }
        })

        if(!post) {
            return redirect("/");
        }

        await db.update(posts).set({
            content: postContent,
            updatedAt: Math.floor(Date.now() / 1000)
        }).where(eq(posts.id, parseInt(postId)))


        
        return redirect("/");
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return response<CreatePostError>(false, { message: errorMessage });
    }
}


export async function loader({ request, params }: Route.LoaderArgs) {
    try {
        const userId = await getUserId(request);
        if(!userId) {
            throw redirect("/login");
        }
    
        const post = await db.query.posts.findFirst({
            where: (post, { eq }) => {
                return eq(post.id, parseInt(params.postId))
            }
        })
    
        if(!post) {
            return redirect("/");
        }
    
        return { post };
    }
    catch(error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return response<CreatePostError>(false, { message: errorMessage });
    }
  }
  

export default function EditPost({loaderData}: Route.ComponentProps) {
    
    const { post } = loaderData as { post: { id: number, content: string } }
    const fetcher = useFetcher();
    return (
        <div className="max-w-md mx-auto mt-10 p-6">
            <h1 className="text-2xl font-bold mb-6">Create Post</h1>
            <fetcher.Form className="space-y-4" method="post">
                {fetcher.data && <p className="text-red-500">{fetcher.data.data.message}</p>}
                <div>
                    <input
                        defaultValue={post.id}
                        type="hidden"
                        name="id"
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <textarea
                        name="post"
                        placeholder="post ...."
                        className="w-full p-2 border rounded"
                        required
                    >{post.content}</textarea>
                </div>
                <button 
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                    disabled={fetcher.state === "submitting"}
                >
                    Create {fetcher.state === "submitting" && "..." }
                </button>
            </fetcher.Form>
        </div>
    )
}