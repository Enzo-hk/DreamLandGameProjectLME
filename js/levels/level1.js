export function loadLevel(scene, advancedTexture, camera) {
    BABYLON.SceneLoader.ImportMesh(
        null,           // Import all meshes
        "assets/",      // Path
        "room.glb",     // File
        scene,
        (meshes) => {
            const root = meshes[0].parent || meshes[0]; // Often meshes are under a root node
            //root.scaling = new BABYLON.Vector3(1.5, 1.5, 1.5); // scale down by 50%
            //root.refreshBoundingInfo(true);

            meshes.forEach((mesh) => {
                mesh.checkCollisions = true;
                mesh.isPickable = false;
            });
        }
      );

    camera.position = new BABYLON.Vector3(0, 2, 4);
    camera.rotation = new BABYLON.Quaternion(0, 0, 0);
}