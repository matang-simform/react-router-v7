import { relations, sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const posts = sqliteTable("posts", {
    id: int().primaryKey({ autoIncrement: true }),
    user_id: int(),
    content: text().notNull(),
    createdAt: int().notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: int().notNull().default(sql`CURRENT_TIMESTAMP`),
    deletedAt: int(),
});

export const postsRelations = relations(posts, ({ one }) => ({
    user: one(users, {
        fields: [posts.user_id],
        references: [users.id],
    }),
}))