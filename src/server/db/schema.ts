import { sqliteTable } from "drizzle-orm/sqlite-core/table";
import { integer, text } from "drizzle-orm/sqlite-core";

const image_source_variants = Object.freeze([
  "custom_link",
  // "from_readme",
  // "created_screenshot",
]) satisfies readonly [string, ...string[]];

export const tbl_users = sqliteTable("users", {
  gh_id: integer("gh_id").primaryKey().notNull(),
});

export const tbl_repos = sqliteTable("repos", {
  repo_gh_id: integer("gh_repo_id").primaryKey().notNull(),
  user_gh_id: integer("user_gh_id")
    .references(() => tbl_users.gh_id)
    .notNull(),
  image_source: text("image_source", { enum: image_source_variants }).notNull(),
  custom_link: text("custom_link"),
});
