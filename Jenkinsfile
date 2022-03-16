pipeline {

    agent any
    tools {nodejs "node"}

    environment {
        CI = 'true'
    }
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
              
            }
        }
        // stage('Test') {
        //     steps {
        //         sh 'npm run test'
        //     }
        // }
         stage('Deliver') {
            steps {
                sh 'npm start &'
                sh 'sleep 1'
                sh '$! > .pidfile'
                input message: 'Finished using the web site? (Click "Proceed" to continue)'
                sh 'kill $(cat ./.pidfile)'
            }
        }
    }
}