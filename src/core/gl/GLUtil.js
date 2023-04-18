var gl = undefined;

const Attributes = {
  POSITION_NAME: 'a_position',
  POSITION_LOC: 0,
  NORMAL_NAME: 'a_normal',
  NORMAL_LOC: 1,
  UV_NAME: 'a_uvs',
  UV_LOC: 2
};

class GLUtil {

  canvas = undefined;

  static initialize( elementID ) {


    if ( elementID !== undefined ) {
      this.canvas = document.getElementById( elementID );
      if ( this.canvas === null ) {
        throw new Error( "Cannot find a canvas element named: " + elementID );
      }
    } else {
      this.canvas = document.createElement( "canvas" );
      document.body.appendChild( canvas );
    }

    gl = this.canvas.getContext( "webgl2" );
    if( !gl ) { throw new Error( "WebGL context is not available" ); }

    // setup GL, set all the default configurations we need.
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 ); // set the clear color
  }

  /**
  @brief Clears the color and depth buffers in webGL
  */
  static clear( ) {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    return this;
  }

  /**
  @brief Set the size fo the canvas html element and the rendering view port
  @param w width
  @param h height
  */
  static setSize( w, h ) {
    this.canvas.style.width = w + "px";
    this.canvas.style.height = h + "px";
    this.canvas.width = w;
    this.canvas.height = h;

    // reset the viewport to the canvas size
    gl.viewport( 0, 0, w, h );
  }

  /**
  @brief Creates and fills an array buffer
  @param floatArray Float32Array
  @param isStatic boolean indicating if the buffer is static
  */
  static createArrayBuffer( floatArray, isStatic ) {
    if ( isStatic === undefined ) { isStatic = true; }

    var buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
    gl.bufferData( gl.ARRAY_BUFFER, floatArray, (isStatic)? gl.STATIC_DRAW : gl.DYNAMIC_DRAW );
    gl.bindBuffer( gl.ARRAY_BUFFER, null );
    return buffer;
  }

}

export { gl };
export { GLUtil };
export { Attributes };
