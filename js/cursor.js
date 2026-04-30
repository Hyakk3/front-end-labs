(function () {
    const style = document.createElement('style');
    style.innerHTML = `
        #cursor-label {
            position: fixed;
            top: 10px;
            left: 10px;
            font-size: 14px;
            opacity: 0.7;
            font-family: Arial, sans-serif;
            z-index: 9999;
            pointer-events: none;
            color: black;
            text-shadow: 1px 1px 2px white;
        }

        #cursor-canvas {
            position: fixed;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 9998;
        }
    `;
    document.head.appendChild(style);

    const label = document.createElement('div');
    label.id = "cursor-label";
    label.innerText = "Efeito: rainbow (clique para trocar)";
    document.body.appendChild(label);

    const canvas = document.createElement('canvas');
    canvas.id = "cursor-canvas";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let mouse = { x: 0, y: 0 };
    let effectIndex = 0;

    document.addEventListener("mousemove", e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    document.addEventListener("click", () => {
        effectIndex = (effectIndex + 1) % effects.length;
        label.innerText = "Efeito: " + effects[effectIndex].name + " (clique para trocar)";
        particles = [];
    });

    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    let particles = [];

    function randomColor() {
        return `hsl(${Math.random() * 360},100%,60%)`;
    }

    const effects = [
        {
            name: "rainbow",
            update() {
                particles.push({
                    x: mouse.x,
                    y: mouse.y,
                    color: randomColor(),
                    size: 4,
                    life: 60
                });

                particles.forEach(p => {
                    p.life--;
                    p.size *= 0.95;
                });

                particles = particles.filter(p => p.life > 0);
            },
            draw() {
                particles.forEach(p => {
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                });
            }
        },

        {
            name: "fairy",
            update() {
                particles.push({
                    x: mouse.x + (Math.random() - 0.5) * 10,
                    y: mouse.y + (Math.random() - 0.5) * 10,
                    size: Math.random() * 3 + 1,
                    life: 40
                });

                particles.forEach(p => {
                    p.y -= 0.5;
                    p.life--;
                });

                particles = particles.filter(p => p.life > 0);
            },
            draw() {
                ctx.fillStyle = "gray"; 
                particles.forEach(p => {
                    ctx.fillRect(p.x, p.y, p.size, p.size);
                });
            }
        },

        {
            name: "ghost",
            update() {
                particles.push({
                    x: mouse.x,
                    y: mouse.y,
                    size: 20,
                    life: 50
                });

                particles.forEach(p => p.life--);
                particles = particles.filter(p => p.life > 0);
            },
            draw() {
                particles.forEach(p => {
                    ctx.globalAlpha = p.life / 50;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = "gray"; 
                    ctx.fill();
                    ctx.globalAlpha = 1;
                });
            }
        },

        {
            name: "emoji",
            update() {
                particles.push({
                    x: mouse.x,
                    y: mouse.y,
                    emoji: ["🔥", "💀", "😎", "✨"][Math.floor(Math.random() * 4)],
                    life: 60
                });

                particles.forEach(p => {
                    p.y -= 1;
                    p.life--;
                });

                particles = particles.filter(p => p.life > 0);
            },
            draw() {
                ctx.font = "20px Arial";
                particles.forEach(p => {
                    ctx.fillText(p.emoji, p.x, p.y);
                });
            }
        },

        {
            name: "bubbles",
            update() {
                particles.push({
                    x: mouse.x,
                    y: mouse.y,
                    size: Math.random() * 10 + 5,
                    life: 80
                });

                particles.forEach(p => {
                    p.y -= 1;
                    p.life--;
                });

                particles = particles.filter(p => p.life > 0);
            },
            draw() {
                ctx.strokeStyle = "cyan";
                particles.forEach(p => {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.stroke();
                });
            }
        }
    ];

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const effect = effects[effectIndex];
        effect.update();
        effect.draw();

        requestAnimationFrame(animate);
    }

    animate();
})();
