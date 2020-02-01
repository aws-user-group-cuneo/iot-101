#!/usr/bin/env node

/**
 * Load .env file
 */
require('dotenv').config()

/**
 * Load CLI commands
 */
require('yargs')
  .commandDir('commands')
  .demandCommand()
  .help()
  .options({
    key: {
      default: process.env.KEY_PATH,
      description: 'Private key path',
      required: true,
      type: 'string'
    },
    cert: {
      default: process.env.CERT_PATH,
      description: 'Certificate path',
      required: true,
      type: 'string',
    },
    ca: {
      default: process.env.CA_PATH,
      description: 'Root CA certificate',
      required: true,
      type: 'string',
    },
    client: {
      default: process.env.CLIENT_ID,
      description: 'Client identifier',
      required: false,
      type: 'string',
    },
    host: {
      default: process.env.HOST,
      description: 'IoT host',
      required: true,
      type: 'string',
    }
  })
  .argv
