# feature 2
<img width="1920" height="1080" alt="Screenshot (261)" src="https://github.com/user-attachments/assets/a8370a95-59dd-4df6-ac3f-5a73776937c8" />

# feature 3
<img width="1920" height="1080" alt="Screenshot (278)" src="https://github.com/user-attachments/assets/2ec67c28-acc9-4adf-aeb6-9062dcb56efa" />

<img width="668" height="169" alt="image" src="https://github.com/user-attachments/assets/5ef979c7-1087-412f-a659-b8b71ca093e5" />
<img width="1920" height="1080" alt="Screenshot (265)" src="https://github.com/user-attachments/assets/24b68748-a3e0-442f-82a1-46014361bffb" />
# Helm Deployment Guide for Travel Ease Application
## Prerequisites

1. **Helm installed**:
   ```bash
   # Install Helm
   curl https://get.helm.sh/helm-v3.12.0-linux-amd64.tar.gz | tar xz
   sudo mv linux-amd64/helm /usr/local/bin/
   ```

2. **Kubernetes cluster access**:
   ```bash
   kubectl cluster-info
   ```

3. **Correct directory structure**:
   ```
   manifests/
   ├── Chart.yaml
   ├── values.yaml
   └── templates/
       ├── client_config.yml
       ├── client_deployment.yml
       ├── client_service.yml
       ├── mongo_secret.yml
       ├── mongo_service.yml
       ├── mongo_statefulset.yml
       ├── server_deployment.yml
       ├── server_secret.yml
       ├── server_service.yml
       └── storage_class.yml
   ```

## Deployment Commands

### 1. Move files to templates directory (if not done):
```bash
# Create templates directory
mkdir -p templates

# Move all YAML files to templates
mv *.yml templates/
```

### 2. Verify Chart structure:
```bash
helm lint .
```

### 3. Dry run to check templates:
```bash
helm install myapp . --namespace prod --create-namespace --dry-run --debug
```

### 4. Install the application:
```bash
helm install myapp . --namespace prod --create-namespace
```

### 5. Check deployment status:
```bash
kubectl get pods -n prod
kubectl get services -n prod
helm status myapp -n prod
```

## Troubleshooting

### If you get "already exists" errors:
```bash
# Check existing resources
kubectl get all -n prod

# If you need to clean up:
helm uninstall myapp -n prod
kubectl delete namespace prod

# Then retry installation
helm install myapp . --namespace prod --create-namespace
```

### If resources don't start:
```bash
# Check pod logs
kubectl logs -n prod deployment/myapp-server
kubectl logs -n prod deployment/myapp-client
kubectl logs -n prod statefulset/myapp-mongo

# Check events
kubectl get events -n prod --sort-by='.lastTimestamp'
```

### Update deployment:
```bash
# If you make changes to values.yaml or templates
helm upgrade myapp . -n prod
```

## Accessing the Application

After successful deployment:

1. **Get service information**:
   ```bash
   kubectl get services -n prod
   ```

2. **Port forward for local access**:
   ```bash
   kubectl port-forward -n prod service/myapp-client-service 8080:80
   ```

3. **Access application**:
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:8080/api (through frontend proxy)

## Resource Naming Convention

With `myapp` as the release name, resources will be created as:
- Deployments: `myapp-client`, `myapp-server`
- StatefulSet: `myapp-mongo`
- Services: `myapp-client-service`, `myapp-server-service`, `myapp-mongo-service`
- ConfigMap: `myapp-client-config`
- Secrets: `myapp-server-secret`, `myapp-mongo-secret`

This ensures no naming conflicts and allows multiple releases in the same cluster.


