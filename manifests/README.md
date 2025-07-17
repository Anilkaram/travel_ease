# Travel Ease - Kubernetes Testing Deployment

## Quick Start for Testing

### 1. Deploy MongoDB (Required - 4 files)
```bash
kubectl apply -f mongo_secret.yml
kubectl apply -f mongo_service.yml  
kubectl apply -f mongo_statefulset.yml
kubectl apply -f server_secret.yml
```

### 2. Deploy Application
```bash
kubectl apply -f client_config.yml
kubectl apply -f client_service.yml
kubectl apply -f client_deployment.yml
kubectl apply -f server_service.yml
kubectl apply -f server_deployment.yml
```

### 3. Check Status
```bash
kubectl get pods
kubectl get services
```

### 4. Test MongoDB Connection
```bash
kubectl exec -it mongo-statefulset-0 -- mongosh -u admin -p admin --authenticationDatabase admin
```

## Storage (Optional)
- For AWS EKS: `kubectl apply -f storage_class.yml`
- For local testing: `kubectl apply -f local_storage_class.yml`
- Or use default StorageClass (recommended)

## Auto Scaling (Optional)
- `kubectl apply -f client_hpa.yml`
- `kubectl apply -f server_hpa.yml`

## ECR (Optional - for private registry)
- `kubectl apply -f ecr_secret.yml`

---

**MongoDB Configuration:**
- **Single Instance**: 1 pod, 1Gi storage, 512Mi RAM
- **Credentials**: admin/admin
- **Database**: travelease
- **Service**: mongo:27017
