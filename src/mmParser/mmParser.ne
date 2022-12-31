@{%
const { lexer } = require('./lexer');
%}

@lexer lexer

mmFile -> ( %ws | %comment ):*
