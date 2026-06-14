---
name: Orval hook calling convention
description: How to correctly call generated Orval query hooks and mutation hooks in this workspace
---

## Query hooks
Signature: `useHookName(params?, options?)`

CORRECT:
```ts
useGetLeaderboard({ type: tab })
useAdminListUsers({ page: 1, limit: 20, search: q })
useListStories({ page, limit: 10 })
```

WRONG (design subagent made this mistake):
```ts
useGetLeaderboard({ query: { queryKey: [...] } })   // ← params and options confused
useAdminListUsers({ query: { queryKey: ... } })
```

## Mutation hooks
Mutations take path params + optional `data` body directly in `mutate({...})`.
Check the `UseMutationOptions` generic to see what fields are expected.

CORRECT:
```ts
useStartLevel().mutate({ storyId: 123 })
useCompleteLevel().mutate({ storyId: 123, data: { score: 100 } })
useEquipItem().mutate({ itemId: 42 })
useAdminBanUser().mutate({ id: userId, data: { reason: "..." } })
```

WRONG:
```ts
useStartLevel().mutate({ id: 123 })     // ← wrong field name, use storyId
useEquipItem().mutate({ id: 42 })       // ← wrong field name, use itemId
```

**Why:** Orval generates mutations where the path param name matches the OpenAPI `operationId` param name exactly, not a generic `id`. Always check the generated `UseMutationOptions` generic to confirm field names.
