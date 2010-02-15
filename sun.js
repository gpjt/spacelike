function Sun(gl, location) {
  this.gl = gl;
  this.location = location;
  this.mesh = createSphereMesh(gl, 1392000);
}


Sun.prototype.draw = function(shaderProgram, offset) {
  if (this.mesh == null) {
    return;
  }
  
  this.gl.mvPushMatrix();
  
  var x = this.location[0] - offset[0];
  var y = this.location[1] - offset[1];
  var z = this.location[2] - offset[2];
  this.gl.mvTranslate([x, y, z]);
  
  gl.uniform1i(shaderProgram.useLightingUniform, true);

  gl.uniform3f(shaderProgram.pointLightingLocationUniform, x, y, z);
  gl.uniform3f(shaderProgram.pointLightingSpecularColorUniform, 0.8, 0.8, 0.8);
  gl.uniform3f(shaderProgram.pointLightingDiffuseColorUniform, 0.8, 0.8, 0.8);

  
  this.gl.uniform1i(shaderProgram.useColorMapUniform, false);
  this.gl.uniform4f(shaderProgram.colorUniform, 1.0, 1.0, 1.0, 1.0);
  this.gl.uniform1i(shaderProgram.useLightingUniform, false);
  this.gl.uniform1i(shaderProgram.useSpecularMapUniform, false);

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


Sun.prototype.offset = function(location) {
  var x = location[0] + this.location[0];
  var y = location[1] + this.location[1];
  var z = location[2] + this.location[2];
  return [x, y, z];
}


Sun.prototype.animate = function(elapsed) {
}