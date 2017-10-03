# Movements
The goal is to move the ball into destination colored cell by arrow keys
# Description
This is the game I played on Android and I want to have the code to find the best solution given the game.
In the game, you will see several boxes with difference colors:
- The grey one is blocking box, that you will not allowed to move into that.
- The black one is the "can move" box, that you can move your box into that.
- The blue one is the "destination" box, that is the box you need to fill with ball.
- The ball is white circle, that is the subject of the game.
You will use your arrow key to move up/down/left/right to move these balls into the blue boxes

# Requirement
Nodejs

# Install
npm install

# Usage
There is a grid you will first see when run the Move.html. Click on cells to change the states
There is 4 states of a cell: Blocked, Allowed, Ball, Colored, Colored Ball.
The first version, you will have to design the map, and play with it :).
After design, you will press Start button and then, you can play with arrow keys to move balls.
You can ask for solution by pressing Optimize button.
NOTE: It sometimes can't find out the solutions if the number of colored and number of ball is not equal OR the solutions is too hard to find out (there is threshold for it).

# Release note
- 0.0.1 - Feb 25 2016: Add UI, Allow user to edit the map.

# Contribution
Please making any merge requests in case of error.

# From Author
Feel free to download and use any part of the source code
Any idea can be push directly via hpphat1992@gmail.com

# Reference
Please refer to this link as the demostration
https://play.google.com/store/apps/details?id=com.nitako.move 
