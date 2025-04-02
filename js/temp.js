var createScene = function () {

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);
    camera.inertia = 0.4;
    camera.angularSensibility = 500;
    // This targets the camera to scene origin
    //camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    
	var camera2 = new BABYLON.ArcRotateCamera("Camera", 0, 1.5, 30, BABYLON.Vector3.Zero(), scene);

    scene.activeCameras = [];
    // scene.activeCameras.push(camera2);
    // scene.activeCameras.push(camera);
    camera2.attachControl(canvas, true);

	camera2.layerMask = 2;

	var rt2 = new BABYLON.RenderTargetTexture("depth", 1024, scene, true, true);
    scene.customRenderTargets.push(rt2);
	rt2.activeCamera = camera2;
    rt2.renderList = scene.meshes;

    var mon2 = BABYLON.Mesh.CreatePlane("plane", .4, scene);
    mon2.position = new BABYLON.Vector3(canvas.width/2500, canvas.height/2500, 1.5)
	// mon2.showBoundingBox = true;
    var mon2mat = new BABYLON.StandardMaterial("texturePlane", scene);
    mon2mat.diffuseColor = new BABYLON.Color3(1,1,1);
    mon2mat.diffuseTexture = rt2;
    mon2mat.specularColor = BABYLON.Color3.Black();

    mon2mat.diffuseTexture.uScale = 1; // zoom
    mon2mat.diffuseTexture.vScale = 1;

    mon2mat.diffuseTexture.level = 1.2; // intensity

    mon2mat.emissiveColor = new BABYLON.Color3(1,1,1); // backlight
	mon2.material = mon2mat;
	mon2.parent = camera;
	// mon2.parent = camera;
	mon2.layerMask = 1;

	var epsilon = .9999999;  // threshold
	mon2.enableEdgesRendering(epsilon);	
	mon2.edgesWidth = .25;
	mon2.edgesColor = new BABYLON.Color4(1, 1, 1, 1);



    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
    var sphere = BABYLON.Mesh.CreateBox("sphere", 2, scene);
    var sphere1 = BABYLON.Mesh.CreateBox("sphere1", 2.05, scene);
    // sphere.showBoundingBox = true;
    sphere1.parent = sphere; 
    //sphere1.position.y = 0;

    // camera.parent = sphere;
    camera.position.y = 0.45;

    camera2.lockedTarget = sphere;

    // Move the sphere upward 1/2 its height
    sphere.position.y = 2;

    // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
    var ground = BABYLON.Mesh.CreateGround("ground1", 100, 100, 2, scene);
	ground.material = new BABYLON.GridMaterial("gmat", scene);

    var ground2 = BABYLON.Mesh.CreateGround("ground1", 100, 100, 2, scene);
	ground2.material = new BABYLON.GridMaterial("gmat", scene);
    ground2.position.z = 80;
    ground2.position.y = 25;
    ground2.rotation.x = -Math.PI/5;
    var jump = false;


	scene.enablePhysics(new BABYLON.Vector3(0, -80, 0));
    scene.gravity = new BABYLON.Vector3(0, -80, 0);
	
	sphere.physicsImpostor = new BABYLON.PhysicsImpostor(
        sphere, 
        BABYLON.PhysicsImpostor.BoxImpostor, { 
            mass: .5, 
            restitution: 0,
            friction: .01 
        }, 
        scene
    );
    
    sphere.physicsImpostor.physicsBody.linearDamping = 0.9;
    sphere.physicsImpostor.physicsBody.angularDamping = 0.999;

	ground.physicsImpostor = new BABYLON.PhysicsImpostor(
        ground, 
        BABYLON.PhysicsImpostor.BoxImpostor, { 
            mass: 0, 
            restitution: 0,
            friction: .001
            
        }, 
    scene
    );

	ground2.physicsImpostor = new BABYLON.PhysicsImpostor(
        ground2, 
        BABYLON.PhysicsImpostor.BoxImpostor, { 
            mass: 0, 
            restitution: 0,
            friction: .001
            
        }, 
    scene
    );
    ground2.jax = 0;
    ground2.jaz = -1;

    // Don't MAKE me have to MAKE you have to MAKE something of yourself, mister.  :)
    canvas.onclick = function() {
        canvas.requestPointerLock();
    }

    // another document eventlistener?  Oh goody.
    document.addEventListener('pointerlockchange', lockChangeLog, false);

    // blech!  at least let get it indented correctly.
    function lockChangeLog() {
        if (document.pointerLockElement === canvas) {
            divObj.innerHTML = "The pointer is locked. Press Esc to unlock.";
            document.addEventListener("mousemove", mousemoveCallback, false);
        } else {
            divObj.innerHTML = "The pointer is unlocked.";
            document.removeEventListener("mousemove", mousemoveCallback, false);
        }
    }

    //  Thanks to Wingnut for making it universal! :) my pleasure
    //  a special func - thanks Deltakosh! :)
    var transformForce = function (mesh, vec) {
        var mymatrix = new BABYLON.Matrix();
        mesh.rotationQuaternion.toRotationMatrix(mymatrix);
        return BABYLON.Vector3.TransformNormal(vec, mymatrix);
    };

