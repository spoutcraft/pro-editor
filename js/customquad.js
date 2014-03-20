THREE.CustomQuadGeometry = function(verticesCoords) {

	THREE.Geometry.call(this);
    
	// Workaround for triangle normal detection.
	var verticesFix = [];
	for (var i = 0; i < 4; i++) {
		var value = verticesCoords[i].x + "." + verticesCoords[i].y + "." +verticesCoords[i].z;
		if (verticesFix.indexOf(value) == -1) {
			verticesFix.push(value);
		}
	}

	// This creates our vertices...
	for (var i = 0; i < verticesFix.length; i++) {
		this.vertices.push(new THREE.Vector3(
			verticesCoords[i].x - 0.5,
			verticesCoords[i].y - 0.5,
			verticesCoords[i].z - 0.5
		));
	}

	// Creating the face
	if (verticesFix.length == 3) {
		var face = new THREE.Face3(0, 1, 2);
	} else {
		var face = new THREE.Face4(0, 1, 2, 3);
	}
	this.faces.push(face);

	// Automaticaly compute normals
	this.computeFaceNormals();

	// Setting texture coords.
	this.faceVertexUvs[0].push([
		new THREE.UV(1, 1),
		new THREE.UV(1, 0),
		new THREE.UV(0, 0),
		new THREE.UV(0, 1)
	]);
};

THREE.CustomQuadGeometry.prototype = new THREE.Geometry();
THREE.CustomQuadGeometry.prototype.constructor = THREE.CustomQuadGeometry;
