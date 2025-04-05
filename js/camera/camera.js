import { setUpCameraControls } from "./cameraControls.js";

export function createCamera(canvas, scene) {
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(canvas, true);
    scene.activeCamera.keysUp = [];
    scene.activeCamera.keysDown = [];
    scene.activeCamera.keysLeft = [];
    scene.activeCamera.keysRight = [];
    return camera;
}

export function createFPSCamera(canvas, scene, engine, cameraPhysicsBody) {
    scene.useRightHandedSystem = true;

    const camera = new BABYLON.FreeCamera("freeCamera", new BABYLON.Vector3(0, 3, -3), scene);
    camera.attachControl(canvas, true);

    camera.speed = 1;
    camera.inertia = 0;
    camera.angularSensibility = 500;  // modifiable dans les paramètres

    camera.keysUp = [90];  //90  // modifiable dans les paramètres en fonction du layout
    camera.keysDown = [83];  //83
    camera.keysLeft = [81];  // 81
    camera.keysRight = [68];  // 68
    camera.keysDownward = [83];
    
    cameraPhysicsBody.isVisible = true;  // Make the box invisible
    cameraPhysicsBody.position = camera.position; // Place it at the camera's position
    cameraPhysicsBody.physicsImpostor = new BABYLON.PhysicsImpostor(cameraPhysicsBody, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, friction: 1 });
    
    // Apply force to the physics body, which will affect the camera indirectly
    camera.parent = cameraPhysicsBody;
    cameraPhysicsBody.applyGravity = true;

    scene.activeCamera = camera;
    camera.checkCollisions = true;
    
    scene.registerBeforeRender(function () {
        camera.position.y = cameraPhysicsBody.position.y;
        cameraPhysicsBody.position.z = camera.position.z;
        cameraPhysicsBody.position.x = camera.position.x;
    });

    // pointer lock
    canvas.addEventListener("click", () => {
        canvas.requestPointerLock();
    });

    return camera;
}

export async function jump(camera, cameraPhysicsBody, jumping) {
    const force = new BABYLON.Vector3(0, 5, 0); // Apply force on the Y-axis
    cameraPhysicsBody.physicsImpostor.applyImpulse(force, cameraPhysicsBody.position);
    setTimeout(() => {
        jumping.value = false;
    }, 1500);
// Attach the camera to the physics object
    /** 
    console.log("1");
    asyncJump(camera);*/
}

export function createUniversalCamera(canvas, scene) {
    const camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 2, -10), scene);
    scene.activeCamera = camera;
    camera.attachControl(canvas, true);
    camera.setTarget(BABYLON.Vector3.Zero()); // Set the camera target to the origin
    return camera;
}