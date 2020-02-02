const awsIot = require('aws-iot-device-sdk')

/**
 * Command description
 */
exports.command = 'job <thing>'
exports.desc = 'Process jobs'

/**
 * Command handler
 */
exports.handler = (argv) => {
  console.log('Connecting to device..')

  const jobs = awsIot.jobs({
    keyPath: argv.key,
    certPath: argv.cert,
    caPath: argv.ca,
    clientId: argv.client,
    host: argv.host
  })

  jobs.on('connect', () => {
    console.log('Device connected!')
  })

  jobs.subscribeToJobs(argv.thing, (err, job) => {
    if (err) {
      console.error(err)
      return
    }
    console.log('----------------------')
    console.log(`Job operation handler invoked, jobId: ${job.id}, document:`)
    console.log(JSON.stringify(job.document, null, 2))

    // Start job
    console.log('Starting job execution..')
    console.log('----------------------')

    // Set job in progress state
    job.inProgress({ operation: job.operation, step: 'starting..' }, err => {if (err) console.error(err)})

    // Check if is an "error job"
    if (job.operation=== 'error') {
      job.failed({ operation: job.operation, errorCondition: 'Job fail with error'}, err => {if (err) console.error(err)})
      console.error('Error happens during job execution')
      console.log('----------------------')
      console.log('Job failed!')
      return
    }

    // Simulate works
    const totalStep = job.document.steps || 5
    let currentStep = 1
    let timer = setInterval(() => {
      console.log(`Executing step ${currentStep} of ${totalStep}..`)

      // Set job in progress state with a custom message
      job.inProgress({ operation: job.operation, step: `step ${currentStep} of ${totalStep}` }, err => {if (err) console.error(err)})

      // Check current simulated step
      currentStep++
      if (currentStep > totalStep) {
        clearInterval(timer)

        // Complete job
        console.log('----------------------')
        console.log('Job completed!')
        job.succeeded({ operation: job.operation, step: 'all operations completed successfully!' }, err => {if (err) console.error(err)})
      }
    }, 1000)
    
  })

  jobs.startJobNotifications(argv.thing, function(err) {
    if (err) {
      console.error(err)
      console.log('Error starting listener, disconnecting..')
      jobs.end()
      return
    }
    console.log(`Start listening for thing ${argv.thing}'s jobs..`)
  })

  jobs.on('close', () => {
    console.log('Device disconnected')
    process.exit()
  })

  process.on('SIGINT', () => {
    console.log('----------------------')
    console.log('Disconnecting device..')
    jobs.end()
  })
}


