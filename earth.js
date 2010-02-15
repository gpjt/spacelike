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
  
  this.mesh = createSphereMesh(gl, 6371);
  
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


Earth.prototype.draw = function(shaderProgram, offset) {
  if (this.mesh == null) {
    return;
  }
  
  this.gl.mvPushMatrix();
  
  this.gl.mvTranslate(V3.sub(this.location, offset));
  
  this.gl.mvRotate(this.rotateAngle, [0, 1, 0]);
  
  this.gl.uniform1i(shaderProgram.useLightingUniform, true);

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


Earth.prototype.animate = function(elapsed) {
  this.rotateAngle += (10 * elapsed) / 1000;
}