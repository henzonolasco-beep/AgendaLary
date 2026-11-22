import { createInsertSchema } from "drizzle-zod";
import {
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";
import { schoolUsersTable } from "./schoolUsers";

export const announcementPriorityEnum = pgEnum("announcement_priority", [
  "normal",
  "important",
]);

export const announcementsTable = pgTable("school_announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  priority: announcementPriorityEnum("priority").notNull().default("normal"),
  createdBy: text("created_by")
    .notNull()
    .references(() => schoolUsersTable.id, { onDelete: "restrict" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertAnnouncementSchema = createInsertSchema(announcementsTable).omit({
  id: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Announcement = typeof announcementsTable.$inferSelect;
