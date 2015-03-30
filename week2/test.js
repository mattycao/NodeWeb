/**
 * Created by caoyangkaka on 3/29/15.
 */
var querystring = require('querystring');

console.log(querystring.stringify({foo: 'bar', baz: 'qux'}, ';', ':'));
console.log(querystring.parse('foo:bar;baz:qux', ';', ':'));