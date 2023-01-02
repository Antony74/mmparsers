@{%
const { lexer } = require('./lexer');
%}

@lexer lexer

database -> ( outermost_scope_stmt ):*

outermost_scope_stmt ->
  include_stmt | constant_stmt | stmt | %WHITESPACE | %_COMMENT

# File inclusion command; process file as a database.
# Databases should NOT have a comment in the filename.
include_stmt -> "$[" filename "$]"

# Constant symbols declaration.
constant_stmt -> "$c" _ ( constant _ ):+ "$."

# A normal statement can occur in any scope.
stmt -> block | variable_stmt | disjoint_stmt |
  hypothesis_stmt | assert_stmt

# A block. You can have 0 statements in a block.
block -> "${" _ ( stmt _ ):* "$}"

# Variable symbols declaration.
variable_stmt -> "$v" ( _ variable ):+ _ "$."

# Disjoint variables. Simple disjoint statements have
# 2 variables, i.e., "variable*" is empty for them.
disjoint_stmt -> "$d" variable variable ( variable ):* "$."

hypothesis_stmt -> floating_stmt | essential_stmt

# Floating (variable-type) hypothesis.
floating_stmt -> LABEL _ "$f" _ typecode _ variable _ "$."

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

_ -> %WHITESPACE ( %_COMMENT _ ):?
