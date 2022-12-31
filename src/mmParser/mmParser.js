// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const { lexer } = require('./lexer');
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "mmFile$ebnf$1", "symbols": []},
    {"name": "mmFile$ebnf$1$subexpression$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "mmFile$ebnf$1$subexpression$1", "symbols": [(lexer.has("comment") ? {type: "comment"} : comment)]},
    {"name": "mmFile$ebnf$1", "symbols": ["mmFile$ebnf$1", "mmFile$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "mmFile", "symbols": ["mmFile$ebnf$1"]}
]
  , ParserStart: "mmFile"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
