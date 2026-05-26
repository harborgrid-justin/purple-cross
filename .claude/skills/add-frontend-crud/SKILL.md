---
name: add-frontend-crud
description: Build a real CRUD page (list/create/edit) in the Vite + React frontend wired to the API client + TanStack Query + the shared Zod form layer, replacing placeholder/stub pages. Use when adding or converting pages under frontend/src/pages.
---

# Add a frontend CRUD page

Wire real data + validation; do not leave info-card stubs or mock arrays.

## Steps
1. **API** — ensure the endpoint group exists in `frontend/src/services/api.ts`
   (`api.<module>.getAll/getById/create/update/delete`). Add it there if missing,
   following the existing namespaces.
2. **Data hooks** — use TanStack Query. Reuse/extend the hook pattern in
   `frontend/src/hooks/usePatients.ts` (`useQuery` for reads, `useMutation` +
   `invalidateQueries` for writes; keys from `QUERY_KEYS`).
3. **List page** — `frontend/src/pages/<Module>.tsx`: fetch live data via the hook
   (no hardcoded arrays), with loading/empty/error states; link to create/edit.
4. **Create/Edit forms** — use the shared **Zod-validated form layer**:
   `useZodForm` (`frontend/src/hooks/useZodForm.ts`) + `FormField`
   (`frontend/src/components/form/FormField.tsx`). Mirror the backend Joi schema
   in the Zod schema so client-side validation matches server rules. Worked
   example: `frontend/src/pages/patients/PatientsCreate.tsx`.
5. **Routing** — register routes; protected app routes already render inside
   `ProtectedRoute` (`frontend/src/routes/ProtectedRoute.tsx`) via `App.tsx`. Add
   `allowedRoles` for role-gated pages.
6. **Accessibility** — labels tied to inputs, `aria-invalid`/`aria-required`,
   `role="alert"` for errors (FormField does this).

## Verify
- `cd frontend && npm run typecheck` (no new errors vs baseline).
- Run the dev server and exercise create → list → edit in the browser; confirm
  client-side validation errors show before submit and the network calls succeed.

See `docs/LLM_ENGINEERING_GUIDE.md` and root `CLAUDE.md` ("Adding a New Frontend Page").
