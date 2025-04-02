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

    const camera = new BABYLON.FreeCamera("FPS", new BABYLON.Vector3(0, 10.8, -3), scene);
    camera.attachControl(canvas, true);
    camera.rotation = new BABYLON.Vector3.Zero();

    camera.speed = 2.5;
    camera.inertia = 0;
    camera.angularSensibility = 500;  // modifiable dans les paramètres

    camera.keysUp = [90];  // modifiable dans les paramètres en fonction du layout
    camera.keysDown = [83];
    camera.keysLeft = [81]; 
    camera.keysRight = [68];

    camera.ellipsoid = new BABYLON.Vector3(1.2, 1, 1.2);
    camera.checkCollisions = true;
    scene.activeCamera = camera;

    enablePhysics(scene, camera);

    // pointer lock
    canvas.addEventListener("click", () => {
        canvas.requestPointerLock();
    });

    return camera;
}

function enablePhysics(scene, camera) {
    const cameraBody = BABYLON.MeshBuilder.CreateBox("cameraBody", {}, scene);  // box de collision de la cam pour les objets amovibles
    cameraBody.scaling = new BABYLON.Vector3(2.5, 1, 2.5);
    cameraBody.position = camera.position;
    cameraBody.visibility = false;
    cameraBody.isPickable = false;

    cameraBody.physicsImpostor = new BABYLON.PhysicsImpostor(  // box impostor
        cameraBody,
        BABYLON.PhysicsImpostor.BoxImpostor,
        { mass: 10, restitution: 0, friction: 1 },
        scene
    );

    scene.registerBeforeRender(() => {  // la box suit le joueur
        cameraBody.position = camera.position;
    });
}