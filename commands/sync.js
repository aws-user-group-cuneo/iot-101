const awsIot = require('aws-iot-device-sdk')

/**
 * Command description
 */
exports.command = 'sync <thing>'
exports.desc = 'Synchronize Thing\'s Shadow'

/**
 * Command handler
 */
exports.handler = (argv) => {
  console.log('Connecting to thing..')

  const thingShadow = awsIot.thingShadow({
    keyPath: argv.key,
    certPath: argv.cert,
    caPath: argv.ca,
    clientId: argv.client,
    host: argv.host
  })

  thingShadow.on('connect', () => {
    console.log('Thing connected!')
    console.log('----------------------')
    console.log(`Registering to thing ${argv.thing}'s shadow..`)
    thingShadow.register(argv.thing, {}, () => {
      console.log('Registered to thing shadow!')
      console.log('----------------------')
      console.log('Asking for current thing shadow..')
      thingShadow.get(argv.thing)
    })
  })

  thingShadow.on('status', (thingName, stat, clientToken, stateObject) => {
    console.log('----------------------')
    console.log(`Received '${stat}' on ${thingName}`)
    console.log(JSON.stringify(stateObject.state, null, 2))
    if (stat === 'accepted' && stateObject.state.delta !== undefined) {
      console.log('----------------------')
      console.log('Found delta value to synchronize..')
      console.log(JSON.stringify(stateObject.state.delta, null, 2))
      thingShadow.update(thingName, {
        state: {
          reported: stateObject.state.delta,
          desired: null
        }
      })
      console.log('Delta synchronized!')
    } else if (stat === 'accepted' && stateObject.state.desired !== undefined && stateObject.state.desired !== null) {
      console.log('----------------------')
      console.log('Found desired value to synchronize..')
      console.log(JSON.stringify(stateObject.state.desired, null, 2))
      thingShadow.update(thingName, {
        state: {
          reported: stateObject.state.desired,
          desired: null
        }
      })
      console.log('Desired synchronized!')
    }
  })

  thingShadow.on('delta', (thingName, stateObject) => {
    console.log('----------------------')
    console.log(`Received 'delta' on ${thingName} shadow!`)
    console.log(JSON.stringify(stateObject.state, null, 2))
    thingShadow.update(thingName, {
      state: {
        reported: stateObject.state,
        desired: null
      }
    })
  })

  thingShadow.on('timeout', (thingName, clientToken) => {
    console.log('----------------------')
    console.log(`Received 'timeout' on ${thingName} with token '${clientToken}'`)
  })

  thingShadow.on('close', () => {
    console.log('Thing shadow disconnected')
  })

  process.on('SIGINT', () => {
    console.log('----------------------')
    console.log('Disconnecting thing shadow..')
    thingShadow.end()
  })
}
