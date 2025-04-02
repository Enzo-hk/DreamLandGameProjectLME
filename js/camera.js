
export function createCamera(canvas, scene) {
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(canvas, true);
    scene.activeCamera.keysUp = [];
    scene.activeCamera.keysDown = [];
    scene.activeCamera.keysLeft = [];
    scene.activeCamera.keysRight = [];
    return camera;
}

export function createFPSCamera(canvas, scene, engine) {
    scene.useRightHandedSystem = true;

    const camera = new BABYLON.FreeCamera("FPS", new BABYLON.Vector3(0, 1.8, 0), scene);
    camera.attachControl(canvas, true);
    camera.rotation = new BABYLON.Vector3.Zero();

    camera.speed = 2.5;
    camera.inertia = 0;
    camera.angularSensibility = 500;  // modifiable dans les paramètres

    camera.keysUp = [90];  // modifiable dans les paramètres en fonction du layout
    camera.keysDown = [83];
    camera.keysLeft = [81]; 
    camera.keysRight = [68];

    scene.activeCamera = camera;

    // pointer lock
    canvas.addEventListener("click", () => {
        canvas.requestPointerLock();
    });

    enablePointerLock(true, canvas, camera, engine);
}

function mouseMove(e, camera, engine) {
    let deltaTime = engine.getDeltaTime();

    camera.rotation.x += e.movementY * deltaTime * 0.001;
    camera.rotation.y -= e.movementX * deltaTime * 0.001;
}

export function enablePointerLock(on, canvas, camera, engine) {
    if (on) {
        document.addEventListener("pointerlockchange", () => {  // le bouger pour le modifier quand on est dans un menu
            if (document.pointerLockElement === canvas) {
                document.addEventListener("mousemove", mouseMove, camera, engine);
            } else {
                document.removeEventListener("mousemove", mouseMove, camera, engine);
            }
        });
    } else {
        document.removeEventListener("mousemove", mouseMove, camera, engine);
    }
}