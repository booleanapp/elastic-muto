/*
 * Core PEG
 */
ExprWrapper "Expression Wrapper"
    = expr:Expression {
        return expr instanceof BoolQuery
            ? expr
            : new BoolQuery().must(expr)
    }

Expression "Where Expression"
    = '(' head:Expression tail:(And expr:Expression { return expr; })+ ')' {
        var conditions = tail;
        conditions.unshift(head);
        return new BoolQuery().must(conditions);
    }
    / '(' head:Expression tail:(Or expr:Expression { return expr; })+ ')' {
        var conditions = tail;
        conditions.unshift(head);
        return new BoolQuery().should(conditions);
    }
    / '(' expr:Expression ')' { return expr; }
    / head:PropertyCondition
    torso:(And cond:PropertyCondition { return cond; })+
    tail:(And expr:Expression { return expr; })* {
        var conditions = torso.concat(tail);
        conditions.unshift(head);
        return new BoolQuery().must(conditions);
    }
    / head:PropertyCondition
    torso:(And cond:PropertyCondition { return cond; })*
    tail:(And expr:Expression { return expr; })+ {
        var conditions = torso.concat(tail);
        conditions.unshift(head);
        return new BoolQuery().must(conditions);
    }
    / head:PropertyCondition
    torso:(Or cond:PropertyCondition { return cond; })+
    tail:(Or expr:Expression { return expr; })* {
        var conditions = torso.concat(tail);
        conditions.unshift(head);
        return new BoolQuery().should(conditions);
    }
    / head:PropertyCondition
    torso:(Or cond:PropertyCondition { return cond; })*
    tail:(Or expr:Expression { return expr; })+ {
        var conditions = torso.concat(tail);
        conditions.unshift(head);
        return new BoolQuery().should(conditions);
    }
    / PropertyCondition

PropertyCondition "Property Condition"
    = _ '(' _ cond:PropertyCondition _ ')' _ { return cond; }
    / NumLtCondition
    / NumGtCondition
    / NumLteCondition
    / NumGteCondition
    / NumEqCondition
    / NumNeCondition
    / DateLtCondition
    / DateGtCondition
    / DateLteCondition
    / DateGteCondition
    / DateEqCondition
    / StrContainsCondition
    / StrNotContainsCondition
    / StrEqCondition
    / StrNeCondition
    / ExistsCondition
    / MissingCondition
    / BooleanCondition

/*
 * Numeric property conditions
 */

NumLteCondition "Number property less than or equal to condition"
    = key:PropertyKey LteOperator value:NumericValue
    { return options.numLte(key, value); }

NumGteCondition "Number property greater than or equal to condition"
    = key:PropertyKey GteOperator value:NumericValue
    { return options.numGte(key, value); }

NumLtCondition "Number property less than condition"
    = key:PropertyKey LtOperator value:NumericValue
    { return options.numLt(key, value); }

NumGtCondition "Number property greater than condition"
    = key:PropertyKey GtOperator value:NumericValue
    { return options.numGt(key, value); }

NumEqCondition "Number property equality condition"
    = key:PropertyKey EqOperator value:NumericValue
    { return options.numEq(key, value); }

NumNeCondition "Number property inequality condition"
    = key:PropertyKey NeOperator value:NumericValue
    { return options.numNe(key, value); }

/*
 * Date property condition
 */

DateLteCondition "Date property less than or equal to condition"
    = key:PropertyKey LteOperator value:DateValue
    { return options.dateLte(key, value); }

DateGteCondition "Date property greater than or equal to condition"
    = key:PropertyKey GteOperator value:DateValue
    { return options.dateGte(key, value); }

DateLtCondition "Date property less than condition"
    = key:PropertyKey LtOperator value:DateValue
    { return options.dateLt(key, value); }

DateGtCondition "Date property greater than condition"
    = key:PropertyKey GtOperator value:DateValue
    { return options.dateGt(key, value); }

DateEqCondition "Date property equality condition"
    = key:PropertyKey EqOperator value:DateValue
    { return options.dateEq(key, value); }

/*
 * String property conditions
 */
StrContainsCondition "String property contains condition"
    = key:PropertyKey ContainsOperator value:StringValue
    { return options.strContains(key, value); }

StrNotContainsCondition "String property does not contain condition"
    = key:PropertyKey NotContainsOperator value:StringValue
    { return options.strNotContains(key, value); }

StrEqCondition "String property equality condition"
    = key:PropertyKey EqOperator value:StringValue
    { return options.strEq(key, value, options.notAnalysedFields); }

StrNeCondition "String property inequality condition"
    = key:PropertyKey NeOperator value:StringValue
    { return options.strNe(key, value, options.notAnalysedFields); }

ExistsCondition "Property Exists"
    = key:PropertyKey ExistsOperator
    { return options.exists(key); }

MissingCondition "Property does not exist"
    = key:PropertyKey MissingOperator
    { return options.missing(key); }

/*
 * Boolean property condition
 */
BooleanCondition "Boolean condition"
    = key:PropertyKey BooleanOperator value:BooleanValue
    { return options.bool(key, value); }

/*
 * Property Keys, operators and property values
 */
PropertyKey "Property key"
    = begin_property chars:char+ end_property
    { return options.propertyKey(chars) }

EqOperator "Equal operator"
    = _ "==" _

NeOperator "Not equal operator"
    = _ "!=" _

LtOperator "Less than operator"
    = _ "<" _

GtOperator "Greater than operator"
    = _ ">" _

LteOperator "Less than or equal to operator"
    = _ "<=" _

