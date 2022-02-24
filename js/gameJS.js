//VARIABLES GLOBALES DECLARADAS  
var myGamePiece;
var myScore;
var myGame; //variable de la clase juego
var button;
var interval;


// 
class Game {
    constructor() { // INICIMOS LAS PROPIEDADES DE LA CLASE GAME
        button = document.getElementsByTagName("button")[0];
        this.myObstacles = []; // ARRAY DE COMPONENTES QUE SON PINTADOS COMO OBSTACCULOS
        this.canvas = document.createElement("canvas"); // CREAMOS EL CANVAS
        this.canvas.width = 640;
        this.canvas.height = 487;
        document.body.insertBefore(this.canvas, document.body.lastChild); // AÑADIMOS CANVAS AL HTML
        this.context = this.canvas.getContext("2d"); // CONTEXTO DEL LIEZO
        this.frameNo = 0; //VARIABLE DONDE GUARDAMOS EL NUMERO DE FRAME
        this.pause = false; // PROPIEDAD PARA SABER SI EL JUEGO ESTA PAUSADO 
    }
    onHold() { // CREA EL MENSAJE DE ESPERA ANTES DE DARLE AL BOTON START
        this.clear(); // LLAMAMOS FUNCION CLEAR
        this.context.font = "55px Monospaced";
        this.context.fillStyle = "black";
        var titulo = "FLAPPY SQUARE";
        this.context.fillText(titulo, this.canvas.width / 2 - titulo.length * 36 / 2, this.canvas.height / 2);
        button.onclick = this.start; // AÑADIMOS AL BOTON LA FUNCION START
    }
    start() { //INICIA JUEGO 
        button.disabled = true; // DESACTIVAMOS BOTON
        myGamePiece = new component(30, 30, "#00615f", 10, 120); // CREAMOS EL COMPONENTE QUE MANEJA EL JUGADOR
        myScore = new component("30px", "Consolas", "black", 280, 40, "text"); // CREAMOS EL COMPONENTEDE LA PUNTUACION
        interval = setInterval(updateGameArea, 20); // LLAMAMOS REPETIDAS VECES AL METODO updateGameArea() PARA ACTUALIZAR LA POSICION TANTO DEL COMPONENTE DE JUGADOR COMO LOS OBSTACULOS
    }
    stop() { // PARA EL JUEGO
        clearInterval(interval); //DEJAMOS DE LLAMAR AL METODO updateGameArea()
        this.pause = true; // PONEMOS LA PROPIEDAD EN PAUSE 
    }
    clear() { //BORRA EL CONTENIDO DEL CANVAS
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function startGame() { // FUNCION LLAMADA AL CARGAR LA PAGIN
    myGame = new Game(); //CREA LA CLASE JUEGO
    myGame.onHold(); // Y LLAMAMOS A LA FUNCION DE LA PANTALLA DE ESPERAS
}

function restartGame() { // LLAMAMOS A LA FUNCION QUE REINICIA EL JUEGO 
    document.body.getElementsByTagName("canvas")[0].remove() //BORRAMOS EL CANVAS
    myGame = new Game(); //CREAMOS DE NUEVO LA CLASE GAME
    myGame.start(); // INICIAMOS JUEGO
}

class component {
    constructor(width, height, color, x, y, type) { // INICIMOS LAS PROPIEDADES DE LA CLASE COMPONENTE
        this.type = type; // PUEDE SER DE TIPO TEXTO U OTROS TIPOS INDETERMINADOS
        this.score = 0;
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;
        this.x = x;
        this.y = y;
        this.gravity = 0;
        this.gravitySpeed = 0;
        this.update = function() { // ACTUALIZAR LA POCISION DE LOS COMPONENTES DENTRO DEL LIENZO
            var ctx = myGame.context;
            if (this.type == "text") {
                ctx.font = this.width + " " + this.height;
                ctx.fillStyle = color;
                ctx.fillText(this.text, this.x, this.y); // PINTA LA NUEVA PUNTUACION
            } else {
                ctx.fillStyle = color;
                ctx.fillRect(this.x, this.y, this.width, this.height); // PINTA EL COMPONENTE(OBTACULO, CUADRADO)
            }
        };

        this.crashWith = function(otherobj) { // COMPRUEBA SI EL COMPONENTE "CUADRADO" QUE USA EL JUGADOR Y EL PASADO POR PARAMETRO ESTAN COLICIONAN
            //POSICION "CUADRADO" + SU ALTO Y ANCHO
            var myleft = this.x; // X
            var myright = this.x + (this.width); // X + ANCHO 
            var mytop = this.y; // Y
            var mybottom = this.y + (this.height); // Y + ALTO
            //POSICION OBSTACULO + SU ALTO Y ANCHO
            var otherleft = otherobj.x; // X
            var otherright = otherobj.x + (otherobj.width); //  X + ANCHO 
            var othertop = otherobj.y; // Y
            var otherbottom = otherobj.y + (otherobj.height); // Y + ALTO

            var crash = true;
            //COMPROBACION DE SI LOS COMPONENTES CHOCAN
            if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
                crash = false;
            }
            return crash;
        };
    }
}

function everyinterval(n) { //SE LLAMA PARA EN UN INTERVALO DE TIEMPO INSERTAR UN OBSTACULO
    if ((myGame.frameNo / n) % 1 == 0) { return true; }
    return false;
}

// FUNCIONQUE COMPRUEBA SI SE SE HA COLISIONADO O NO Y SE ACTUALIZAR TODAS LAS POSICIONES DE LOS COMPONENTE
function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myGame.myObstacles.length; i += 1) { // RECORRE TODO LOS OBSTACULOS Y COMPRUEBA SI SE HA COLISIONADO CON ALGUNO
        if (myGamePiece.crashWith(myGame.myObstacles[i])) {
            myGame.stop(); // PARA JUEGO
            dead.play(); // SONIDO DE MUERTE DEL JUGADOR
            button.disabled = false; // PONE EL BOTOS EN DISPONIBLE
            button.innerHTML = "Restart";
            button.onclick = restartGame;
            return;
        }
    }
    if (myGame.pause == false) { // SI EL JUEGO NO ESTA PAUDADO BORRAMOS Y ACTULIZAMOS LA POSICION DE TODOS LOS COMPONENTES
        myGame.clear(); //LLAMAMO A LA FUNCION CLEAR Y BORRAMOS EL CONTENIDO 
        myGame.frameNo += 1;
        myScore.score += 1;
        if (myGame.frameNo == 1 || everyinterval(150)) {
            x = myGame.canvas.width;
            y = myGame.canvas.height - 100;
            minHeight = 20;
            maxHeight = 200;
            height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
            minGap = 50;
            maxGap = 200;
            gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
            myGame.myObstacles.push(new component(18, height, "#00b551", x, 0));
            myGame.myObstacles.push(new component(18, x - height - gap, "#00b551", x, height + gap));
        }
        for (i = 0; i < myGame.myObstacles.length; i += 1) { // RECORREMOS TODOS LOS OBSTACULOS Y LE SUMAMOS 1 AL EJE X DEL OBSTACULO
            myGame.myObstacles[i].x += -1;
            myGame.myObstacles[i].update(); // ACTUALIZA CON LAS NUEVAS POSICION
        }
        myScore.text = "SCORE: " + myScore.score;
        myScore.update(); // ACTUALIZA LA PUNTUACION

        updatePosition(myGamePiece, myGame.canvas);
        myGamePiece.update(); // ACTUALIZA CON LAS NUEVAS POSICION
    }
}

