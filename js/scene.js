async function getInitializedHavok() {
  return await HavokPhysics();
}

import { createCamera, createFPSCamera } from "./camera.js";
import { createLight } from "./light.js";
import { createBox, createGround, makeBoxMovable } from "./objects.js";
import { setupAnimation } from "./animation.js";
import { setupCameraControls, setupControls } from "./controls.js";
import { initAudio } from "./sound.js";

export async function createScene(engine, canvas) {
    const scene = new BABYLON.Scene(engine);
    scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
    scene.applyGravity = true;
    scene.collisionsEnabled = true;
    const havokInstance = await HavokPhysics();
    const physicsPlugin = new BABYLON.HavokPlugin(true, havokInstance);
    scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), physicsPlugin);

    // pointer lock
    canvas.addEventListener("click", () => {
        canvas.requestPointerLock();
    });

    const camera = createFPSCamera(canvas, scene, engine);
    const light = createLight(scene);
    const box1 = createBox(scene, new BABYLON.Vector3(1, 2, 1), new BABYLON.Vector3(0, 1, 0));
    const box2 = createBox(scene, new BABYLON.Vector3(1, 2, 1), new BABYLON.Vector3(-2, 1, 0));
    const box3 = createBox(scene, new BABYLON.Vector3(1, 2, 1), new BABYLON.Vector3(2, 1, 0));
    const ground = createGround(scene);

    const h1 = new BABYLON.HighlightLayer("h1", scene);
    setupCameraControls(scene, camera, h1);

    //initAudio();
    /**setupAnimation(box1);
    setupAnimation(box2);
    setupAnimation(box3);
    setupControls(scene, box1);
    setupControls(scene, box2);
    setupControls(scene, box3);*/

    let y = 3
    window.addEventListener("keypress", (e) => { 
        if (e.key == "n") {
            const newBox = createBox(scene, new BABYLON.Vector3(1, 1, 1), new BABYLON.Vector3(0, y, 0));
            y += 3;
            console.log("yop");
        }
        
    });
    
    return scene;
}