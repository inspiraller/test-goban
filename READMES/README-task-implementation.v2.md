
# First implementation 
Was to create marker points in the grid where the top left hand corner is 1 of the enemy colour and edge or 2 both enemy colours. The square itself would get replaced with the marker. Then iterate the next square and compare that square with the previous top lef, in this case either enemy or enemy marker chain and so on. This builds up a chain within the grid that I can then move onto the below row and compare against until it reaches its end. This is merely a guide at this point because at the bottom or some row below there maybe a freedom. So we can then reverse back the other way and remove the chain markers.

*The problem with the above scenario is that it doesnt' cater for chains wrapping chains.*

# This was discovered with this test:
```ts
it('test18: custom: White surrounds black from outside and inside and has freedom from surrounding black', () => {
    const goban = new Goban([
      '.#######.', 
      '#ooooooo#', 
      '#o#####o#',
      '#o##o##o#', 
      '#o#####o#',
      '#ooooooo#', 
      '.###.###.'
    ]);

    expect(goban.boardUnChained).toEqual(
      expect.arrayContaining([
        '.#######.', 
        '#ooooooo#', 
        '#o33333o#',
        '#o33o33o#', 
        '#o33333o#',
        '#ooooooo#', 
        '.###.###.'
      ]),
    );
  });
```
# That fails and we end up with 
```ts
chained= [
  '.#######.',
  '#8888888#',
  '#8#####8#',
  '#8##8##8#',
  '#8#####8#',
  '#8888888#',
  '.###.###.'
]
unchained= [
  '.#######.',
  '#o888888#',
  '#o#####8#',
  '#o##8##8#',
  '#o#####8#',
  '#oooo888#',
  '.###.###.'
]
```
 A bit broken!

# 2nd Implementation
- Instead of reversing back up the chain, apply reverse functionality just to find the first reference of a freedom 
and then get the 'start x.y' coordinate associated with the last chained square. This will reference the chain start square.
This gets added to the exclusion list, and then the boardChained is recreated, but exluding this reference point.

