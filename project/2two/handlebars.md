## About handlebars view engine used in Node

### 1 How to setup in express?
> Notice, we here use the Express.js 4.

Be default, Express will require the engine based on the file extension. For example `jade`, Express incokes the following inernall, and caches the `require()` on subsequent calls to increase performance.

```javascript
app.engine('jade', require('jade').__express);
```
Use this method for engines that do not provide .__express out of box, if you wish to 'map' a different extension to the template engine. For example, ejs, we can do this:

```javascript
app.engine('html', require('ejs').renderFile);
```
So for handlebars, if we use the hbs package, then we can use either of these ways:

```javascript
app.set('view engine', 'hbs');

// must set the view engine to html, since express set the jade as default engine
app.set('view engine', 'html');
// here, we use the hbs package, there are still lots of other package to use, like handlebars, express-handlebars
app.engine('html', require('hbs').__express);
```
### 2 Handlebars Syntax
The handlebars is a template engine, which inherits from Mustache.

#### Variables
```
{{title}}
```
#### Iteration(each)
`each` is one of the built-in helpers, it allows you to iterate through objects and arrays. Inside the block, we use the `@key` for the former(objects), and the `@index` for the later(arrays). In addition, each item is referred to as `this`. When an item is an object itself, `this` can be omitted and just the property name is used to reference the value of that property.

```html
<div>
    {{#each languages}}
    <p>{{@index}}. {{this}}</p>
    {{/each}}
</div>
{language: ['a', 'b', 'c']}
```
#### Unescaped Output
By default, handlebars escapes values. If you don't want it to escape a value, use the triple cruly brace. `{{{value}}}`

#### Conditions(if)
if is another built-in helper invoked via #.

```html
{{#if user.admin}}
  <button class='lanch'>Lanch</button>
  {{else}}
  <button class='login'>Login</button>
  {{/if}}
```
#### Unless
Equal to if not. An another helper.

```html
{{#unless user.admin}}
{{else}}
{{/unless}}
```
#### With
In case there's an object with nested properties, use the `with` can solve this problem.

```html
{{#with user}}
  <p>{{name}}</p>
    {{#with contact}}
      <span>Twitter: @{{twitter}}</span>
    {{/with}}
{{/with}}
```
#### Comments
To output comments, just use the regular html `<!-- -->`. To hide comments in the final output, use `{{! }}` or `{{!-- --}}`.

#### Cusomer helper
Customer Handlebars helps are similar to built-in helper blocks and jade mixins. To use customer helpers, we need to create them as a javascript function and register them with the handlebars instance.

```javascript
Handlebars.registerHelper('table', function(data) {
    var str='<table>';
    for(var i = 0; i < data.length; i++) {
        str += '<tr>';
        for(var key in data[i]) {
            str += '<td>' + data[i][key] + '</td>';
        };
        str += '</tr>';
    };
    str += '</table>';
    return new Handlerbars.SafeString(str);
});
{
    node:[
        {name: 'express', url: 'http://expressjs.com/'},
        {name: 'hapi', url: 'http://spumko.github.io/'},
        {name: 'compound', url: 'http://compoundjs.com/'},
        {name: 'derby', url: 'http://derbyjs.com/'}
    ]
}

```
```{{table node}}```

#### Block
The context is changing. Like this:

```html
<ul>
    {{#each tours}}
        {{! I'm in a new block...and the context has changed }}
        <li>
            {{name}} - {{price}}
            {{#if ../currencies}}
                ({{../../currency.abbrev}})
            {{/if}}
        </li>
    {{/each}}
</ul>
{{#unless currencies}}
    <p>All prices in {{currency.name}}.</p>
{{/unless}}
{{#if specialsUrl}}
    {{! I'm in a new block...but the context hasn't changed (sortof) }}
    <p>Check out our <a href="{{specialsUrl}}">specials!</p>
{{else}}
    <p>Please check back often for specials.</p>
{{/if}}
<p>
    {{#each currencies}}
        <a href="#" class="currency">{{.}}</a>
    {{else}}
        Unfortunately, we currently only accept {{currency.name}}.
    {{/each}}
</p>

The data:
{
    currency: {
    name: 'United States dollars',
    abbrev: 'USD',
},
    tours: [
        { name: 'Hood River', price: '$99.95' },
        { name: 'Oregon Coast', price, '$159.95' },
    ],
    specialsUrl: '/january-specials',
    currencies: [ 'USD', 'GBP', 'BTC' ],
}
```
Notice here when inside the tours object, the context has changed to be the tours, so if you want to access the currency property, we need use `../currency`.

Each helper in handlebars will change  the context. For `if` block, it will create a new context which is a copy of the parent context. That is to say, in `if/else` block, the new context will be the same with it previous context( parent context). However, if there is a `if` in the `each`, we need use the `../../.` to access the currency in the example. So be careful, it is complicated, so we would better not use `if` in `each` block.

`{{.}}` refers to the current context.

#### Includes(Partials)
Includes or partials templates in Handlebars are interpreted by the `{{>partial_name}}` expression. Partials are akin to helpers and are registered with `Handlebars.registerPartial(name, source)`, where name is a string and source is a Handlebars template code for the partial.

```javascript
var hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials'); // access the partial files in the partials folder
```

### 3 StandAlone Handlebar Usage
[Pratical NodeJS Chapter4](https://github.com/azat-co/practicalnode/tree/master/ch4)
The handlebars-example.js and handlebars-example.html code.

### 4 Weired part of hbs used in express
* Using the partials

```javascript
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
var hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials');
```
```html
<div>
    <p>This is example</p>
    {{title}}
    {{> part1}} <!-- refer to the part1.html in partials folder -->
</div>
```
* Using the data

```javascript
router.get('/', function(req, res, next) {
    res.locals.title = 'express';
    res.render('index');
});
```
Unlike the ejs, we use the `title` to access it not the `locals.title`

```html
<div>
    <p>This is example</p>
    {{title}}
    {{> part1}} <!-- refer to the part1.html in partials folder -->
</div>
```
* Using the layout

If we pass nothing, and the views folder has a file called layout.html, then it will be taken as the layout.

```javascript
router.get('/', function(req, res, next) {
    res.locals.title = 'express';
    res.render('index'); // will use the layout.html as the layout
  //res.render('index', {layout: null}); // set the layout to null
});
```
* Using the layout and data at the same time

```javascript
router.get('/', function(req, res, next) {
    res.locals.title = 'express';
    res.render('index', {layout: 'main', title: 'express'}); // will use the layout.html as the layout
});
```
Here, we will use the main.html as the layout file, and pass the title data.