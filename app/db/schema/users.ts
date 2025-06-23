import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { posts } from "./posts";

export const users = sqliteTable("users", {
    id: int().primaryKey({ autoIncrement: true }),
    username: text().notNull().unique(),
    email: text().notNull().unique(),
    password: text().notNull(),
    createdAt: int().notNull().default(Math.floor(Date.now() / 1000)),
    updatedAt: int().notNull().default(Math.floor(Date.now() / 1000)),
    deletedAt: int(),
});



export const userRelations = relations(users, ({ many }) => ({
    posts: many(posts),
}))