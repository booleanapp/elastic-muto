These classes are purely optional helpers for building `Where` expressions.
`muto.parse` can handle strings just fine.

There are two ways to use the classes for constructing queries:

```js
// Import the library
const muto = require('elastic-muto');

// Use `new` keyword for constructor instances of class
const cn = new muto.Condition('elasticsearch').eq('awesome');
const expr = new muto.Where(cn).and('["unicorn"] exists');

// Or use helper methods which construct the object without need for the `new` keyword
const cn = muto.cn('elasticsearch').eq('awesome'); // or muto.condition
const expr = muto.where(cn).and('["unicorn"] exists')

const qry = muto.parse(expr);
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
