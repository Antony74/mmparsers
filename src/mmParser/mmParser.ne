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
constant_stmt -> "$c" ( constant | %WHITESPACE | %_COMMENT ):+ "$."

# A normal statement can occur in any scope.
stmt -> block | variable_stmt | disjoint_stmt |
  hypothesis_stmt | assert_stmt

# A block. You can have 0 statements in a block.
block -> "${" ( stmt ):* "$}"

# Variable symbols declaration.
variable_stmt -> "$v" ( variable | %WHITESPACE | %_COMMENT ):+ "$."

# Disjoint variables. Simple disjoint statements have
# 2 variables, i.e., "variable*" is empty for them.
disjoint_stmt -> "$d" variable variable ( variable ):* "$."

hypothesis_stmt -> floating_stmt | essential_stmt

# Floating (variable-type) hypothesis.
floating_stmt -> LABEL "$f" typecode variable "$."

# Essential (logical) hypothesis.
essential_stmt -> LABEL "$e" typecode ( MATH_SYMBOL | %WHITESPACE | %_COMMENT ):* "$."

assert_stmt -> axiom_stmt | provable_stmt

# Axiomatic assertion.
axiom_stmt -> LABEL "$a" typecode ( MATH_SYMBOL | %WHITESPACE | %_COMMENT ):* "$."

# Provable assertion.
provable_stmt -> LABEL "$p" typecode ( MATH_SYMBOL | %WHITESPACE | %_COMMENT ):*
  "$=" proof "$."

# A proof. Proofs may be interspersed by comments.
# If '?' is in a proof it's an "incomplete" proof.
proof -> uncompressed_proof | compressed_proof
uncompressed_proof -> ( LABEL | "?" | %WHITESPACE | %_COMMENT ):+
compressed_proof -> "(" ( LABEL ):* ")" ( COMPRESSED_PROOF_BLOCK ):+

typecode ->  ( %WHITESPACE | %COMMENT ):* constant

filename -> MATH_SYMBOL # No whitespace or '$'
constant -> MATH_SYMBOL
variable -> MATH_SYMBOL

COMPRESSED_PROOF_BLOCK -> %TEXT1 | %TEXT2 | %TEXT3
LABEL -> ( %TEXT1 | %TEXT2 | %TEXT3 ) ( %WHITESPACE | %COMMENT ):*
MATH_SYMBOL -> ( %WHITESPACE | %COMMENT ):* ( %TEXT1 | %TEXT2 | %TEXT3 ) ( %WHITESPACE | %COMMENT ):*