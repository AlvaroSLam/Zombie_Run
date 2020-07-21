/*
Player Color: #4a823e
color enemies: #bf1313
*/

let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d")
canvas.style.border = '2px solid black';

//SET OF VARIABLES

let score; //0 default
let scoreText;
let highscore; // 0 deault
let highscoreText;
let player;
let gravity; //1 default
let enemies = [];
let gameSpeed; //3 default
let keys = {};
let isGameOver = false; //Con esto finalizamos el loop
let gameOverScreen;

//IMAGES
let bgImg;
let playerImg;
let enemyImg;


//-----------EVENT LISTENERS--------------//
document.addEventListener("keydown", function (even) {
  keys[even.code] = true;
});

document.addEventListener("keyup", function (even){
  keys[even.code] = false;
})


//-----------CLASSES--------------//
// X AXIS, Y AXIS, WIDTH, HEIGHT, COLOUR, DIRECTION Y FORCE
class Player {
  constructor (x, y, width, height, colour) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.colour = colour;
    this.dirY = 0; //Maybe I could also use it for the jumping velocity
    this.jumpForce = 15; //remeber to check
    this.originalHeight = height; //Only for shrinking the character
    this.grounded = false;
    this.jumpTimer = 0; //salto de supermario
  }

  animation() {

    //JUMP MECHANICS DEL PLAYER
    //Para saltar más alto
    if (keys["Space"]) { 
      this.jump();
    } else {
        this.jumpTimer = 0; //Para saltar más alto o más bajo
      }

      //Para agacharnos
      if (keys['KeyS']) {
        this.height = this.originalHeight / 2;
      } else {
        this.height = this.originalHeight;
      }
    
      this.y += this.dirY;

    //GRAVITY SISTEM. StackOverFlow
    if (this.y + this.height < canvas.height) {
      this.dirY += gravity;
      this.grounded = false;
    } else {
      this.dirY = 0;
      this.grounded = true;
      this.y = canvas.height - this.height;
    }  

    this.draw()
  }

  //JUMP MECHANICS
  jump() {
    if (this.grounded && this.jumpTimer === 0) {
      this.jumpTimer = 1;
      this.dirY = -this.jumpForce;
    } else if (this.jumpTimer > 0 && this.jumpTimer < 15) {       
        this.jumpTimer++;
        this.dirY = -this.jumpForce - (this.jumpTimer /50);
      }
    }

  
  draw(){ //CREA EL JUGADOR, UN RECTÁNGULO
    ctx.beginPath();
    ctx.fillStyle = this.colour;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.closePath();
  }  
}


//ENEMIES
class Enemy {
  constructor (x, y, width, height, colour) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.colour = colour;

    this.dirX = -gameSpeed;
  }

  update() {
    this.x += this.dirX;
    this.draw();
    this.dirX = -gameSpeed;
  }

  draw() { //Crea el enemigo
    ctx.beginPath();
    ctx.fillStyle = this.colour;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.closePath();
  }
}


//SCORE
class Statistics {
  constructor(text, x, y, alignment, colour, size) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.alignment = alignment;
    this.colour = colour;
    this.size = size;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.colour;
    ctx.font = this.size +"px sans-serif";
    ctx.textAlign = this.alignment
    ctx.fillText(this.text, this.x, this.y);
    ctx.closePath();
  }
}


//-----------FUNCTIONS--------------//
function createEnemies(){ //CREATE ENEMIES WITH RANDOM SIZE
  let size = randomRange(20, 70) // Function debajo, el player es 50x50
  let type = randomRange(0, 1); //Dos tipos de enemigos
  let enemy = new Enemy(canvas.width + size, canvas.height - size, size, size, '#bf1313');

  if (type == 1) {
    enemy.y -= player.originalHeight - 10; //Para hacerlo un poco más alto que el jugador
  }
  enemies.push(enemy);
}


