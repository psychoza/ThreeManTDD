# ThreeManTDD


Given the start of the game
When play has not started
Then all the players roll a single dice
Then the highest roll starts play first
Then play continues to their left

Given the start of the game
When play has not started
When the multiple players roll the highest result
Then those players roll again and repeat until only one player has the highest result

Given a player is taking their turn
When a player rolls the dice
When the result is the combination of a 1 and a 4
Then every player at the table gets a drink (including the roller)

Given a player is taking their turn
When a player rolls the dice
When the result between the two dice add up to be 7
Then the player to the right of the roller / active player takes a drink

Given a player is taking their turn
When a player rolls the dice
When the result between the two dice add up to be 11
Then the player to the left of the roller / active player takes a drink

Given a player is taking their turn and a three man is not declared
When a player rolls the dice
When the result has a 3 in it
Then the roller / active player gets to declare another player as the three man.
Then that player who is declared as the three man takes a drink for each 3 that was rolled.

Given a player is taking their turn and a three man is declared and the three man is the roller / active player
When a player rolls the dice
When the result has a 3 in it
Then the roller / active player gets to declare another player as the three man.
Then the player who is declared as the three man takes a drink for each 3 that was rolled.

Given a player is taking their turn and a three man is declared
When a player rolls the dice
When the result has a 3 in it
Then the player who is declared as the three man takes a drink for each 3 that was rolled.

Given a player is taking their turn and three man is not declared
When a player rolls the dice
When the result is a 1 and a 2
Then the roller / active player takes 2 drinks

Given a player is taking their turn and three man is declared
When a player rolls the dice
When the result is a 1 and a 2
Then the player who is declared as the three man takes 2 drinks (yes even if it is the roller)

Given a player is taking their turn
When a player rolls the dice
When the result of the two dice are the same (doubles)
Then the roller / active player chooses to give two players a single dice or a single player two dice.

Given a player is taking their turn
When a player rolls the dice
When the result of the two dice are the same (doubles)
When the roller / active player give both dice to a single player
Then the player receiving the dice rolls them both
Then if the result of both dice are not the same (doubles) then that roller gets drinks equal to the sum of the roll



// Doubles

The ACTIVE PLAYER rolls doubles, gives the doubles to a OPPONENT PLAYER.
There is an implied multiplier of x1
The OPPONENT PLAYER rolls, if they get doubles back, the multiplier increments by 1.
The OPPONENT PLAYER gives the dice back to the ACTIVE PLAYER.
The ACTIVE PLAYER rolls. This continues until one of them DO NOT roll doubles.
The person who does not roll doubles drinks the sum of the dice times the multiplier.

// EXTRA DOUBLES RULES

The active player can split the dice.
Give one dice to two players. 
The same rules above apply but now the dice are split between two people.





--------------------------------------------------------------------------------

CRAPPY ACCEPTANCE CRITERIA 




Given a player is taking their turn
When a player rolls the dice
When the result of the two dice are the same (doubles)
When the roller / active player give both dice to a single player
Then the player receiving the dice rolls them both
Then if the result of both dice is the same (doubles) then the original roller gets the dice back and rolls again
Then the if the result is not a set of doubles



