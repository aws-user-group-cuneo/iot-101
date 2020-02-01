const awsIot = require('aws-iot-device-sdk')

/**
 * Command description
 */
exports.command = 'listen <topic>'
exports.desc = 'Listen for topic\'s messages'

/**
 * Command handler
 */
exports.handler = (argv) => {
  console.log('Connecting to device..')

  const device = awsIot.device({
    keyPath: argv.key,
    certPath: argv.cert,
    caPath: argv.ca,
    clientId: argv.client,
    host: argv.host
  })

  device.on('connect', () => {
    console.log('Device connected!')
    console.log('----------------------')
    console.log(`Start listening on topic '${argv.topic}' for messages..`)
    device.subscribe(argv.topic)
  })

  device.on('message', (topic, payload) => {
    console.log('----------------------')
    console.log(`Message received from topic '${topic}':`)
    console.log(payload.toString())
  })

  device.on('close', () => {
    console.log('Device disconnected')
    process.exit()
  })

  process.on('SIGINT', () => {
    console.log('----------------------')
    console.log('Disconnecting device..')
    device.end()
  })
}


