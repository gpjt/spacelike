function Earth(gl, location) {
  this.gl = gl;
  this.mass = 5973600000000000000000000;
  this.location = location;
  this.velocity = V3.$(0, 0, 0);
  this.acceleration = V3.$(0, 0, 0);

  this.colorMap = loadTexture("earth.jpg");  
  this.specularMap = loadTexture("earth-specular.gif");
  
  this.mesh = createSphereMesh(gl, 6371);
  
  this.rotateAngle = 0;
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
  elapsed /= 1000;
  this.location = V3.add(this.location, V3.add(V3.scale(this.velocity, elapsed), V3.scale(this.acceleration, 0.5 * elapsed * elapsed)));
  this.velocity = V3.add(this.velocity, V3.scale(this.acceleration, elapsed));

  // Spin at 360 degrees/day == 0.00416 degrees/second.
  this.rotateAngle += 0.00416 * elapsed;
}
