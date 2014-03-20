// Contains the current window size.
var height = window.innerHeight;
var width  = window.innerWidth - 200;

// Initialize required variables
var scene, renderer, camera, light, controls, bbox, quads = [];

// Gets triggered when the window is loaded.
window.onload = function() {
	// Make sure the textarea fits.
	document.getElementsByTagName("textarea")[0].style.height = height - 20 + "px";
	
	// First we will setup everything.
	init();
	animate();
	
	// Then we can bind the onchange event.
	document.getElementsByTagName("textarea")[0].onkeyup = onEditEvent;
	document.getElementsByTagName("input")[0].onkeyup = onEditEvent;
	
	// At last we parse the default shape! :)
	preParseShape();
};

// Gets triggered when someone resized the window.
var onWindowResize = function(event) {
	// Update the window size.
	width = window.innerWidth - 200;
	height = window.innerHeight;
	// Update viewport and camera aspect.
	renderer.setSize(width, height);
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	// Make sure the textarea still fits.
	document.getElementsByTagName("textarea")[0].style.height = height - 20 + "px";
};
// Add the resize function as event listener.
window.addEventListener("resize", onWindowResize, false);


// The render-loop.
var animate = function() {
	// First wait one frame...
	requestAnimationFrame(animate);
	// ... then call the render function.
	render();
};

// The main render function
var render = function() {
	controls.update();
	light.position = camera.position;
	renderer.clear();
	renderer.render(scene, camera);
};

// Capture the edit-area
var onEditEvent = function() {
	// First delete old model.
	for (var i = 0; i < quads.length; i++) {
			scene.remove(quads[i]);
	}
	quads = [];
	preParseShape();
};

// This function creates our WebGL Application
var init = function() {
	// Create the main render container.
	var container = document.createElement("div");
	document.body.appendChild(container);

	// Create a new scene.
	scene = new THREE.Scene();
	
	// Setup the renderer
	var props = {
		antialias: true,
		clearAlpha: 1,
		clearColor: 0x000000
	};
	if (!Detector.webgl) {
		renderer = new THREE.CanvasRenderer(props);
	} else {
		renderer = new THREE.WebGLRenderer(props);
	}
	renderer.setSize(width, height);
	container.appendChild(renderer.domElement);

	// Setup the camera
	camera = new THREE.PerspectiveCamera(70, width / height, 0.001, 1000);
	camera.position.z = 5;
	scene.add(camera);

	// Setup the controls
	controls = new THREE.TrackballControls(camera, renderer.domElement);
	controls.minDistance = 2;
	controls.maxDistance = 5;
	controls.noPan = true;
	controls.keys = [];

	// Setup the light
	light = new THREE.DirectionalLight(0xFFFFFF);
	light.position = camera.position;
	scene.add(light);

	// Setup the bounding box
	bbox = new THREE.Mesh(
		new THREE.CubeGeometry(1, 1, 1, 1, 1, 1, new THREE.MeshBasicMaterial({
			color: 0xffffff, wireframe: true
		})),
		new THREE.MeshFaceMaterial()
	);
	scene.add(bbox);

	// Setup the blocksize
	var bsize = new THREE.Mesh(
		new THREE.CubeGeometry(1.1, 1.1, 1.1, 1, 1, 1, new THREE.MeshBasicMaterial({
			color: 0x404040, wireframe: true
		})),
		new THREE.MeshFaceMaterial()
	);
	scene.add(bsize);
	
	// Show the axis
	var axis = new THREE.ManipulatorTool();
	axis.position.x = -0.6;
	axis.position.y = -0.6;
	axis.position.z = -0.6;
	scene.add(axis);
	
};

// Checking the texture before drawing.
var preParseShape = function() {
	var img = document.createElement("img");
	img.src = document.getElementsByTagName("input")[0].value;
	img.onload = function() {
		var textures = [];
		// Make sure width and height are valid
		if ((img.width & (img.width - 1)) == 0 && (img.height & (img.height - 1)) == 0) {
			if ((img.width % img.height) == 0) {
				var texCount = img.width / img.height;
				for (var i = 0; i < texCount; i++) {
					textures[textures.length] = new THREE.MeshLambertMaterial({
						map: THREE.ImageUtils.loadTexture("../img/imageproxy.php?subtex=" + i + "&image=" + img.src)
					});
				}
			}
		}
		parseShape(textures);
	};
};

// Draw the model.
var parseShape = function(textures) {
	console.log(textures);
	
	// Parse out shape from the textarea.
	var yaml = YAML.eval(document.getElementsByTagName("textarea")[0].value);

	// Now we draw the new bounding box.
	if (yaml.BoundingBox && yaml.BoundingBox.match(/^([0-9\.]+\s+){5}([0-9\.]+)$/)) {
		bboxSizes = yaml.BoundingBox.split(/\s+/);
		bbox.scale.x = bboxSizes[3] - bboxSizes[0];
		bbox.scale.y = bboxSizes[4] - bboxSizes[1];
		bbox.scale.z = bboxSizes[5] - bboxSizes[2];
		bbox.position.x = (bbox.scale.x / 2 - 0.5) + parseFloat(bboxSizes[0]);
		bbox.position.y = (bbox.scale.y / 2 - 0.5) + parseFloat(bboxSizes[1]);
		bbox.position.z = (bbox.scale.z / 2 - 0.5) + parseFloat(bboxSizes[2]);
	}
	
	// Now create all quads.
	if (yaml.Shapes) {
		for (var i = 0; i < yaml.Shapes.length; i++) {
			var shape = yaml.Shapes[i];
			if (shape.Coords && shape.Coords.match(/^(([0-9\.\-]+\s+){8}|([0-9\.\-]+\s+){11})([0-9\.\-]+)$/)) {
				var coords = shape.Coords.split(/[\s]+/);
				var texture = parseInt(shape.Texture);
				// Now add the quad.
				var quadVertices = [];
				for (var j = 0; j < (coords.length / 3); j++) {
					quadVertices[j] = { x: coords[j*3], y: coords[j*3+1], z: coords[j*3+2] };
				};
				// Triangle fix
				if (quadVertices.length == 3) {
					quadVertices[3] = quadVertices[2];
				}
				var quad = new THREE.Mesh(
					new THREE.CustomQuadGeometry(quadVertices),
					textures.length > texture ? textures[texture] : new THREE.MeshLambertMaterial({
						color: 0xffffff
					})
				);
				scene.add(quad);
				quads[quads.length] = quad;
			}
		}
	}
	
};
