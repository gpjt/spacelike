function Spacecraft(gl, location) {
  this.gl = gl;
  this.shininess = 64;
  this.location = location;
  this.acceleration = 0;
  this.speed = 0;
  this.load();
}


Spacecraft.prototype.load = function() {
  var request = new XMLHttpRequest();
  request.open("GET", "spacecraft.json");
  var spacecraft = this;
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      spacecraft.onLoaded(JSON.parse(request.responseText));
    }
  }
  request.send();
}


Spacecraft.prototype.onLoaded = function(spacecraftData) {
  var mesh = {}
  
  mesh.vertexNormalBuffer = this.gl.createBuffer();
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.vertexNormalBuffer);
  this.gl.bufferData(this.gl.ARRAY_BUFFER, new WebGLFloatArray(spacecraftData.vertexNormals), this.gl.STATIC_DRAW);
  mesh.vertexNormalBuffer.itemSize = 3;
  mesh.vertexNormalBuffer.numItems = spacecraftData.vertexNormals.length / 3;

  mesh.vertexTextureCoordBuffer = this.gl.createBuffer();
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.vertexTextureCoordBuffer);
  this.gl.bufferData(this.gl.ARRAY_BUFFER, new WebGLFloatArray(spacecraftData.vertexTextureCoords), this.gl.STATIC_DRAW);
  mesh.vertexTextureCoordBuffer.itemSize = 2;
  mesh.vertexTextureCoordBuffer.numItems = spacecraftData.vertexTextureCoords.length / 2;

  mesh.vertexPositionBuffer = this.gl.createBuffer();
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.vertexPositionBuffer);
  this.gl.bufferData(this.gl.ARRAY_BUFFER, new WebGLFloatArray(spacecraftData.vertexPositions), this.gl.STATIC_DRAW);
  mesh.vertexPositionBuffer.itemSize = 3;
  mesh.vertexPositionBuffer.numItems = spacecraftData.vertexPositions.length / 3;

  mesh.vertexIndexBuffer = this.gl.createBuffer();
  this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, mesh.vertexIndexBuffer);
  this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new WebGLUnsignedShortArray(spacecraftData.indices), this.gl.STREAM_DRAW);
  mesh.vertexIndexBuffer.itemSize = 3;
  mesh.vertexIndexBuffer.numItems = spacecraftData.indices.length;
  
  this.mesh = mesh;
}


Spacecraft.prototype.draw = function(shaderProgram, offset) {
  if (this.mesh == null) {
    return;
  }
  
  this.gl.mvPushMatrix();
  
  var x = this.location[0] - offset[0];
  var y = this.location[1] - offset[1];
  var z = this.location[2] - offset[2];
  this.gl.mvTranslate([x, y, z]);

  this.gl.uniform1i(shaderProgram.useLightingUniform, true);

  this.gl.uniform1i(shaderProgram.useColorMapUniform, false);
  this.gl.uniform4f(shaderProgram.colorUniform, 1.0, 1.0, 1.0, 1.0);
  this.gl.uniform1i(shaderProgram.useSpecularMapUniform, false);
  this.gl.uniform1f(shaderProgram.shininessUniform, this.shininess);

  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mesh.vertexPositionBuffer);
  this.gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.mesh.vertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mesh.vertexTextureCoordBuffer);
  this.gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.mesh.vertexTextureCoordBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mesh.vertexNormalBuffer);
  this.gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.mesh.vertexNormalBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

  this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.mesh.vertexIndexBuffer);
  setMatrixUniforms();
  this.gl.drawElements(this.gl.TRIANGLES, this.mesh.vertexIndexBuffer.numItems, this.gl.UNSIGNED_SHORT, 0);
  
  this.gl.mvPopMatrix();
}



Spacecraft.prototype.animate = function(elapsed) {
  elapsed /= 1000;
  this.acceleration += 0.00981 * elapsed;
  this.speed += this.acceleration * elapsed;
  var distanceTraveled = (this.speed * elapsed) + 0.5 * (this.acceleration * elapsed ^ 2);
  this.location = [this.location[0], this.location[1], this.location[2] - distanceTraveled];
}
