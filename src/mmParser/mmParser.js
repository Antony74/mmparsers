// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const { lexer } = require('./lexer');
const h = require('./mmParseTreeHelpers');

const minToken = (t) => {
  const {type, text} = t;
  return {type, text};
};

const popWhitespace = (item) => item.length === 1 ? item[0] : item

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
    {"name": "block", "symbols": [{"literal":"${"}, "_", "block$ebnf$1", {"literal":"$}"}], "postprocess":  d => {
          return {
            type: 'block',
            children: [
              minToken(d[0]),
              popWhitespace(d[1]),
              {
                type: 'statements',
                children: d[2].flat(3).map((item, index) => {
                  if (index % 2) {
                    return popWhitespace(item);
                  } else {
                    return item;
                  }
                })
              },
              minToken(d[3]),
            ]
          };
        } },
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
    {"name": "hypothesis_stmt", "symbols": ["essential_stmt"], "postprocess":  d => {
          d = d.flat(Number.MAX_SAFE_INTEGER);
          return {
            type: 'essential_stmt',
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
    {"name": "floating_stmt", "symbols": [(lexer.has("LABEL") ? {type: "LABEL"} : LABEL), "_", {"literal":"$f"}, "_", "typecode", "_", "variable", "_", {"literal":"$."}], "postprocess":  d => {
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
    {"name": "essential_stmt$ebnf$1$subexpression$1", "symbols": [(lexer.has("MATH_SYMBOL") ? {type: "MATH_SYMBOL"} : MATH_SYMBOL), "_"]},
    {"name": "essential_stmt$ebnf$1", "symbols": ["essential_stmt$ebnf$1", "essential_stmt$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "essential_stmt", "symbols": [(lexer.has("LABEL") ? {type: "LABEL"} : LABEL), "_", {"literal":"$e"}, "_", "typecode", "_", "essential_stmt$ebnf$1", {"literal":"$."}]},
    {"name": "assert_stmt", "symbols": ["axiom_stmt"]},
    {"name": "assert_stmt", "symbols": ["provable_stmt"]},
    {"name": "axiom_stmt", "symbols": [(lexer.has("LABEL") ? {type: "LABEL"} : LABEL), "_", {"literal":"$a"}, "_", "typecode", "_", "assertion", {"literal":"$."}], "postprocess":  d => {
          d = d.flat(1);
          return {
            type: 'axiom_stmt',
            children: [
              minToken(d[0]), // LABEL
              d[1],           // _
              minToken(d[2]), // $a
              d[3],           // _
              minToken(d[4].flat(Number.MAX_SAFE_INTEGER)[0]), // typecode
              d[5],           // _
              d[6],           // assertion
              minToken(d[7])  // $.
            ]
          }
        } },
    {"name": "provable_stmt", "symbols": [(lexer.has("LABEL") ? {type: "LABEL"} : LABEL), "_", {"literal":"$p"}, "_", "typecode", "_", "assertion", {"literal":"$="}, "_", "proof", {"literal":"$."}], "postprocess":  d => {
          return {
            type: 'provable_stmt',
            children: [
              minToken(d[0]), // label
              d[1],           // _
              minToken(d[2]), // $p
              d[3],           // _
              minToken(d[4].flat(Number.MAX_SAFE_INTEGER)[0]),  // typecode
              d[5],           // _
              d[6],           // assertion
              d[7],           // $=
              d[8],           // _
              {
                type: 'proof',
                children: d[9].flat(Number.MAX_SAFE_INTEGER).map(minToken)
              },       
              minToken(d[10]) // $.
            ]
          }
        } },
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
    {"name": "assertion", "symbols": ["assertion$ebnf$1"], "postprocess": h.assertion},
    {"name": "typecode", "symbols": ["constant"]},
    {"name": "filename", "symbols": [(lexer.has("MATH_SYMBOL") ? {type: "MATH_SYMBOL"} : MATH_SYMBOL)]},
    {"name": "constant", "symbols": [(lexer.has("MATH_SYMBOL") ? {type: "MATH_SYMBOL"} : MATH_SYMBOL)]},
    {"name": "variable", "symbols": [(lexer.has("MATH_SYMBOL") ? {type: "MATH_SYMBOL"} : MATH_SYMBOL)]},
    {"name": "_$ebnf$1$subexpression$1", "symbols": ["comment", "_"]},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "_$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "_", "symbols": ["whitespace", "_$ebnf$1"], "postprocess": h._},
    {"name": "whitespace", "symbols": [(lexer.has("WHITESPACE") ? {type: "WHITESPACE"} : WHITESPACE)], "postprocess": h.whitespace},
    {"name": "comment", "symbols": [(lexer.has("_COMMENT") ? {type: "_COMMENT"} : _COMMENT)], "postprocess": h.comment}
]
  , ParserStart: "database"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
