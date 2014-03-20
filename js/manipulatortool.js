THREE.ManipulatorTool = function() {

	THREE.Object3D.call(this);
	
	this.selected = {};
	
	var lineGeometry = new THREE.Geometry();
	lineGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
	lineGeometry.vertices.push(new THREE.Vector3(0, 1, 0));

	var coneGeometry = new THREE.CylinderGeometry(0, 0.05, 0.4, 4, 1);
	
	var info = [
		[0xff0000, 1,0,1, 1,0,0, 0,0,1],
		[0x00ff00, 0,1,0, 0,1,0, 0,1,0],
		[0x0000ff, 0,1,1, 0,0,1, 3,0,0] // Ugly 3 -.- but its the blue cone rotation
	];

	for (var i = 0; i < info.length; i++) {
		var line = new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color: info[i][0] }));
		line.rotation.x = (- Math.PI / 2) * info[i][1];
		line.rotation.y = (- Math.PI / 2) * info[i][2];
		line.rotation.z = (- Math.PI / 2) * info[i][3];
		this.add(line);
	
		var cone = new THREE.Mesh(coneGeometry, new THREE.MeshBasicMaterial({ color: info[i][0] }));
		cone.position.x = info[i][4];
		cone.position.y = info[i][5];
		cone.position.z = info[i][6];
		cone.rotation.x = (- Math.PI / 2) * info[i][7];
		cone.rotation.y = (- Math.PI / 2) * info[i][8];
		cone.rotation.z = (- Math.PI / 2) * info[i][9];
		this.add(cone);
	}

};

THREE.ManipulatorTool.prototype = new THREE.Object3D();
THREE.ManipulatorTool.prototype.constructor = THREE.ManipulatorTool;
