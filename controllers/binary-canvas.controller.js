
(function() {
    angular.module('portfolioApp')
      .directive('heroCanvas', ['$window', '$timeout', function($window, $timeout) {
        return {
          restrict: 'A',
          link: function(scope, element) {
            const canvas = element[0];
            const ctx = canvas.getContext('2d');
  
            // --- Resize canvas ---
            function resizeCanvas() {
              canvas.width = canvas.offsetWidth;
              canvas.height = canvas.offsetHeight;
            }
            resizeCanvas();
            angular.element($window).on('resize', resizeCanvas);
  
            // --- Binary code setup ---
            const binary = '01';
            const fontSize = 14;
            let columns, drops;
            let particles = [];
  
            function initMatrix() {
              columns = Math.floor(canvas.width / fontSize);
              drops = Array(columns).fill(1);
              particles = [];

              for (let i = 0; i < 300; i++) {
                particles.push({
                  x: Math.random() * canvas.width,
                  y: Math.random() * canvas.height,
                  vy: 2 + Math.random() * 4,
                });
              }
            }
            initMatrix();
  
            const teal = '#00bcd4';
            const gold = '#ffd700';
            let glowOffset = 0;
            let waveTime = 0;
            // Spark tracker
            const sparks = [];
  
            let formingName = false;
            let namePixels = [];
            let nameAlpha = 0;
            let fadeDirection = 1; // 1 = fade in, -1 = fade out

            // === Draw Names as Binary Dots ===
            const names = ["BEN KATIKU M", "FULLSTACK DEV", "JavaScript", "Node.js", "Angular",  "BEN KATIKU M","Python", "PHP", "SQL"];
            let nameIndex = 0;

            function drawNamePattern(nameText) {
                const tempCanvas = document.createElement('canvas');
                const tempCtx = tempCanvas.getContext('2d');
                tempCanvas.width = canvas.width;
                tempCanvas.height = canvas.height;
    
                tempCtx.font = "bold 64px monospace";
                tempCtx.fillStyle = "#fff";
                const textWidth = tempCtx.measureText(nameText).width;
                tempCtx.fillText(nameText, (canvas.width - textWidth) / 2, canvas.height / 2);
    
                const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
                namePixels = [];
                for (let y = 0; y < imageData.height; y += 6) {
                  for (let x = 0; x < imageData.width; x += 6) {
                    const index = (y * imageData.width + x) * 4;
                    if (imageData.data[index + 3] > 128) {
                      namePixels.push({ x, y });
                    }
                  }
                }
              }

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
  
              // --- Binary rain ---
              ctx.font = `${fontSize}px monospace`;
              
              if (!formingName) {
                for (let i = 0; i < drops.length; i++) {
                    const text = binary.charAt(Math.floor(Math.random() * binary.length));
      
                    // Slow horizontal wave drift
                    const waveY = drops[i] * fontSize + Math.sin(i / 3 + waveTime / 20) * 3;
      
                    ctx.fillStyle = Math.random() < 0.5 ? teal : gold;
                    ctx.fillText(text, i * fontSize, waveY);
      
                    // Reset drop randomly
                    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                      drops[i] = 0;
                    }
                    drops[i]++;
                }
                // --- Random sparks (glowing binary flashes) ---
                if (Math.random() < 0.03) { // 3% chance each frame
                    sparks.push({
                    x: Math.floor(Math.random() * columns) * fontSize,
                    y: Math.floor(Math.random() * canvas.height / fontSize) * fontSize,
                    life: 20,
                    });
                }
                // Draw sparks
                for (let i = sparks.length - 1; i >= 0; i--) {
                    const s = sparks[i];
                    const brightness = s.life / 20;
                    ctx.fillStyle = `rgba(255, 215, 0, ${brightness})`;
                    ctx.fillText('1', s.x, s.y);
                    s.life -= 1;

                    if (s.life <= 0) sparks.splice(i, 1);
                }
              } else {
                    // reset name in names array to draw next name iteration
                    if (nameIndex == names.length) {
                      nameIndex = 0;  // reached end of array, restart
                    }
                    drawNamePattern(names[nameIndex]);  // get namePixels imageData for this name
                    // Particles drift toward name pixels
                    namePixels.forEach((p, i) => {
                      if (!particles[i]) return;
                        const part = particles[i];
                        const dx = p.x - part.x;
                        const dy = p.y - part.y;
                        part.x += dx * 0.05;
                        part.y += dy * 0.05;
                        ctx.fillStyle = `rgba(255, 215, 0, ${0.3 + nameAlpha})`;
                        ctx.fillText(Math.random() > 0.5 ? '1' : '0', part.x, part.y);
                      });
                    // === Form Name Using Binary Dots ===
                    
                    // Smooth fade transition
                    // Fade logic
                    nameAlpha += 0.02 * fadeDirection;
                    if (nameAlpha >= 1) {
                      fadeDirection = 0;
                      $timeout(() => { fadeDirection = -1; }, 5000); // visible for 5 seconds
                    }
                    if (nameAlpha <= 0 && fadeDirection === -1) {
                      formingName = false;
                      fadeDirection = 1;
                      initMatrix();
                    }                
                }
                glowOffset += 1.3;
                waveTime += 1.3;               
                requestAnimationFrame(draw);
            }
  
            draw();
  
            // === Cycle Between Rain and Name ===
            function cycleName() {
                formingName = true;
                nameAlpha = 0;
                fadeDirection = 1;
                nameIndex++;
                $timeout(cycleName, 15000); // repeat every 15s
            }

            $timeout(cycleName, 5000); // start after 5s

            // --- Handle resize ---
            angular.element($window).on('resize', () => {
              resizeCanvas();
              initMatrix();
              drawNamePattern(names[nameIndex]);
            });
          }
        };
      }]);
  })();
  
 
  // N-puzzle in JS
