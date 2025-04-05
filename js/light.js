export function createLight(scene) {
    return new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);
    // return new BABYLON.PointLight("pointLight", new BABYLON.Vector3(4, 10, 1), scene);
}