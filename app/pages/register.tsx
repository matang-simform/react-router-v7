import bcrypt from 'bcrypt'
import { db } from "~/db";
import type { Route } from "./+types/register";
import { Form, Link, redirect, useFetcher } from "react-router";
import { users } from "~/db/schema";
import { response } from "~/utils/responce";


interface RegisterError {
    message: string;
}

export async function action({ request }: Route.ActionArgs) {
    try {
        const form = await request.formData();
        const username = form.get("username")?.toString();
        const email = form.get("email")?.toString();
        const password = form.get("password")?.toString();
    
        if (!username || !email || !password) {
            return response<RegisterError>(false, { message: "All fields are required" });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await db.insert(users).values({ username, email, password: hashedPassword });
        return redirect("/login");
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return response<RegisterError>(false, { message: errorMessage });
    }
}

export default function Register() {
    const fetcher = useFetcher();

    return (
        <div className="max-w-md mx-auto mt-10 p-6">
            <h1 className="text-2xl font-bold mb-6">Register</h1>
            <fetcher.Form className="space-y-4" method="post">
                {fetcher.data && <p className="text-red-500">{fetcher.data.data.message}</p>}
                <div>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full p-2 border rounded"
                        required
                        minLength={6}
                    />
                </div>
                <div>
                    Allready have an account <Link to="/login" className='text-blue-500'>Sign in</Link>
                </div>
                <button 
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                    disabled={fetcher.state === "submitting"}
                >
                    Register {fetcher.state === "submitting" && "..." }
                </button>
            </fetcher.Form>
        </div>
    );
}