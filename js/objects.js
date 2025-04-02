export function createBox(scene, size, pos) {
    const box = BABYLON.MeshBuilder.CreateBox("box", {}, scene);
    box.scaling = size;
    box.position = pos;
    box.checkCollisions = true;
    return box;
}

export function createGround(scene) {
    const ground = BABYLON.MeshBuilder.CreateGround("ground", {width:10, height:10});
    ground.checkCollisions = true;

    ground.physicsImpostor = new BABYLON.PhysicsImpostor(
        ground,
        BABYLON.PhysicsImpostor.BoxImpostor,
        { mass: 0, restitution: 0.9 },
        scene
    );

    return ground;
}

export function makeBoxMovable(scene, box, physicsPlugin) {
    box.physicsImpostor = new BABYLON.PhysicsImpostor(
        box,
        BABYLON.PhysicsImpostor.BoxImpostor,
        { mass: 0, restitution: 0.9 },
        scene
    );

    box.addEventListener("collide", function(e) {
        const relativeVelocity = e.contact.getImpactVelocityAlongNormal();
        console.log(relativeVelocity);
    })
}