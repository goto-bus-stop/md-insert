var test = require('tape')
var concat = require('simple-concat')
var mdinsert = require('.')

test('header', function (t) {
  var s = mdinsert({
    header: 'Cool Things',
    content: 'Interesting content'
  })
  concat(s, function (e, result) {
    t.ifError(e)
    t.equal(result + '', '# Title\n\n## Cool Things\nInteresting content\n\n# Uncool things\nUninteresting content\n')
    t.end()
  })

  s.end('# Title\n\n## Cool Things\nblah blah\n\n# Uncool things\nUninteresting content\n')
})

test('header with trailing newline', function (t) {
  var s = mdinsert({
    header: 'Cool Things',
    content: 'Interesting content\n'
  })
  concat(s, function (e, result) {
    t.ifError(e)
    t.equal(result + '', '# Title\n\n## Cool Things\nInteresting content\n\n# Uncool things\nUninteresting content\n')
    t.end()
  })

  s.end('# Title\n\n## Cool Things\nblah blah\n\n# Uncool things\nUninteresting content\n')
})

test('region', function (t) {
  var s = mdinsert({
    region: 'insert',
    content: 'Interesting content'
  })
  concat(s, function (e, result) {
    t.ifError(e)
    t.equal(result + '', '# Title\n\n## Cool Things\n<!--insert start-->\nInteresting content\n<!--insert end-->\n\n# Uncool things\nUninteresting content\n')
    t.end()
  })

  s.end('# Title\n\n## Cool Things\n<!--insert start-->\nblah blah\n<!--insert end-->\n\n# Uncool things\nUninteresting content\n')
})

test('region with trailing newline', function (t) {
  var s = mdinsert({
    region: 'insert',
    content: 'Interesting content\n'
  })
  concat(s, function (e, result) {
    t.ifError(e)
    t.equal(result + '', '# Title\n\n## Cool Things\n<!--insert start-->\nInteresting content\n\n<!--insert end-->\n\n# Uncool things\nUninteresting content\n')
    t.end()
  })

  s.end('# Title\n\n## Cool Things\n<!--insert start-->\nblah blah\n<!--insert end-->\n\n# Uncool things\nUninteresting content\n')
})
