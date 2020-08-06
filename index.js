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
  var newContent = opts.content
  var tree = remark.parse(stream.buffer)

  if (opts.header) {
    heading(tree, opts.header, onrange)
  } else {
    zone(tree, opts.region, onrange)
  }

  function onrange (start, content, end) {
    var s = start.position.end.offset + 1 // +1 for the newline after the header or the <!--comment-->
    var lastParagraph = content[content.length - 1]
    var e = lastParagraph ? lastParagraph.position.end.offset : (end ? end.position.start.offset : undefined)

    // if we have a bunch of whitespace after the paragraph in the original text,
    // don't add another one even if the new content has a \n
    var trailingWhitespace = stream.buffer.slice(
      lastParagraph ? lastParagraph.position.end.offset : stream.buffer.length,
      end ? end.position.start.offset : undefined
    )
    if (trailingWhitespace.match(/\n/g).length >= 2) {
      newContent = newContent.replace(/\n$/, '')
    }

    stream.push(multisplice(stream.buffer).splice(s, e, newContent).toString())
    stream.push(null)
  }
}
