# Kubernetes deployment

Kustomize manifests for deploying Purple Cross to a cluster.

```
deploy/k8s/
├── base/                     # namespace, config, backend, frontend, migrate job, ingress
└── overlays/production/      # production replica counts + image pins
```

## Prerequisites
- An ingress controller (nginx) and cert-manager (`letsencrypt-prod` ClusterIssuer) for TLS.
- A managed PostgreSQL and Redis (referenced via `DATABASE_URL` / `REDIS_URL` secrets).
- Secrets supplied **out of band** (sealed-secrets / external-secrets / cloud secret
  manager). `base/config.yaml` contains a Secret *template* with placeholders — never
  commit real values.

## Deploy
```bash
# 1. Provision/seal real secrets into the purple-cross-secrets Secret.
# 2. Run migrations first and wait for completion:
kubectl apply -f deploy/k8s/base/migrate-job.yaml
kubectl -n purple-cross wait --for=condition=complete job/purple-cross-migrate --timeout=300s
# 3. Apply the production overlay:
kubectl apply -k deploy/k8s/overlays/production
```

The backend exposes `/health/live` (liveness) and `/health/ready` (readiness, checks
DB + Redis); the HPA scales the backend 2→10 on CPU. The migration image must include
the Prisma CLI + `prisma/migrations` (build from the backend Dockerfile builder stage
or a dedicated migration image).
