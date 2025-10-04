import { integer, pgTable, varchar, timestamp, text, serial } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  clerkId: varchar({ length: 255 }).notNull().unique(),
  firstName: varchar({ length: 255 }).notNull(),
  lastName: varchar({ length: 255 }).notNull(),
  username: varchar({ length: 255 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  profileImage: text(),
  bio: text(),
  plan: varchar({ length: 20 }).default('free').notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const recipesTable = pgTable("recipes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  clerkId: varchar({ length: 255 }).notNull(),
  title: varchar({ length: 500 }).notNull(),
  content: text().notNull(),
  ingredients: text(),
  preferences: text(),
  difficulty: varchar({ length: 50 }),
  cookingTime: integer(),
  servings: integer(),
  plan: varchar({ length: 20 }).default('free').notNull(),
  recipeNumber: serial(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});