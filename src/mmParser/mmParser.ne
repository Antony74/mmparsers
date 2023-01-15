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
  | assert_stmt {% h.assert_stmt %}

# A block. You can have 0 statements in a block.
block -> "${" _ ( stmt _ ):* "$}" {% h.block %}

# Variable symbols declaration.
variable_stmt -> "$v" ( _ variable ):+ _ "$." {% h.variable_stmt %}

# Disjoint variables. Simple disjoint statements have
# 2 variables, i.e., "variable*" is empty for them.
disjoint_stmt -> "$d" variable variable ( variable ):* "$."

hypothesis_stmt -> floating_stmt | essential_stmt {% h.hypothesis_stmt %}

# Floating (variable-type) hypothesis.
floating_stmt -> %LABEL _ "$f" _ typecode _ variable _ "$." {% h.floating_stmt %}

# Essential (logical) hypothesis.
essential_stmt -> %LABEL _ "$e" _ typecode _ ( %MATH_SYMBOL _ ):* "$."

assert_stmt -> axiom_stmt | provable_stmt

# Axiomatic assertion.
axiom_stmt -> %LABEL _ "$a" _ typecode _ assertion "$." {% h.axiom_stmt %}

# Provable assertion.
provable_stmt -> %LABEL _ "$p" _ typecode _ assertion "$=" _ proof "$." {% h.provable_stmt %}

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