// katikumut@gmail.com

// const ROOM_WIDTH = 100, ROOM_HEIGHT = 100;
//     const BLACK = "#000", LIME = "#0fff09", YELLOW = "#ffff09", 
//             WHITE = "#fff", GREEN = "#004040", RED = "#ff0000", 
//             BLUE = "#0000ff";
//     const size = 4;  // e.g. 3x3 grid puzzle
//     const N = size * size - 1;  // N-puzzle, 3x3 becomes 8-puzzle
//     const sides = ["left", "right", "up", "down"];
//     const points = {m: 100000, t: 80000};
//     const button_r = {x: 420, y: 520, w: 80, h: 35};
//     const T_LIMIT = 60;
    
//     var gameStarted = false, gameOver = false, shuffled = false;
//     var grid = null;
//     var adjacent = null;    // array of 4 objects(cell or null), those adjacent to empty cell.
//     var emptyCell = null;
    
//     var title = N + "-puzzle";
//     var moves = 0;
//     var startTime = null, elapsed = {h:'00', m:'00', s:'00'}, endTime = null;
//     var score = "";
    
//     const canvas = document.getElementById("heroCanvas");
//     const ctx = canvas.getContext("2d");
    
//     var keyPress = "";
//     var mouseX = 0, mouseY = 0;
    
//     /* ------------------------------------------------------------------- */
//     window.addEventListener("load", loadHandler, false);
//     /* ------------------------------------------------------------------- */
//     function loadHandler () {
//         update();
//     }
//     /* ------------------------------------------------------------------- */
//     function update () {
//         requestAnimationFrame(update, canvas);
//         if (gameOver) 
//             endGame();
//         else {
//             if (!shuffled)
//                 createPuzzle();
//             else
//                 play(); // "waiting for keypress/click/touch events"
//         }
//         render();
//     }
//     /* --------------------------------------------------------------- */
//     function createPuzzle () {
//         var aTile = 0;
//         var posY = 10;
//         var rooms = [];
    
//         for (var row = 0; row < size; row++) {
//             var posX = 10;    
//             var rows = [];
//             for (var col = 0; col < size; col++) {
//                 rows.push (new Room (aTile, aTile, {x: posX, y: posY}));
//                 posX += ROOM_WIDTH;
//                 aTile++;
//             }
//             rooms.push (rows);
//             posY += ROOM_HEIGHT;
//         }
//         grid = new Grid (rooms);
//         grid.shuffle();
//         emptyCell = grid.getEmptyCell();
//         resetAdjacent();
//         gameStarted = true;
//         shuffled = true;
//         canvas.addEventListener("click", onMouseClick, false);
//     }
//     /* ------------------------------------------------------------------- */
//     function play () {
//         timer();
//         document.onkeydown = function(e) {
//             e = e ? e : window.event;
//             if (e.keyCode >= 37 && e.keyCode <= 40) {     // left, up, right, down
//                 keyPress = e.code;            
//             }
//             if (!gameOver && keyPress != "") {
//                 moveTile(onKeyPress());
//             }    
//         };
//         document.onkeyup = function(e) {
//             e = e ? e : window.event;
//             // arrow key unpress processing
//         };
//     }
//     /* ------------------------------------------------------------------- */
//     function timer () {
//         if (startTime != null) {
//             var now = new Date();
//             var diff = now.getTime() - startTime.getTime(); //milliseconds
//             var s=Math.floor(diff/1000), m=0, h=0;
    
