const awsIot = require('aws-iot-device-sdk')

/**
 * Command description
 */
exports.command = 'send <topic> <message>'
exports.desc = 'Send message to topic'

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
    console.log(`Sending message to topic '${argv.topic}'..`)
    device.publish(argv.topic, argv.message, (err) => {
      if (err) {
        console.error(err)
      } else {
        console.log('Message sent!')
      }
      console.log('----------------------')
      console.log('Disconnecting device..')
      device.end()
    })
  })

  device.on('close', () => {
    console.log('Device disconnected')
  })
}
