# bitman
bitman (an abbreviation of "bitwise manipulation") is a stack-based language made to be good with bit manipulation.

## Commands
- `+`: Create a new integer, initially set to 0.
- `1`: Add a 1 to the top-of-stack integer and discard overflowing bits.
- `$`: Duplicate _nth_ from top of stack.
- `%`: Discard top of stack.
- `@`: Roll _nth_ to top of stack.
- `&|^`: Perform bitwise AND/OR/XOR on top two integers on stack.
- `~`: Perform bitwise NOT on top integer on stack.
- `<`: Shift bits to left and discard overflowing bits.
- `>`: Shift bits to right and discard overflowing bits.
- `[...]`: Push lambda onto stack.
- `!`: Execute lambda.
- `?`: Execute lambda only if condition is not 0.
- `=a`: Set a lambda to operator `a`.
