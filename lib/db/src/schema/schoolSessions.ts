import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { schoolUsersTable } from "./schoolUsers";

export const schoolSessionsTable = pgTable(
  "school_sessions",
  {
    tokenHash: text("token_hash").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => schoolUsersTable.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("school_sessions_user_id_idx").on(table.userId),
    index("school_sessions_expires_at_idx").on(table.expiresAt),
  ],
);
