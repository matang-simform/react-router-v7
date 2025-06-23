// app/services/session.server.ts

import { createCookieSessionStorage, redirect } from "react-router";

interface User {
  id: number;
  username: string;
  password: string;
}

interface SessionConfig {
  name: string;
  secrets: string[];
  sameSite: "lax" | "strict" | "none";
  path: string;
  httpOnly: boolean;
  secure: boolean;
}

interface CreateSessionParams {
  request: Request;
  userId: number;
  remember: boolean;
  redirectUrl?: string;
}

const USER_SESSION_KEY = "userId";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const sessionConfig: SessionConfig = {
  name: "__session",
  secrets: ["s3cret"], // Should be environment variable in production
  sameSite: "lax",
  path: "/",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

export const sessionStorage = createCookieSessionStorage({ cookie: sessionConfig });

export const { commitSession, destroySession } = sessionStorage;

/**
 * Retrieves the user session from the request.
 * @param {Request} request - The incoming request.
 * @returns {Promise<Session>} The user session.
 */
async function getUserSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

/**
 * Logs out the user by destroying their session.
 * @param {Request} request - The incoming request.
 * @returns {Promise<Response>} Redirect response after logout.
 */
export async function logout(request: Request): Promise<Response> {
  const session = await getUserSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

/**
 * Retrieves the user ID from the session.
 * @param {Request} request - The incoming request.
 * @returns {Promise<string | undefined>} The user ID if found, undefined otherwise.
 */
export async function getUserId(request: Request): Promise<User["id"] | undefined> {
  const session = await getUserSession(request);
  const userId = session.get(USER_SESSION_KEY);
  return userId;
}

/**
 * Creates a new user session.
 * @param {Object} params - The parameters for creating the session.
 * @param {Request} params.request - The incoming request.
 * @param {number} params.userId - The user ID to store in the session.
 * @param {boolean} params.remember - Whether to create a persistent session.
 * @param {string} [params.redirectUrl] - The URL to redirect to after creating the session.
 * @returns {Promise<Response>} Redirect response with the new session cookie.
 */
export async function createUserSession({
  request,
  userId,
  remember = true,
  redirectUrl,
}: CreateSessionParams): Promise<Response> {
  try {
    const session = await getUserSession(request);
    session.set(USER_SESSION_KEY, userId);

    return redirect(redirectUrl || "/", {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session, {
          ...sessionConfig,
          maxAge: remember ? SESSION_MAX_AGE : undefined,
        }),
      },
    });
  } catch (error) {
    throw new Error(
      `Failed to create user session: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
