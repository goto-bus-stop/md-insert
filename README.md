# md-insert

insert content under a markdown header or into a comment delimited region

[Install](#install) - [Usage](#usage) - [License: Apache-2.0](#license)

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![standard][standard-image]][standard-url]

[npm-image]: https://img.shields.io/npm/v/md-insert.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/md-insert
[travis-image]: https://img.shields.io/travis/goto-bus-stop/md-insert.svg?style=flat-square
[travis-url]: https://travis-ci.org/goto-bus-stop/md-insert
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/standard

## Install

```
npm install md-insert
```

## Usage

```bash
$ md-insert
usage: md-insert <file> [--header name] [--region name] [-i]

  --header name  Insert content under the header with this name.
  --region name  Insert content under the comment-delimited region with this
                 name.

  -i  Update <file> in place. If given, the result is written to <file>,
      instead of to standard output.

Examples:

  md-insert -i README.md --header API < generated-doc.md

  make-toc README.md | md-insert -i README.md --region toc

  document-prop-types src/index.js | md-insert TEMPLATE.md --header Props > README.md
```

### Regions

`--region` inserts content into a comment-delimited region like this:

```md
<!--toc start-->
<!--toc end-->
```

```bash
md-insert FILE.md -i --region toc < TOC.md
```

```md
<!--toc start-->
contents of TOC.md
<!--toc end-->
```

### Headers

`--header` inserts content below a header like this:

```md
## Props
```

```bash
document-prop-types src/index.js | md-insert README.md -i --header Props
```

## License

[Apache-2.0](LICENSE.md)
