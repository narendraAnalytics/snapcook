Get Started with Drizzle and Neon

Basic file structure
This is the basic file structure of the project. In the src/db directory, we have table definition in schema.ts. In drizzle folder there are sql migration file and snapshots.

📦 <project root>
 ├ 📂 drizzle
 ├ 📂 src
 │   ├ 📂 db
 │   │  └ 📜 schema.ts
 │   └ 📜 index.ts
 ├ 📜 .env
 ├ 📜 drizzle.config.ts
 ├ 📜 package.json
 └ 📜 tsconfig.json


 Step 1 - Install @neondatabase/serverless package
npm i drizzle-orm @neondatabase/serverless dotenv
npm i -D drizzle-kit tsx


Step 2 - Setup connection variables
Create a .env file in the root of your project and add your database connection variable:

DATABASE_URL=


Step 3 - Connect Drizzle ORM to the database



Create a index.ts file in the src directory and initialize the connection:

import { drizzle } from 'drizzle-orm/neon-http';
const db = drizzle(process.env.DATABASE_URL);


If you need a synchronous connection, you can use our additional connection API, where you specify a driver connection and pass it to the Drizzle instance.

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });


Step 4 - Create a table
Create a schema.ts file in the src/db directory and declare your table:

src/db/schema.ts

import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});


Step 5 - Setup Drizzle config file
Drizzle config - a configuration file that is used by Drizzle Kit and contains all the information about your database connection, migration folder and schema files.

Create a drizzle.config.ts file in the root of your project and add the following content:

drizzle.config.ts

import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});



Step 6 - Applying changes to the database
You can directly apply changes to your database using the drizzle-kit push command. This is a convenient method for quickly testing new schema designs or modifications in a local development environment, allowing for rapid iterations without the need to manage migration files:

npx drizzle-kit push


Step 8 - Run index.ts file
To run any TypeScript files, you have several options, but let’s stick with one: using tsx

You’ve already installed tsx, so we can run our queries now

Run index.ts script

npx tsx src/index.ts


## What We Accomplished - SnapCook Project Setup

### Completed Steps:
✅ **Step 1** - Installed required packages (drizzle-orm, @neondatabase/serverless, dotenv, drizzle-kit, tsx)
✅ **Step 2** - Created .env file with Neon database URL
✅ **Step 3** - Created src/db/index.ts with database connection
✅ **Step 4** - Created src/db/schema.ts with usersTable
✅ **Step 5** - Created drizzle.config.ts configuration file
✅ **Step 6** - Applied schema to database using `npx drizzle-kit push`

### Our Custom User Schema:
```typescript
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
```

### Database Structure:
- **User Management**: firstName, lastName, username, email
- **Authentication**: clerkId for Clerk integration
- **Pricing Plans**: plan field (free/pro/max) with 'free' default
- **Profile**: profileImage, bio for user customization
- **Timestamps**: createdAt, updatedAt for tracking

### Next Steps:
- Integrate Clerk authentication
- Connect Clerk users with database records using clerkId
- Implement pricing tier features based on plan field

