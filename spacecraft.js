function Spacecraft(gl) {
  this.gl = gl;
  this.shininess = 64;
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
  this.vertexNormalBuffer = this.gl.createBuffer();
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexNormalBuffer);
  this.gl.bufferData(this.gl.ARRAY_BUFFER, new WebGLFloatArray(spacecraftData.vertexNormals), this.gl.STATIC_DRAW);
  this.vertexNormalBuffer.itemSize = 3;
  this.vertexNormalBuffer.numItems = spacecraftData.vertexNormals.length / 3;

  this.vertexTextureCoordBuffer = this.gl.createBuffer();
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
  this.gl.bufferData(this.gl.ARRAY_BUFFER, new WebGLFloatArray(spacecraftData.vertexTextureCoords), this.gl.STATIC_DRAW);
  this.vertexTextureCoordBuffer.itemSize = 2;
  this.vertexTextureCoordBuffer.numItems = spacecraftData.vertexTextureCoords.length / 2;

  this.vertexPositionBuffer = this.gl.createBuffer();
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
  this.gl.bufferData(this.gl.ARRAY_BUFFER, new WebGLFloatArray(spacecraftData.vertexPositions), this.gl.STATIC_DRAW);
  this.vertexPositionBuffer.itemSize = 3;
  this.vertexPositionBuffer.numItems = spacecraftData.vertexPositions.length / 3;

  this.vertexIndexBuffer = this.gl.createBuffer();
  this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
  this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new WebGLUnsignedShortArray(spacecraftData.indices), this.gl.STREAM_DRAW);
  this.vertexIndexBuffer.itemSize = 3;
  this.vertexIndexBuffer.numItems = spacecraftData.indices.length;
}


Spacecraft.prototype.draw = function(shaderProgram) {
  if (this.vertexPositionBuffer == null || this.vertexNormalBuffer == null || this.vertexTextureCoordBuffer == null || this.vertexIndexBuffer == null) {
    return;
  }

  this.gl.uniform1i(shaderProgram.useTexturesUniform, false);

  this.gl.uniform1f(shaderProgram.materialShininessUniform, this.shininess);

  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
  this.gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
  this.gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.vertexTextureCoordBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexNormalBuffer);
  this.gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.vertexNormalBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

  this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
  setMatrixUniforms();
  this.gl.drawElements(this.gl.TRIANGLES, this.vertexIndexBuffer.numItems, this.gl.UNSIGNED_SHORT, 0);
}
