#!/usr/bin/env node

var args = require('minimist')(process.argv.slice(2))
var concat = require('simple-concat')
var insert = require('./')
var fs = require('fs')

var file = args._[0]
if (!file) {
  console.error(fs.readFileSync(require.resolve('./usage.txt'), 'utf8'))
  process.exit(1)
}

var inPlace = args.i || false
var source = fs.createReadStream(file)
concat(process.stdin, function (err, content) {
  if (err) throw err

  var stream = insert({
    content: content.toString('utf8'),
    header: args.header,
    region: args.region
  })

  source.pipe(stream)
  if (inPlace) {
    concat(stream, function (err, result) {
      if (err) throw err
      fs.writeFile(file, result, function (err) {
        if (err) throw err
      })
    })
  } else {
    stream.pipe(process.stdout)
  }
})
