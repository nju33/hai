# Hai

[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

[![Build Status](https://travis-ci.org/nju33/hai.svg?branch=master)](https://travis-ci.org/nju33/hai)

A small conversation library that happens at hand

<img src="https://github.com/nju33/hai/raw/master/screenshot.gif?raw=true" alt="Hai" width="300">

## Install, or Download

### npm

```sh
$ npm i -S @nju33/hai
```

### yarn

```sh
$ yarn add @nju33/hai
```

### bower

```sh
$ bower i -S hai
```

### Download

Access to [releases page](https://github.com/nju33/hai/releases).
Then, download the latest version.

## Usage

### Bandler

> (e.g.) webpack, browserify, rollup...

```js
// es
import Hai from 'hai';
// common
const Hai = require('hai');
```

### Browser

```html
<script src="/path/to/hai.js"></script>
<script>// Your JS code.</script>
```

## API

### `new Hai(talk)`

Create an instance of Hai that Contains information about talk elements or callbacks. It can be used by passing it to openWith.

(Below `hai` is an instance of `Hai`)

#### `hai.name`

Use for prefix of callback name.

#### `hai.message`

What I'd like to talk about here.

#### `hai.convenient`

##### `hai.convenient.type`

Various types. (e.g. `text`, `radio`, `checkbox`)  
Note that property values that you have to pass depend on type change

###### `type: text`

Please write the text you want displayed in the `text` property. This is used when you want to display longer text.

###### `type: radio` or `type: checkbox`

Please write the text you want displayed in the `items` property. Use this if you want to give the client choices.

This is the only difference.

- `radio`  
  Select only one.
- `checkbox`  
  Multiple selection.

TODO....

#### `hai.buttons`

It is mainly used for elements for callback firing.

TODO...

### `Hai.openWith(targetElement, talks, callbacks)`

TODO...

### `Hai.on`

TODO...

## TODO?

- [ ] Implement history (`back` `prev`)
- [ ] Refactoring (To eliminate waste)
- [ ] Add user customization options
- [ ] Writing tests
- [ ] More convenient type (e.g. `input`, `textarea`)
- [ ] More variation (use lerna)  
     For example, modal

## LICENSE

MIT