//---------------------------
    var rotate = function (mesh, direction, power) {
        // console.log("rotate happening", direction.scale(power));
        mesh.physicsImpostor.setAngularVelocity(
            mesh.physicsImpostor.getAngularVelocity().add(
                direction.scale(power)
            )
        );
    }

    var translate = function (mesh, direction, power) {
        mesh.physicsImpostor.setLinearVelocity(
            mesh.physicsImpostor.getLinearVelocity().add(
                transformForce(mesh, direction.scale(power))
            )
        );
    }
    //---------------------------
    var mf = false;
    var mb = false;
    var sl = false;
    var sr = false;
    var tr = false;
    var tl = false;
    var jump = false;
    var canjump = true;
    var transpower = 1;
    var rotpower = .1;
    var jumppower = 45;
    var spood = 0;
    var inair = false;
    var howmuchairmove = 1;
    var help;
    var helps;
    var eulerRot = BABYLON.Vector3.Zero();


    var onKeyDown = function(event) {
        
        switch (event.keyCode) {

            case 69: // e
                tr = true;
                // console.log("right turn");
                break;

            case 81: // q
                tl = true;
                // console.log("left turn");
                break;

            case 68: // d
                sr = true;
                break;
                
            case 65: // a
                sl = true;
                break;

            case 87: // w
                mf = true;
                break;

            case 83: // s
                mb = true;
                break;

            case 32: // space
                jump = true;
                break;

            case 16: //shift
                spood = 1;
                break;

        }
    };

    var onKeyUp = function(event) {

        switch (event.keyCode) {

            case 69: // e
                tr = false;
                break;

            case 81: // q
                tl = false;
                break;

            case 68: // d
                sr = false;
                break;

            case 65: // a
                sl = false;
                break;

            case 87: // w
                mf = false;
                break;

            case 83: // s
                mb = false;
                break;

            case 32: // space
                jump = false;
                canjump = true;
                break;

            case 16: //shift
                spood = 0;
                break;

        }

    };

    // canvas event listeners.  Now we're rockin'.
    canvas.addEventListener('keydown', onKeyDown, false);
    canvas.addEventListener('keyup', onKeyUp, false);

    // yeah, you can shut it off, but I suggest you don't.  Not disposing
    // of your event listeners when using playground... WILL send you
    // on a wild goose chase someday, if you don't clean-up after yourself.  :)
    scene.onDispose = function() {
        canvas.removeEventListener('keydown', onKeyDown);
        canvas.removeEventListener('keyup', onKeyUp);
    }

    var g = new BABYLON.Vector3(0, -80, 0);
    var jax = 0;
    var jaz = 0;
    
    function updatePosition(e) {
  x += e.movementX;
  y += e.movementY;
  
  sphere.rotation.y += x;
}

    // the new update() func... stronger than dirt.
    var update = function() {


        if (sphere1.intersectsMesh(ground, false)) {
            inair = false;
        } else {
            inair = true;
        }
        if (inair == true) howmuchairmove = 0.5;

        if (sphere1.intersectsMesh(ground2, true)) {
            g.y = -0.001;
            jax = ground2.jax;
            jaz = ground2.jaz;
        } else {
            g.y = -80;
            jax = 0;
            jaz = 0;
        }


        // console.logs in the render loop? Streaming them, eh?  About 23 million
        // output lines per minute, ya fig?  BOG!
        if (mf == true) translate(sphere, new BABYLON.Vector3(0, 0, 1+spood*howmuchairmove), transpower);
        // else console.log("All good here!")
        if (mb == true) translate(sphere, new BABYLON.Vector3(0, 0, -0.66-spood*howmuchairmove), transpower);
        // else console.log("All good here!")
        if (sl == true) translate(sphere, new BABYLON.Vector3(-0.75-spood*howmuchairmove, 0, 0), transpower);
        // else console.log("All good here!")
        if (sr == true) translate(sphere, new BABYLON.Vector3(0.75+spood*howmuchairmove, 0, 0), transpower);
        // else console.log("All good here!")
        if (tl == true) rotate(sphere, new BABYLON.Vector3(0, -2, 0), rotpower);
        // else console.log("All good here!")
        if (tr == true) rotate(sphere, new BABYLON.Vector3(0, 2, 0), rotpower);
        // else console.log("All good here!")
        if (sphere1.intersectsMesh(ground, false) && jump == true && canjump == true || sphere1.intersectsMesh(ground2, true) && jump == true && canjump == true) {
            translate(sphere, new BABYLON.Vector3(jax, 1, jaz), jumppower);
            canjump = false;
        }

        // make the camera be in same position as sphere, without parenting. 
        // Raise cam.pos.y 0.45 ...matching line 31.
        camera.position = sphere.position.add(new BABYLON.Vector3(0, 0.45, 0));
        sphere.physicsImpostor.physicsBody.quaternion.toEuler(eulerRot); // adjust eulerRot value
        camera.rotation.y = eulerRot.y; // use adjusted value

        // tsk tsk.  :)
        sphere.rotation.x = 0;
        sphere.rotation.z = 0;
        scene.getPhysicsEngine().setGravity(g);
    }

    document.addEventListener('mousemove', function(event) {
    var ex = event.movementX;
    var ey = event.movementY;
    rotate(sphere, new BABYLON.Vector3(0, ex, 0), rotpower);
}, false);

    scene.registerBeforeRender(function() {
        update();
    });

    canvas.focus();  // no need to click in canvas

    return scene;

};