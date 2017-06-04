https://github.com/booleanapp/elastic-muto

`elastic-muto` is a library for easliy building elasticsearch queries with simple expressive expressions.
It also allows full control over query generation if you want different behavior.

The complete library documentation is present here.


```js
// Import the library
const muto = require('elastic-muto');

const qry = muto.parse('["elasticsearch"] == "awesome" and ["unicorn"] exists');
qry.toJSON();
{
  "bool": {
    "must": [
      {
        "term": { "elasticsearch.keyword": "awesome" }
      },
      {
        "exists": { "field": "unicorn" }
      }
    ]
  }
}
```

**Demo** - https://muto.js.org/

The parser was originally developed for parsing filter conditions for the [GET score endpoint](https://www.booleanapp.com/docs/v1_score.html) of [Boolean](https://www.booleanapp.com/).
