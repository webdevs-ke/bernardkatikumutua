const BLACK = "#000", LIME = "#0fff09", YELLOW = "#ffff09",  WHITE = "#fff", GREEN = "#004040", RED = "#ff0000", BLUE = "#0000ff";
const TEAL = '#00bcd4';
const GOLD = '#c59607';       
const ROOM_WIDTH = 100, ROOM_HEIGHT = 100;  

(function() {
    angular.module('portfolioApp')
      .directive('puzzleCanvas', ['$window', '$timeout', function($window, $timeout) {
        return {
          restrict: 'A',
          link: function(scope, element) { 
            // --- Puzzle setup ---                    

            let glowOffset = 0;

             const size = 4;  // e.g. 4x4 grid puzzle
             const N = size * size - 1;  // N-puzzle, 4x4 becomes 15-puzzle
             const sides = ["left", "right", "up", "down"];
             const points = {m: 100000, t: 80000};
             const button_r = {x: 420, y: 420, w: 80, h: 35};
             const T_LIMIT = 60;
             
             var gameStarted = false, gameOver = false, shuffled = false;
             var grid = null;
             var adjacent = null;    // array of 4 objects(cell or null), those adjacent to empty cell.
             var emptyCell = null;
             
             var title = N + "-puzzle";
             var moves = 0;
             var startTime = null, elapsed = {h:'00', m:'00', s:'00'}, endTime = null;
             var score = "";
             
             var keyPress = "";
             var mouseX = 0, mouseY = 0;

            const canvas = element[0];
            const ctx = canvas.getContext('2d');

            // --- Resize canvas ---
            function resizeCanvas() {
              canvas.width = canvas.offsetWidth;
              canvas.height = canvas.offsetHeight;
            }
            resizeCanvas();
            angular.element($window).on('resize', resizeCanvas);  
  
            function initPuzzle() {
                var aTile = 0;
                var posY = 10;
                var rooms = [];
            
                for (var row = 0; row < size; row++) {
                    var posX = 10;    
                    var rows = [];
                    for (var col = 0; col < size; col++) {
                        rows.push (new Room (aTile, aTile, {x: posX, y: posY}));
                        posX += ROOM_WIDTH;
                        aTile++;
                    }
                    rooms.push (rows);
                    posY += ROOM_HEIGHT;
                }
                grid = new Grid (rooms);
                grid.shuffle();
                emptyCell = grid.getEmptyCell();
                resetAdjacent();
                gameStarted = true;
                shuffled = true;
                canvas.addEventListener("click", onMouseClick, false);
            }
            /* ------------------------------------------------------------------- */
            function timer () {
                if (startTime != null) {
                    var now = new Date();
                    var diff = now.getTime() - startTime.getTime(); //milliseconds
                    var s=Math.floor(diff/1000), m=0, h=0;
            
                    if (s >= T_LIMIT) 
                        m = Math.floor(s/T_LIMIT); s = s % T_LIMIT;
                    if (m >= T_LIMIT)
                        h = Math.floor(m/T_LIMIT); m = m % T_LIMIT;
            
                    if (h < 10) h = "0"+h; elapsed.h = h;
                    if (m < 10) m = "0"+m; elapsed.m = m;
                    if (s < 10) s = "0"+s; elapsed.s = s;
                }
            }
            /* ------------------------------------------------------------------- */
            function isAdjacent (dir) {
                if (dir == "left") 
                    if (emptyCell.y - 1 > -1)
                        return emptyCell.y - 1; 
                if (dir == "right")
                    if (emptyCell.y + 1 < size)
                        return emptyCell.y + 1;         
                if (dir == "up")
                    if (emptyCell.x - 1 > -1)
                        return emptyCell.x - 1;
                if (dir == "down")
                    if (emptyCell.x + 1 < size)
                        return emptyCell.x + 1;
                return null;
            }
            /* ------------------------------------------------------------------- */
            function resetAdjacent () {
                adjacent = [];
                sides.forEach (side => {
                    let axis = isAdjacent(side); //dir is a 1-digit number or null
                    if (axis == null)
                        adjacent.push(null);
                    else {
                        if (side == "left" || side == "right") 
                            adjacent.push({x: emptyCell.x, y: axis});
                        else
                            adjacent.push({x: axis, y: emptyCell.y});
                    } 
                });
            }
            /* ------------------------------------------------------------------- */
            function play () {
                timer();
                document.onkeydown = function(e) {
                    e = e ? e : window.event;
                    if (e.keyCode >= 37 && e.keyCode <= 40) {     // left, up, right, down
                        keyPress = e.code;            
                    }
                    if (!gameOver && keyPress != "") {
                        moveTile(onKeyPress());
                    }    
                };
                document.onkeyup = function(e) {
                    e = e ? e : window.event;
                    // arrow key unpress processing
                };
            }
            /* ------------------------------------------------------------------- */
            function moveTile (cell) {
                if (cell != null) {
                    let emptyRoom = grid.getRoom(emptyCell),
                        moveRoom = grid.getRoom(cell);
                    emptyRoom.occupy(moveRoom.getTile());
                    moveRoom.occupy(0);  
                    emptyCell = cell;
            
                    if (keyPress != "")
                        keyPress = "";
                    resetGame();
                }
            }
            /* ------------------------------------------------------------------- */
            function onKeyPress() {
                if (keyPress == "ArrowLeft" || keyPress == "ArrowRight") {
                    if (keyPress == "ArrowLeft") 
                        return adjacent[1];
                    return adjacent[0];
                }
                if (keyPress == "ArrowUp" || keyPress == "ArrowDown") { 
                    if (keyPress == "ArrowUp")
                        return adjacent[3];
                    return adjacent[2];
                }
                return null;
            }
            /* ------------------------------------------------------------------- */
            function onMouseClick (event) {
                mouseX = event.pageX - canvas.offsetLeft;
                mouseY = event.pageY - canvas.offsetTop;
            
                if (!gameOver) {
                    if (mouseX >= button_r.x && mouseX <= button_r.x + button_r.w &&
                        mouseY >= button_r.y && mouseY <= button_r.y + button_r.h) {
                        restartGame ();
                    } else {
                        moveTile(moveClick());
                    }
                }
            }
            /* ------------------------------------------------------------------- */
            function resetGame () {
                moves++;
                if (moves == 1) {
                    startTime = new Date();
                }            
                if (grid.solved()) {
                    endTime = new Date();
                    gameOver = true;
                    title = "You Won!";
                    return;
                }
                resetAdjacent();
            }
            /* ------------------------------------------------------------------- */
            function moveClick () {
                for (let i = 0; i < 4; i++) {
                    if (adjacent[i] != null) {
                        if (grid.getRoom(adjacent[i]).clicked(mouseX, mouseY)) {
                            return adjacent[i];
                        }
                    }
                }
                return null;
            }
            /* ------------------------------------------------------------------- */
            function endGame () {
                score = getScore();
                var now = new Date();
                var diff = now.getTime() - endTime.getTime();
                var s = Math.floor(diff/1000);
                
                if (s > 10) { // 10 seconds to savour win moment, then begin new game
                    restartGame();
                }
            }
            /* ------------------------------------------------------------------- */
            function getScore () {
                let score_t = Math.floor(points.t/((endTime.getTime() - startTime.getTime())/1000)), 
                    score_m = Math.floor(points.m/moves);
                return 150 + score_t + score_m; // minimum score is 150 for game completion
            }
            /* ------------------------------------------------------------------- */
            function restartGame () {
                gameOver = false, shuffled = false;
                startTime = null, elapsed = {h:'00', m:'00', s:'00'}, endTime = null;
                moves = 0;
                title = N + "-puzzle";
                score = "";
            }

            function update() {
                requestAnimationFrame(update);

                if (gameOver) 
                    endGame();
                else {
                    if (!shuffled)
                        initPuzzle();
                     else
                        play(); // "waiting for keypress/click/touch events"
                }
                draw(); 
            }
            
            update();

            function draw() {
                // Soft fade for trailing effect
                ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
    
                // --- Parallax glow background ---
                const gradient = ctx.createRadialGradient(
                  canvas.width / 2 + Math.sin(glowOffset / 100) * 100,
                  canvas.height / 2 + Math.cos(glowOffset / 120) * 80,
                  100,
                  canvas.width / 2,
                  canvas.height / 2,
                  canvas.width / 1.2
                );
                gradient.addColorStop(0, 'rgba(0, 188, 212, 0.15)');
                gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.08)');
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');

                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                glowOffset += 1.3;
                
                ctx.fillStyle = '#ffd7000e';
                ctx.fillRect(canvas.width/2+105, 10, 200, 280);
                // title
                ctx.strokeStyle = TEAL;
                ctx.font = "bold 24px Sans-Serif";
                ctx.textBaseline = "top";
                ctx.strokeText (title, canvas.width/2+110, 10 ); 

                ctx.setTransform(1,0,0,1,0,0);
                ctx.rotate(1.2 * Math.PI / 180);   
                ctx.strokeStyle = GOLD; 
                ctx.strokeRect(canvas.width/2+110, 22, 110, 1);
                ctx.setTransform(1,0,0,1,0,0);

                ctx.fillStyle = GOLD;
                ctx.font = "14px cursive, monospace";
                ctx.fillText ("click a tile & move", canvas.width/2+107, 50 );
                ctx.fillStyle = TEAL;
                ctx.fillText ("left, up, right, down", canvas.width/2+107, 70 );
                ctx.fillStyle = GOLD;
                ctx.fillText ("to the empty space", canvas.width/2+107, 90 );
                ctx.fillText ("or use arrow keys.", canvas.width/2+120, 110 );

                ctx.setTransform(1,0,0,1,0,0);
                ctx.rotate(-1.4 * Math.PI / 180);   
                ctx.fillStyle = gradient; 
                ctx.fillRect(canvas.width/2+101, 150, 201, 10);
                ctx.setTransform(1,0,0,1,0,0);
            
                ctx.fillStyle = TEAL;
                ctx.fillText ("-> ", canvas.width/2+120, 160 );
                ctx.fillStyle = GOLD;
                ctx.fillText ("you win once all", canvas.width/2+135, 160 );
                ctx.fillText ("the tiles are in their", canvas.width/2+107, 180 );
                ctx.fillStyle = TEAL;
                ctx.fillText ("ordered positions.", canvas.width/2+120, 200 );
                ctx.fillStyle = TEAL;
                ctx.fillText ("-> ", canvas.width/2+120, 225 );
                ctx.fillStyle = GOLD;
                ctx.fillText ("your score relies", canvas.width/2+135, 225 );
                ctx.fillText ("on game completion", canvas.width/2+107, 245 );
                ctx.fillStyle = TEAL;
                ctx.fillText ("time and moves.", canvas.width/2+120, 265 );

                ctx.strokeStyle = '#ffd7000f'; 
                ctx.strokeRect(canvas.width/2+110, 300, 125, 100);
                ctx.fillStyle = TEAL;
                ctx.fillText ("Solve this mental", canvas.width/2+115, 310 );
                ctx.fillText ("challenge as fast", canvas.width/2+115, 330 );
                ctx.fillText ("as you can!", canvas.width/2+135, 350 );
                ctx.fillStyle = GOLD; 
                ctx.fillText ("ENJOY!", canvas.width/2+145, 375 );

                ctx.strokeStyle = "#ffd7000f"; 
                ctx.strokeRect(10, 420, 390, 35);

                ctx.fillStyle = GOLD;
                ctx.font = "18px Sans-Serif";
                ctx.fillText ("Moves: " + moves, 20, 430 );
                ctx.fillText ("Time: " + elapsed.h + ":" + elapsed.m + ":" + elapsed.s, 270, 430 );

                if (score != "") {
                    ctx.fillStyle = TEAL;
                    ctx.font = "18px Sans-Serif";
                    ctx.fillText ("Score: " + score, button_r.x, button_r.y+10 );
                } else {
                    ctx.fillStyle = TEAL;
                    ctx.fillRect(button_r.x, button_r.y, button_r.w, button_r.h);
                    ctx.fillStyle = "#c59607";
                    ctx.font = "20px fantasy";
                    ctx.fillText ("RESTART", button_r.x+5, button_r.y+5);
                    //ctx.fillText ("AI SOLVE", 435, 448 );
                }

                for (let row = 0; row < size; row++) {
                    for (let col = 0; col < size; col++) {
                        ctx.save();
                        let room = grid.getRoom({x : row, y : col});
                        ctx.fillStyle = room.getColor();
                        ctx.fillRect(room.getPos().x, room.getPos().y, ROOM_WIDTH-10, ROOM_HEIGHT-10);
                        ctx.strokeStyle = room.getFont().fillStyle;
                        ctx.font = room.getFont().font_;
                        
                        ctx.textBaseline = "top";
                        if (!room.isEmpty())
                            ctx.strokeText (room.getTile(), room.getPos().x, room.getPos().y);
                        ctx.restore();
                    }
                }
              }
            
            // --- Handle resize ---
            angular.element($window).on('resize', () => {
              resizeCanvas();              
            });
          }
        };
      }]);
  })();    

