# Architecture proposal for shared accounts and content

Status: proposal only. Nothing in this document is built. Lernova is still a static site on GitHub Pages. Accounts, passwords, approval and settings stay in the browser (`localStorage` / `sessionStorage`). That cannot honestly become the admin system described below.

Do not treat a hidden button, a local editor, or a “must change password” screen stored only on one laptop as authorization, a shared content store, or a password reset.

## What sections 5–8 need

- One content store that every intended student reads, including drafts versus published lessons, quiz items, and images with caption and alt text.
- Authorization checked on the server for every read and write. Hiding an admin link is not enough, and a student can call the API directly.
- Passwords stored only as a slow, salted hash. Admins never see a password, not even a temporary one after they have handed it over. Nothing secret in logs.
- An admin sets or generates a temporary password for one user. The account is flagged must-change. Existing sessions for that user die. The temporary password works once for the change and then does not. The user cannot open lessons until the new password is set. The event is logged without the password.
- A user sees their own name and username, can change the display name and their own password, and cannot read anyone else’s record. Username stays fixed unless a later decision says otherwise.
- Uploaded images live in object storage, not in each browser’s `localStorage`.

## What the current site cannot do safely

| Need | Why GitHub Pages + `localStorage` fails |
| --- | --- |
| Shared lessons and quizzes | Each browser has its own copy. Publishing on one machine does not update the others. |
| Server-side authorization | The pages are files. Anyone who can open the URL can read the JavaScript. |
| Password reset that invalidates sessions | There is no session list. A hash in `localStorage` can be edited by the same person. |
| Admin must not see passwords | Today’s class login stores unsalted SHA-256, and `users.js` still has a plaintext admin password for the separate export screen. |
| Image upload for everyone | A data URL in one browser is not a file the class can load. |
| Audit log | A log in `localStorage` can be deleted by the user who is being audited. |

Moving the current hashes into a database would not make them safe. Unsalted SHA-256 is not a password store. Migration means a forced reset, not a copy of `fisi-users`.

## Option A — Supabase (Auth, Postgres, Storage)

The static site stays on GitHub Pages and calls Supabase with the public anon key. Row Level Security policies are the real permission check: students read published rows, admins write, a user updates only their own profile. Storage policies do the same for images. Auth issues the session; the must-change flag is a column the API refuses to skip.

Fit: no server to run, SQL matches lessons and questions, RLS matches “not by hiding buttons”.

Cost and limits change. As of this writing the free tier is enough to try a class project, with a small database and file quota, and free projects can pause after inactivity. Confirm the current numbers on Supabase’s pricing page before relying on it. A paid plan is the usual way to keep a school site awake. No paid plan should be started without a yes.

## Option B — Firebase (Auth, Firestore or Postgres, Storage)

Same shape: GitHub Pages in front, Firebase security rules instead of RLS. Auth handles sessions and password changes. Rules must reject a student who writes a lesson or reads another profile.

Fit: familiar console, generous free Spark quotas for a small class, rules are easy to get wrong. Confirm current Spark limits before choosing. Data is less portable than SQL if you later leave Google.

## Option C — Small self-hosted API

A tiny API plus Postgres on a school VM or a small VPS. The Pages site sends the session cookie or bearer token. The API checks role on every route, stores a salted hash (for example Argon2id), invalidates sessions on reset, and writes an audit row without the secret. Images go to disk or to something like MinIO.

Fit: no vendor pause, full control, backups are your job. Someone has to patch, obtain TLS, and restore. A small VPS is usually a few euros a month plus time. That spend also needs a yes.

## Recommendation

Option A if the priority is a class site without operating a server. Option C if the school must keep accounts off a third party. Option B is reasonable if you already have Google accounts and accept the lock-in. All three replace the browser user list. None of them is started in this pull request.

## Migration of people already registered

1. Export usernames, names, emails, student numbers and approval flags. Do not treat the current hashes as passwords you can keep.
2. Create the accounts in the new auth system with must-change set, or send a one-time setup link.
3. Seed published lessons from the existing HTML and `lesson-pack.js`, and seed `quiz-data.js`, after a human checks them.
4. Turn off the old `localStorage` login only when the new login is the one students actually use.
5. Delete the plaintext `ADMIN_PASSWORD` path in `admin.html` / `users.js` as part of that cutover, not before.

## Approval needed before any of this is built

- Which option (A, B, or C).
- Who pays, and whether a free tier that can pause is acceptable for the school year.
- Where personal data may sit (EU region or a school machine).
- Who is the first admin, and that every current user will set a new password.
- Permission to add a public client key to the Pages site and to retire the browser-only accounts.

Until that yes, Lernova will not pretend that content management, password reset, or a shared profile exist.
