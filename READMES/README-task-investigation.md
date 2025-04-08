## How to dissect the requirements?
The first step is to understand the requirements.

---
### Learn how to play GO first

I decided to remind myself the rules of the Go boardgame and play it.
So that I could understand the rules, beyond passing the tests provided.
I discovered there is a scenario where either white or black could capture a piece depending on who's go it was like this position.

```
.#O.
#O#O
.#O.
```
If black had taken the last turn at 3,1, then it would have captured white in position 1,1
If white had taken the last turn at 2,2, then it would have captured black in position 3,1
Also, the tests indicate the last turn taken but not whether or not an eye is remaining that would increase the score for black or white at the end of the game.
Also that at the end of the game a player can sacrifice a stone in 2 consecutive turns to end the game, provided the other player accepts.


**Retrospective:**

This has got  me thinking about feature development and how I might extend this application further. 
So its important to architect the solution in a way that is progressive and allows expansion.
Perhaps this solution can be used to create a full game of Go.

---

### Representation of the board and capture
To understand how to program a solution, create representations of the board in a way that might unlock ways to solve the problem.
Create diagrams of a few key variations of the board.

*Key:*
- B=capture
- b=eye
- W=capture
- w=eye


#### Table: Captures
**Capture example: 1**
| Board   | Last turn Black  | Last turn White |
|---------|------------------|-----------------|
| .#O.    | b--w             | ---w            |
| #O#O    | -B--             | --W-            |
| .#O.    | b---             | ---w            |

**Capture example: 2**
| Board   | any turn |
|---------|----------|
| ...O    | ----     |
| .OO#    | ---W     | 
| O###    | -WWW     | 
| .OOO    | ----     |

**Capture example: 3**
| Board | any turn |
|-------|----------|
| O.    | --       |
| #O    | W-       | 
| #O    | W-       | 
| O.    | --       |

**Capture example: 4**
| Board | any turn |
|-------|----------|
| .##.  | ----     |
| #OO#  | -BB-     | 
| .#O#  | --B-     | 
| ..#.  | ----     |

**Capture example: 5**
| Board | any turn |
|-------|----------|
| O#    | B-       |
| #.    | --       | 


## Being able to read the x,y coordinates easily before proceeding?
**Use nested array**
I struggled switching my head to visualise x,y in terms of how I would program it. 
I could read the logic more quickly as a nested array.
For the purposes of documenting for myself, going forward, will dissecting the solution I will use this method.
(It's easy to change to object key format later once the core functionality has been established.
Also there is a slight performance gain working with arrays over objects)

*Convert x,y to nested array*

#### Table: x,y to nested arrays

**Row 1  | x,y      | Nested array**
| .#O.   | x,y      | Array    |
|--------|----------|----------|
| .      | `[0][0]` | `[0][0]` |
| -#     | `[1][0]` | `[0][1]` |
| --O    | `[2][0]` | `[0][2]` |
| ---.   | `[3][0]` | `[0][3]` |


**Row 2  | x,y      | Nested array**
| #O#O   | x,y      | Array    |
|--------|----------|----------|
| #      | `[0][1]` | `[1][0]` |
| -O     | `[1][1]` | `[1][1]` |
| --#    | `[2][1]` | `[1][2]` |
| ---O   | `[3][1]` | `[1][3]` |



## Think about ways I could determine what x,y position is captured?
First I thought about looking at finding the first colour- black or white, then looking around it to see if it captures anything.
Thid I'd do by looking at the top, left, bottom and right square.
The problem with this is that 2 or 3 squares could be taken up but the the remaining squares are the same colour and I'd then have to move the cursor to then check the next top, right, left bottom and so on and remember the chain as I go.

Next I thought about looking at every single square, one at a time and seeing if itself was captured by iterating over the surrounding squares. This is the same problem and is even more overhead testing blank squares.

The first idea I think is the first part of the solution, but do I need to iterate over top, left, bottom and right? I only need to worry about 2 positions to determine if I should continue checking around it. Top and left. That simplifies already. Since I have to move the cursor anyway, it makes sense to build a memory as it moves of the previous position.


**Capture example: 4**
*key*
- 8 = represents a position that is a chain surrounded top, left by B
- 3 = represents a position that is a chain surrounded top, left by W
(why these numbers? 8 looks like a b, 3 looks like a w on its side)


#### Table: First found item surrounded by a colour

| Board | any turn |  top,left surrounded                                 | 
|-------|----------|------------------------------------------------------|
| .##.  | ----     |                                                      |
| #OO#  | -BB-     | [1][1] Surrounded by B, [1][2] (left is 8, top is B) |
| .#O#  | --B-     |                                                      |
| ..#.  | ----     |                                                      |

In the above example, now I can use this as the steps to start iteration and build a memory of previous positions as 8 or 3 to determine if top, left, right, bottom is surrounded










