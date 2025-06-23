import bcrypt from 'bcrypt'
import { Link, redirect, useFetcher } from "react-router";
import type { Route } from "./+types/login";
import { response } from "~/utils/responce";
import { db } from '~/db';
import { users } from '~/db/schema';
import { eq } from 'drizzle-orm';
import { createUserSession, getUserId } from '~/services/session';

interface LoginError {
    message: string;
}

export async function loader({ request }: Route.LoaderArgs) {
    // Check if the user is already logged in
    const userId = await getUserId(request);
    if (userId) {
      return redirect("/");
    }
  }

export async function action({ request }: Route.ActionArgs) {
    try {
        const form = await request.formData();
        const email = form.get("email")?.toString();
        const password = form.get("password")?.toString();

        if (!email || !password) {
            return response<LoginError>(false, { message: "All fields are required" });
        }

        const user = await db.select().from(users).where(eq(users.email, email)).get();
        if (!user) {
            return response<LoginError>(false, { message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return response<LoginError>(false, { message: "Invalid password" });
        }        

        const res = await createUserSession({
            request,
            userId: user.id,
            remember: true,
        });

        if (!res) {
            throw new Error("An error occurred while creating the session");
        }

        const setCookieHeader = res.headers.get("Set-Cookie");
        return redirect("/", {
            headers: setCookieHeader
                ? { "Set-Cookie": setCookieHeader }
                : undefined,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return response<LoginError>(false, { message: errorMessage });
    }
}


export default function LoginPage() {

    const fetcher = useFetcher();

    return (
        <div className="max-w-md mx-auto mt-10 p-6">
            <h1 className="text-2xl font-bold mb-6">Sign in to your account</h1>

            <fetcher.Form className="space-y-4" method="post">
                {fetcher.data && <p className="text-red-500">{fetcher.data.data.message}</p>}
                <div>
                    <input
                        type="email"
                        required
                        name="email"
                        className="w-full p-2 border rounded"
                        placeholder="Email address"
                    />
                </div>
                <div>
                    <input
                        type="password"
                        required
                        name="password"
                        className="w-full p-2 border rounded"
                        placeholder="Password"
                        minLength={6}
                    />
                </div>
                <div>
                    Don't have an account? <Link to="/register" className='text-blue-500'>Sign up</Link>
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                        disabled={fetcher.state !== "idle"}
                    >
                        Sign in {fetcher.state === "submitting" && "..."}
                    </button>
                </div>
            </fetcher.Form>
        </div>
    );
}