/* ------------------------------------------------------------------- */
  class Room {
    constructor (myTile, aTile, pos) {
        this.pos = pos;
        this.tile = aTile;
        this.myTile = myTile;
    }

    isEmpty () {
        return this.tile == 0;
    }

    occupy (aTile) {
        this.tile = aTile;
    }

    getTile () {
        return this.tile;
    }

    getMyTile () {
        return this.myTile;
    }
    
    getPos () {
        return this.pos;
    }

    solved () {
        return this.tile == this.myTile;
    }
    
    getColor () {
        if (this.isEmpty())
            return '#ffffff00';
        if (this.solved())
            return TEAL;
        return '#0000000f';
    }
    
    getFont () {
        let fontStyle = "fantasy", fontSize = 40, color = WHITE;
        if (this.solved())
            color = BLACK;
        return {font_: fontSize + "px " + fontStyle, fillStyle: color};
    }

    clicked (mouseX, mouseY) {
        if (mouseX >= this.pos.x && mouseX <= (this.pos.x + ROOM_WIDTH) &&
            mouseY >= this.pos.y && mouseY <= (this.pos.y + ROOM_HEIGHT))
            return true;
        return false;
    }
}

/* ------------------------------------------------------------------- */
class Grid {
    constructor (rooms) {
        this.grid = rooms;
    }

