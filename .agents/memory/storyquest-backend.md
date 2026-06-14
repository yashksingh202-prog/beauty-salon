---
name: StoryQuest backend patterns
description: Key patterns and gotchas in the StoryQuest Express backend
---

## parseInt with req.params
Express 5 types `req.params[key]` as `string | string[]`. Always cast:
```ts
const id = parseInt(String(req.params.id));
```

## requireAuth / requireAdmin return type
Must be `Promise<void>` (not `Promise<Response | void>`) to satisfy Express 5 middleware types. Use `res.status(x).json(...)` then `return;` instead of `return res.status(x).json(...)`.

## nanoid
`nanoid` is installed on `@workspace/api-server` for referral code generation.

## DB schema lib rebuild
After adding new schema files to `lib/db/src/schema/`, always run `pnpm run typecheck:libs` before typechecking any artifact. Missing exports usually mean stale lib declarations, not bad imports.

**Why:** The DB lib is composite — it must be rebuilt with `tsc --build` for artifact packages to see new exports.
