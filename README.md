## NOT YET PUBLISHED
This module will be published once this [pull request](https://github.com/davidtheclark/cosmiconfig/pull/67) is accepted.

<p align="center">
    <img src="assets/muto-logo.png" alt="elastic-muto"/>
</p>

# elastic-muto

[![Build Status](https://travis-ci.org/booleanapp/elastic-muto.svg?branch=master)](https://travis-ci.org/booleanapp/elastic-muto)
[![Coverage Status](https://coveralls.io/repos/github/booleanapp/elastic-muto/badge.svg?branch=master)](https://coveralls.io/github/booleanapp/elastic-muto?branch=master)

Easy expressive search queries for Elasticsearch with customisation!
Build complicated elasticsearch queries without having to use the DSL.
Expressions get compiled into native Elasticsearch queries,
offering the same performance as if it had been hand coded.

`elastic-muto` is built using [PEG.js](https://github.com/pegjs/pegjs).
If you are curious about how the parsing works, check [this](http://dundalek.com/GrammKit/#https://raw.githubusercontent.com/booleanapp/elastic-muto/master/src/muto.pegjs) out.
The parser was originally developed for parsing filter conditions for the [GET score API](https://www.booleanapp.com/docs/v1_score.html) of [Boolean](https://www.booleanapp.com/).

**Check out the [API reference documentation](https://muto.js.org/docs).**

_Note: The library includes TypeScript definitions for a superior development experience._

## Elasticsearch compatibility
`elastic-muto` can be used with elasticsearch v2.x and above.

## Install
```
npm install elastic-muto --save
```

## Usage
```js
// Import the library
const muto = require('elastic-muto');

// muto.parse returns an elastic-builder BoolQuery object
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

Classes have also been provided for building the `where` expressions. Use whatever floats your boat :wink:.
```js
const qry = muto.parse(
    muto.where(muto.cn('elasticsearch').eq('awesome'))
        .and(muto.cn('unicorn').exists())
);
```

`elastic-muto` uses [debug](https://github.com/visionmedia/debug) with the namespace `elastic-muto`.
To enable debug logs, refer [this](https://github.com/visionmedia/debug#wildcards).

## Where Conditions
Where conditions can either be single(ex: `'["key"] == value'`) or multiple.
Multiple conditions can be combined with `and`/`or`.

Supported data types:

|Data type|Values|Description|
|---------|------|-----------|
|String|`"unicorns"`, `"dancing monkeys"`|Strings are enclosed in double-quotes. Can contain space, special characters|
|Numbers|`3`, `-9.5`, `"2.5"`|Numbers can be integers or floating point. Double quotes are also okay|
|Date|`"2016-12-01"`, `"2011-10-10T14:48:00"`|Dates, enclosed within double quotes, must be in the [ISO-8601 format](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Date/parse#ECMAScript_5_ISO-8601_format_support)|
|Boolean|`true`, `false`, `"true"`|Boolean can be `true` or `false`. Double quotes are also okay|

Condition types:

|Condition type|Operator|Data types|Example|
|--------------|--------|----------|-------|
|Equals|`==`|String, Number, Date|`["elasticsearch"] == "awesome"`, `["answer"] == 42`, `["launch_date"] == "2017-06-01"`|
|Not Equals|`!=`|String, Number|`["joke_type"] != "knock-knock"`, `["downloads"] != 0`|
|Contains|`contains`|String|`["potion"] contains "fluxweed"`|
|Not Contains|`!contains`|String|`["anime"] !contains "fillers"`|
|Less than|`<`|Number, Date|`["num_idiots"] < 0`, `["birthday"] < "1990-12-01"`|
|Less than or equal to|`<=`|Number, Date|`["issues"] <= 0`, `["speed"] <= 299792458`|
|Greater than|`>`|Number, Date|`["contributos"] > 1`, `["fictional_date"] > "2049-01-01"`|
|Greater than or equal to|`>=`|Number, Date|`["pull_requests"] >= 1`, `["unfreeze_date"] >= "3000-01-01"`|
|Boolean|`is`|Boolean|`["prophecy"] is true`|
|Property Exists|`exists`|Any data type|`["unicorn"] exists`|
|Property Missing|`missing`|Any data type|`["clue"] missing`|

Both `and`, `or` cannot be used in the same level, because if you do, the desired query is not clear.
```js
it('throws error if both and, or are called', () => {
    expect(
        () => muto.where()
            .and(muto.cn('anime').notContains('fillers'))
            .or(muto.cn('elasticsearch').eq('awesome'))
    ).toThrowError('Illegal operation! Join types cannot be mixed!');
});
```
Expressions can be nested using paranthesis. This allows to use both `and`, `or`:
```js
const qry = muto.parse(
    '["elasticsearch"] == "awesome" and ["language"] == "node.js"' +
        'and (["library"] == "elastic-muto" or ["library"] == "elastic-builder")'
)
```

## Elasticsearch Mapping
`elastic-muto` makes some assumptions for the mapping of data types. Following are the recommended mappings:

  * String mapping:
    ```json
    {
    "type": "text",
      "fields": {
          "keyword": {
          "type": "keyword",
          "ignore_above": 256
        }
      }
    }
    ```
    This is the default since [elasticsearch v5.x](https://www.elastic.co/guide/en/elasticsearch/reference/current/breaking_50_mapping_changes.html#_default_string_mappings)

  * Date mapping
    ```json
    {
      "type": "date",
      "format": "strict_date_time_no_millis||strict_date_optional_time||epoch_millis"
    }
    ```

  * Number mapping
    ```json
    { "type" : "double" }
    ```

  * Boolean mapping
    ```json
    { "type": "boolean" }
    ```

If your mapping doesn't match, you might need to tweak the elasticsearch query generated with customisation.

## Customisation
Elasticsearch queries generated by `elastic-muto` can be customised.
Read more [here](docs/custom-conf.md). Check out a contrived example [here](examples/custom-config).

## REPL
Try it out on the command line using the node REPL:

```
# Start the repl
node ./node_modules/elastic-muto/repl.js
# Use the library loaded in context as `muto`
elastic-muto > muto.prettyPrint('["elasticsearch"] == "awesome" and ["unicorn"] exists')
```

## API Reference
API reference can be accessed here - http://muto.js.org/docs.

API documentation was generated using [documentation.js](https://github.com/documentationjs/documentation).
It is being hosted with help from this awesome project - https://github.com/js-org/dns.js.org

## Tests
Run unit tests:
```
npm test
```
The parser is tested extensively with upto 5 levels of nested queries!

## Related
  - [elastic-builder](/sudo-suhas/elastic-builder) - An elasticsearch query body builder for node.js
  - [FiltrES.js](/abehaskins/FiltrES.js) - A simple, safe, ElasticSearch Query compiler

## License
MIT
