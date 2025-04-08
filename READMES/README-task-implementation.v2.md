# Version 3 (With ai support)
It suggested to flood fill matching stones by looking at all neighbours until it finds a liberty.
This is less complicated than having to compare if the stones are surrounded. 
I only have to concern myself with a connecting liberty to determine if a group is captured.

The ai provided solution was quite dense, so I took pieces of it to custom build my own in a more ledgible way so that I could expand the functionality. I broke the steps down into smaller functions to build re-usable variables like colourGroups and associated a liberty with it.
I also refactored it to mutate colour groups so I can compare against it to determine if a surrounding enemy has a liberty or not. If not, then the inside group is NOT captured.

The code is reduced so kept it to 1 file for now.



