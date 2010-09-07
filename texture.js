function handleLoadedTexture(texture) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
      gl.TEXTURE_2D, 0,
      gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
      texture.image
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);

  gl.bindTexture(gl.TEXTURE_2D, null);
}


function loadTexture(url) {
  var result = gl.createTexture();
  result.image = new Image();
  result.image.onload = function() {
    handleLoadedTexture(result)
  };
  result.image.src = url;
  return result;
}
