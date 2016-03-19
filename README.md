# bitman
bitman (an abbreviation of "bitwise manipulation") is a simple stack-based language designed to be excel at bit manipulation.

## Commands
- `+`: Create a new integer, initially set to 0.
- `1`: Add a 1 to the top-of-stack integer.
- `$`: Duplicate _nth_ from top of stack.
- `%`: Discard top of stack.
- `@`: Roll _nth_ to top of stack.
- `&|^`: Perform bitwise AND/OR/XOR on top two integers on stack.
- `~`: Perform bitwise NOT on top integer on stack.
- `<`: Shift bits to left.
- `>`: Shift bits to right and discard overflowing bits.
- `[...]`: Push lambda onto stack.
- `!`: Execute lambda.
- `?`: Execute lambda only if condition is not 0.
- `=a`: Set a lambda to operator `a`.

## Basics
bitman uses a dynamic bit storage model. This means that if the current number of bits used to store each number is 32 and a number is created with 33 bits, the number of bits used will be changed to 33 bits and all numbers on the stack will be adjusted to contain 33 bits. This allows for arbitrary bit manipulation.

To create binary numbers (ex.:`1001`), simply put a `+` at the beginning to initialize a number, and start adding `1` for 1 and `<` for 0 (ex.: `+1<<1`).

## Examples
Truth machine:
```
[+$[+$T]?]=T
```