//             if (s >= T_LIMIT) 
//                 m = Math.floor(s/T_LIMIT); s = s % T_LIMIT;
//             if (m >= T_LIMIT)
//                 h = Math.floor(m/T_LIMIT); m = m % T_LIMIT;
    
//             if (h < 10) h = "0"+h; elapsed.h = h;
//             if (m < 10) m = "0"+m; elapsed.m = m;
//             if (s < 10) s = "0"+s; elapsed.s = s;
//         }
//     }
//     /* ------------------------------------------------------------------- */
//     function moveTile (cell) {
//         if (cell != null) {
//             let emptyRoom = grid.getRoom(emptyCell),
//                 moveRoom = grid.getRoom(cell);
//             emptyRoom.occupy(moveRoom.getTile());
//             moveRoom.occupy(0);  
//             emptyCell = cell;
    
//             if (keyPress != "")
//                 keyPress = "";
//             resetGame();
//         }
//     }
//     /* ------------------------------------------------------------------- */
//     function onKeyPress() {
//         if (keyPress == "ArrowLeft" || keyPress == "ArrowRight") {
//             if (keyPress == "ArrowLeft") 
//                 return adjacent[1];
//             return adjacent[0];
//         }
//         if (keyPress == "ArrowUp" || keyPress == "ArrowDown") { 
//             if (keyPress == "ArrowUp")
//                 return adjacent[3];
//             return adjacent[2];
//         }
//         return null;
//     }
//     /* ------------------------------------------------------------------- */
//     function onMouseClick (event) {
//         mouseX = event.pageX - canvas.offsetLeft;
//         mouseY = event.pageY - canvas.offsetTop;
    
//         if (!gameOver) {
//             if (mouseX >= button_r.x && mouseX <= button_r.x + button_r.w &&
//                 mouseY >= button_r.y && mouseY <= button_r.y + button_r.h) {
//                 restartGame ();
//             } else {
//                 moveTile(moveClick());
//             }
//         }
//     }
//     /* ------------------------------------------------------------------- */
//     function moveClick () {
//         for (let i = 0; i < 4; i++) {
//             if (adjacent[i] != null) {
//                 if (grid.getRoom(adjacent[i]).clicked(mouseX, mouseY)) {
//                     return adjacent[i];
//                 }
//             }
//         }
//         return null;
//     }
//     /* ------------------------------------------------------------------- */
//     function render () {
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         // background
//         ctx.fillStyle = GREEN;
//         ctx.fillRect(0, 0, canvas.width - 50, canvas.height - 100);
    
//         ctx.fillStyle = YELLOW;
//         ctx.fillRect(canvas.width/2+105, 10, 140, 280);
//         // title
//         ctx.strokeStyle = GREEN;
//         ctx.font = "bold 24px Sans-Serif";
//         ctx.textBaseline = "top";
//         ctx.strokeText (title, canvas.width/2+110, 10 ); 
    
//         ctx.setTransform(1,0,0,1,0,0);
//         ctx.rotate(1.2 * Math.PI / 180);   
//         ctx.strokeStyle = LIME; 
//         ctx.strokeRect(canvas.width/2+110, 22, 110, 1);
//         ctx.setTransform(1,0,0,1,0,0);
    
//         ctx.fillStyle = GREEN;
//         ctx.font = "14px cursive, monospace";
//         ctx.fillText ("click a tile & move", canvas.width/2+107, 50 );
//         ctx.fillStyle = LIME;
//         ctx.fillText ("left, up, right, down", canvas.width/2+107, 70 );
//         ctx.fillStyle = GREEN;
//         ctx.fillText ("to the empty space", canvas.width/2+107, 90 );
//         ctx.fillText ("or use arrow keys.", canvas.width/2+120, 110 );
    
