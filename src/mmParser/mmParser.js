// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const { lexer } = require('./lexer');

const minToken = (t) => {
  const {type, text} = t;
  return {type, text};
};

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "database$ebnf$1", "symbols": []},
    {"name": "database$ebnf$1$subexpression$1", "symbols": ["outermost_scope_stmt"]},
    {"name": "database$ebnf$1", "symbols": ["database$ebnf$1", "database$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "database", "symbols": ["database$ebnf$1"], "postprocess": d => {return {type: 'database', children: d.flat(3)}}},
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
    {"name": "constant_stmt", "symbols": [{"literal":"$c"}, "_", "constant_stmt$ebnf$1", {"literal":"$."}], "postprocess":  d => {
          d = d.flat(Number.MAX_SAFE_INTEGER);
          return {
            type: 'constant_stmt',
            children: [
              minToken(d[0]),
              d[1],
              {
                type: 'constants',
                text: d.slice(2, -1).map(minToken)
              },
              minToken(d[d.length - 1])
           ]
          };
        } },
    {"name": "stmt", "symbols": ["block"]},
    {"name": "stmt", "symbols": ["variable_stmt"]},
    {"name": "stmt", "symbols": ["disjoint_stmt"]},
    {"name": "stmt", "symbols": ["hypothesis_stmt"], "postprocess": d => d.flat()},
    {"name": "stmt", "symbols": ["assert_stmt"], "postprocess": d => d.flat()},
    {"name": "block$ebnf$1", "symbols": []},
    {"name": "block$ebnf$1$subexpression$1", "symbols": ["stmt", "_"]},
    {"name": "block$ebnf$1", "symbols": ["block$ebnf$1", "block$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "block", "symbols": [{"literal":"${"}, "_", "block$ebnf$1", {"literal":"$}"}]},
    {"name": "variable_stmt$ebnf$1$subexpression$1", "symbols": ["_", "variable"]},
    {"name": "variable_stmt$ebnf$1", "symbols": ["variable_stmt$ebnf$1$subexpression$1"]},
    {"name": "variable_stmt$ebnf$1$subexpression$2", "symbols": ["_", "variable"]},
    {"name": "variable_stmt$ebnf$1", "symbols": ["variable_stmt$ebnf$1", "variable_stmt$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "variable_stmt", "symbols": [{"literal":"$v"}, "variable_stmt$ebnf$1", "_", {"literal":"$."}], "postprocess":  d => {
          d = d.flat(Number.MAX_SAFE_INTEGER);
          return {
            type: 'variable_stmt',
            children: [
              minToken(d[0]),
              d[1],
              {
                type: 'variables',
                text: d.slice(2, -1).map(minToken)
              },
              minToken(d[d.length - 1])
           ]
          };
        } },
    {"name": "disjoint_stmt$ebnf$1", "symbols": []},
    {"name": "disjoint_stmt$ebnf$1$subexpression$1", "symbols": ["variable"]},
    {"name": "disjoint_stmt$ebnf$1", "symbols": ["disjoint_stmt$ebnf$1", "disjoint_stmt$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "disjoint_stmt", "symbols": [{"literal":"$d"}, "variable", "variable", "disjoint_stmt$ebnf$1", {"literal":"$."}]},
    {"name": "hypothesis_stmt", "symbols": ["floating_stmt"]},
    {"name": "hypothesis_stmt", "symbols": ["essential_stmt"]},
    {"name": "floating_stmt", "symbols": ["LABEL", "_", {"literal":"$f"}, "_", "typecode", "_", "variable", "_", {"literal":"$."}], "postprocess":  d => {
          d = d.flat(Number.MAX_SAFE_INTEGER);
          return {
            type: 'floating_stmt',
            children: [
              minToken(d[0]),
              minToken(d[1]),
              minToken(d[2]),
              minToken(d[3]),
              {
                type: 'statement',
                text: d.slice(4, -1).map(minToken)
              },
              minToken(d[d.length - 1])
            ]
          }
        } },
    {"name": "essential_stmt$ebnf$1", "symbols": []},
    {"name": "essential_stmt$ebnf$1$subexpression$1", "symbols": ["MATH_SYMBOL", "_"]},
    {"name": "essential_stmt$ebnf$1", "symbols": ["essential_stmt$ebnf$1", "essential_stmt$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "essential_stmt", "symbols": ["LABEL", "_", {"literal":"$e"}, "_", "typecode", "_", "essential_stmt$ebnf$1", {"literal":"$."}]},
    {"name": "assert_stmt", "symbols": ["axiom_stmt"]},
    {"name": "assert_stmt", "symbols": ["provable_stmt"]},
    {"name": "axiom_stmt$ebnf$1", "symbols": []},
    {"name": "axiom_stmt$ebnf$1$subexpression$1", "symbols": ["MATH_SYMBOL", "_"]},
    {"name": "axiom_stmt$ebnf$1", "symbols": ["axiom_stmt$ebnf$1", "axiom_stmt$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "axiom_stmt", "symbols": ["LABEL", "_", {"literal":"$a"}, "_", "typecode", "_", "axiom_stmt$ebnf$1", {"literal":"$."}], "postprocess":  d => {
          d = d.flat(Number.MAX_SAFE_INTEGER);
          return {
            type: 'axiom_stmt',
            children: [
              minToken(d[0]),
              minToken(d[1]),
              minToken(d[2]),
              minToken(d[3]),
              {
                type: 'assertion',
                text: d.slice(4, -1).map(minToken)
              },
              minToken(d[d.length - 1])
            ]
          }
        } },
    {"name": "provable_stmt$ebnf$1", "symbols": []},
    {"name": "provable_stmt$ebnf$1$subexpression$1", "symbols": ["MATH_SYMBOL", "_"]},
    {"name": "provable_stmt$ebnf$1", "symbols": ["provable_stmt$ebnf$1", "provable_stmt$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "provable_stmt", "symbols": ["LABEL", "_", {"literal":"$p"}, "_", "typecode", "_", "provable_stmt$ebnf$1", {"literal":"$="}, "_", "proof", {"literal":"$."}]},
    {"name": "proof", "symbols": ["uncompressed_proof"]},
    {"name": "proof", "symbols": ["compressed_proof"]},
    {"name": "uncompressed_proof$ebnf$1$subexpression$1$subexpression$1", "symbols": ["LABEL"]},
    {"name": "uncompressed_proof$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":"?"}]},
    {"name": "uncompressed_proof$ebnf$1$subexpression$1", "symbols": ["uncompressed_proof$ebnf$1$subexpression$1$subexpression$1", "_"]},
    {"name": "uncompressed_proof$ebnf$1", "symbols": ["uncompressed_proof$ebnf$1$subexpression$1"]},
    {"name": "uncompressed_proof$ebnf$1$subexpression$2$subexpression$1", "symbols": ["LABEL"]},
    {"name": "uncompressed_proof$ebnf$1$subexpression$2$subexpression$1", "symbols": [{"literal":"?"}]},
    {"name": "uncompressed_proof$ebnf$1$subexpression$2", "symbols": ["uncompressed_proof$ebnf$1$subexpression$2$subexpression$1", "_"]},
    {"name": "uncompressed_proof$ebnf$1", "symbols": ["uncompressed_proof$ebnf$1", "uncompressed_proof$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "uncompressed_proof", "symbols": ["uncompressed_proof$ebnf$1"]},
    {"name": "compressed_proof$ebnf$1", "symbols": []},
    {"name": "compressed_proof$ebnf$1$subexpression$1", "symbols": ["LABEL", "_"]},
    {"name": "compressed_proof$ebnf$1", "symbols": ["compressed_proof$ebnf$1", "compressed_proof$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "compressed_proof$ebnf$2$subexpression$1", "symbols": ["COMPRESSED_PROOF_BLOCK", "_"]},
    {"name": "compressed_proof$ebnf$2", "symbols": ["compressed_proof$ebnf$2$subexpression$1"]},
    {"name": "compressed_proof$ebnf$2$subexpression$2", "symbols": ["COMPRESSED_PROOF_BLOCK", "_"]},
    {"name": "compressed_proof$ebnf$2", "symbols": ["compressed_proof$ebnf$2", "compressed_proof$ebnf$2$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "compressed_proof", "symbols": [{"literal":"("}, "_", "compressed_proof$ebnf$1", {"literal":")"}, "_", "compressed_proof$ebnf$2"]},
    {"name": "typecode", "symbols": ["constant"]},
    {"name": "filename", "symbols": ["MATH_SYMBOL"]},
    {"name": "constant", "symbols": ["MATH_SYMBOL"]},
    {"name": "variable", "symbols": ["MATH_SYMBOL"]},
    {"name": "COMPRESSED_PROOF_BLOCK", "symbols": [(lexer.has("TEXT1") ? {type: "TEXT1"} : TEXT1)]},
    {"name": "COMPRESSED_PROOF_BLOCK", "symbols": [(lexer.has("TEXT2") ? {type: "TEXT2"} : TEXT2)]},
    {"name": "COMPRESSED_PROOF_BLOCK", "symbols": [(lexer.has("TEXT3") ? {type: "TEXT3"} : TEXT3)]},
    {"name": "LABEL", "symbols": [(lexer.has("TEXT1") ? {type: "TEXT1"} : TEXT1)]},
    {"name": "LABEL", "symbols": [(lexer.has("TEXT2") ? {type: "TEXT2"} : TEXT2)]},
    {"name": "LABEL", "symbols": [(lexer.has("TEXT3") ? {type: "TEXT3"} : TEXT3)]},
    {"name": "MATH_SYMBOL", "symbols": [(lexer.has("TEXT1") ? {type: "TEXT1"} : TEXT1)]},
    {"name": "MATH_SYMBOL", "symbols": [(lexer.has("TEXT2") ? {type: "TEXT2"} : TEXT2)]},
    {"name": "MATH_SYMBOL", "symbols": [(lexer.has("TEXT3") ? {type: "TEXT3"} : TEXT3)]},
    {"name": "_$ebnf$1$subexpression$1", "symbols": ["comment", "_"]},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "_$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "_", "symbols": ["whitespace", "_$ebnf$1"], "postprocess": d => d.filter((item) => item !== null)},
    {"name": "whitespace", "symbols": [(lexer.has("WHITESPACE") ? {type: "WHITESPACE"} : WHITESPACE)], "postprocess": d => minToken(d[0])},
    {"name": "comment", "symbols": [(lexer.has("_COMMENT") ? {type: "_COMMENT"} : _COMMENT)], "postprocess": d => minToken(d[0])}
]
  , ParserStart: "database"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
