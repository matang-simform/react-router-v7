import { redirect, useFetcher } from "react-router";
import type { Route } from "./+types/create-post";
import { response } from "~/utils/responce";
import { getUserId } from "~/services/session";
import { posts } from "~/db/schema";
import { db } from "~/db";



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
        const post = form.get("post")?.toString() ?? "";
    
        
        await db.insert(posts).values({
            content: post,
            user_id: userId
        })
        return redirect("/");
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return response<CreatePostError>(false, { message: errorMessage });
    }
}

export default function CreatePost() {

    const fetcher = useFetcher();
    return (
        <div className="max-w-md mx-auto mt-10 p-6">
            <h1 className="text-2xl font-bold mb-6">Create Post</h1>
            <fetcher.Form className="space-y-4" method="post">
                {fetcher.data && <p className="text-red-500">{fetcher.data.data.message}</p>}
                <div>
                    <textarea
                        name="post"
                        placeholder="post ...."
                        className="w-full p-2 border rounded"
                        required
                    ></textarea>
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