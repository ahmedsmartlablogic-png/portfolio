# Project setup

Yeh guide naye laptop par project chalane aur GitHub ke zariye collaboration ke liye hai.

## Zaroori cheezein

- Git
- Bun (project ka lockfile `bun.lock` hai)
- VS Code (optional)

Windows par Bun install karne ke liye PowerShell mein:

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

Terminal band karke dobara kholen, phir verify karein:

```powershell
git --version
bun --version
```

## Project clone aur dependencies

GitHub account ko repository ka access milne ke baad:

```powershell
git clone https://github.com/ahmedsmartlablogic-png/portfolio.git
cd portfolio
bun install --frozen-lockfile
```

Private repository ho to pehle GitHub par sign in karein aur collaborator access confirm karein.

## Environment aur database

Project Prisma ke saath SQLite use karta hai. `.env` mein `DATABASE_URL` set hona chahiye. Local SQLite ke liye:

```env
DATABASE_URL="file:./db/custom.db"
```

Schema `prisma/schema.prisma` mein hai; is relative URL se local database `prisma/db/custom.db` mein banta hai. Agar `.env` pehle se maujood hai, uski local configuration check karein aur apne laptop ka database path zaroorat par set karein.

> **Important:** Repository mein `.env` filhaal Git se tracked hai. Is file mein passwords, API keys ya doosre secrets na rakhein, aur is file ke changes push karne se pehle review karein. `.gitignore` mein hone ke bawajood tracked file Git mein track hoti rehti hai.

Dependencies install hone ke baad Prisma client generate karein:

```powershell
bun run db:generate
```

Agar local database file abhi maujood nahi hai, schema ko initialize karne ke liye:

```powershell
bun run db:push
```

`db:push` database schema update karta hai aur project script `--accept-data-loss` use karti hai. Existing database par chalane se pehle uska backup lein; pehle se data wali database par bina review ke na chalayein.

## Development server

```powershell
bun run dev
```

Browser mein [http://localhost:3002](http://localhost:3002) kholen. Server rokne ke liye terminal mein `Ctrl+C` dabayein.

## Aam commands

```powershell
bun run lint          # ESLint
bun run build         # Production build
bun run start         # Production server; build ke baad chalayein
bun run db:generate   # Prisma client generate karein
bun run db:push       # Schema ko SQLite database par apply karein
```

## GitHub collaboration

1. Repository owner GitHub par repository ke **Settings → Collaborators** section se collaborator ko invite kare.
2. Collaborator invite accept karke repository clone kare.
3. `main` par seedha kaam karne ke bajaye har task ke liye alag branch banaye:

   ```powershell
   git switch main
   git pull --ff-only origin main
   git switch -c feature/short-task-name
   ```

4. Changes check karke commit aur branch push kare:

   ```powershell
   git status
   git add <changed-files>
   git commit -m "Describe the change"
   git push -u origin feature/short-task-name
   ```

5. GitHub par us branch se `main` ke liye Pull Request khole; review ke baad merge kare.

Har naye task se pehle `main` update karke nayi branch banayein. Secrets, generated dependencies aur naye local database files commit na karein. Database file mein intentional changes hon tabhi unhein commit karein; commit se pehle `git status` aur staged files review karein.
