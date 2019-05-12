var bunyan = require('bunyan')
var path = require('path')

var log = bunyan.createLogger({
  name: 'bunyan-log',
  streams: [
    {
      level: 'debug',
      stream: process.stdout // log INFO and above to stdout
    },
    {
      level: 'error',
      path: path.join(__dirname, '/logs/appError.log') // log ERROR and above to a file
    }
  ]
})

module.exports = log