//         ctx.setTransform(1,0,0,1,0,0);
//         ctx.rotate(-1.4 * Math.PI / 180);   
//         ctx.fillStyle = GREEN; 
//         ctx.fillRect(canvas.width/2+95, 150, 150, 10);
//         ctx.setTransform(1,0,0,1,0,0);
    
//         ctx.fillStyle = RED;
//         ctx.fillText ("-> ", canvas.width/2+120, 160 );
//         ctx.fillStyle = GREEN;
//         ctx.fillText ("you win once all", canvas.width/2+135, 160 );
//         ctx.fillText ("the tiles are in their", canvas.width/2+107, 180 );
//         ctx.fillStyle = LIME;
//         ctx.fillText ("ordered positions.", canvas.width/2+120, 200 );
//         ctx.fillStyle = RED;
//         ctx.fillText ("-> ", canvas.width/2+120, 225 );
//         ctx.fillStyle = GREEN;
//         ctx.fillText ("your score relies", canvas.width/2+135, 225 );
//         ctx.fillText ("on game completion", canvas.width/2+107, 245 );
//         ctx.fillStyle = LIME;
//         ctx.fillText ("time and moves.", canvas.width/2+120, 265 );
    
//         ctx.strokeStyle = LIME; 
//         ctx.strokeRect(canvas.width/2+110, 300, 125, 100);
//         ctx.fillStyle = WHITE;
//         ctx.fillText ("Solve this mental", canvas.width/2+115, 310 );
//         ctx.fillText ("challenge as fast", canvas.width/2+115, 330 );
//         ctx.fillText ("as you can!", canvas.width/2+135, 350 );
//         ctx.fillStyle = YELLOW; 
//         ctx.fillText ("ENJOY!", canvas.width/2+145, 375 );
          
//         ctx.strokeStyle = LIME; 
//         ctx.strokeRect(10, 520, 400, 35);
    
//         ctx.fillStyle = YELLOW;
//         ctx.font = "18px Sans-Serif";
//         ctx.fillText ("Moves: " + moves, 20, 530 );
//         ctx.fillText ("Time: " + elapsed.h + ":" + elapsed.m + ":" + elapsed.s, 280, 530 );
    
//         if (score != "") {
//             ctx.fillStyle = LIME;
//             ctx.font = "18px Sans-Serif";
//             ctx.fillText ("Score: " + score, button_r.x, button_r.y+10 );
//         } else {
//             ctx.fillStyle = LIME;
//             ctx.fillRect(button_r.x, button_r.y, button_r.w, button_r.h);
//             ctx.fillStyle = GREEN;
//             ctx.font = "20px fantasy";
//             ctx.fillText ("RESTART", button_r.x+5, button_r.y+5);
//             //ctx.fillText ("AI SOLVE", 435, 448 );
//         }
    
//         for (let row = 0; row < size; row++) {
//             for (let col = 0; col < size; col++) {
//                 ctx.save();
//                 let room = grid.getRoom({x : row, y : col});
//                 ctx.fillStyle = room.getColor();
//                 ctx.fillRect(room.getPos().x, room.getPos().y, ROOM_WIDTH-10, ROOM_HEIGHT-10);
//                 ctx.strokeStyle = room.getFont().fillStyle;
//                 ctx.font = room.getFont().font_;
                
//                 ctx.textBaseline = "top";
//                 if (!room.isEmpty())
//                     ctx.strokeText (room.getTile(), room.getPos().x, room.getPos().y);
//                 ctx.restore();
//             }
//         }
//     }
//     /* ------------------------------------------------------------------- */
//     function resetGame () {
//         moves++;
//         if (moves == 1) {
//             startTime = new Date();
//         }            
//         if (grid.solved()) {
//             endTime = new Date();
//             gameOver = true;
//             title = "You Won!";
//             return;
//         }
//         resetAdjacent();
//     }
//     /* ------------------------------------------------------------------- */
//     function resetAdjacent () {
//         adjacent = [];
//         sides.forEach (side => {
//             let axis = isAdjacent(side); //dir is a 1-digit number or null
//             if (axis == null)
//                 adjacent.push(null);
//             else {
//                 if (side == "left" || side == "right") 
//                     adjacent.push({x: emptyCell.x, y: axis});
//                 else
//                     adjacent.push({x: axis, y: emptyCell.y});
//             } 
//         });
//     }
//     /* ------------------------------------------------------------------- */
//     function isAdjacent (dir) {
//         if (dir == "left") 
//             if (emptyCell.y - 1 > -1)
//                 return emptyCell.y - 1; 
//         if (dir == "right")
//             if (emptyCell.y + 1 < size)
//                 return emptyCell.y + 1;         
//         if (dir == "up")
//             if (emptyCell.x - 1 > -1)
//                 return emptyCell.x - 1;
//         if (dir == "down")
//             if (emptyCell.x + 1 < size)
//                 return emptyCell.x + 1;
//         return null;
//     }
//     /* ------------------------------------------------------------------- */
//     function endGame () {
//         score = getScore();
//         var now = new Date();
//         var diff = now.getTime() - endTime.getTime();
//         var s = Math.floor(diff/1000);
        
