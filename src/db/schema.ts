import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  json,
  pgEnum,
} from "drizzle-orm/pg-core";

export const messageRoleEnum = pgEnum("message_role", ["USER", "ASSISTANT"]);

export const messageTypeEnum = pgEnum("message_type", ["RESULT", "ERROR"]);

//    USERS
export const users = pgTable("users", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  clerkId: varchar("clerk_id", { length: 255 }).notNull().unique(),

  email: varchar("email", { length: 255 }).unique(),

  firstName: varchar("first_name", { length: 255 }),

  lastName: varchar("last_name", { length: 255 }),

  name: varchar("name", { length: 255 }),

  imageUrl: text("image_url"),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

//    PROJECTS
export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 255 }).notNull(),

  userId: varchar("user_id", { length: 255 })
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

//    MESSAGES
export const messages = pgTable("messages", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  content: text("content").notNull(),

  role: messageRoleEnum("role").notNull(),

  type: messageTypeEnum("type").notNull(),

  projectId: uuid("project_id")
    .references(() => projects.id, {
      onDelete: "cascade",
    })
    .notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

//    FRAGMENTS
export const fragments = pgTable("fragments", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  messageId: varchar("message_id", { length: 255 })
    .references(() => messages.id, {
      onDelete: "cascade",
    })
    .unique()
    .notNull(),

  sandboxUrl: text("sandbox_url"),

  title: varchar("title", { length: 255 }).notNull(),

  files: json("files").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