function randomRange(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

//Timer enemies
let initialSpawnTimer = 200;
let spawnTimer = 100;

//INITIALIZE THE GAME

function startGame(){
  isGameOver = false
  console.log("starGame function called")
  //canvas.width = window.innerWidth; //con estas lineas las puedo hacer pantalla completa, recordar quitar
  //canvas.height = window.innerHeight;

  //CARACTERÍSTICAS BÁSICAS
  
  ctx.font = "20px sans-serif"; //Probar a ponerlo en Global
  gameSpeed = 3; 
  gravity = 1; 
  score = 0; 
  highscore = 0; 

  //DATOS DEL JUGADOR
  player = new Player(50, canvas.height - 150, 50, 50, "#4a823e");

  //DATOS DE LOS STATISTICS. Score and Highscore
  scoreText = new Statistics("Score: " + score, 25, 25, "left", "#000000", "20")

  highscoreText = new Statistics("Highscore: " + highscore, canvas.width - 25, 25, "right", "#000000", "20");



  requestAnimationFrame(update)

  //CREATE A SPLASH SCREEN
  
   
}

//GAME OVER SCREEN

function gameOver(){
  canvas.remove() //Lo primero elimina el canvas con element.remove
  let body = document.querySelector("body") // como no es una variable global la tengo que volver a seleccionar.

  gameOverScreen = document.createElement("div")//Recordar! Tengo la variable creada arriba en global.
  gameOverScreen.classList.add("gameOverScr")
  gameOverScreen.innerHTML = `<button class="reset-btn">RESET</button>`;  
  body.appendChild(gameOverScreen) //Lo añado al body con append.child

  let reset = gameOverScreen.querySelector(".reset-btn")
  reset.addEventListener("click", function() {
    newGame(); //Añado una nueva función para que cuando le dé a click se ejecute la nueva función definida abajo
  })  
}
//TERMINAR LA GAME OVER Y CREAR UNA NUEVA

function newGame() {
  gameOverScreen.remove();
  
  let body = document.querySelector("body") //fetch de nuevo el canvas, no es una variable local.
  canvas = document.createElement("div"); 
  canvas.innerHTML = `<canvas id="game" width="900" height="500"></canvas>` //Nos crea un nuevo cambas como el anterior
  body.appendChild(canvas)
   canvas = document.getElementById("game");
   ctx = canvas.getContext("2d");
   canvas.style.border = '2px solid black';
  
  startGame();
}


function update() {
  requestAnimationFrame(update);
  ctx.clearRect(0, 0, canvas.width, canvas.height) //Clear the canvas every time, si no todo se quedará

  //SPAWING ENEMIES
spawnTimer--;
if (spawnTimer <= 0) {
  createEnemies();
  spawnTimer = initialSpawnTimer - gameSpeed * 15; //Esto hace que aparezcan más seguido

  if (spawnTimer < 60) {
    spawnTimer = 60;
  }
}

//CREACIÓN DE ENEMIGOS
for (let i = 0; i < enemies.length; i ++) { 
  let e = enemies[i];

  //COLLISION SYSTEM
  //IMPORTANTE!! Eliminar los enemigos que salgan de la pantalla
  if (e.x + e.width < 0) {
    enemies.splice(i, 1);
  }

  //COLLISION
  if (
    player.x < e.x + e.width && 
    player.x + player.width > e.x &&
    player.y < e.y + e.height &&
    player.y + player.height > e.y
    ){
      //INCLUIR AQUI EL GAME OVER      
      enemies = []; //Resetear enemigos
      score = 0; //Resetear el score
      spawnTimer = initialSpawnTimer; //Velocidad original
      gameSpeed = 3; //La velocidad original
      isGameOver = true
      gameOver();
      

  }

  if (!isGameOver) e.update()
}

  player.animation();

  gameSpeed += 0.005; // Increase every frame hasta llegar a 60 del spawnTimer

  score ++;
  scoreText.text = "Score: " + score;
  scoreText.draw();

  if (score > highscore) {
    highscore = score;
    highscoreText.text = "Highscore: " + highscore;
  }

  highscoreText.draw();
  
}

startGame();


