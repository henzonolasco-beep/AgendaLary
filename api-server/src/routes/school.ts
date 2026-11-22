import {
  CreateActivityBody,
  CreateActivityResponse,
  CreateAnnouncementBody,
  CreateAnnouncementResponse,
  DeleteActivityParams,
  DeleteAnnouncementParams,
  GetCurrentUserResponse,
  GetDashboardSummaryResponse,
  ListActivitiesResponse,
  ListAnnouncementsResponse,
  UpdateActivityBody,
  UpdateActivityParams,
  UpdateActivityResponse,
  UpdateAnnouncementBody,
  UpdateAnnouncementParams,
  UpdateAnnouncementResponse,
} from "@workspace/api-zod";
import {
  activitiesTable,
  announcementsTable,
  db,
} from "@workspace/db";
import { asc, count, desc, eq, gte, lt } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { requireSchoolAdmin, requireSchoolUser } from "../lib/schoolAuth";
import { requireSameOriginMutations } from "../lib/authSecurity";

const router: IRouter = Router();
router.use(requireSameOriginMutations);

function fortalezaToday(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Fortaleza",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function calendarDate(value: Date | string): string {
  return value instanceof Date ? value.toISOString().slice(0, 10) : value;
}

function toActivityResponse(
  activity: typeof activitiesTable.$inferSelect,
) {
  const { createdBy: _createdBy, ...publicActivity } = activity;
  return {
    ...publicActivity,
    createdAt: activity.createdAt.toISOString(),
    updatedAt: activity.updatedAt.toISOString(),
  };
}

function toAnnouncementResponse(
  announcement: typeof announcementsTable.$inferSelect,
) {
  const { createdBy: _createdBy, ...publicAnnouncement } = announcement;
  return {
    ...publicAnnouncement,
    createdAt: announcement.createdAt.toISOString(),
    updatedAt: announcement.updatedAt.toISOString(),
  };
}

router.get("/me", async (req, res): Promise<void> => {
  const user = await requireSchoolUser(req, res);
  if (!user) return;
  res.json(
    GetCurrentUserResponse.parse({
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
    }),
  );
});

router.get("/dashboard-summary", async (req, res): Promise<void> => {
  const user = await requireSchoolUser(req, res);
  if (!user) return;

  const today = fortalezaToday();
  const [[upcoming], [past], [nextActivity], [latestAnnouncement]] =
    await Promise.all([
      db
        .select({ value: count() })
        .from(activitiesTable)
        .where(gte(activitiesTable.dueDate, today)),
      db
        .select({ value: count() })
        .from(activitiesTable)
        .where(lt(activitiesTable.dueDate, today)),
      db
        .select()
        .from(activitiesTable)
        .where(gte(activitiesTable.dueDate, today))
        .orderBy(asc(activitiesTable.dueDate))
        .limit(1),
      db
        .select()
        .from(announcementsTable)
        .orderBy(desc(announcementsTable.createdAt))
        .limit(1),
    ]);

  res.json(
    GetDashboardSummaryResponse.parse({
      upcomingCount: upcoming.value,
      pastCount: past.value,
      nextActivity: nextActivity ? toActivityResponse(nextActivity) : null,
      latestAnnouncement: latestAnnouncement
        ? toAnnouncementResponse(latestAnnouncement)
        : null,
    }),
  );
});

router.get("/activities", async (req, res): Promise<void> => {
  const user = await requireSchoolUser(req, res);
  if (!user) return;
  const activities = await db
    .select()
    .from(activitiesTable)
    .orderBy(asc(activitiesTable.dueDate), desc(activitiesTable.createdAt));
  res.json(ListActivitiesResponse.parse(activities.map(toActivityResponse)));
});

router.post("/activities", async (req, res): Promise<void> => {
  const user = await requireSchoolAdmin(req, res);
  if (!user) return;

  const parsed = CreateActivityBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [activity] = await db
    .insert(activitiesTable)
    .values({
      ...parsed.data,
      dueDate: calendarDate(parsed.data.dueDate),
      createdBy: user.id,
    })
    .returning();
  res.status(201).json(CreateActivityResponse.parse(toActivityResponse(activity)));
});

router.patch("/activities/:id", async (req, res): Promise<void> => {
  const user = await requireSchoolAdmin(req, res);
  if (!user) return;

  const params = UpdateActivityParams.safeParse(req.params);
  const parsed = UpdateActivityBody.safeParse(req.body);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { dueDate, ...fields } = parsed.data;
  const [activity] = await db
    .update(activitiesTable)
    .set({
      ...fields,
      ...(dueDate === undefined ? {} : { dueDate: calendarDate(dueDate) }),
      updatedAt: new Date(),
    })
    .where(eq(activitiesTable.id, params.data.id))
    .returning();
  if (!activity) {
    res.status(404).json({ error: "Atividade não encontrada." });
    return;
  }
  res.json(UpdateActivityResponse.parse(toActivityResponse(activity)));
});

router.delete("/activities/:id", async (req, res): Promise<void> => {
  const user = await requireSchoolAdmin(req, res);
  if (!user) return;

  const params = DeleteActivityParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(activitiesTable)
    .where(eq(activitiesTable.id, params.data.id))
    .returning({ id: activitiesTable.id });
  if (!deleted) {
    res.status(404).json({ error: "Atividade não encontrada." });
    return;
  }
  res.sendStatus(204);
});

router.get("/announcements", async (req, res): Promise<void> => {
  const user = await requireSchoolUser(req, res);
  if (!user) return;
  const announcements = await db
    .select()
    .from(announcementsTable)
    .orderBy(desc(announcementsTable.createdAt));
  res.json(
    ListAnnouncementsResponse.parse(announcements.map(toAnnouncementResponse)),
  );
});

router.post("/announcements", async (req, res): Promise<void> => {
  const user = await requireSchoolAdmin(req, res);
  if (!user) return;

  const parsed = CreateAnnouncementBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [announcement] = await db
    .insert(announcementsTable)
    .values({ ...parsed.data, createdBy: user.id })
    .returning();
  res
    .status(201)
    .json(CreateAnnouncementResponse.parse(toAnnouncementResponse(announcement)));
});

router.patch("/announcements/:id", async (req, res): Promise<void> => {
  const user = await requireSchoolAdmin(req, res);
  if (!user) return;

  const params = UpdateAnnouncementParams.safeParse(req.params);
  const parsed = UpdateAnnouncementBody.safeParse(req.body);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [announcement] = await db
    .update(announcementsTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(announcementsTable.id, params.data.id))
    .returning();
  if (!announcement) {
    res.status(404).json({ error: "Aviso não encontrado." });
    return;
  }
  res.json(
    UpdateAnnouncementResponse.parse(toAnnouncementResponse(announcement)),
  );
});

router.delete("/announcements/:id", async (req, res): Promise<void> => {
  const user = await requireSchoolAdmin(req, res);
  if (!user) return;

  const params = DeleteAnnouncementParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(announcementsTable)
    .where(eq(announcementsTable.id, params.data.id))
    .returning({ id: announcementsTable.id });
  if (!deleted) {
    res.status(404).json({ error: "Aviso não encontrado." });
    return;
  }
  res.sendStatus(204);
});

export default router;
