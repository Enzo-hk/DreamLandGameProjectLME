import { createCamera, createFPSCamera, createUniversalCamera } from "./camera/camera.js";
import { createLight } from "./light.js";
import { createBox, createGround } from "./objects.js";
import { setupAnimation } from "./animation.js";
import { setupControls } from "./controls.js";
import { initAudio } from "./sound.js";
import { setUpCameraControls } from "./camera/cameraControls.js";
import { enableGrabbing } from "./grab.js";
import { createDialogBox, disableDialogBox, enableDialogBox, updateText } from "./dialog.js";
import { loadLevel } from "./levels/level1.js";



export function createScene(engine, canvas) {
    const scene = new BABYLON.Scene(engine);
    scene.applyGravity = true;
    scene.gravity = new BABYLON.Vector3(0, -0.15, 0);
    scene.collisionsEnabled = true;
    scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());
    let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");    


    const camera = createUniversalCamera(canvas, scene);
    setUpCameraControls(canvas, scene, camera, advancedTexture);
    enableGrabbing(scene, camera);

    const light = createLight(scene);
    //const ground = createGround(scene);

    // ---------- Tests DialogBox ----------
    let dialogBoxEnabled = false;
    let dialogBox = createDialogBox("");  // boîte de dialogue vide
    updateText(dialogBox, "Hello World!");
    
    window.addEventListener("keydown", (event) => {
        if (event.key == "a") console.log(camera.rotation);
        if (event.key == "b") {
            if (!dialogBoxEnabled) {
                dialogBoxEnabled = true;
                enableDialogBox(advancedTexture, dialogBox);
            }
            else {
                dialogBoxEnabled = false;
                disableDialogBox(advancedTexture, dialogBox);
            }
        }
    });

    loadLevel(scene, advancedTexture, camera);
    // ---------- Fin tests DialogBox ----------

    // ---------------------- Tests pour prendre des objets, à mettre dans un autre fichier plus tard ---------------------------
    /*const cube = createBox(scene, new BABYLON.Vector3(3, 1, 3), new BABYLON.Vector3(0, 0.5, 0));
    const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene);
    sphere.position.y = 1;
    sphere.position.x = 3;
    sphere.position.z = 3;
    sphere.checkCollisions = true;

    // Init du moteur physique

    const item = createBox(scene, new BABYLON.Vector3(0.5, 0.5, 0.5), new BABYLON.Vector3(0, 1.25, 0));
    item.physicsImpostor = new BABYLON.PhysicsImpostor(
        item,
        BABYLON.PhysicsImpostor.BoxImpostor,
        { mass: 0.125, restitution: 0.1 },
        scene
    );

    cube.physicsImpostor = new BABYLON.PhysicsImpostor(
        cube,
        BABYLON.PhysicsImpostor.BoxImpostor,
        { mass: 0, restitution: 0.5 },
        scene
    );

    sphere.physicsImpostor = new BABYLON.PhysicsImpostor(
        sphere,
        BABYLON.PhysicsImpostor.SphereImpostor,
        { mass : 1, restitution: 0 },
        scene
    );
    
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(
        ground,
        BABYLON.PhysicsImpostor.BoxImpostor,
        { mass: 0, restitution: 0.5 },
        scene
    );*/

    // Des sons randoms pour le moment
    let isMoving = false;
    (async () => {
        const audioEngine = await BABYLON.CreateAudioEngineAsync();
        const footstepSound = await BABYLON.CreateSoundAsync("gunshot", "./sounds/indoor-footsteps.mp3", { loop: true });
        const jumpSound = await BABYLON.CreateSoundAsync("jumpSound", "./sounds/cartoon-jump.mp3");
        const morphingSound = await BABYLON.CreateSoundAsync("morphingSound", "./sounds/morphing.mp3");
        // const backgroundMusic = await BABYLON.CreateSoundAsync("backgroundMusic", "./musics/bg_melody.mp4", { autoplay: true, loop: true, volume: 0.1 });

        // Wait for the audio engine to unlock
        await audioEngine.unlockAsync();

        // footstepSound.play();
        window.addEventListener("keydown", (event) => {
            if ((event.key === "z" || event.key === "d" || event.key === "q" || event.key === "s") && !isMoving) {
                isMoving = true;
        
                if (!footstepSound.isPlaying) {
                    footstepSound.play();
                }
            }
        });

        window.addEventListener("keydown", (event) => {
            if (event.key === " ") {
                jumpSound.play();
            }
        });

        window.addEventListener("keydown", (event) => {
            if (event.key === "c") {
                morphingSound.play();
            }
        });
        
        window.addEventListener("keyup", (event) => {
            if (event.key === "z" || event.key === "d" || event.key === "q" || event.key === "s") {
                isMoving = false;
                footstepSound.stop(); // stop() = arrête la boucle
            }
        });
    })();

    
    // texture pour mieux voir le sol
    /*const groundMat = new BABYLON.StandardMaterial("groundMat");
    groundMat.diffuseTexture = new BABYLON.Texture("assets/sky.jpg", scene);
    ground.material = groundMat;*/

    return scene;
}