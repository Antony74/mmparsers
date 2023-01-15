@{%
const { lexer } = require('./lexer');
const h = require('./mmParseTreeHelpers');

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
constant_stmt -> "$c" _ ( constant _ ):+ "$." {% h.constant_stmt %}

# A normal statement can occur in any scope.
stmt -> block
  | variable_stmt
  | disjoint_stmt
  | hypothesis_stmt {% d => d.flat() %}
  | assert_stmt {% d => d.flat() %}

# A block. You can have 0 statements in a block.
block -> "${" _ ( stmt _ ):* "$}" {% d => {
  return {
    type: 'block',
    children: [
      h.minToken(d[0]),
      d[1],
      {
        type: 'statements',
        children: d[2].flat(3).map((item, index) => {
            return item;
        })
      },
      h.minToken(d[3]),
    ]
  };
} %}

# Variable symbols declaration.
variable_stmt -> "$v" ( _ variable ):+ _ "$." {% d => {
  d = d.flat(Number.MAX_SAFE_INTEGER);
  return {
    type: 'variable_stmt',
    children: [
      h.minToken(d[0]),
      d[1],
      {
        type: 'variables',
        children: d.slice(2, -1).map(h.minToken)
      },
      h.minToken(d[d.length - 1])
   ]
  };
} %}

# Disjoint variables. Simple disjoint statements have
# 2 variables, i.e., "variable*" is empty for them.
disjoint_stmt -> "$d" variable variable ( variable ):* "$."

hypothesis_stmt -> floating_stmt | essential_stmt {% d => {
  d = d.flat(Number.MAX_SAFE_INTEGER);
  return {
    type: 'essential_stmt',
    children: [
      h.minToken(d[0]),
      h.minToken(d[1]),
      h.minToken(d[2]),
      h.minToken(d[3]),
      {
        type: 'statement',
        children: d.slice(4, -1).map(h.minToken)
      },
      h.minToken(d[d.length - 1])
    ]
  }
} %}

# Floating (variable-type) hypothesis.
floating_stmt -> %LABEL _ "$f" _ typecode _ variable _ "$." {% d => {
  d = d.flat(Number.MAX_SAFE_INTEGER);
  return {
    type: 'floating_stmt',
    children: [
      h.minToken(d[0]),
      h.minToken(d[1]),
      h.minToken(d[2]),
      h.minToken(d[3]),
      {
        type: 'statement',
        children: d.slice(4, -1).map(h.minToken)
      },
      h.minToken(d[d.length - 1])
    ]
  }
} %}

# Essential (logical) hypothesis.
essential_stmt -> %LABEL _ "$e" _ typecode _ ( %MATH_SYMBOL _ ):* "$."

assert_stmt -> axiom_stmt | provable_stmt

# Axiomatic assertion.
axiom_stmt -> %LABEL _ "$a" _ typecode _ assertion "$." {% d => {
  d = d.flat(1);
  return {
    type: 'axiom_stmt',
    children: [
      h.minToken(d[0]), // LABEL
      d[1],           // _
      h.minToken(d[2]), // $a
      d[3],           // _
      h.minToken(d[4].flat(Number.MAX_SAFE_INTEGER)[0]), // typecode
      d[5],           // _
      d[6],           // assertion
      h.minToken(d[7])  // $.
    ]
  }
} %}

# Provable assertion.
provable_stmt -> %LABEL _ "$p" _ typecode _ assertion "$=" _ proof "$." {% d => {
  return {
    type: 'provable_stmt',
    children: [
      h.minToken(d[0]), // label
      d[1],           // _
      h.minToken(d[2]), // $p
      d[3],           // _
      h.minToken(d[4].flat(Number.MAX_SAFE_INTEGER)[0]),  // typecode
      d[5],           // _
      d[6],           // assertion
      d[7],           // $=
      d[8],           // _
      {
        type: 'proof',
        children: d[9].flat(Number.MAX_SAFE_INTEGER).map(h.minToken)
      },       
      h.minToken(d[10]) // $.
    ]
  }
} %}

# A proof. Proofs may be interspersed by comments.
# If '?' is in a proof it's an "incomplete" proof.
proof -> uncompressed_proof | compressed_proof
uncompressed_proof -> ( ( %LABEL | "?" ) _ ):+
compressed_proof -> "(" _ ( %LABEL _ ):* ")" _ ( %COMPRESSED_PROOF_BLOCK _ ):+

assertion -> ( %MATH_SYMBOL _ ):* {% h.assertion %}

typecode -> constant

filename -> %MATH_SYMBOL # No whitespace or '$'
constant -> %MATH_SYMBOL
variable -> %MATH_SYMBOL

_ -> whitespaceComment {% h._ %}

whitespaceComment -> whitespace ( comment _ ):? 

whitespace -> %WHITESPACE {% h.whitespace %}
comment -> %_COMMENT {% h.comment %}
