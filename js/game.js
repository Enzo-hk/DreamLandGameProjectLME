import { createScene } from "./scene.js";

let gameStarted = false;
const startButton = document.getElementById("startGame");
startButton.addEventListener("click", startGame)
window.addEventListener("keypress", (e) => {
    if (e.key == "Enter" && !gameStarted) {
        startGame();
        gameStarted = true;
    }
})

function launchGame() {
    const canvas = document.getElementById("renderCanvas");
    const engine = new BABYLON.Engine(canvas, true);
    const scene = createScene(engine, canvas);

    engine.runRenderLoop(function () {
        scene.render();
    });

    window.addEventListener("resize", function () {
        engine.resize();
    });
}

function startGame() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('renderCanvas').style.display = 'block';
    document.getElementById('bg').style.display = 'none';
    launchGame();
}
  