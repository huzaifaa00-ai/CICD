pipeline {
  agent any

  environment {
    APP_NAME = 'cicd-demo-app'
    IMAGE_TAG = "${env.BUILD_NUMBER}"
    IMAGE_REPO = credentials('docker-image-repo')
    DOCKER_CREDENTIALS = 'dockerhub-creds'
    KUBECONFIG_CREDENTIALS = 'kubeconfig-file'
  }

  options {
    timestamps()
    ansiColor('xterm')
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Verify Node') {
      steps {
        sh 'node --version'
        sh 'npm --version'
      }
    }

    stage('Test') {
      steps {
        sh 'npm ci --ignore-scripts || npm install --ignore-scripts'
        sh 'npm run test:ci'
      }
    }

    stage('Build Docker Image') {
      steps {
        script {
          dockerImage = docker.build("${IMAGE_REPO}:${IMAGE_TAG}")
        }
      }
    }

    stage('Push Docker Image') {
      steps {
        script {
          docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS) {
            dockerImage.push()
            dockerImage.push('latest')
          }
        }
      }
    }

    stage('Deploy To Kubernetes') {
      steps {
        withCredentials([file(credentialsId: "${KUBECONFIG_CREDENTIALS}", variable: 'KUBECONFIG')]) {
          sh '''
            kubectl apply -f k8s/namespace.yaml
            sed -e "s|IMAGE_PLACEHOLDER|${IMAGE_REPO}:${IMAGE_TAG}|g" \
                -e "s|APP_VERSION_PLACEHOLDER|${IMAGE_TAG}|g" \
                k8s/deployment.yaml | kubectl apply -f -
            kubectl apply -f k8s/service.yaml
            kubectl rollout status deployment/cicd-demo-app -n devops-demo --timeout=120s
          '''
        }
      }
    }
  }

  post {
    always {
      junit testResults: '**/junit.xml', allowEmptyResults: true
    }
    success {
      echo 'Pipeline completed successfully.'
    }
    failure {
      echo 'Pipeline failed. Review stage logs above.'
    }
  }
}
