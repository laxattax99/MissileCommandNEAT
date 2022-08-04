# MissileCommandNEAT
This project is an implementation of a neuroevolution algorithm where an AI is trained to play the game Missile Command.
The idea here is to have many players playing the game at the same time, and once all the players have lost, we create another
batch of players, or another generation. This next generation of players is based on the best performing players from the
previous generation. The goal is that we will have players that can play the game well after many generations.
The players are evaluated based on their fitness, which entails a variety of factors, but mainly hits, level, and accuracy.
The players with the highest fitness scores are the ones who will be the basis for the next generation.

Each player has a brain which is represented as a neural network. The neural network is fed the location of incoming missiles,
the current ammo count the player has, and which shelters are still alive. The output will determine where the player will aim
and shoot. When the next generations are created, the neural networks of the best players are copied with the same weights,
however there is slight mutations performed on the players' brains, in order for there to be variation among players.

The end goal of the player is to shoot down incoming missiles before they hit their shelters (the green boxes). When both shelters
are destroyed the player loses. If at least one shelter remains by the time all the missiles have been destroyed or have hit the
ground, the player moves on to the next level, where more missiles will spawn and be fired at the player.

I used a neuroevoltion javascript library that can be found here https://gabrieltavernini.github.io/NeatJS/.

The starter code I used to create the Missile command game can be found here https://github.com/LukeGarrigan/codeheir.com/tree/master/evolution-of-games/9%20-%20Missle%20Command.

All of the code uses the p5 processing library, which is a javascript library that is focused on design and creative coding, making it useful for creating games.
More info here https://p5js.org/.

To run the project, open index.html in a browser. 200 players will be spawned and will all play the game simultaneously.
The screen by default will display all instances of the Missile Command game being run at once. The page will display what
generation we are on and what the best fitness level a player has achieved. The checkboxes above the game display will allow
us to show all players, only the best player from the current generation, or run only the best player and no other players.
There is also a slider to increase the speed that the game will be played at so we can run through the generations faster.
The slider will not display the game when it is above 4 in order to save computing resources.