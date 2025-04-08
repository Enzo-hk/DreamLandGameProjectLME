export function setUpCameraControls(canvas, scene, camera) {
    setUpCameraSpeed(camera);
    setUpCameraMovementControls(camera);
    setUpCameraLock(scene, canvas);
    setUpcameraSprint(camera);
    switchCameraSize(scene, camera);
    setUpCameraGravity(scene, camera);
    setUpCameraJump(scene, camera);
    setUpCameraSelector(scene, camera);
    setUpCameraPointer(scene, camera);
    setUpCameraImpostor(scene, camera);
}

function setUpCameraSpeed(camera) { // also change in setUpCameraSprint if you change the speed here
    camera.speed = 0.6; // Vitesse de déplacement (default is 1)
    camera.inertia = 0.6;  // Higher = smoother (default is 0.9)
    camera.angularSensibility = 3000;  // Mouvement de la souris (default is 2000) (higher = more sensitive)
}

function setUpCameraMovementControls(camera) {
    camera.keysUp = [90];    // Z
    camera.keysDown = [83];  // S
    camera.keysLeft = [81];  // Q
    camera.keysRight = [68]; // D
}

function setUpCameraLock(scene, canvas) {
    // Pointer lock: ne s'active que si la souris est cliquée sur la scène (pratique si on a une UI pour les boutons), au lieu de tout le canvas
    scene.onPointerDown = () => {
        if (scene.activeCamera) {
            canvas.requestPointerLock();
        }
    };
}

function setUpcameraSprint(camera) {
    window.addEventListener("keydown", (event) => {
        if (event.key === "Shift") camera.speed = 1.2; // Sprint
    });
    window.addEventListener("keyup", (event) => {
        if (event.key === "Shift") camera.speed = 0.6; // Normal speed
    });
}

let state = 0; // variable globale pour le changement de taille de la caméra (0 = petite, 1 = normale, 2 = grande)
function switchCameraSize(scene, camera) {
    window.addEventListener("keydown", (event) => {
        if (event.key === "c") {
            if (state === 0) {
                camera.ellipsoid = new BABYLON.Vector3(0.5, 0.1, 0.5); // Player hitbox size: small
            }
            else if (state === 1) {
                camera.ellipsoid = new BABYLON.Vector3(0.5, 1, 0.5); // Player hitbox size: normal
            }
            else if (state === 2) { 
                camera.ellipsoid = new BABYLON.Vector3(1, 2, 1); // Player hitbox size: large
            }
            state = (state + 1) % 3; // Cycle through the states
        }
    });
}


function setUpCameraGravity(scene, camera) {
    // gravity and collision detection
    camera.applyGravity = true;
    camera.ellipsoid = new BABYLON.Vector3(0.5, 1, 0.5); // Player hitbox size: normal
    camera.checkCollisions = true;  // Enable collision detection
    camera.minZ = 0.1;  // Avoid clipping, distance minimale de ce qu'on peut voir
    camera._needMoveForGravity = true; // Enable gravity even when not moving
}

function setUpCameraJump(scene, camera) {
    // Variables du saut
    let isJumping = false;
    let velocityY = 0;
    const jumpForce = 0.35; // Force initiale du saut
    const gravity = -0.012; // Gravité personnalisée

    // Gestion du saut
    window.addEventListener("keydown", (event) => {
        if (event.key === " " && !isJumping) {
            isJumping = true;
            velocityY = jumpForce; // On donne une impulsion vers le haut
        }
    });
    // Mise à jour de la physique à chaque frame
    scene.onBeforeRenderObservable.add(() => {
        if (isJumping) {
            camera.position.y += velocityY; // Appliquer la vitesse verticale
            velocityY += gravity; // Appliquer la gravité (accélération vers le bas)
            camera.onCollide = () => {
                if (velocityY < 0) { // Check if falling
                    isJumping = false; // On est sur le sol, on peut sauter à nouveau
                    velocityY = 0; // On arrête la chute
                }
            };
        }
        
    });
}

function setUpCameraSelector(scene, camera) {
    const h1 = new BABYLON.HighlightLayer("h1", scene);  // highlight
    h1.innerGlow = true;
    h1.outerGlow = false;

    scene.onPointerMove = function () {
        const ray = new BABYLON.Ray(camera.position, camera.getForwardRay().direction, 1000);  // rayon qui part de la camera dans la direction où on regarde
        const picked = scene.pickWithRay(ray);  // objet touché par le rayon
        h1.removeAllMeshes();  // on enlève l'highlight des autres objets
        if (picked.hit) {
            h1.addMesh(picked.pickedMesh, BABYLON.Color3.Black());  // highlight
        }
    }
}

function setUpCameraPointer(scene, camera) {
    const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("pointerUI");

    const pointer = new BABYLON.GUI.Image("pointer", "./assets/pointer.png");
    pointer.width = "10px";
    pointer.height = "10px";
    pointer.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    pointer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

    advancedTexture.addControl(pointer);
}

function setUpCameraImpostor(scene, camera) {
    const cameraCollision = BABYLON.MeshBuilder.CreateCylinder("cameraBox", { diameter: 1.5}, scene);
    cameraCollision.visibility = false;
    cameraCollision.position = camera.position;
    cameraCollision.isPickable = false;

    cameraCollision.physicsImpostor = new BABYLON.PhysicsImpostor(
        cameraCollision, 
        BABYLON.PhysicsImpostor.CylinderImpostor, 
        { mass: 0, friction: 0.5, restitution: 0.3 }, 
        scene
    );

    scene.onBeforeRenderObservable.add(() => {
        cameraCollision.position = camera.position.clone().add(new BABYLON.Vector3(0, -1, 0));
    });
}