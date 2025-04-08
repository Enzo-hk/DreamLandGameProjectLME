export function createBox(scene, size, pos) {
    const box = BABYLON.MeshBuilder.CreateBox("box", {}, scene);
    box.scaling = size;
    box.position = pos;
    box.checkCollisions = true;
    return box;
}

export function createGround(scene) {
    const ground = BABYLON.MeshBuilder.CreateGround("ground", {width:100, height:100});
    ground.checkCollisions = true;
    ground.isPickable = false;

    // ground.physicsImpostor = new BABYLON.PhysicsImpostor(
    //     ground,
    //     BABYLON.PhysicsImpostor.BoxImpostor,
    //     { mass: 0 },
    //     scene
    // );

    return ground;
}