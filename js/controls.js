import { jump } from "./camera/camera.js";

export function setupControls(scene, box) {
    let keys = {};
    let targetX = box.position.x; // Target X position
    let targetY = box.position.y; // Target Y position
    let targetZ = box.position.z; // Target Z position

    scene.onBeforeRenderObservable.add(() => {
        box.position.x = BABYLON.Scalar.Lerp(box.position.x, targetX, 0.05);
        box.position.y = BABYLON.Scalar.Lerp(box.position.y, targetY, 0.05);
        box.position.z = BABYLON.Scalar.Lerp(box.position.z, targetZ, 0.05);
    });

    function handleKeyDown(e) {
        keys[e.key] = true;
    }
    function handleKeyUp(e) { 
        keys[e.key] = false; 
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    // for animating:
    window.addEventListener("keypress", (e) => { 
        if (keys["a"]) scene.beginAnimation(box, 0, 60, true); 
        if (keys["e"]) scene.beginAnimation(box, 0, 0, false); 
    });
    // for jumping
    // for moving:
    window.addEventListener("keypress", (e) => { 
        if (keys["a"]) scene.beginAnimation(box, 0, 60, true); 
        if (keys["e"]) scene.beginAnimation(box, 0, 0, false); 
        if (keys["q"]) targetX -= 0.3;
        if (keys["d"]) targetX += 0.3;
        if (keys["z"]) targetY += 0.3;
        if (keys["s"]) targetY -= 0.3;
        if (keys[" "]) targetZ += 0.3;
        if (keys["b"]) targetZ -= 0.3;
    });
    // for morphing:
    window.addEventListener("keydown", (e) => { 
        if (keys["ArrowRight"]) box.scaling.x += 0.1;
        if (keys["ArrowLeft"]) box.scaling.x -= 0.1;
        if (keys["ArrowUp"]) box.scaling.y += 0.1;
        if (keys["ArrowDown"]) box.scaling.y -= 0.1;
        if (keys["r"]) box.scaling.z += 0.1;
        if (keys["f"]) box.scaling.z -= 0.1;
        if (keys["t"]) {
            box.scaling.x += 0.1;
            box.scaling.y += 0.1;
            box.scaling.z += 0.1;
        }
        if (keys["g"]) {
            box.scaling.x -= 0.1;
            box.scaling.y -= 0.1;
            box.scaling.z -= 0.1;
        }
    });
    // for rotating:
    window.addEventListener("keypress", (e) => { 
        if (keys["y"]) box.rotation.y += 0.1; 
        if (keys["h"]) box.rotation.y -= 0.1; ; 
    });
}

