export function enableGrabbing(scene, camera) {
    let state = 0;  // not grabbing
    let observer = null;
    let picked = null;
    let physicsImpostor = null;
    let impostorOptions = null;
    let xRot = null;
    let zRot = null;

    window.addEventListener("keydown", (event) => {
        if (event.key === "g") {
            if (state === 0) {  // on grab un nouvel objet
                const ray = new BABYLON.Ray(camera.position, camera.getForwardRay().direction, 1000);
                picked = scene.pickWithRay(ray).pickedMesh;
                if (!picked) return;  // si rien n'est grab on arrête sans changer de state

                if (picked.physicsImpostor) {
                    physicsImpostor = picked.physicsImpostor;
                    impostorOptions = {
                        mass: picked.physicsImpostor.getParam("mass"),
                        friction: picked.physicsImpostor.getParam("friction"),
                        restitution: picked.physicsImpostor.getParam("restitution")
                    };
                    picked.physicsImpostor.dispose();
                    picked.physicsImpostor = null;
                }
                xRot = picked.rotation.x;
                zRot = picked.rotation.z;

                observer = scene.onBeforeRenderObservable.add(() => {
                    grab(state, picked, camera, xRot, zRot);
                });
                state = 1;
            }
            else {  // on relâche l'objet
                // on lui remet un nouveau physicsImpostor
                picked.physicsImpostor = new BABYLON.PhysicsImpostor(
                    picked,
                    physicsImpostor.type,
                    {mass: impostorOptions.mass, friction: impostorOptions.friction, restitution: impostorOptions.restitution}, // get current physics settings
                    scene
                );
                physicsImpostor = null;
                impostorOptions = null;
                console.log(picked);
                console.log(picked.physicsImpostor);
                scene.onBeforeRenderObservable.remove(observer);
                state = 0;
            }
        }
    });
}

function grab(state, picked, camera, xRot, zRot) {
    if (picked == null) return;

    if (state === 1) {
        const ray = camera.getForwardRay();
        const pointAlongRay = ray.origin.add(ray.direction.scale(5)); // point à 5 unités de la camera
        picked.position.x = pointAlongRay._x;
        picked.position.y = pointAlongRay._y;
        picked.position.z = pointAlongRay._z;
        picked.rotation = new BABYLON.Vector3(xRot, camera.rotation.y, zRot);  // ça remet l'objet à sa place après je sais pas pourquoi, et il a plus de physiques
    }
}