GteOperator "Greater than or equal to operator"
    = _ ">=" _

ContainsOperator "Contains operator"
    = _ "contains"i _

NotContainsOperator "Contains operator"
    = _ "!contains"i _

ExistsOperator "Exists operator"
    = _ "exists"i _

MissingOperator "Missing operator"
    = _ "missing"i _

BooleanOperator "Boolean(is) operator"
    = _ "is"i _

NumericValue "Numeric Value"
    = quotation_mark val:NumericValue quotation_mark { return val; }
    / minus? int frac? exp? { return parseFloat(text()); }

DateValue "Date Value"
    = quotation_mark val:DateValue quotation_mark { return val; }
    / _ iso_date_time _ { return new Date(text().trim()); }

StringValue "String value"
    = quotation_mark chars:char* quotation_mark { return chars.join(""); }

BooleanValue "Boolean Value"
    = quotation_mark val:BooleanValue quotation_mark { return val; }
    / _ val:("true"/"false") _ { return val === 'true'; }

/*
 * Supporting identifiers
 */
Or "or condition"
    = _ "or"i _

And "and condition"
    = _ "and"i _

begin_property = _ '["'
end_property = '"]' _


/* ----- Numbers ----- */
decimal_point = "."
digit1_9      = [1-9]
e             = [eE]
exp           = e (minus / plus)? DIGIT+
frac          = decimal_point DIGIT+
int           = zero / (digit1_9 DIGIT*)
minus         = "-"
plus          = "+"
zero          = "0"

/* ----- Strings ----- */
char
    = unescaped
  / escape
    sequence:(
        '"'
      / "\\"
      / "/"
      / "b" { return "\b"; }
      / "f" { return "\f"; }
      / "n" { return "\n"; }
      / "r" { return "\r"; }
      / "t" { return "\t"; }
      / "u" digits:$(HEXDIG HEXDIG HEXDIG HEXDIG) {
          return String.fromCharCode(parseInt(digits, 16));
        }
    ) { return sequence; }

escape         = "\\"
quotation_mark = '"'
unescaped = [^\0-\x1F\x22\x5C]

DIGIT  = [0-9]
HEXDIG = [0-9a-f]i

/* Date */
iso_date_time
    = date ("T" time)?  { return text(); }

date_century
    // 00-99
    = $(DIGIT DIGIT) { return text(); }

date_decade
    // 0-9
    = DIGIT  { return text(); }

date_subdecade
    // 0-9
    = DIGIT  { return text(); }

date_year
    = date_decade date_subdecade  { return text(); }

date_fullyear
    = date_century date_year  { return text(); }

date_month
    // 01-12
    = $(DIGIT DIGIT)  { return text(); }

date_wday
    // 1-7
    // 1 is Monday, 7 is Sunday
    = DIGIT  { return text(); }

date_mday
    // 01-28, 01-29, 01-30, 01-31 based on
    // month/year
    = $(DIGIT DIGIT)  { return text(); }

date_yday
    // 001-365, 001-366 based on year
    = $(DIGIT DIGIT DIGIT)  { return text(); }

date_week
    // 01-52, 01-53 based on year
    = $(DIGIT DIGIT)  { return text(); }

datepart_fullyear
    = date_century? date_year "-"?  { return text(); }

datepart_ptyear
    = "-" (date_subdecade "-"?)?  { return text(); }

datepart_wkyear
    = datepart_ptyear
    / datepart_fullyear

dateopt_century
    = "-"
    / date_century

dateopt_fullyear
    = "-"
    / datepart_fullyear

dateopt_year
    = "-"
    / date_year "-"?

dateopt_month
    = "-"
    / date_month "-"?

dateopt_week
    = "-"
    / date_week "-"?

datespec_full
    = datepart_fullyear date_month "-"? date_mday  { return text(); }

datespec_year
    = date_century
    / dateopt_century date_year

datespec_month
    = "-" dateopt_year date_month ("-"? date_mday)  { return text(); }

datespec_mday
    = "--" dateopt_month date_mday  { return text(); }

datespec_week
    = datepart_wkyear "W" (date_week / dateopt_week date_wday)  { return text(); }

datespec_wday
    = "---" date_wday  { return text(); }

datespec_yday
    = dateopt_fullyear date_yday  { return text(); }

date
    = datespec_full
    / datespec_year
    / datespec_month
    / datespec_mday
    / datespec_week
    / datespec_wday
    / datespec_yday


/* Time */
time_hour
    // 00-24
    = $(DIGIT DIGIT)  { return text(); }

time_minute
    // 00-59
    = $(DIGIT DIGIT)  { return text(); }

time_second
    // 00-58, 00-59, 00-60 based on
    // leap-second rules
    = $(DIGIT DIGIT)  { return text(); }

time_fraction
    = ("," / ".") $(DIGIT+)  { return text(); }

time_numoffset
    = ("+" / "-") time_hour (":"? time_minute)?  { return text(); }

time_zone
    = "Z"
    / time_numoffset

timeopt_hour
    = "-"
    / time_hour ":"?

timeopt_minute
    = "-"
    / time_minute ":"?

timespec_hour
    = time_hour (":"? time_minute (":"? time_second)?)?  { return text(); }

timespec_minute
    = timeopt_hour time_minute (":"? time_second)?  { return text(); }

timespec_second
    = "-" timeopt_minute time_second  { return text(); }

timespec_base
    = timespec_hour
    / timespec_minute
    / timespec_second

time
    = timespec_base time_fraction? time_zone?  { return text(); }

_ "whitespace"
    = [ \t\n\r]*