// FUNCION A LA QUE SE LE LLAMA PARA ACTULIZAR LA POSICION DEL "CUADRADO" QUE MUEVE EL JUGADOR 
// COMPROBANDO QUE NO SE SALGA DEL TAMAÑO DEL CANVAS
function updatePosition(piece, canvas) {
    if (piece.x >= 0) { // COMPROBAMOS Y ACTUALIZAMOS EJE X  
        var limitX = canvas.width - piece.width;
        if (piece.x <= limitX) {
            piece.x += piece.speedX;
        } else {
            piece.x = limitX;
        }
    } else {
        piece.x = 0;
    }

    if (piece.y >= 0) { // COMPROBAMOS Y ACTUALIZAMOS EJE Y 
        var limitY = canvas.height - piece.height;
        if (piece.y <= limitY) {
            piece.y += piece.speedY;
        } else {
            piece.y = limitY;
        }
    } else {
        piece.y = 0;
    }
}

// SONIDOS DEL JUEGO
let dead = new Audio();
let up = new Audio();
let right = new Audio();
let left = new Audio();
let down = new Audio();
dead.src = "audio/dead.mp3"; // CUANDO MUERE
up.src = "audio/up.mp3"; // BOTON ARRIBA
right.src = "audio/right.mp3"; // BOTON DERECHA
left.src = "audio/left.mp3"; // BOTON IZQUIERDA
down.src = "audio/down.mp3"; // BOTON ABAJO
document.addEventListener("keydown", keyPress); //REGISTRA UN EVENTO QUE SE PRODUCE AL PULSAR UNA TECLA

function keyPress(event) { //TECLAS
    if (myGame.pause === true) return;
    let key = event.keyCode;
    if (key == 37) { //LEFT
        myGamePiece.speedX = -1;
        left.play();
    } else if (key == 38) { //UP
        myGamePiece.speedY = -1;
        up.play();
    } else if (key == 39) { //RIGHT
        myGamePiece.speedX = 1;
        right.play();
    } else if (key == 40) { //DOWN
        myGamePiece.speedY = 1;
        down.play();
    }
}