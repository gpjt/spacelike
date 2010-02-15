function Earth(gl, location) {
  this.gl = gl;
  this.shininess = 32;
  this.location = location;

  var colorMap = gl.createTexture();
  colorMap.image = new Image();
  colorMap.image.onload = function() {
    handleLoadedTexture(colorMap)
  };
  colorMap.image.src = "earth.jpg";
  this.colorMap = colorMap;
  
  var specularMap = gl.createTexture();
  specularMap.image = new Image();
  specularMap.image.onload = function() {
    handleLoadedTexture(specularMap)
  };
  specularMap.image.src = "earth-specular.gif";
  this.specularMap = specularMap;
  
  this.mesh = createSphereMesh(gl);
  
  this.rotateAngle = 0;
}


function handleLoadedTexture(texture) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, texture.image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);

  gl.bindTexture(gl.TEXTURE_2D, null);
}


function createSphereMesh(gl) {
  var latitudeBands = 30;
  var longitudeBands = 30;
  var radius = 6371 / 2;

  var vertexPositionData = [];
  var normalData = [];
  var textureCoordData = [];
  for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
    var theta = latNumber * Math.PI / latitudeBands;
    var sinTheta = Math.sin(theta);
    var cosTheta = Math.cos(theta);

    for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
      var phi = longNumber * 2 * Math.PI / longitudeBands;
      var sinPhi = Math.sin(phi);
      var cosPhi = Math.cos(phi);

      var x = cosPhi * sinTheta;
      var y = cosTheta;
      var z = sinPhi * sinTheta;
      var u = 1 - (longNumber / longitudeBands);
      var v = 1 - (latNumber / latitudeBands);

      normalData.push(x);
      normalData.push(y);
      normalData.push(z);
      textureCoordData.push(u);
      textureCoordData.push(v);
      vertexPositionData.push(radius * x);
      vertexPositionData.push(radius * y);
      vertexPositionData.push(radius * z);
    }
  }


  var indexData = [];
  for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
    for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
      var first = (latNumber * (longitudeBands + 1)) + longNumber;
      var second = first + longitudeBands + 1;
      indexData.push(first);
      indexData.push(second);
      indexData.push(first + 1);

      indexData.push(second);
      indexData.push(second + 1);
      indexData.push(first + 1);
    }
  }

  var result = {}
  result.vertexNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, result.vertexNormalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new WebGLFloatArray(normalData), gl.STATIC_DRAW);
  result.vertexNormalBuffer.itemSize = 3;
  result.vertexNormalBuffer.numItems = normalData.length / 3;

  result.vertexTextureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, result.vertexTextureCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new WebGLFloatArray(textureCoordData), gl.STATIC_DRAW);
  result.vertexTextureCoordBuffer.itemSize = 2;
  result.vertexTextureCoordBuffer.numItems = textureCoordData.length / 2;

  result.vertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, result.vertexPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new WebGLFloatArray(vertexPositionData), gl.STATIC_DRAW);
  result.vertexPositionBuffer.itemSize = 3;
  result.vertexPositionBuffer.numItems = vertexPositionData.length / 3;

  result.vertexIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, result.vertexIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new WebGLUnsignedShortArray(indexData), gl.STREAM_DRAW);
  result.vertexIndexBuffer.itemSize = 3;
  result.vertexIndexBuffer.numItems = indexData.length;

  return result;
};


Earth.prototype.draw = function(shaderProgram, offset) {
  if (this.mesh == null) {
    return;
  }
  
  this.gl.mvPushMatrix();
  
  var x = this.location[0] - offset[0];
  var y = this.location[1] - offset[1];
  var z = this.location[2] - offset[2];
  this.gl.mvTranslate([x, y, z]);
  
  this.gl.mvRotate(this.rotateAngle, [0, 1, 0]);

  this.gl.uniform1i(shaderProgram.useColorMapUniform, true);
  this.gl.activeTexture(gl.TEXTURE0);
  this.gl.bindTexture(gl.TEXTURE_2D, this.colorMap);
  this.gl.uniform1i(shaderProgram.colorMapSamplerUniform, 0);
  
  this.gl.uniform1i(shaderProgram.useSpecularMapUniform, true);
  this.gl.activeTexture(gl.TEXTURE1);
  this.gl.bindTexture(gl.TEXTURE_2D, this.specularMap);
  this.gl.uniform1i(shaderProgram.specularMapSamplerUniform, 1);

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


Earth.prototype.offset = function(location) {
  var x = location[0] - this.location[0];
  var y = location[1] - this.location[1];
  var z = location[2] - this.location[2];
  return [x, y, z];
}


Earth.prototype.animate = function(elapsed) {
  this.rotateAngle += (10 * elapsed) / 1000;
}