var Transform = require('stream').Transform
var inherits = require('util').inherits
var assert = require('assert')
var remark = require('remark')
var heading = require('mdast-util-heading-range')
var zone = require('mdast-zone')
var multisplice = require('multisplice')

module.exports = InsertStream

function InsertStream (opts) {
  if (!(this instanceof InsertStream)) return new InsertStream(opts)

  Transform.call(this)
  assert(typeof opts === 'object' && opts, 'md-insert: opts must be type Object')
  assert(typeof opts.header === 'string' || typeof opts.region === 'string', 'md-insert: opts.header or opts.region must be type String')
  assert(typeof opts.content === 'string', 'md-insert: opts.content must be type String')

  this.opts = opts
  this.buffer = ''
}

inherits(InsertStream, Transform)

InsertStream.prototype._transform = function (chunk, enc, next) {
  this.buffer += chunk.toString('utf8')
  next()
}

InsertStream.prototype._flush = function (done) {
  var stream = this
  var opts = stream.opts
  var tree = remark.parse(stream.buffer)

  if (opts.header) {
    heading(tree, opts.header, onrange)
  } else {
    zone(tree, opts.region, onrange)
  }

  function onrange (start, _, end) {
    var s = start.position.end.offset + 1 // +1 for the newline
    var e = end ? end.position.start.offset : undefined
    stream.push(multisplice(stream.buffer).splice(s, e, opts.content).toString())
    stream.push(null)
  }
}
