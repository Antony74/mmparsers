@{%
const { lexer } = require('./lexer');

const minToken = (t) => {
  const {type, text} = t;
  return {type, text};
};

%}

@lexer lexer

database -> ( outermost_scope_stmt ):* {% d => {return {type: 'database', children: d.flat(3)}} %}

outermost_scope_stmt ->
  include_stmt    
  | constant_stmt 
  | stmt {% d => d.flat() %}
  | whitespace   
  | comment 

# File inclusion command; process file as a database.
# Databases should NOT have a comment in the filename.
include_stmt -> "$[" filename "$]"

# Constant symbols declaration.
constant_stmt -> "$c" _ ( constant _ ):+ "$." {% d => {
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
} %}

# A normal statement can occur in any scope.
stmt -> block
  | variable_stmt
  | disjoint_stmt
  | hypothesis_stmt {% d => d.flat() %}
  | assert_stmt

# A block. You can have 0 statements in a block.
block -> "${" _ ( stmt _ ):* "$}"

# Variable symbols declaration.
variable_stmt -> "$v" ( _ variable ):+ _ "$." {% d => {
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
} %}

# Disjoint variables. Simple disjoint statements have
# 2 variables, i.e., "variable*" is empty for them.
disjoint_stmt -> "$d" variable variable ( variable ):* "$."

hypothesis_stmt -> floating_stmt | essential_stmt

# Floating (variable-type) hypothesis.
floating_stmt -> LABEL _ "$f" _ typecode _ variable _ "$." {% d => {
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
} %}

# Essential (logical) hypothesis.
essential_stmt -> LABEL _ "$e" _ typecode _ ( MATH_SYMBOL _ ):* "$."

assert_stmt -> axiom_stmt | provable_stmt

# Axiomatic assertion.
axiom_stmt -> LABEL _ "$a" _ typecode _ ( MATH_SYMBOL _ ):* "$."

# Provable assertion.
provable_stmt -> LABEL _ "$p" _ typecode _ ( MATH_SYMBOL _ ):*
  "$=" _ proof "$."

# A proof. Proofs may be interspersed by comments.
# If '?' is in a proof it's an "incomplete" proof.
proof -> uncompressed_proof | compressed_proof
uncompressed_proof -> ( ( LABEL | "?" ) _ ):+
compressed_proof -> "(" _ ( LABEL _ ):* ")" _ ( COMPRESSED_PROOF_BLOCK _ ):+

typecode -> constant

filename -> MATH_SYMBOL # No whitespace or '$'
constant -> MATH_SYMBOL
variable -> MATH_SYMBOL

COMPRESSED_PROOF_BLOCK -> %TEXT1 | %TEXT2 | %TEXT3
LABEL ->  %TEXT1 | %TEXT2 | %TEXT3
MATH_SYMBOL -> %TEXT1 | %TEXT2 | %TEXT3

_ -> whitespace ( comment _ ):? {% d => d.filter((item) => item !== null) %}

whitespace -> %WHITESPACE {% d => minToken(d[0]) %}
comment -> %_COMMENT {% d => minToken(d[0]) %}
