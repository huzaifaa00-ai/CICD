# Local Jenkins + K3s Setup Guide

This guide is customized for:
- Docker Hub user: `ravipratapsingh14`
- Git branch: `main`
- Jenkins runtime: Docker container on your local machine
- Kubernetes target: K3s

## 1. Install Required Software
- Docker Desktop or Docker Engine
- Git
- K3s

If K3s is not installed yet on Linux:

```bash
curl -sfL https://get.k3s.io | sh -
sudo kubectl get nodes
```

If you are using macOS or Windows locally, it is usually easier to run K3s on an Ubuntu EC2 instance and keep Jenkins local, or use a lightweight Kubernetes alternative locally for practice.

## 2. Start Jenkins In Docker
From the project root:

```bash
docker compose -f docker-compose.jenkins.yml up -d --build
```

Open:
- Jenkins UI: [http://localhost:8080](http://localhost:8080)

Check Jenkins logs:

```bash
docker logs -f jenkins-devops
```

## 3. Prepare Jenkins Credentials
In Jenkins, create these credentials:

1. `docker-image-repo`
Secret text:
```text
ravipratapsingh14/cicd-demo-app
```

2. `dockerhub-creds`
Username/password:
- Username: `ravipratapsingh14`
- Password: your Docker Hub password or access token

3. `kubeconfig-file`
Secret file:
- Upload your K3s kubeconfig file
- On Linux K3s, this is usually `/etc/rancher/k3s/k3s.yaml`

## 4. Create The GitHub Repository
Create a GitHub repository and push this project to the `main` branch.

Example:

```bash
git init
git branch -M main
git add .
git commit -m "Initial CI/CD major project"
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

Replace:
- `YOUR_GITHUB_USERNAME`
- `YOUR_REPO_NAME`

## 5. Create The Jenkins Pipeline Job
In Jenkins:
- New Item
- Choose `Pipeline`
- Under Pipeline Definition choose `Pipeline script from SCM`
- SCM: `Git`
- Branch Specifier: `*/main`
- Script Path: `Jenkinsfile`

Use your GitHub repository URL.

## 6. Configure GitHub Trigger
You can use either:
- GitHub webhook
- Poll SCM in Jenkins

For a college demo, Poll SCM is simpler if webhook exposure is difficult.

Suggested Poll SCM schedule:

```text
H/2 * * * *
```

That checks every 2 minutes.

## 7. Verify K3s Access
Before running the pipeline, verify Kubernetes access:

```bash
kubectl get nodes
kubectl get pods -A
```

If your K3s cluster is on EC2 and Jenkins is local, make sure the kubeconfig points to the reachable public or private server address, not just `127.0.0.1`.

## 8. First Manual Deployment Test
Before Jenkins, verify the app deploys manually:

```bash
npm test
docker build -t ravipratapsingh14/cicd-demo-app:latest .
docker push ravipratapsingh14/cicd-demo-app:latest
kubectl apply -f k8s/namespace.yaml
./scripts/render-k8s.sh ravipratapsingh14/cicd-demo-app latest | kubectl apply -f -
kubectl apply -f k8s/service.yaml
kubectl get all -n devops-demo
```

## 9. Pipeline Flow In Your Demo
1. Edit the homepage title or version.
2. Commit and push to GitHub `main`.
3. Jenkins detects the change.
4. Jenkins runs tests.
5. Jenkins builds `ravipratapsingh14/cicd-demo-app:<build-number>`.
6. Jenkins pushes the image to Docker Hub.
7. Jenkins updates the K3s deployment.
8. Open the app using the service external IP or node port mapping.

## 10. If You Deploy On AWS EC2 With K3s
Recommended demo design:
- Ubuntu EC2 instance
- K3s installed on the EC2 instance
- Security group allows:
  - `22` for SSH
  - `80` for app access
  - `8080` only if you want Jenkins reachable remotely

Useful commands on EC2:

```bash
curl -sfL https://get.k3s.io | sh -
sudo kubectl get nodes
sudo cat /etc/rancher/k3s/k3s.yaml
```

Update the kubeconfig server value if needed to the EC2 public IP before uploading it to Jenkins.

## 11. Viva-Friendly Explanation
- GitHub stores source code.
- Jenkins automates build, test, and deployment.
- Docker packages the app into a portable container.
- Docker Hub stores versioned images.
- K3s deploys and manages the running containers.
- The full pipeline reduces manual work and improves reliability.
