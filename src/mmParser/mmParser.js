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
    {"name": "outermost_scope_stmt", "symbols": [(lexer.has("WHITESPACE") ? {type: "WHITESPACE"} : WHITESPACE)]},
    {"name": "outermost_scope_stmt", "symbols": [(lexer.has("_COMMENT") ? {type: "_COMMENT"} : _COMMENT)]},
    {"name": "include_stmt", "symbols": [{"literal":"$["}, "filename", {"literal":"$]"}]},
    {"name": "constant_stmt$ebnf$1$subexpression$1", "symbols": ["constant"]},
    {"name": "constant_stmt$ebnf$1$subexpression$1", "symbols": [(lexer.has("WHITESPACE") ? {type: "WHITESPACE"} : WHITESPACE)]},
    {"name": "constant_stmt$ebnf$1$subexpression$1", "symbols": [(lexer.has("_COMMENT") ? {type: "_COMMENT"} : _COMMENT)]},
    {"name": "constant_stmt$ebnf$1", "symbols": ["constant_stmt$ebnf$1$subexpression$1"]},
    {"name": "constant_stmt$ebnf$1$subexpression$2", "symbols": ["constant"]},
    {"name": "constant_stmt$ebnf$1$subexpression$2", "symbols": [(lexer.has("WHITESPACE") ? {type: "WHITESPACE"} : WHITESPACE)]},
    {"name": "constant_stmt$ebnf$1$subexpression$2", "symbols": [(lexer.has("_COMMENT") ? {type: "_COMMENT"} : _COMMENT)]},
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
    {"name": "block", "symbols": [{"literal":"${"}, "block$ebnf$1", {"literal":"$}"}]},
    {"name": "variable_stmt$ebnf$1$subexpression$1", "symbols": ["variable"]},
    {"name": "variable_stmt$ebnf$1$subexpression$1", "symbols": [(lexer.has("WHITESPACE") ? {type: "WHITESPACE"} : WHITESPACE)]},
    {"name": "variable_stmt$ebnf$1$subexpression$1", "symbols": [(lexer.has("_COMMENT") ? {type: "_COMMENT"} : _COMMENT)]},
    {"name": "variable_stmt$ebnf$1", "symbols": ["variable_stmt$ebnf$1$subexpression$1"]},
    {"name": "variable_stmt$ebnf$1$subexpression$2", "symbols": ["variable"]},
    {"name": "variable_stmt$ebnf$1$subexpression$2", "symbols": [(lexer.has("WHITESPACE") ? {type: "WHITESPACE"} : WHITESPACE)]},
    {"name": "variable_stmt$ebnf$1$subexpression$2", "symbols": [(lexer.has("_COMMENT") ? {type: "_COMMENT"} : _COMMENT)]},
    {"name": "variable_stmt$ebnf$1", "symbols": ["variable_stmt$ebnf$1", "variable_stmt$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "variable_stmt", "symbols": [{"literal":"$v"}, "variable_stmt$ebnf$1", {"literal":"$."}]},
    {"name": "disjoint_stmt$ebnf$1", "symbols": []},
    {"name": "disjoint_stmt$ebnf$1$subexpression$1", "symbols": ["variable"]},
    {"name": "disjoint_stmt$ebnf$1", "symbols": ["disjoint_stmt$ebnf$1", "disjoint_stmt$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "disjoint_stmt", "symbols": [{"literal":"$d"}, "variable", "variable", "disjoint_stmt$ebnf$1", {"literal":"$."}]},
    {"name": "hypothesis_stmt", "symbols": ["floating_stmt"]},
    {"name": "hypothesis_stmt", "symbols": ["essential_stmt"]},
    {"name": "floating_stmt", "symbols": ["LABEL", {"literal":"$f"}, "typecode", "variable", {"literal":"$."}]},
    {"name": "essential_stmt$ebnf$1", "symbols": []},
    {"name": "essential_stmt$ebnf$1$subexpression$1", "symbols": ["MATH_SYMBOL"]},
    {"name": "essential_stmt$ebnf$1$subexpression$1", "symbols": [(lexer.has("WHITESPACE") ? {type: "WHITESPACE"} : WHITESPACE)]},
    {"name": "essential_stmt$ebnf$1$subexpression$1", "symbols": [(lexer.has("_COMMENT") ? {type: "_COMMENT"} : _COMMENT)]},
    {"name": "essential_stmt$ebnf$1", "symbols": ["essential_stmt$ebnf$1", "essential_stmt$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "essential_stmt", "symbols": ["LABEL", {"literal":"$e"}, "typecode", "essential_stmt$ebnf$1", {"literal":"$."}]},
    {"name": "assert_stmt", "symbols": ["axiom_stmt"]},
    {"name": "assert_stmt", "symbols": ["provable_stmt"]},
    {"name": "axiom_stmt$ebnf$1", "symbols": []},
    {"name": "axiom_stmt$ebnf$1$subexpression$1", "symbols": ["MATH_SYMBOL"]},
    {"name": "axiom_stmt$ebnf$1$subexpression$1", "symbols": [(lexer.has("WHITESPACE") ? {type: "WHITESPACE"} : WHITESPACE)]},
    {"name": "axiom_stmt$ebnf$1$subexpression$1", "symbols": [(lexer.has("_COMMENT") ? {type: "_COMMENT"} : _COMMENT)]},
    {"name": "axiom_stmt$ebnf$1", "symbols": ["axiom_stmt$ebnf$1", "axiom_stmt$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "axiom_stmt", "symbols": ["LABEL", {"literal":"$a"}, "typecode", "axiom_stmt$ebnf$1", {"literal":"$."}]},
    {"name": "provable_stmt$ebnf$1", "symbols": []},
    {"name": "provable_stmt$ebnf$1$subexpression$1", "symbols": ["MATH_SYMBOL"]},
    {"name": "provable_stmt$ebnf$1$subexpression$1", "symbols": [(lexer.has("WHITESPACE") ? {type: "WHITESPACE"} : WHITESPACE)]},
    {"name": "provable_stmt$ebnf$1$subexpression$1", "symbols": [(lexer.has("_COMMENT") ? {type: "_COMMENT"} : _COMMENT)]},
    {"name": "provable_stmt$ebnf$1", "symbols": ["provable_stmt$ebnf$1", "provable_stmt$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "provable_stmt", "symbols": ["LABEL", {"literal":"$p"}, "typecode", "provable_stmt$ebnf$1", {"literal":"$="}, "proof", {"literal":"$."}]},
    {"name": "proof", "symbols": ["uncompressed_proof"]},
    {"name": "proof", "symbols": ["compressed_proof"]},
    {"name": "uncompressed_proof$ebnf$1$subexpression$1", "symbols": ["LABEL"]},
    {"name": "uncompressed_proof$ebnf$1$subexpression$1", "symbols": [{"literal":"?"}]},
    {"name": "uncompressed_proof$ebnf$1$subexpression$1", "symbols": [(lexer.has("WHITESPACE") ? {type: "WHITESPACE"} : WHITESPACE)]},
    {"name": "uncompressed_proof$ebnf$1$subexpression$1", "symbols": [(lexer.has("_COMMENT") ? {type: "_COMMENT"} : _COMMENT)]},
    {"name": "uncompressed_proof$ebnf$1", "symbols": ["uncompressed_proof$ebnf$1$subexpression$1"]},
    {"name": "uncompressed_proof$ebnf$1$subexpression$2", "symbols": ["LABEL"]},
    {"name": "uncompressed_proof$ebnf$1$subexpression$2", "symbols": [{"literal":"?"}]},
    {"name": "uncompressed_proof$ebnf$1$subexpression$2", "symbols": [(lexer.has("WHITESPACE") ? {type: "WHITESPACE"} : WHITESPACE)]},
    {"name": "uncompressed_proof$ebnf$1$subexpression$2", "symbols": [(lexer.has("_COMMENT") ? {type: "_COMMENT"} : _COMMENT)]},
    {"name": "uncompressed_proof$ebnf$1", "symbols": ["uncompressed_proof$ebnf$1", "uncompressed_proof$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "uncompressed_proof", "symbols": ["uncompressed_proof$ebnf$1"]},
    {"name": "compressed_proof$ebnf$1", "symbols": []},
    {"name": "compressed_proof$ebnf$1$subexpression$1", "symbols": ["LABEL"]},
    {"name": "compressed_proof$ebnf$1", "symbols": ["compressed_proof$ebnf$1", "compressed_proof$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "compressed_proof$ebnf$2$subexpression$1", "symbols": ["COMPRESSED_PROOF_BLOCK"]},
    {"name": "compressed_proof$ebnf$2", "symbols": ["compressed_proof$ebnf$2$subexpression$1"]},
    {"name": "compressed_proof$ebnf$2$subexpression$2", "symbols": ["COMPRESSED_PROOF_BLOCK"]},
    {"name": "compressed_proof$ebnf$2", "symbols": ["compressed_proof$ebnf$2", "compressed_proof$ebnf$2$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "compressed_proof", "symbols": [{"literal":"("}, "compressed_proof$ebnf$1", {"literal":")"}, "compressed_proof$ebnf$2"]},
    {"name": "typecode$ebnf$1", "symbols": []},
    {"name": "typecode$ebnf$1$subexpression$1", "symbols": [(lexer.has("WHITESPACE") ? {type: "WHITESPACE"} : WHITESPACE)]},
    {"name": "typecode$ebnf$1$subexpression$1", "symbols": [(lexer.has("COMMENT") ? {type: "COMMENT"} : COMMENT)]},
    {"name": "typecode$ebnf$1", "symbols": ["typecode$ebnf$1", "typecode$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "typecode", "symbols": ["typecode$ebnf$1", "constant"]},
    {"name": "filename", "symbols": ["MATH_SYMBOL"]},
    {"name": "constant", "symbols": ["MATH_SYMBOL"]},
    {"name": "variable", "symbols": ["MATH_SYMBOL"]},
    {"name": "COMPRESSED_PROOF_BLOCK", "symbols": [(lexer.has("TEXT1") ? {type: "TEXT1"} : TEXT1)]},
    {"name": "COMPRESSED_PROOF_BLOCK", "symbols": [(lexer.has("TEXT2") ? {type: "TEXT2"} : TEXT2)]},
    {"name": "COMPRESSED_PROOF_BLOCK", "symbols": [(lexer.has("TEXT3") ? {type: "TEXT3"} : TEXT3)]},
    {"name": "LABEL$subexpression$1", "symbols": [(lexer.has("TEXT1") ? {type: "TEXT1"} : TEXT1)]},
    {"name": "LABEL$subexpression$1", "symbols": [(lexer.has("TEXT2") ? {type: "TEXT2"} : TEXT2)]},
    {"name": "LABEL$subexpression$1", "symbols": [(lexer.has("TEXT3") ? {type: "TEXT3"} : TEXT3)]},
    {"name": "LABEL$ebnf$1", "symbols": []},
    {"name": "LABEL$ebnf$1$subexpression$1", "symbols": [(lexer.has("WHITESPACE") ? {type: "WHITESPACE"} : WHITESPACE)]},
    {"name": "LABEL$ebnf$1$subexpression$1", "symbols": [(lexer.has("COMMENT") ? {type: "COMMENT"} : COMMENT)]},
    {"name": "LABEL$ebnf$1", "symbols": ["LABEL$ebnf$1", "LABEL$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "LABEL", "symbols": ["LABEL$subexpression$1", "LABEL$ebnf$1"]},
    {"name": "MATH_SYMBOL$ebnf$1", "symbols": []},
    {"name": "MATH_SYMBOL$ebnf$1$subexpression$1", "symbols": [(lexer.has("WHITESPACE") ? {type: "WHITESPACE"} : WHITESPACE)]},
    {"name": "MATH_SYMBOL$ebnf$1$subexpression$1", "symbols": [(lexer.has("COMMENT") ? {type: "COMMENT"} : COMMENT)]},
    {"name": "MATH_SYMBOL$ebnf$1", "symbols": ["MATH_SYMBOL$ebnf$1", "MATH_SYMBOL$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "MATH_SYMBOL$subexpression$1", "symbols": [(lexer.has("TEXT1") ? {type: "TEXT1"} : TEXT1)]},
    {"name": "MATH_SYMBOL$subexpression$1", "symbols": [(lexer.has("TEXT2") ? {type: "TEXT2"} : TEXT2)]},
    {"name": "MATH_SYMBOL$subexpression$1", "symbols": [(lexer.has("TEXT3") ? {type: "TEXT3"} : TEXT3)]},
    {"name": "MATH_SYMBOL$ebnf$2", "symbols": []},
    {"name": "MATH_SYMBOL$ebnf$2$subexpression$1", "symbols": [(lexer.has("WHITESPACE") ? {type: "WHITESPACE"} : WHITESPACE)]},
    {"name": "MATH_SYMBOL$ebnf$2$subexpression$1", "symbols": [(lexer.has("COMMENT") ? {type: "COMMENT"} : COMMENT)]},
    {"name": "MATH_SYMBOL$ebnf$2", "symbols": ["MATH_SYMBOL$ebnf$2", "MATH_SYMBOL$ebnf$2$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "MATH_SYMBOL", "symbols": ["MATH_SYMBOL$ebnf$1", "MATH_SYMBOL$subexpression$1", "MATH_SYMBOL$ebnf$2"]}
]
  , ParserStart: "database"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
