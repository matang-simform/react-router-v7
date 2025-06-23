import path from "path";

export function relativePath(...relativePath: string[]) {
    // Get the parent directory of __dirname (utils) to reach app folder
    const appDir = path.dirname(__dirname);
    // Join with pages directory and the provided path segments
    return path.join(appDir, "pages", ...relativePath);
}