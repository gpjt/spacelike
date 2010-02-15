function createSphereMesh(gl, radius) {
  var latitudeBands = 30;
  var longitudeBands = 30;
  var radius = radius;

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


