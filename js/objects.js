export function createBox(scene, size, pos) {
    const box = BABYLON.MeshBuilder.CreateBox("box", {}, scene);
    box.scaling = size;
    box.position = pos;
    box.checkCollisions = true;
    return box;
}

export function createGround(scene) {
    const ground = BABYLON.MeshBuilder.CreateGround("ground", {width:25, height:25});
    ground.checkCollisions = true;
    ground.isPickable = false;

    ground.physicsImpostor = new BABYLON.PhysicsImpostor(
        ground,
        BABYLON.PhysicsImpostor.BoxImpostor,
        { mass: 0, restitution: 0.9 },
        scene
    );

    return ground;
}

export function makeBoxMovable(scene, box) {
    box.physicsImpostor = new BABYLON.PhysicsImpostor(
        box,
        BABYLON.PhysicsImpostor.BoxImpostor,
        { mass: .8, restitution: .1, friction: .1 },
        scene
    );
}

export function makeBoxUnmovable(box) {
    box.physicsImpostor.dispose();
}