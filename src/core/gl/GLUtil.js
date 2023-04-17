var gl = undefined;

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
}

export { gl };
export { GLUtil };
