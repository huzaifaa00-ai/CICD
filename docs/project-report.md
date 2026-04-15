# CI/CD Pipeline Major Project Report

## Abstract
This project implements an end-to-end CI/CD pipeline for a sample web application using GitHub, Jenkins, Docker, K3s Kubernetes, AWS EC2, and Linux. The pipeline automates code checkout, testing, container image creation, registry publishing, and deployment to a Kubernetes cluster. The solution reduces manual effort, improves deployment reliability, and reflects an industry-style DevOps workflow.

## Introduction
DevOps combines software development and IT operations to deliver software faster and more reliably. Continuous Integration and Continuous Deployment are central DevOps practices that automate build, test, and release processes. This project demonstrates how a developer push can trigger a complete delivery workflow from source code to a live application.

## Objectives
- Automate application build and deployment
- Implement a CI/CD pipeline using Jenkins
- Containerize the application with Docker
- Deploy the application on Kubernetes
- Improve deployment speed, consistency, and reliability

## Tools And Technologies
- GitHub for source code management
- Jenkins for CI/CD automation
- Docker for containerization
- K3s Kubernetes for orchestration
- AWS EC2 for hosting Jenkins or cluster nodes
- Linux as the base operating environment
- Node.js for the demo application

## System Architecture
1. A developer pushes code changes to GitHub.
2. Jenkins polls the repository or receives a webhook trigger.
3. Jenkins checks out the latest code and runs automated tests.
4. Jenkins builds a Docker image for the application.
5. The image is pushed to Docker Hub under the repository `ravipratapsingh14/cicd-demo-app`.
6. Jenkins updates the K3s deployment with the new image.
7. K3s rolls out the new version and exposes it through a service.

## Implementation Details
### Application Layer
The sample application is a lightweight Node.js web service with:
- A landing page for browser access
- A `/health` endpoint for readiness and liveness checks
- A `/api/info` endpoint to display deployment metadata

### CI/CD Layer
The Jenkins pipeline performs:
- Source checkout
- Node.js verification
- Automated test execution
- Docker image build
- Docker registry push
- Kubernetes deployment

### Kubernetes Layer
The deployment uses:
- A dedicated namespace
- Two application replicas
- Readiness and liveness probes
- A K3s-managed service for external access

## Results And Output
The pipeline is designed to automate deployment from source change to live release. After successful execution:
- The application becomes available through the Kubernetes service URL
- Deployment time is reduced compared to manual release steps
- Consistency is improved across environments

## Advantages
- Faster and repeatable deployments
- Lower risk of manual configuration errors
- Better team collaboration through automation
- Easier scaling with Kubernetes replicas and services

## Conclusion
This project demonstrates a practical DevOps workflow that aligns with real-world software delivery standards. By integrating GitHub, Jenkins running in Docker, Docker Hub, and K3s Kubernetes, the solution shows how modern CI/CD practices can improve software quality and operational efficiency.

## Future Enhancements
- Add code quality scanning and security scanning
- Integrate monitoring with Prometheus and Grafana
- Add centralized logging with EFK or Loki
- Move to GitOps with Argo CD or Flux
