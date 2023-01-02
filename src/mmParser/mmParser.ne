@{%
const { lexer } = require('./lexer');
%}

@lexer lexer

database -> ( outermost_scope_stmt ):*

outermost_scope_stmt ->
  include_stmt | constant_stmt | stmt | %_COMMENT

# File inclusion command; process file as a database.
# Databases should NOT have a comment in the filename.
include_stmt -> "%$[" filename "%$]"

# Constant symbols declaration.
constant_stmt -> "$c" ( %constant ):+ "$."

# A normal statement can occur in any scope.
stmt -> block | variable_stmt | disjoint_stmt |
  hypothesis_stmt | assert_stmt

# A block. You can have 0 statements in a block.
block -> "%${" ( stmt ):* "%$}"

# /* Variable symbols declaration. */
# variable-stmt ::= '$v' variable+ '$.'

# /* Disjoint variables. Simple disjoint statements have
#    2 variables, i.e., "variable*" is empty for them. */
# disjoint-stmt ::= '$d' variable variable variable* '$.'

# hypothesis-stmt ::= floating-stmt | essential-stmt

# /* Floating (variable-type) hypothesis. */
# floating-stmt ::= LABEL '$f' typecode variable '$.'

# /* Essential (logical) hypothesis. */
# essential-stmt ::= LABEL '$e' typecode MATH-SYMBOL* '$.'

# assert-stmt ::= axiom-stmt | provable-stmt

# /* Axiomatic assertion. */
# axiom-stmt ::= LABEL '$a' typecode MATH-SYMBOL* '$.'

# /* Provable assertion. */
# provable-stmt ::= LABEL '$p' typecode MATH-SYMBOL*
#   '$=' proof '$.'

# /* A proof. Proofs may be interspersed by comments.
#    If '?' is in a proof it's an "incomplete" proof. */
# proof ::= uncompressed-proof | compressed-proof
# uncompressed-proof ::= (LABEL | '?')+
# compressed-proof ::= '(' LABEL* ')' COMPRESSED-PROOF-BLOCK+

# typecode ::= constant

filename -> %MATH_SYMBOL # No whitespace or '$'
constant -> %MATH_SYMBOL
# variable -> %MATH_SYMBOL
