
# Start
The board is provided by an array of strings. ['o#.','#..'] instead of [['o','#','.'], ['#','.', '.']]
Instead of keeping this format, the first thing this function will do is convert  that string row to the latter - a nested array: [y][x] 
Why?

## Pros: 
This allows us to enforce types on each character and new characters created as markers. 
(Typescript can't enforce any combination of any length of a particular character as a string type.)
We can update single characters as markers easily with arrays. We can't do str[i] = value.
The alternative to use stick to the string format would require a lot of difficult to read string manipulation

# Core functionality
How to know if each square is captured?
We can iterate over each square and compare the top, left, bottom and right of a square to determine if the enemy has captured it, 
but not if we have a chain of our colour in one of those top, left, right, bottom places.

# How to solve that? 
We only have to compare the top and left position only when iterating each row of squares.
This method - mutateAddChains, will iterate over each role and column and replace the current square if:
- the top and left position is the enemy, an edge or an enemy chain marker.
As it progresses each square, adding an enemy chain marker, we stop when we get to a different square colour, edge or dot.

## example:
```
.## 
#oo#
.##. 
```
returns:
```
.## 
#88#
.##. 
```

The enemy chain marker, in this case - 8, has filled all the spaces of white. 
We might think this is enough now to determine if this is captured, but it isn't because there can be a scenario like this:

## example:
```ts
.## 
#oo#
.#.. 
```
returns:
.## 
#88#
.#.. 

## Conclusion: 
The marker for the chain is a guide, not a definate qualification of capture at this point.
The next step is to reverse back the other direction and remove any chain that is free, 
like the above scenario where the last character is a dot.
mutateReverseUnChainVerticals()
This checks any last position to remove any free chains, and then we end up with the final result of true, false for captured positions.

#################################################################################################
# UPDATE!
There is a problem with this approach after some testing. 
In the case of test 4 
      'oo.',
      '##.',
      'o#o',  
      '.o.',

**chained becomes**
```
  ['o', 'o', '.'],
  ['3', '3', '.'],
  ['o', '3', 'o'],
  ['.', 'o', '.']
```
**unchained becomes**
```
  ['o', 'o', '.'],
  ['#', '#', '.'],
  ['o', '3', 'o'],
  ['.', 'o', '.']
```

# The bottom 3 does not become unchained, because the bottom and right item are whites.

To fix this edgecase, when iterating over the rows to add the chains, we can simply exclude the whole role from a chain, provided that the end of the row ends with a dot.
That way, the next row won't match the top item as an enemy and this will never happen.
Added extra method: getRowChainEndsWithDot() to capture this.

After more tests this proves the case.

