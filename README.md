# ZOMBIE RUN

## Description

ZOMBIE RUN is a 2D endless runner videogame in which the player will have to escape from an horde of terrible zombies. To achieve this, you will be able to jump and duck to dodge them easily, but with each second that passes they will arrive faster and faster until it reaches a point that they will be practically impossible to dodge.

The game ends when the player cannot continue and is caught by one of the zombies.

## MVP (DOM - CANVAS)

- The game has a Splash screen and a Game Over screen.
- With every second that passes, zombies will come at you faster.
- The player will be able to jump and duck the zombies.
- The player have two jumps heights.


## Backlog

- Add Music
- Diferent zombies, flying ones.
- Ability to shoot the zombies.

## Data Structure

# index.html
# style.css
# index.js

Classes
- class Player () {
    this.x;
    this.y;
    this.width;
    this.height;
    this.colour; 
    this.dirY;
    this.jumpForce; 
    this.originalHeight;
    this.grounded;
    this.jumpTimer;
}
- class Enemy() {
    this.x;
    this.y;
    this.width;
    this.height;
    this.colour;
    this.dirX;
}
- class Statistics() {
    this.text;
    this.x;
    this.y;
    this.alignment;
    this.colour;
    this.size;
}

functions

function createEnemies(){}
function randomRange(){}
function splash(){}
function addCanvas(){}
function startGame(){}
function gameOver(){}
function newGame(){}
function updateGame(){}
 


## States y States Transitions

- splashScreen
- gameScreen
- gameOverScreen

## Task

- main - buildDom
- main - buildSplashScreen
- main - addEventListeners
- main - buildGameScreen
- main - buildGameOverScreen
- game - startLoop
- game - updateCanvas
- game - drawCanvas
- player - buildTwoJumps
- player - implementDuckMechanic
- enemies - makeThemRandomSizes
- enemies - makeThemAppearRandomly


## Links

### Trello
[Link url]https://trello.com/b/GQU8Ywvc/ironhack-game

### Git
[Link Repo] https://github.com/AlvaroSLam/Zombie_Run

[Link Deploy] https://alvaroslam.github.io/Zombie_Run/.


### Slides
[Link Slides.com]