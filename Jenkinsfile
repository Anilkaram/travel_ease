pipeline {
    agent any 
    environment {
        scannerHome = tool 'sonar-install'
        DOCKER_IMAGE_CLIENT = 'anildoc143/travel_ease_website_try'
        DOCKERTAG_CLIENT = 'client'
        DOCKER_IMAGE_SERVER = 'anildoc143/travel_ease_website_try'
        DOCKERTAG_SERVER = 'server'
        PATH_CLIENT = 'client'
        PATH_SERVER = 'server'
    }
    tools {
        nodejs 'nodejs'
    }
    stages {
        stage ('clean workspace') {
            steps {
                cleanWs()
            }
        }
        
        stage ('code checkout') {
            steps {
                echo 'Cloning the repository...'
                git branch: 'feature-v2', url: 'https://github.com/Anilkaram/travel_ease.git'
                echo 'Repository cloned successfully!'
            }
        } 
        stage ('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar-install') {
                    echo 'Running SonarQube analysis...'
                    sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=travel"
                    echo 'SonarQube analysis completed!'
                }
            }
        }
        
        stage ('quality gate'){
            steps {
                echo 'Waiting for SonarQube quality gate...'
                script {
                    def qg = waitForQualityGate abortPipeline: false, credentialsId: 'sonar-token'
                    if (qg.status != 'OK') {
                        error "Pipeline aborted due to SonarQube quality gate failure: ${qg.status}"
                    }
                }
                echo 'SonarQube quality gate passed!'
            }
        }
        stage ('trivy file scan') {
            steps {
                sh 'trivy fs --exit-code 1 --severity CRITICAL .'
            }
        }
        stage ('owasp dependency') {
            steps {
                dependencyCheck additionalArguments: '--scan ./ --disableYarnAudit --disableNodeAudit', odcInstallation: 'dependency-check'
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }
        stage ('build images') {
            steps {
                
                sh '''
                    echo 'Building Docker images client ...'
                    docker build -t $DOCKER_IMAGE_CLIENT:$DOCKERTAG_CLIENT $PATH_CLIENT
                '''
                sh '''
                    echo 'Building Docker image server...'
                    docker build -t $DOCKER_IMAGE_SERVER:$DOCKERTAG_SERVER $PATH_SERVER
                '''
            }
        }
        stage ('Trivy image scan') {
            steps {
                sh 'trivy image --exit-code 1 --severity CRITICAL $DOCKER_IMAGE_CLIENT:$DOCKERTAG_CLIENT || exit 1'
                sh 'trivy image --exit-code 1 --severity CRITICAL $DOCKER_IMAGE_SERVER:$DOCKERTAG_SERVER || exit 1'
            }
        }
        
        stage ('push to dockerhub') {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'dockerhub_cred') {
                        echo 'Pushing Docker images to Docker Hub...'
                        sh 'docker push $DOCKER_IMAGE_CLIENT:$DOCKERTAG_CLIENT'
                        sh 'docker push $DOCKER_IMAGE_SERVER:$DOCKERTAG_SERVER'
                        echo 'Docker images pushed to Docker Hub successfully!'
                    }
                }
            }
        }
        stage ('remove images') {
            steps {
                echo 'Removing Docker images...'
                sh "docker rmi $DOCKER_IMAGE_CLIENT:$DOCKERTAG_CLIENT || true"
                sh "docker rmi $DOCKER_IMAGE_SERVER:$DOCKERTAG_SERVER || true"
                echo 'Docker images removed successfully!'
            }
        }
    }
    post {
        always {
           mail to: 'anilkumarkarampuri3@gmail.com',
           subject: "Jenkins Build Notification: ${currentBuild.fullDisplayName}",
                 	body: """\
                 		Build Status: ${currentBuild.currentResult}
                 		Project: ${env.JOB_NAME}
                 		Build Number: ${env.BUILD_NUMBER}
                 		Build URL: ${env.BUILD_URL}
                 	"""
        }
    }
}

