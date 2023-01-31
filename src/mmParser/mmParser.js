// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const { lexer } = require('./lexer');
const e = require('./index').parserEvents;
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "database$ebnf$1", "symbols": []},
    {"name": "database$ebnf$1$subexpression$1", "symbols": ["outermost_scope_stmt"]},
    {"name": "database$ebnf$1", "symbols": ["database$ebnf$1", "database$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "database", "symbols": ["database$ebnf$1"], "postprocess": e.database},
    {"name": "outermost_scope_stmt", "symbols": ["include_stmt"]},
    {"name": "outermost_scope_stmt", "symbols": ["constant_stmt"]},
    {"name": "outermost_scope_stmt", "symbols": ["stmt"], "postprocess": d => d.flat()},
    {"name": "outermost_scope_stmt", "symbols": ["whitespace"]},
    {"name": "outermost_scope_stmt", "symbols": ["comment"]},
    {"name": "include_stmt", "symbols": [{"literal":"$["}, "filename", {"literal":"$]"}]},
    {"name": "constant_stmt$ebnf$1$subexpression$1", "symbols": ["constant", "_"]},
    {"name": "constant_stmt$ebnf$1", "symbols": ["constant_stmt$ebnf$1$subexpression$1"]},
    {"name": "constant_stmt$ebnf$1$subexpression$2", "symbols": ["constant", "_"]},
    {"name": "constant_stmt$ebnf$1", "symbols": ["constant_stmt$ebnf$1", "constant_stmt$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "constant_stmt", "symbols": [{"literal":"$c"}, "_", "constant_stmt$ebnf$1", {"literal":"$."}], "postprocess": e.constant_stmt},
    {"name": "stmt", "symbols": ["block"]},
    {"name": "stmt", "symbols": ["variable_stmt"]},
    {"name": "stmt", "symbols": ["disjoint_stmt"]},
    {"name": "stmt", "symbols": ["hypothesis_stmt"], "postprocess": d => d.flat()},
    {"name": "stmt", "symbols": ["assert_stmt"], "postprocess": d => d.flat()},
    {"name": "block$ebnf$1", "symbols": []},
    {"name": "block$ebnf$1$subexpression$1", "symbols": ["stmt", "_"]},
    {"name": "block$ebnf$1", "symbols": ["block$ebnf$1", "block$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "block", "symbols": [{"literal":"${"}, "_", "block$ebnf$1", {"literal":"$}"}], "postprocess": e.block},
    {"name": "variable_stmt$ebnf$1$subexpression$1", "symbols": ["_", "variable"]},
    {"name": "variable_stmt$ebnf$1", "symbols": ["variable_stmt$ebnf$1$subexpression$1"]},
    {"name": "variable_stmt$ebnf$1$subexpression$2", "symbols": ["_", "variable"]},
    {"name": "variable_stmt$ebnf$1", "symbols": ["variable_stmt$ebnf$1", "variable_stmt$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "variable_stmt", "symbols": [{"literal":"$v"}, "variable_stmt$ebnf$1", "_", {"literal":"$."}], "postprocess": e.variable_stmt},
    {"name": "disjoint_stmt$ebnf$1", "symbols": []},
    {"name": "disjoint_stmt$ebnf$1$subexpression$1", "symbols": ["variable", "_"]},
    {"name": "disjoint_stmt$ebnf$1", "symbols": ["disjoint_stmt$ebnf$1", "disjoint_stmt$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "disjoint_stmt", "symbols": [{"literal":"$d"}, "_", "variable", "_", "variable", "_", "disjoint_stmt$ebnf$1", {"literal":"$."}]},
    {"name": "hypothesis_stmt", "symbols": ["floating_stmt"]},
    {"name": "hypothesis_stmt", "symbols": ["essential_stmt"]},
    {"name": "floating_stmt", "symbols": [(lexer.has("LABEL") ? {type: "LABEL"} : LABEL), "_", {"literal":"$f"}, "_", "typecode", "_", "variable", "_", {"literal":"$."}], "postprocess": e.floating_stmt},
    {"name": "essential_stmt$ebnf$1", "symbols": []},
    {"name": "essential_stmt$ebnf$1$subexpression$1", "symbols": [(lexer.has("MATH_SYMBOL") ? {type: "MATH_SYMBOL"} : MATH_SYMBOL), "_"]},
    {"name": "essential_stmt$ebnf$1", "symbols": ["essential_stmt$ebnf$1", "essential_stmt$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "essential_stmt", "symbols": [(lexer.has("LABEL") ? {type: "LABEL"} : LABEL), "_", {"literal":"$e"}, "_", "typecode", "_", "essential_stmt$ebnf$1", {"literal":"$."}], "postprocess": e.essential_stmt},
    {"name": "assert_stmt", "symbols": ["axiom_stmt"]},
    {"name": "assert_stmt", "symbols": ["provable_stmt"]},
    {"name": "axiom_stmt", "symbols": [(lexer.has("LABEL") ? {type: "LABEL"} : LABEL), "_", {"literal":"$a"}, "_", "typecode", "_", "assertion", {"literal":"$."}], "postprocess": e.axiom_stmt},
    {"name": "provable_stmt", "symbols": [(lexer.has("LABEL") ? {type: "LABEL"} : LABEL), "_", {"literal":"$p"}, "_", "typecode", "_", "assertion", {"literal":"$="}, "_", "proof", {"literal":"$."}], "postprocess": e.provable_stmt},
    {"name": "proof", "symbols": ["uncompressed_proof"]},
    {"name": "proof", "symbols": ["compressed_proof"]},
    {"name": "uncompressed_proof$ebnf$1$subexpression$1$subexpression$1", "symbols": [(lexer.has("LABEL") ? {type: "LABEL"} : LABEL)]},
    {"name": "uncompressed_proof$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":"?"}]},
    {"name": "uncompressed_proof$ebnf$1$subexpression$1", "symbols": ["uncompressed_proof$ebnf$1$subexpression$1$subexpression$1", "_"]},
    {"name": "uncompressed_proof$ebnf$1", "symbols": ["uncompressed_proof$ebnf$1$subexpression$1"]},
    {"name": "uncompressed_proof$ebnf$1$subexpression$2$subexpression$1", "symbols": [(lexer.has("LABEL") ? {type: "LABEL"} : LABEL)]},
    {"name": "uncompressed_proof$ebnf$1$subexpression$2$subexpression$1", "symbols": [{"literal":"?"}]},
    {"name": "uncompressed_proof$ebnf$1$subexpression$2", "symbols": ["uncompressed_proof$ebnf$1$subexpression$2$subexpression$1", "_"]},
    {"name": "uncompressed_proof$ebnf$1", "symbols": ["uncompressed_proof$ebnf$1", "uncompressed_proof$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "uncompressed_proof", "symbols": ["uncompressed_proof$ebnf$1"]},
    {"name": "compressed_proof$ebnf$1", "symbols": []},
    {"name": "compressed_proof$ebnf$1$subexpression$1", "symbols": [(lexer.has("LABEL") ? {type: "LABEL"} : LABEL), "_"]},
    {"name": "compressed_proof$ebnf$1", "symbols": ["compressed_proof$ebnf$1", "compressed_proof$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "compressed_proof$ebnf$2$subexpression$1", "symbols": [(lexer.has("COMPRESSED_PROOF_BLOCK") ? {type: "COMPRESSED_PROOF_BLOCK"} : COMPRESSED_PROOF_BLOCK), "_"]},
    {"name": "compressed_proof$ebnf$2", "symbols": ["compressed_proof$ebnf$2$subexpression$1"]},
    {"name": "compressed_proof$ebnf$2$subexpression$2", "symbols": [(lexer.has("COMPRESSED_PROOF_BLOCK") ? {type: "COMPRESSED_PROOF_BLOCK"} : COMPRESSED_PROOF_BLOCK), "_"]},
    {"name": "compressed_proof$ebnf$2", "symbols": ["compressed_proof$ebnf$2", "compressed_proof$ebnf$2$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "compressed_proof", "symbols": [{"literal":"("}, "_", "compressed_proof$ebnf$1", {"literal":")"}, "_", "compressed_proof$ebnf$2"]},
    {"name": "assertion$ebnf$1", "symbols": []},
    {"name": "assertion$ebnf$1$subexpression$1", "symbols": [(lexer.has("MATH_SYMBOL") ? {type: "MATH_SYMBOL"} : MATH_SYMBOL), "_"]},
    {"name": "assertion$ebnf$1", "symbols": ["assertion$ebnf$1", "assertion$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "assertion", "symbols": ["assertion$ebnf$1"], "postprocess": e.assertion},
    {"name": "typecode", "symbols": ["constant"]},
    {"name": "filename", "symbols": [(lexer.has("MATH_SYMBOL") ? {type: "MATH_SYMBOL"} : MATH_SYMBOL)]},
    {"name": "constant", "symbols": [(lexer.has("MATH_SYMBOL") ? {type: "MATH_SYMBOL"} : MATH_SYMBOL)]},
    {"name": "variable", "symbols": [(lexer.has("MATH_SYMBOL") ? {type: "MATH_SYMBOL"} : MATH_SYMBOL)]},
    {"name": "_", "symbols": ["whitespaceComment"], "postprocess": e._},
    {"name": "whitespaceComment$ebnf$1$subexpression$1", "symbols": ["comment", "_"]},
    {"name": "whitespaceComment$ebnf$1", "symbols": ["whitespaceComment$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "whitespaceComment$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "whitespaceComment", "symbols": ["whitespace", "whitespaceComment$ebnf$1"]},
    {"name": "whitespace", "symbols": [(lexer.has("WHITESPACE") ? {type: "WHITESPACE"} : WHITESPACE)], "postprocess": e.whitespace},
    {"name": "comment", "symbols": [(lexer.has("_COMMENT") ? {type: "_COMMENT"} : _COMMENT)], "postprocess": e.comment}
]
  , ParserStart: "database"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
