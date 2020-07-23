/*
Player Color: #4a823e
color enemies: #bf1313
*/

//let canvas = document.getElementById("game");
//let ctx = canvas.getContext("2d")
let body = document.querySelector("body")
let canvas;
let ctx;
//canvas.style.border = '2px solid black'; //ATTENTION! Quitar después del arte final

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
let splashScreen;
let canvasContainer;

//IMAGES

let playerImg = new Image();
playerImg.src = "images/player.png";

let enemyImg = new Image();
enemyImg.src = "images/zombie1.png"

//MUSIC
//let splashScreenMusic = document.getElementById("splashScreenMusic")
//let gameMusic = document.getElementById("gameMusic")
//let endGame = document.getElementById("endGame")

let splashScreenMusic = new Audio();
splashScreenMusic.src = "music/TLOU.song.mp3"

let gameMusic = new Audio();
gameMusic.src = "music/game.music.mp3"

let endGame = new Audio();
endGame.src = "music/end.game.mp3"

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
    this.colour = colour; // YA NO ES NECESARIO
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

    draw(){ //CREA EL JUGADOR
      ctx.drawImage(playerImg, this.x, this.y, this.width, this.height)
    } 

  
  /* CODIGO ANTIGUO PARA EL CUADRADO draw(){ //CREA EL JUGADOR, UN RECTÁNGULO
    ctx.beginPath();
    ctx.fillStyle = this.colour;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.closePath();*/
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
    ctx.drawImage(enemyImg, this.x, this.y, this.width, this.height)
  }

  /* CODIGO ANTIGUO Para los rectángulos. ctx.beginPath();
    ctx.fillStyle = this.colour;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.closePath();*/
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
  let size = randomRange(90, 120) // Function debajo, el player es 60x80
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

//SPLASH SCREEN

function splash(){
  let body = document.querySelector("body")
  splashScreen = document.createElement("div")
  splashScreenMusic.play();
  splashScreenMusic.volume = 0.05
  splashScreen.classList.add("splashScr")
  splashScreen.innerHTML = `
    <button class="start-btn">START GAME</button> 
    <h2 class= "headline">Are you faster than a zombie? </h2>
    <h2 class= "instruccions">Press the spacebar to jump and the S to duck</h2>           
    <img src="images/zombie.hand.png" alt="Start" class="hand">
  `
  body.appendChild(splashScreen)
  let splashBtn = splashScreen.querySelector(".start-btn")
  splashBtn.addEventListener("click", function() {
      splashScreenMusic.pause();
      splashScreen.currentTime = 0
      gameMusic.play()
      gameMusic.volume = 0.05
      startGame();
    })
}

function addCanvas() {
  canvasContainer = document.createElement("div")
  canvasContainer.setAttribute("id", "canvas-container")
  canvasContainer.innerHTML = `<canvas id="game" width="1200" height="700"></canvas>`
  body.appendChild(canvasContainer)
}

function startGame(){
  isGameOver = false
  splashScreen.remove()
  addCanvas()
  canvas = document.getElementById("game");
  ctx = canvas.getContext("2d")
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
  player = new Player(50, canvas.height, 60, 90, "#4a823e");

  //DATOS DE LOS STATISTICS. Score and Highscore
  scoreText = new Statistics("Score: " + score, 25, 25, "left", "#bababa", "30")

  highscoreText = new Statistics("Highscore: " + highscore, canvas.width - 25, 25, "right", "#bababa", "30");



  requestAnimationFrame(updateGame)

     
}

//GAME OVER SCREEN

function gameOver(){
  //canvas.remove() //Lo primero elimina el canvas con element.remove
  endGame.currentTime = 0
  endGame.play();
  endGame.volume = 0.05;
  canvasContainer.remove();
  let body = document.querySelector("body") // como no es una variable global la tengo que volver a seleccionar.

  gameOverScreen = document.createElement("div")//Recordar! Tengo la variable creada arriba en global.
  gameOverScreen.classList.add("gameOverScr")
  gameOverScreen.innerHTML = `
  <button class="reset-btn">RESET</button>
  <div class="score">

  <h2 class = "scoreText">Your Score</h2>
  <h3 class= "scoreNum">${score}</h3>

  <h2 class= "quote"><em>"I like my zombies slow and I like my zombies stupid"</em></h2>
  <h3 class="author">Seth Grahame-Smith</h3>
  <h3 class="authorText"><em>Author of Pride and Prejudice and Zombies<em></h3>
  </div>
  `;  
  body.appendChild(gameOverScreen) //Lo añado al body con append.child

  let reset = gameOverScreen.querySelector(".reset-btn")
  reset.addEventListener("click", function() {
    //canvasContainer.remove();
    gameMusic.play()
    newGame();
     //Añado una nueva función para que cuando le dé a click se ejecute la nueva función definida abajo
  })  
}
//TERMINAR LA GAME OVER Y CREAR UNA NUEVA

function newGame() {
  gameOverScreen.remove();
  
  let body = document.querySelector("body") //fetch de nuevo el canvas, no es una variable local.
  //canvas = document.createElement("div"); 
  //canvas.innerHTML = `<canvas id="game" width="1200" height="700" ></canvas>` /
 // addCanvas()
  //Nos crea un nuevo cambas como el anterior
  //body.appendChild(canvas)
  // canvas = document.getElementById("game");
  // ctx = canvas.getContext("2d");
  // canvas.style.border = '2px solid black';
  
    //score = 0; //0 default
    //scoreText;
    highscore = 0; // 0 deault
    highscoreText;
    //player;
    gravity = 1; //1 default
    enemies = [];
    gameSpeed = 3; //3 default
    keys = {};
    isGameOver = false; //Con esto finalizamos el loop
    initialSpawnTimer = 200;
    spawnTimer = 100;
    //gameOverScreen;

  startGame();
}


function updateGame() {
  //requestAnimationFrame(update);
  //if (!isGameOver) requestAnimationFrame(updateGame)
  ctx.clearRect(0, 0, canvas.width, canvas.height) //Clear the canvas every time, si no todo se quedará

  //SPAWING ENEMIES
  spawnTimer--;
  if (spawnTimer <= 0) {
    createEnemies();
    spawnTimer = initialSpawnTimer - gameSpeed * 20; //Esto hace que aparezcan más seguido
    console.log(gameSpeed)
    if (spawnTimer < 100) {
      spawnTimer = 100;
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
      gameMusic.pause()    
      gameMusic.currentTime = 0  
      enemies = []; //Resetear enemigos
      //score = 0; //Resetear el score
      spawnTimer = initialSpawnTimer; //Velocidad original
      gameSpeed = 3; //La velocidad original
      isGameOver = true
      gameOver();
      
  }

  if (!isGameOver) e.update()
  console.log("game continues")
}

  player.animation();

  gameSpeed += 0.010; // Increase every frame hasta llegar a 60 del spawnTimer

  score ++;
  scoreText.text = "Score: " + score;
  scoreText.draw();

  if (score > highscore) {
    highscore = score;
    highscoreText.text = "Highscore: " + highscore;
  }

  //highscoreText.draw();
  if (!isGameOver) requestAnimationFrame(updateGame)
}

//startGame();

window.addEventListener("load", splash)