//         if (s > 10) { // 10 seconds to savour win moment, then begin new game
//             restartGame();
//         }
//     }
//     /* ------------------------------------------------------------------- */
//     function getScore () {
//         let score_t = Math.floor(points.t/((endTime.getTime() - startTime.getTime())/1000)), 
//             score_m = Math.floor(points.m/moves);
//         return 150 + score_t + score_m; // minimum score is 150 for game completion
//     }
//     /* ------------------------------------------------------------------- */
//     function restartGame () {
//         gameOver = false, shuffled = false;
//         startTime = null, elapsed = {h:'00', m:'00', s:'00'}, endTime = null;
//         moves = 0;
//         title = N + "-puzzle";
//         score = "";
//     }
//     /* ------------------------------------------------------------------- */
//     /* ------------------------------------------------------------------- */
//     class Room {
//         constructor (myTile, aTile, pos) {
//             this.pos = pos;
//             this.tile = aTile;
//             this.myTile = myTile;
//         }
    
//         isEmpty () {
//             return this.tile == 0;
//         }
    
//         occupy (aTile) {
//             this.tile = aTile;
//         }
    
//         getTile () {
//             return this.tile;
//         }
    
//         getMyTile () {
//             return this.myTile;
//         }
        
//         getPos () {
//             return this.pos;
//         }
    
//         solved () {
//             return this.tile == this.myTile;
//         }
        
//         getColor () {
//             if (this.isEmpty())
//                 return GREEN;
//             if (this.solved())
//                 return LIME;
//             return BLACK;
//         }
        
//         getFont () {
//             let fontStyle = "fantasy", fontSize = 40, color = WHITE;
//             if (this.solved())
//                 color = BLACK;
//             return {font_: fontSize + "px " + fontStyle, fillStyle: color};
//         }
    
//         clicked (mouseX, mouseY) {
//             if (mouseX >= this.pos.x && mouseX <= (this.pos.x + ROOM_WIDTH) &&
//                 mouseY >= this.pos.y && mouseY <= (this.pos.y + ROOM_HEIGHT))
//                 return true;
//             return false;
//         }
//     }
//     /* ------------------------------------------------------------------- */
//     class Grid {
//         constructor (rooms) {
//             this.grid = rooms;
//         }
    
//         shuffle () {
//             let tileList = this.getTileList();        
//             for (let k = 0; k < tileList.length; k++) {
//                 let l = Math.floor(Math.random() * k);
//                 let temp = tileList[k];
//                 tileList[k] = tileList[l];
//                 tileList[l] = temp;
//             }
//             for (let x = 0; x < this.grid.length; x++) {
//                 for (let y = 0; y < this.grid.length; y++) 
//                     this.grid[x][y].occupy(tileList.pop())
//             }
//         }
    
//         getEmptyCell () {
//             for (let x = 0; x < this.grid.length; x++) {
//                 for (let y = 0; y < this.grid.length; y++) {
//                     if (this.grid[x][y].isEmpty()) 
//                         return {x : x, y : y};
//                 }
//             }
//         }
    
//         getRoom (cell) {
//             return this.grid[cell.x][cell.y];
//         }
        
//         solved () {
//             for (let x = 0; x < this.grid.length; x++) {
//                 for (let y = 0; y < this.grid.length; y++) {
//                     if (!this.grid[x][y].solved())
//                         return false;
//                 }
//             }  
//             return true;      
//         }
    
//         getTileList () {
//             var tileList = [];
//             for (let i = 0; i < this.grid.length; i++) {
//                 for (let j = 0; j < this.grid.length; j++) 
//                     tileList.push(this.grid[i][j].getTile());
//             }  
//             return tileList;  
//         }
//     }