import { createScene } from "./scene.js";

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true, { stencil: true });
const scene = createScene(engine, canvas);

engine.runRenderLoop(function () {
    scene.render();
});

window.addEventListener("resize", function () {
    engine.resize();
});