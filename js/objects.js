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

    const groundBody = new BABYLON.PhysicsBody(ground, BABYLON.PhysicsMotionType.STATIC, false, scene);
    groundBody.setMassProperties({
        mass: 0,
        restitution: 0.9
    })

    return ground;
}

export function makeBoxMovable(scene, box) {
    const boxBody = new BABYLON.PhysicsBody(box, BABYLON.PhysicsMotionType.DYNAMIC, false, scene);
    boxBody.setMassProperties({
        mass: .8,
        restitution: .1,
        friction: .1
    })
}

export function makeBoxUnmovable(box) {
    box.physicsImpostor.dispose();
}