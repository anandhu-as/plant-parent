# 🪴 plant-parent

A shared, no-login plant-watering tracker for households. Create a household, get a secret link, and anyone with that link can add plants and log waterings — no accounts, no passwords.

## How it works

* **No auth, ever.** Creating a household generates a random ~113-bit token embedded in a URL (`/h/<token>`). That link *is* the access grant — whoever has it can view and edit that household's plants, the same way "anyone with the link can edit" works on a Google Doc.
* **Simple watering tracking** — each plant shows its current watering state based on its watering history. A plant that has never been watered shows **"Never watered"**. After watering it, the plant shows **"Watered today"**.
* **Photo-based plant ID (optional)** — upload a leaf photo and [Pl@ntNet](https://plantnet.org) suggests the species, auto-filling the plant's name and species.
* **Multi-household support** — create or join more than one household and switch between them from a dropdown.

## Tech stack

* [Next.js 15](https://nextjs.org) (App Router, Server Actions) + TypeScript
* [Tailwind CSS](https://tailwindcss.com)
* [Drizzle ORM](https://orm.drizzle.team) + [Neon](https://neon.tech) (serverless Postgres)
* [Pl@ntNet API](https://my.plantnet.org) for optional photo identification

## Prerequisites

* [Node.js](https://nodejs.org) 18.18+ or 20+
* [pnpm](https://pnpm.io) (`npm install -g pnpm` if you don't have it)
* A free [Neon](https://neon.tech) account

## Setup

### 1. Clone and install

```bash
git clone https://github.com/anandhu-as/plant-parent.git
cd plant-parent
pnpm install
```

If pnpm blocks native build scripts on first install (`ERR_PNPM_IGNORED_BUILDS`), run:

```bash
pnpm approve-builds
```

Select all listed packages, then re-run:

```bash
pnpm install
```

### 2. Create a Neon database

1. Sign up / log in at [neon.tech](https://neon.tech)
2. Create a new project.
3. In **Connection Details**, toggle on **Pooled connection**.
4. Copy the connection string. It should look similar to:

```text
postgres://user:password@ep-xxxx-pooler.region.aws.neon.tech/dbname?sslmode=require
```

### 3. Configure environment variables

Copy the example env file:

```bash
cp .env.local.example .env.local
```

Then fill in `.env.local`:

```env
# Required
DATABASE_URL="postgres://user:password@ep-xxxx-pooler.region.aws.neon.tech/dbname?sslmode=require"

# Optional — enables photo-based plant identification
PLANTNET_API_KEY=""
```

> **Note:** The file must be named exactly `.env.local` — not `.env.local.txt` or any variation. It must also sit in the project root, next to `package.json`.

If you're using the Pl@ntNet identification feature, make sure your API key's **Authorized IPs / CORS** settings in your [Pl@ntNet account](https://my.plantnet.org) aren't restricted to a specific IP. For local development, use `0.0.0.0/0`, since requests come from wherever the app is running rather than directly from the visitor's browser.

### 4. Run the database migration

```bash
pnpm db:migrate
```

This creates the `households`, `plants`, and `watering_logs` tables in your Neon database.

You can confirm it worked by checking the **Tables** view in the Neon dashboard.

### 5. Start the development server

```bash
pnpm dev
```

Open http://localhost:3000.

Create a household and you'll be redirected to:

```text
/h/<token>
```

That URL is your shareable household link.

## Watering

Each plant keeps track of its watering history.

* A plant that has never been watered shows **"Never watered"**.
* When you mark a plant as watered, the latest watering date is recorded.
* If you water a plant today, it will show **"Watered today"**.
* The plant's watering interval is displayed alongside its watering history.

## Available scripts

| Command            | Description                                  |
| ------------------ | -------------------------------------------- |
| `pnpm dev`         | Start the development server                 |
| `pnpm build`       | Build for production                         |
| `pnpm start`       | Run the production build                     |
| `pnpm db:generate` | Generate a new migration from schema changes |
| `pnpm db:migrate`  | Apply pending migrations to the database     |
| `pnpm db:studio`   | Open Drizzle Studio (visual DB browser)      | \

