import { makeBoxMovable, makeBoxUnmovable } from "./objects.js";

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

export function setupCameraControls(scene, camera, h1) {
    scene.onPointerMove = function () {
        onPointerMove(scene, h1);
    }

    let keys = {};

    function handleKeyDown(e) {
        keys[e.key] = true;
    }
    function handleKeyUp(e) { 
        keys[e.key] = false; 
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    
    window.addEventListener("keypress", (e) => {
        if (keys["a"]) {  // make an object movable
            const picked = scene.pick(scene.pointerX, scene.pointerY);
            if (picked.hit) {
                console.log(picked.pickedMesh.metadata);
                if (picked.pickedMesh.metadata === null || picked.pickedMesh.metadata.body._isDisposed) {
                    makeBoxMovable(scene, picked.pickedMesh);
                } else {
                    makeBoxUnmovable(picked.pickedMesh);
                }
                console.log(picked.pickedMesh.metadata);
            }
        }
        if (keys[" "]) {
            camera.metadata.body.applyImpulse(new BABYLON.Vector3(0, 50, 0), camera.position);
        }
    });
    /**
    window.addEventListener("click", (e) => {
        const picked = scene.pick(scene.pointerX, scene.pointerY);
        if (picked.hit) {
            console.log(picked.pickedMesh.metadata);
            if (picked.pickedMesh.metadata === null && scene.metadata === null) {
                scene.metadata = {pickedForMoving: true};
                picked.pickedMesh.metadata = {pickedForMoving: true};
                moveObjectWithCamera(scene, camera, picked);
            }
            else {
                scene.metadata = null;
                picked.pickedMesh.metadata = null;
            }
        }
    });*/
}

function onPointerMove(scene, h1) {
    const picked = scene.pick(scene.pointerX, scene.pointerY);
    h1.removeAllMeshes();
    if (picked.hit) {
        h1.addMesh(picked.pickedMesh, BABYLON.Color3.Black());
    }
}

function moveObjectWithCamera(scene, camera, picked) {
    makeBoxMovable(scene, picked.pickedMesh);

    const cameraBody = new BABYLON.PhysicsBody(camera.metadata.body, BABYLON.PhysicsMotionType.DYNAMIC, false, scene);
    const meshBody = new BABYLON.PhysicsBody(picked.pickedMesh, BABYLON.PhysicsMotionType.DYNAMIC, false, scene);

    cameraBody.addJoint(meshBody, new BABYLON.PhysicsJoint(
        BABYLON.PhysicsJoint.LockJoint, {}
    ));
}