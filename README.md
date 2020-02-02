# AWS User Group - Cuneo

## IoT 101

Simple IoT example project to show AWS IoT Core in action.

### Requirements

- [Node.js](https://nodejs.org/en/download/package-manager/) => 10.18.1
- [NPM](https://www.npmjs.com/) => 6.1.0
- [GIT](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

## Getting Start

### 1 - Clone this repository

```bash
git clone git@github.com:aws-user-group-cuneo/iot-101.git
```

### 2 - Install NPM dependencies

```bash
npm install
```

### 3 - Configure AWS CLI access

```bash
aws configure
```

Additional you can create a specific profile for this project:

```bash
aws configure --profile awsug-iot-101
```

### 4 - Configure IoT Thing

- Create a new IoT Thing from AWS Console
- Create a new certificate and download all files into `certs` directory (Amazon Root CA 1 is already present)
- Activate the new certificate
- Create a new policy and attach to certificate, use the following policy to be able to manage your things
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "iot:Publish",
      "iot:Subscribe",
      "iot:Connect",
      "iot:Receive"
    ],
    "Resource": [
      "*"
    ]
  }]
}
```

### 5 - Configure project

Copy `.env.example` to `.env`, setup certificates paths:
```
KEY_PATH=./certs/xxxxxxxxxxxx-private.pem.key
CERT_PATH=./certs/xxxxxxxxxxxx-certificate.pem.crt
CA_PATH=./certs/AmazonRootCA1.pem
```

Get your Custom IoT endpoint from AWS console (under 'Settings' -> 'Custom endpoint') or use the AWS CLI
```bash
aws --output text --profile awsug-iot-101 iot describe-endpoint
```
and this will print your IoT endpoint:
```
xxxxxxxxxx.iot.eu-west-1.amazonaws.com
```
set this value into `.env` file
```
HOST=xxxxxxxxxx.iot.eu-west-1.amazonaws.com
```

Optionally set a custom client identifier. Within your AWS account, the AWS IoT platform will only allow one connection per client ID. Many of the example programs run as two processes which communicate with one another. If you don't specify a client ID, the example programs will generate random client IDs
```
CLIENT_ID=my-client
```

## Usage

### Listen for topic's messages

This command listen for message sent to specific topic.
```bash
./cli.js listen my-test-topic-name
```

### Send message to topic

This command will send a message to a specific topic.
```bash
./cli.js send my-test-topic-name 'my custom payload'
```
```bash
./cli.js send my-test-topic-name '{"test": "structured data", "ok": true}'
```

### Synchronize Thing's shadow

This command will listen for shadow `delta` and update state with a `reported` that solve the difference. It also empty `desired` state to permit the calculation of the next deltas.
```bash
./cli.js sync MyThingName
```

### Process Thing's job

This command will process a Thing Job simulating a steps executions.
```bash
./cli.js job MyThingName customJob
```
