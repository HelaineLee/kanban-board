```bash
npm install
npx prisma migrate dev
npm run dev
```

Run the automated test suite with:

```bash
npm test
```

Feature work should include matching test updates under `tests/` before it is considered complete.

Production and Vercel notes:

```bash
npm run vercel-build
```

`npm run vercel-build` intentionally skips `prisma migrate deploy`.
Run production migrations as a separate release step:

```bash
npm run db:migrate:deploy
```