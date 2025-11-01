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