import { useEffect } from "react";
import { Form, Link, useActionData, useFetcher } from "react-router";


type PostProps = {
    post: {
        id: number;
        createdAt: number;
        updatedAt: number;
        deletedAt: number | null;
        user_id: number | null;
        content: string;
        user: {
            id: number;
            username: string;
            email: string;
        } | null;
    };
    userId: number;
}

export default function Post({ post, userId }: PostProps) {

    // const { Form } = useFetcher();

    return (
        <div
            className="relative p-4 border rounded-lg group"
        >
            <div className="font-medium">{post.user?.username ?? "Anonymous"}</div>
            <p>{post.content}</p>
            <div className="text-sm text-gray-500 mt-2">
                {new Date(post.createdAt).toLocaleDateString()}
            </div>
            {
                post.user_id === userId && (
                    <div className="absolute p-2 flex w-full gap-2 justify-end bottom-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Form method="DELETE">
                            <input type="hidden" name="id" value={post.id} />
                            <button className="px-3 py-1 text-black bg-gray-200 rounded-full hover:bg-gray-300">Delete</button>
                        </Form>
                        <Link
                            to={`/post/${post.id}`}
                            className="px-3 py-1 text-black bg-gray-200 rounded-full hover:bg-gray-300"
                        >
                            Edit
                        </Link>
                    </div>
                )
            }
        </div>
    )
}