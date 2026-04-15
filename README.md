# DevOps CI/CD Major Project

This repository contains a complete major-project implementation of an end-to-end CI/CD pipeline using GitHub, Jenkins, Docker, Kubernetes, AWS EC2, and Linux.

This version is customized for:
- Docker Hub image: `ravipratapsingh14/cicd-demo-app`
- Primary branch: `main`
- Jenkins running in Docker
- Kubernetes target: K3s

## What Is Included
- A lightweight Node.js web application
- Automated tests using the built-in Node.js test runner
- A production Dockerfile
- A Jenkins pipeline for build, test, image push, and Kubernetes deployment
- Kubernetes namespace, deployment, and service manifests
- A GitHub Actions workflow for extra CI validation
- A ready-to-submit project report in `docs/project-report.md`

## Project Structure
```text
.
├── .github/workflows/ci.yml
├── Dockerfile
├── Jenkinsfile
├── README.md
├── docs/project-report.md
├── k8s/
├── package.json
├── public/
├── scripts/
├── src/
└── test/
```

## Run Locally
### Prerequisites
- Node.js 20 or later

### Commands
```bash
npm install
npm test
npm start
```

Open [http://localhost:3000](http://localhost:3000)

## Build Docker Image
```bash
docker build -t ravipratapsingh14/cicd-demo-app:latest .
docker run -p 3000:3000 ravipratapsingh14/cicd-demo-app:latest
```

## Deploy To Kubernetes
Create the namespace first:

```bash
kubectl apply -f k8s/namespace.yaml
```

Replace the image placeholder and deploy:

```bash
sed -e "s|IMAGE_PLACEHOLDER|ravipratapsingh14/cicd-demo-app:latest|g" \
    -e "s|APP_VERSION_PLACEHOLDER|latest|g" \
    k8s/deployment.yaml | kubectl apply -f -
kubectl apply -f k8s/service.yaml
kubectl get svc -n devops-demo
```

Customized command:

```bash
./scripts/render-k8s.sh ravipratapsingh14/cicd-demo-app latest | kubectl apply -f -
```

## Jenkins In Docker
Build and run Jenkins with the required tools:

```bash
docker compose -f docker-compose.jenkins.yml up -d --build
```

This Jenkins container includes:
- Docker CLI
- Node.js 20
- Git
- `kubectl`

Detailed setup:
- [docs/local-jenkins-k3s-setup.md](/Users/ravipratapsingh/Documents/New%20project/docs/local-jenkins-k3s-setup.md)

## Jenkins Setup
### Required Jenkins plugins
- Docker Pipeline
- Kubernetes CLI
- Credentials Binding
- Git
- Pipeline

### Jenkins credentials
Create these credentials before running the pipeline:
- `docker-image-repo`: Secret text containing `ravipratapsingh14/cicd-demo-app`
- `dockerhub-creds`: Username/password for Docker Hub
- `kubeconfig-file`: Secret file containing the kubeconfig for your cluster

### Jenkins job flow
1. Connect the repository to a Pipeline job.
2. Point the job to `Jenkinsfile`.
3. Configure a GitHub webhook or polling.
4. Run the job and confirm the Kubernetes rollout succeeds.

## AWS EC2 Suggestion
Use one Ubuntu EC2 instance with K3s for the deployment target. Jenkins can stay on your local machine in Docker and deploy remotely using the uploaded kubeconfig.

## Suggested Viva / Demo Flow
1. Show the app locally.
2. Push a code change to GitHub.
3. Trigger Jenkins and show the pipeline stages.
4. Show the Docker image in the registry.
5. Show the K3s pods and service URL.
6. Open the live application.

## Next Improvements
- Add SonarQube
- Add Trivy image scanning
- Add Prometheus and Grafana
- Add Argo CD for GitOps
# CICD
# CICD
# CICD
# CICD
