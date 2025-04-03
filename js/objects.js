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

    /**const groundBody = new BABYLON.PhysicsBody(ground, BABYLON.PhysicsMotionType.STATIC, false, scene);
    groundBody.setMassProperties({
        mass: 0,
        restitution: 0.9
    });
    const groundShape = new BABYLON.PhysicsShapeBox(new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 0, 1), new BABYLON.Vector3(25, 0, 25), scene);
    groundShape.material = { friction: 0.2, restitution: 0.3 };
    groundBody.shape = groundShape;*/
    const groundAggregate = new BABYLON.PhysicsAggregate(ground, BABYLON.PhysicsShapeType.BOX, { mass: 0 }, scene);

    return ground;
}

export function makeBoxMovable(scene, box) {
    /**const boxBody = new BABYLON.PhysicsBody(box, BABYLON.PhysicsMotionType.DYNAMIC, false, scene);
    boxBody.setMassProperties({
        mass: .8,
        restitution: .1,
        friction: .1
    });
    const boxShape = new BABYLON.PhysicsShapeBox(new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 0, 1), new BABYLON.Vector3(1, 2, 1), scene);
    boxShape.material = { friction: 0.2, restitution: 0.3 };
    boxBody.shape = boxShape;*/
    const boxAggregate = new BABYLON.PhysicsAggregate(box, BABYLON.PhysicsShapeType.BOX, { mass: .8 }, scene);
    box.metadata = {body: boxAggregate.body};
}

export function makeBoxUnmovable(box) {
    box.metadata.body.dispose();
}