    shuffle () {
        let tileList = this.getTileList();        
        for (let k = 0; k < tileList.length; k++) {
            let l = Math.floor(Math.random() * k);
            let temp = tileList[k];
            tileList[k] = tileList[l];
            tileList[l] = temp;
        }
        for (let x = 0; x < this.grid.length; x++) {
            for (let y = 0; y < this.grid.length; y++) 
                this.grid[x][y].occupy(tileList.pop())
        }
    }

    getEmptyCell () {
        for (let x = 0; x < this.grid.length; x++) {
            for (let y = 0; y < this.grid.length; y++) {
                if (this.grid[x][y].isEmpty()) 
                    return {x : x, y : y};
            }
        }
    }

    getRoom (cell) {
        return this.grid[cell.x][cell.y];
    }
    
    solved () {
        for (let x = 0; x < this.grid.length; x++) {
            for (let y = 0; y < this.grid.length; y++) {
                if (!this.grid[x][y].solved())
                    return false;
            }
        }  
        return true;      
    }

    getTileList () {
        var tileList = [];
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid.length; j++) 
                tileList.push(this.grid[i][j].getTile());
        }  
        return tileList;  
    }
}


    


    

    

    


    

          

    

    

    

//     }





//     /* ------------------------------------------------------------------- */
//     /* ------------------------------------------------------------------- */

    
        
//     }
//     /* ------------------------------------------------------------------- */
