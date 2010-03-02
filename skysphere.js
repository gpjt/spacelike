function SkySphere(gl) {
  this.gl = gl;
  this.colorMap = loadTexture("gigapixel-milky-way.gif");  
  this.mesh = createSphereMesh(gl, 1);
}


SkySphere.prototype.draw = function(shaderProgram, size) {
  if (this.mesh == null) {
    return;
  }
  
  this.gl.mvPushMatrix();
  
  this.gl.uniform1i(shaderProgram.useLightingUniform, false);

  this.gl.mvScale(size, size, size);

  this.gl.uniform1i(shaderProgram.useColorMapUniform, true);
  this.gl.activeTexture(gl.TEXTURE0);
  this.gl.bindTexture(gl.TEXTURE_2D, this.colorMap);
  this.gl.uniform1i(shaderProgram.colorMapSamplerUniform, 0);
  
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
  
  // No matter what size this is, we want everything to overwrite it.  Clearing the depth buffer
  // effectively makes points on the skysphere infinitely distant.
  gl.clear(gl.DEPTH_BUFFER_BIT);
}
