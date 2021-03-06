noise.seed(Math.random());

 		var scene = new THREE.Scene();
 		scene.background = new THREE.Color(0x00ffff);
 		scene.fog = new THREE.Fog(0x00ffff, 10, 650);
		var renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);
		var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

		
		
		

		var autoJump = true;
		function toggleAutoJump(){
			if(autoJump == true){
				autoJump = false;
				document.getElementById("autojumpbutton").innerHTML = "<h2>AutoJump : Off</h2>";
			} else {
				autoJump = true;
				document.getElementById("autojumpbutton").innerHTML = "<h2>AutoJump : On</h2>";
			}
		}

		var faces = [
			{ // left
			    dir: [ -5,  0,  0, "left"],
			},
			{ // right
			    dir: [  5,  0,  0, "right"],
			},
			{ // bottom
			    dir: [  0, -5,  0, "bottom"],
			},
			{ // top
			    dir: [  0,  5,  0, "top"],
			},
			{ // back
			    dir: [  0,  0, -5, "back"],
			},
			{ // front
			    dir: [  0,  0,  5, "front"],
			},
		];

		function Block(x, y, z){
			this.x = x;
			this.y = y;
			this.z = z;
		}



		var chunks = [];
		var xoff = 0;
		var zoff = 0;
		var inc = 0.05;
		var amplitude = 30 + (Math.random() * 70);
		var renderDistance = 5;
		var chunkSize = 10;
		camera.position.x = renderDistance * chunkSize / 2 * 5;
		camera.position.z = renderDistance * chunkSize / 2 * 5;
		camera.position.y = 50;

		var loader = new THREE.TextureLoader();
		var materialArray = [
			new THREE.MeshBasicMaterial({map : loader.load("side4.jpg")}),
			new THREE.MeshBasicMaterial({map : loader.load("side1.jpg")}),
			new THREE.MeshBasicMaterial({map : loader.load("top.jpg")}),
			new THREE.MeshBasicMaterial({map : loader.load("bottom.jpg")}),
			new THREE.MeshBasicMaterial({map : loader.load("side2.jpg")}),
			new THREE.MeshBasicMaterial({map : loader.load("side3.jpg")}),
		];

		var blockBox = new THREE.BoxGeometry(5, 5, 5)
		var instancedChunk = new THREE.InstancedMesh(blockBox, materialArray, renderDistance * renderDistance * chunkSize * chunkSize);
		var count = 0;
		for(var i = 0; i < renderDistance; i++){
			for(j = 0; j < renderDistance; j++){
				var chunk = [];
				for(var x = i * chunkSize; x < (i * chunkSize) + chunkSize; x++){
					for(var z = j * chunkSize; z < (j * chunkSize) + chunkSize; z++){
						xoff = inc * x;
						zoff = inc * z;
						var v = Math.round(noise.perlin2(xoff, zoff) * amplitude / 5) * 5;
						chunk.push(new Block(x * 5, v, z * 5));
						let matrix = new THREE.Matrix4().makeTranslation(
							x * 5,
							v,
							z * 5
						);
						instancedChunk.setMatrixAt(count, matrix);
						count++;
					}
				}
				chunks.push(chunk);
			}
		}

		scene.add(instancedChunk);

		var keys = [];
		var canJump = true;
		document.addEventListener("keydown", function(e){
			keys.push(e.key);
			if(e.key == " " && canJump == true){
				ySpeed = -1.3;
				canJump = false;
			}
		});
		document.addEventListener("keyup", function(e){
			var newArr = [];
			for(var i = 0; i < keys.length; i++){
				if(keys[i] != e.key){
					newArr.push(keys[i]);
				}
			}
			keys = newArr;
		});

		var controls = new THREE.PointerLockControls(camera, document.body);
		document.body.addEventListener("click", function(){
			controls.lock();
		});
		controls.addEventListener("lock", function(){

		});
		controls.addEventListener("unlock", function(){

		});

		var movingSpeed = 0.7;
		var ySpeed = 0;
		var acc = 0.08;
		function update(){
			if(keys.includes("w")){
				controls.moveForward(movingSpeed);
				if(autoJump == false){
					for(var i = 0; i < chunks.length; i++){
						for(var j = 0; j < chunks[i].length; j++){
							if(camera.position.x <= chunks[i][j].x + 2.5 && camera.position.x >= chunks[i][j].x - 2.5 && camera.position.z <= chunks[i][j].z + 2.5 && camera.position.z >= chunks[i][j].z - 2.5){
								if(camera.position.y == chunks[i][j].y - 2.5){
									controls.moveForward(-1 * movingSpeed);
								}
							}
						}
					}
				}
			}
			if(keys.includes("a")){
				controls.moveRight(-1 * movingSpeed);
				if(autoJump == false){
					for(var i = 0; i < chunks.length; i++){
						for(var j = 0; j < chunks[i].length; j++){
							if(camera.position.x <= chunks[i][j].x + 2.5 && camera.position.x >= chunks[i][j].x - 2.5 && camera.position.z <= chunks[i][j].z + 2.5 && camera.position.z >= chunks[i][j].z - 2.5){
								if(camera.position.y == chunks[i][j].y - 2.5){
									controls.moveRight(movingSpeed);
								}
							}
						}
					}
				}
			}
			if(keys.includes("s")){
				controls.moveForward(-1 * movingSpeed);
				if(autoJump == false){
					for(var i = 0; i < chunks.length; i++){
						for(var j = 0; j < chunks[i].length; j++){
							if(camera.position.x <= chunks[i][j].x + 2.5 && camera.position.x >= chunks[i][j].x - 2.5 && camera.position.z <= chunks[i][j].z + 2.5 && camera.position.z >= chunks[i][j].z - 2.5){
								if(camera.position.y == chunks[i][j].y - 2.5){
									controls.moveForward(movingSpeed);
								}
							}
						}
					}
				}
			}
			if(keys.includes("d")){
				controls.moveRight(movingSpeed);
				if(autoJump == false){
					for(var i = 0; i < chunks.length; i++){
						for(var j = 0; j < chunks[i].length; j++){
							if(camera.position.x <= chunks[i][j].x + 2.5 && camera.position.x >= chunks[i][j].x - 2.5 && camera.position.z <= chunks[i][j].z + 2.5 && camera.position.z >= chunks[i][j].z - 2.5){
								if(camera.position.y == chunks[i][j].y - 2.5){
									controls.moveRight(-1 * movingSpeed);
								}
							}
						}
					}
				}
			}

			camera.position.y = camera.position.y - ySpeed;
			ySpeed = ySpeed + acc;

			for(var i = 0; i < chunks.length; i++){
				for(var j = 0; j < chunks[i].length; j++){
					if(camera.position.x <= chunks[i][j].x + 2.5 && camera.position.x >= chunks[i][j].x - 2.5 && camera.position.z <= chunks[i][j].z + 2.5 && camera.position.z >= chunks[i][j].z - 2.5){
						if(camera.position.y <= chunks[i][j].y + 10 && camera.position.y >= chunks[i][j].y){
							camera.position.y = chunks[i][j].y + 10;
							ySpeed = 0;
							canJump = true;
							break;
						}
					}
				}
			}

			var worldSize = chunkSize * renderDistance * 5;
			var ratio = 0.4;
			if(camera.position.z <= lowestZBlock() + (worldSize * ratio)){ 

				var newChunks = [];
				for(var i = 0; i < chunks.length; i++){
					if((i + 1) % renderDistance != 0){
						newChunks.push(chunks[i]);
					}
				}

				// add blocks
				var lowestX = lowestXBlock();
				var lowestZ = lowestZBlock();

				for(var i = 0; i < renderDistance; i++){
					var chunk = [];
					for(var x = lowestX + (i * chunkSize * 5); x < lowestX + (i * chunkSize * 5) + (chunkSize * 5); x = x + 5){
						for(var z = lowestZ - (chunkSize * 5); z < lowestZ; z = z + 5){
							xoff = inc * x / 5;
							zoff = inc * z / 5;
							var v = Math.round(noise.perlin2(xoff, zoff) * amplitude / 5) * 5;
							chunk.push(new Block(x, v, z));
						}
					}
					newChunks.splice(i * renderDistance, 0, chunk);
				}

				chunks = newChunks;


				scene.remove(instancedChunk);

				instancedChunk = new THREE.InstancedMesh(blockBox, materialArray, renderDistance * renderDistance * chunkSize * chunkSize);
				var count = 0;
				for(var i = 0; i < chunks.length; i++){
					for(var j = 0; j < chunks[i].length; j++){
						let matrix = new THREE.Matrix4().makeTranslation(
							chunks[i][j].x,
							chunks[i][j].y,
							chunks[i][j].z
						);
						instancedChunk.setMatrixAt(count, matrix);
						count++;
					}
				}
				scene.add(instancedChunk);
			}

			if(camera.position.z >= highestZBlock() - (worldSize * ratio)){ 

				var newChunks = [];
				for(var i = 0; i < chunks.length; i++){
					if(i % renderDistance != 0){
						newChunks.push(chunks[i]);
					}
				}

				// add blocks
				var lowestX = lowestXBlock();
				var highestZ = highestZBlock();
				for(var i = 0; i < renderDistance; i++){
					var chunk = [];
					for(var x = lowestX + (i * chunkSize * 5); x < lowestX + (i * chunkSize * 5) + (chunkSize * 5); x = x + 5){
						for(var z = highestZ + 5; z < (highestZ + 5) + (chunkSize * 5); z = z + 5){
							xoff = inc * x / 5;
							zoff = inc * z / 5;
							var v = Math.round(noise.perlin2(xoff, zoff) * amplitude / 5) * 5;
							chunk.push(new Block(x, v, z));
						}
					}
					newChunks.splice(((i + 1) * renderDistance) - 1, 0, chunk);
				}

				chunks = newChunks;

				scene.remove(instancedChunk);

				instancedChunk = new THREE.InstancedMesh(blockBox, materialArray, renderDistance * renderDistance * chunkSize * chunkSize);
				var count = 0;
				for(var i = 0; i < chunks.length; i++){
					for(var j = 0; j < chunks[i].length; j++){
						let matrix = new THREE.Matrix4().makeTranslation(
							chunks[i][j].x,
							chunks[i][j].y,
							chunks[i][j].z
						);
						instancedChunk.setMatrixAt(count, matrix);
						count++;
					}
				}
				scene.add(instancedChunk);		
			}

			if(camera.position.x >= highestXBlock() - (worldSize * ratio)){ 

				var newChunks = [];
				for(var i = renderDistance; i < chunks.length; i++){
					newChunks.push(chunks[i]);
				}

				// add blocks
				var highestX = highestXBlock();
				var lowestZ = lowestZBlock();

				for(var i = 0; i < renderDistance; i++){
					var chunk = [];
					for(var z = lowestZ + (i * chunkSize * 5); z < lowestZ + (i * chunkSize * 5) + (chunkSize * 5); z = z + 5){
						for(var x = highestX + 5; x < highestX + 5 + (chunkSize * 5); x = x + 5){
							xoff = inc * x / 5;
							zoff = inc * z / 5;
							var v = Math.round(noise.perlin2(xoff, zoff) * amplitude / 5) * 5;
							chunk.push(new Block(x, v, z));
						}
					}
					newChunks.splice(chunks.length - (renderDistance - i), 0, chunk);
				}

				chunks = newChunks;

				scene.remove(instancedChunk);

				instancedChunk = new THREE.InstancedMesh(blockBox, materialArray, renderDistance * renderDistance * chunkSize * chunkSize);
				var count = 0;
				for(var i = 0; i < chunks.length; i++){
					for(var j = 0; j < chunks[i].length; j++){
						let matrix = new THREE.Matrix4().makeTranslation(
							chunks[i][j].x,
							chunks[i][j].y,
							chunks[i][j].z
						);
						instancedChunk.setMatrixAt(count, matrix);
						count++;
					}
				}
				scene.add(instancedChunk);				
			}

			if(camera.position.x <= lowestXBlock() + (worldSize * ratio)){ 

				var newChunks = [];
				for(var i = 0; i < chunks.length - renderDistance; i++){
					newChunks.push(chunks[i]);
				}

				// add blocks
				var lowestX = lowestXBlock();
				var lowestZ = lowestZBlock();
				for(var i = 0; i < renderDistance; i++){
					var chunk = [];
					for(var z = lowestZ + (i * chunkSize * 5); z < lowestZ + (i * chunkSize * 5) + (chunkSize * 5); z = z + 5){
						for(var x = lowestX - (chunkSize * 5); x < lowestX; x = x + 5){
							xoff = inc * x / 5;
							zoff = inc * z / 5;
							var v = Math.round(noise.perlin2(xoff, zoff) * amplitude / 5) * 5;
							chunk.push(new Block(x, v, z));
						}
					}
					newChunks.splice(i, 0, chunk);
				}

				chunks = newChunks;

				scene.remove(instancedChunk);

				instancedChunk = new THREE.InstancedMesh(blockBox, materialArray, renderDistance * renderDistance * chunkSize * chunkSize);
				var count = 0;
				for(var i = 0; i < chunks.length; i++){
					for(var j = 0; j < chunks[i].length; j++){
						let matrix = new THREE.Matrix4().makeTranslation(
							chunks[i][j].x,
							chunks[i][j].y,
							chunks[i][j].z
						);
						instancedChunk.setMatrixAt(count, matrix);
						count++;
					}
				}
				scene.add(instancedChunk);	
			}
		}

		function lowestXBlock(){
			var xPosArray = [];
			for(var i = 0; i < chunks.length; i++){
				for(var j = 0; j < chunks[i].length; j++){
					xPosArray.push(chunks[i][j].x);
				}
			}
			return Math.min.apply(null, xPosArray);
		}

		function highestXBlock(){
			var xPosArray = [];
			for(var i = 0; i < chunks.length; i++){
				for(var j = 0; j < chunks[i].length; j++){
					xPosArray.push(chunks[i][j].x);
				}
			}
			return Math.max.apply(null, xPosArray);
		}

		function lowestZBlock(){
			var zPosArray = [];
			for(var i = 0; i < chunks.length; i++){
				for(var j = 0; j < chunks[i].length; j++){
					zPosArray.push(chunks[i][j].z);
				}
			}
			return Math.min.apply(null, zPosArray);
		}

		function highestZBlock(){
			var zPosArray = [];
			for(var i = 0; i < chunks.length; i++){
				for(var j = 0; j < chunks[i].length; j++){
					zPosArray.push(chunks[i][j].z);
				}
			}
			return Math.max.apply(null, zPosArray);
		}

		// Resize Window
		window.addEventListener("resize", function(){
			renderer.setSize(window.innerWidth, window.innerHeight);
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
		});

		const raycaster = new THREE.Raycaster();
		const pointer = new THREE.Vector2();
		pointer.x = (0.5) * 2 - 1;
		pointer.y = -1 * (0.5) * 2 + 1;

		var plane;
		function render(){
			raycaster.setFromCamera(pointer, camera);
			var intersection = raycaster.intersectObject(instancedChunk);
			if(intersection[0] != undefined && intersection[0].distance < 40){
				//console.log(intersection[0]);
				if(!scene.children.includes(plane)){
					var planeG = new THREE.PlaneGeometry(5, 5);
					var planeM = new THREE.MeshBasicMaterial({color : 0xffffff, side : THREE.DoubleSide});
					planeM.transparent = true;
					planeM.opacity = 0.5;
					plane = new THREE.Mesh(planeG, planeM);
					scene.add(plane);
				} else {
					plane.visible = true;
					var materialIndex = intersection[0].face.materialIndex;
					var position = intersection[0].point; // object with x, y and z coords
					var x = 0;
					var y = 0;
					var z = 0;
					const inc = 0.1; 
					switch(materialIndex){
						case 0: // right
							plane.rotation.x = 0;
							plane.rotation.y = (Math.PI / 2);
							plane.rotation.z = 0;
							x = position.x + inc;
							y = Math.round(position.y / 5) * 5;
							z = Math.round(position.z / 5) * 5;
							break;
						case 1: // left
							plane.rotation.x = 0;
							plane.rotation.y = (Math.PI / 2);
							plane.rotation.z = 0;
							x = position.x - inc;
							y = Math.round(position.y / 5) * 5;
							z = Math.round(position.z / 5) * 5;
							break;
						case 2: // top
							plane.rotation.x = (Math.PI / 2);
							plane.rotation.y = 0;
							plane.rotation.z = 0;
							x = Math.round(position.x / 5) * 5;
							y = position.y + inc;
							z = Math.round(position.z / 5) * 5;
							break;
						case 3: // bottom
							plane.rotation.x = (Math.PI / 2);
							plane.rotation.y = 0;
							plane.rotation.z = 0;
							x = Math.round(position.x / 5) * 5;
							y = position.y - inc;
							z = Math.round(position.z / 5) * 5;
							break;
						case 4: // front
							plane.rotation.x = 0;
							plane.rotation.y = 0;
							plane.rotation.z = 0;
							x = Math.round(position.x / 5) * 5;
							y = Math.round(position.y / 5) * 5;
							z = position.z + inc;
							break;
						case 5: // back
							plane.rotation.x = 0;
							plane.rotation.y = 0;
							plane.rotation.z = 0;
							x = Math.round(position.x / 5) * 5;
							y = Math.round(position.y / 5) * 5;
							z = position.z - inc;
							break;
					}
					plane.position.x = x;
					plane.position.y = y;
					plane.position.z = z;
				}
			} else {
				if(plane){
					plane.visible = false;
				}
			}

			renderer.render(scene, camera);
		}

		function GameLoop(){
			requestAnimationFrame(GameLoop);
			update();
			render();
		}

		GameLoop();