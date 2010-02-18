function Sun(gl, location) {
  this.gl = gl;
  this.location = location;
  this.mesh = createSphereMesh(gl, 1392000);
}


function M4x4_transform(m, v, r) {
  if (r == undefined) {
    r = new MJS_FLOAT_ARRAY_TYPE(3);
  }
  
  var w = 1;
  r[0] = v[0] * m[0] + v[1] * m[4] + v[2] * m[8] +  w * m[12];
  r[1] = v[0] * m[1] + v[1] * m[5] + v[2] * m[9] +  w * m[13];
  r[2] = v[0] * m[2] + v[1] * m[6] + v[2] * m[10] +  w * m[14];
  
  return r
}
M4x4.transform = M4x4_transform;


Sun.prototype.draw = function(shaderProgram, offset) {
  if (this.mesh == null) {
    return;
  }
  
  this.gl.mvPushMatrix();
  
  var location = V3.sub(this.location, offset);
  this.gl.mvTranslate(location);
  
  gl.uniform1i(shaderProgram.useLightingUniform, true);

  var eyeSpaceLocation = M4x4.transform(this.gl.mvMatrix, V3.$(0, 0, 0));
  gl.uniform3f(shaderProgram.pointLightingLocationUniform, eyeSpaceLocation[0], eyeSpaceLocation[1], eyeSpaceLocation[2]);
  gl.uniform3f(shaderProgram.pointLightingSpecularColorUniform, 2, 2, 2);
  gl.uniform3f(shaderProgram.pointLightingDiffuseColorUniform, 1, 1, 1);

  
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


Sun.prototype.animate = function(elapsed) {
}