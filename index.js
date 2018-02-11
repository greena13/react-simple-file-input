'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/react-simple-file-input.production.min.js');
} else {
  module.exports = require('./cjs/react-simple-file-input.development.js');
}
