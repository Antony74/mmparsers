// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const { lexer } = require('./lexer');
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "database$ebnf$1", "symbols": []},
    {"name": "database$ebnf$1$subexpression$1", "symbols": ["outermost_scope_stmt"]},
    {"name": "database$ebnf$1", "symbols": ["database$ebnf$1", "database$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "database", "symbols": ["database$ebnf$1"]},
    {"name": "outermost_scope_stmt", "symbols": ["include_stmt"]},
    {"name": "outermost_scope_stmt", "symbols": ["constant_stmt"]},
    {"name": "outermost_scope_stmt", "symbols": ["stmt"]},
    {"name": "outermost_scope_stmt", "symbols": [(lexer.has("_COMMENT") ? {type: "_COMMENT"} : _COMMENT)]},
    {"name": "include_stmt", "symbols": [{"literal":"%$["}, "filename", {"literal":"%$]"}]},
    {"name": "constant_stmt$ebnf$1$subexpression$1", "symbols": [(lexer.has("constant") ? {type: "constant"} : constant)]},
    {"name": "constant_stmt$ebnf$1", "symbols": ["constant_stmt$ebnf$1$subexpression$1"]},
    {"name": "constant_stmt$ebnf$1$subexpression$2", "symbols": [(lexer.has("constant") ? {type: "constant"} : constant)]},
    {"name": "constant_stmt$ebnf$1", "symbols": ["constant_stmt$ebnf$1", "constant_stmt$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "constant_stmt", "symbols": [{"literal":"$c"}, "constant_stmt$ebnf$1", {"literal":"$."}]},
    {"name": "stmt", "symbols": ["block"]},
    {"name": "stmt", "symbols": ["variable_stmt"]},
    {"name": "stmt", "symbols": ["disjoint_stmt"]},
    {"name": "stmt", "symbols": ["hypothesis_stmt"]},
    {"name": "stmt", "symbols": ["assert_stmt"]},
    {"name": "block$ebnf$1", "symbols": []},
    {"name": "block$ebnf$1$subexpression$1", "symbols": ["stmt"]},
    {"name": "block$ebnf$1", "symbols": ["block$ebnf$1", "block$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "block", "symbols": [{"literal":"%${"}, "block$ebnf$1", {"literal":"%$}"}]},
    {"name": "filename", "symbols": [(lexer.has("MATH_SYMBOL") ? {type: "MATH_SYMBOL"} : MATH_SYMBOL)]},
    {"name": "constant", "symbols": [(lexer.has("MATH_SYMBOL") ? {type: "MATH_SYMBOL"} : MATH_SYMBOL)]}
]
  , ParserStart: "database"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
