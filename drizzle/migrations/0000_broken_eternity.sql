CREATE TABLE `repos` (
	`gh_repo_id` integer PRIMARY KEY NOT NULL,
	`user_gh_id` integer NOT NULL,
	`image_source` text DEFAULT 'default' NOT NULL,
	`custom_link` text DEFAULT NULL,
	FOREIGN KEY (`user_gh_id`) REFERENCES `users`(`gh_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`gh_id` integer PRIMARY KEY NOT NULL
);
