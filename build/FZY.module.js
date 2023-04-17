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

// Represents a webGL Shader
class Shader {

  _program = 0;
  _attributes;
  _uniforms;

  /**
  @brief Creates an instance of a shader program, links the program and frees the shaders
  @param vShader vertex shader
  @param fShader fragment Shader
  @param doValidate true to debug
  */
  constructor( vShader, fShader, doValidate ) {
    let vSdr = this.#createShader( vShader, gl.VERTEX_SHADER );
    let fSdr = this.#createShader( fShader, gl.FRAGMENT_SHADER );
    this._program = this.#createProgram( vSdr, fSdr, doValidate );
  }

  #createShader( src, type ) {
    var shader = gl.createShader( type );
    gl.shaderSource( shader, src );
    gl.compileShader( shader );
    // Get Errror data if shader failed compiling
    if( !gl.getShaderParameter( shader, gl.COMPILE_STATUS )) {
      console.error( "Error compiling shader : " + src, gl.getShaderInfoLog( shader ) );
      gl.deleteShader( shader );
      return null;
    }
    return shader;
  }

  #createProgram( vShader, fShader, doValidate ) {
    let prog = gl.createProgram( );
    gl.attachShader( prog, vShader );
    gl.attachShader( prog, fShader );
    gl.linkProgram( prog );

    // check if successful
    if ( !gl.getProgramParameter( prog, gl.LINK_STATUS )){
      console.error( "Error creating shader program.", gl.getProgramInfoLog(prog) );
      gl.deleteProgram(prog );
    }

    if ( doValidate ){
      gl.validateProgram( prog );
      if ( !gl.getProgramParameter( prog, gl.VALIDATE_STATUS ) ) {
        console.error( "Error validating program", gl.getProgramInfoLog( prog) );
        gl.deleteProgram( prog ); return null;
      }
    }

    // can delete the shader since the prgram has been made
    gl.deleteShader( vShader );
    gl.deleteShader( fShader );
    return prog;
  }

  use( ) {
    gl.useProgram( this.program );
  }
}

const ShaderLib = {
  point: {
    vertexShader:  `#version 300 es
    in vec3 a_position;

    uniform float uPointSize;

    void main( void ) {
      gl_PointSize = uPointSize;
      gl_Position = vec4( a_position, 1.0 );
    }`,

    fragmentShader:  `#version 300 es
    precision mediump float;

    out vec4 finalColor;

    void main( void ){
      finalColor = vec4( 0.0, 0.0, 0.0, 1.0 );
    }`
  }
};

let instance;  // instance for the singleton

class EngineSingleton {
  constructor( ) {
    if( instance ) {
      throw new Error( "Cannot create another instance of singleton Engine" );
    }
    instance = this;
  }

  initialize( canvasID ) {
    // initialize GLUtils
    GLUtil.initialize( canvasID );
    GLUtil.setSize( 500, 500 );
    GLUtil.clear( );

    let shader = new Shader( ShaderLib.point.vertexShader, ShaderLib.point.fragmentShader, true );
    gl.useProgram( shader._program );
    let aPositionLoc = gl.getAttribLocation( shader._program, "a_position" );
    let uPointSizeLoc = gl.getUniformLocation( shader._program, "uPointSize" );
    gl.useProgram( null );
    var aryVerts = new Float32Array([ 0, 0, 0, 0.5, 0.5, 0 ] );
    var bufVerts = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufVerts );
    gl.bufferData( gl.ARRAY_BUFFER, aryVerts, gl.STATIC_DRAW );
    gl.bindBuffer( gl.ARRAY_BUFFER, null );

    // Set up for drawing
    gl.useProgram( shader._program );
    gl.uniform1f( uPointSizeLoc, 50.0 );

    gl.bindBuffer( gl.ARRAY_BUFFER, bufVerts );
    gl.enableVertexAttribArray( aPositionLoc );
    gl.vertexAttribPointer( aPositionLoc, 3, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer( gl.ARRAY_BUFFER, null );

    gl.drawArrays( gl.POINTS, 0, 2 );
  }

  loop( ) {

  }

  shutdown( ) {

  }
}

let Engine = new EngineSingleton();

export { Engine, GLUtil, gl };
