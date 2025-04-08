import { createCamera, createFPSCamera, createUniversalCamera } from "./camera/camera.js";
import { createLight } from "./light.js";
import { createBox, createGround } from "./objects.js";
import { setupAnimation } from "./animation.js";
import { setupControls } from "./controls.js";
import { initAudio } from "./sound.js";
import { setUpCameraControls } from "./camera/cameraControls.js";
import { enableGrabbing } from "./grab.js";



export function createScene(engine, canvas) {
    const scene = new BABYLON.Scene(engine);
    scene.applyGravity = true;
    scene.gravity = new BABYLON.Vector3(0, -0.15, 0);
    scene.collisionsEnabled = true;
    const physicsPlugin = new BABYLON.CannonJSPlugin();
    // scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), physicsPlugin);

    const camera = createUniversalCamera(canvas, scene);
    setUpCameraControls(canvas, scene, camera);
    enableGrabbing(scene, camera);

    const light = createLight(scene);
    const ground = createGround(scene);

    // ---------------------- Tests pour prendre des objets, à mettre dans un autre fichier plus tard ---------------------------
    const cube = createBox(scene, new BABYLON.Vector3(3, 1, 3), new BABYLON.Vector3(0, 0.5, 0));
    const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene);
    sphere.position.y = 1;
    sphere.position.x = 3;
    sphere.position.z = 3;
    sphere.checkCollisions = true;

    // Init du moteur physique
    scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());

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
        { mass : 100, restitution: 0 },
        scene
    );
    
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(
        ground,
        BABYLON.PhysicsImpostor.BoxImpostor,
        { mass: 0, restitution: 0.5 },
        scene
    );
    
    
    /*let state = 1;
    let velocityY = 0.3; // Initial velocity
    let velocityZ = 0.3; // Initial velocity
    let grab = () => {
        if (state === 0) {
            const ray = camera.getForwardRay();
            const pointAlongRay = ray.origin.add(ray.direction.scale(5)); // 5 units forward
            item.position.x = pointAlongRay._x;
            item.position.y = pointAlongRay._y;
            item.position.z = pointAlongRay._z;

        }
        else {
            item.position.y += velocityY;   
            item.position.z += velocityZ;   
        }
        
    }
    window.addEventListener("keydown", (event) => {
        if (event.key === "g") {
            velocityZ = 0.3;
            scene.onBeforeRenderObservable.add(() => {
                grab();
                velocityY -= 0.015;
                velocityZ -= 0.015;
                if (velocityZ < 0) {
                    velocityZ = 0;
                }
                if (velocityY < 0) {
                    velocityY = 0;
                }
            });
            state = (state + 1) % 2; // Toggle between 0 (grab) and 1 (release)

        }
    });*/
    // ---------------------------------------------------- Fin des tests pour prendre des objets ---------------------------------------------------------

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
    const groundMat = new BABYLON.StandardMaterial("groundMat");
    groundMat.diffuseTexture = new BABYLON.Texture("assets/sky.jpg", scene);
    ground.material = groundMat;

    return scene;
}