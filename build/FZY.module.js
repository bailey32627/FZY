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

// Represents a webGL Shader
class Shader {

  _program = 0;
  _attributes;
  _uniforms;

  /**
  @brief Creates an instance of a shader program, links the program and frees the shaders
  @param name The name of the shader
  @param vShader vertex shader
  @param fShader fragment Shader
  @param doValidate true to debug
  */
  constructor( name, vShader, fShader, doValidate ) {
    let vSdr = this.#createShader( vShader, gl.VERTEX_SHADER );
    let fSdr = this.#createShader( fShader, gl.FRAGMENT_SHADER );
    this._program = this.#createProgram( vSdr, fSdr, doValidate );
    this._name = name;
    this._attributes = new Map();
    this._uniforms = new Map();

    this.#detectAttributes( );
    this.#detectUniforms( );
  }

  /**
  @brief Creates a shader from the source provided and type
  @src The source code for the shader
  @type The type of shader this is ( ie gl.VERTEX_SHADER or gl.FRAGMENT_SHADER )
   */
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

  /**
  @brief Detects the active attribtues in this shader
  */
  #detectAttributes( ) {
    let attribCount = gl.getProgramParameter( this._program, gl.ACTIVE_ATTRIBUTES );
    for ( let i = 0; i < attribCount; ++i ) {
      let info = gl.getActiveAttrib( this._program, i );
      if( !info ) { break }      this._attributes[ info.name ] = gl.getAttribLocation( this._program, info.name );
    }
  }

  /**
  @brief Retrieves the attributes location from the shader
  */
  getAttributeLocation( name ) {
    if( this._attributes[ name ] === undefined ) {
      throw new Error( `Unable to find attribute named ${name} in shader ${this._name}` );
    }
    return this._attributes[ name ];
  }

  /**
  @brief Detects the active uniforms in this shader
  */
  #detectUniforms( ) {
    let uniformCount = gl.getProgramParameter( this._program, gl.ACTIVE_UNIFORMS );
    for ( let i = 0; i < uniformCount; ++i ){
      let info = gl.getActiveUniform( this._program, i );
      if( !info ) { break; }
      this._uniforms[ info.name ] = gl.getUniformLocation( this._program, info.name );
    }
  }

  /**
  @brief Retrieves the uniforms location in the shader
  @param name The name of the uniform
  */
  getUniformLocation( name ) {
    if( this._uniforms[ name ] === undefined ) {
      throw new Error( `Unable to find uniform named ${name} in shader ${this._name}`);
    }
    return this._uniforms[ name ];
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

class RenderLoop {
  constructor( callback, fps ) {
    var oThis = this;

    this.lastFrame = null;     // The time in illiseconds of the last frame
    this.callback = callback;  // what fucntion to call for each frame
    this.isActive = false;     // control the on/off state of the render loop
    this.fps = 0;              // Save the value of fast to loop

    if ( !fps && fps > 0 ) { // build a run method that limits the framerate
      this.fpsLimit = 1000/fps; // calculate how many milliseconds per frame in one second of time

      this.run = function( ) {
        // calculate the deltatime between frames and the fps currently
        var current = performance.now(),
        delta = ( current - oThis.lastFrame ),
        deltaTime = delta / 1000.0;  // what fraction of a single second is the delta time

        if( delta >= oThis.fpsLimit ) { // now execute frame since the time has elasped
          oThis.fps = Math.floor( 1/deltaTime );
          oThis.lastFrame = current;
          oThis.callback( deltaTime );
        }

        if ( oThis.isActive ){ window.requestAnimationFrame( oThis.run ); }
      };

    } else {

       // build a run method that optimsied as much as possible
       this.run = function( ){
         // calculate the deltatime betweeen frames and the fps currently
         var current = performance.now(),
         deltaTime = ( current - oThis.lastFrame ) / 1000.0; // ms between frames / 1 seconds

         // new execute frame since the time has elasped
         oThis.fps = Math.floor( 1/ deltaTime );
         oThis.lastFrame = current;
         oThis.callback( deltaTime );
         if( oThis.isActive ) { window.requestAnimationFrame( oThis.run ); }
       };
    }
  }

  start( ) {
    this.isActive = true;
    this.lastFrame = performance.now();
    window.requestAnimationFrame( this.run );
    return this;
  }

  stop( ) {
    this.isActive = false;
  }
}

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

    let shader = new Shader( 'point', ShaderLib.point.vertexShader, ShaderLib.point.fragmentShader, true );
    gl.useProgram( shader._program );
    let aPositionLoc = shader.getAttributeLocation( "a_position" );
    this.uPointSizeLoc = shader.getUniformLocation( 'uPointSize' );
    gl.useProgram( null );
    var aryVerts = new Float32Array([ 0, 0, 0, 0.5, 0.5, 0 ] );
    var bufVerts = GLUtil.createArrayBuffer( aryVerts );

    // Set up for drawing
    gl.useProgram( shader._program );
    gl.uniform1f( this.uPointSizeLoc, 50.0 );

    gl.bindBuffer( gl.ARRAY_BUFFER, bufVerts );
    gl.enableVertexAttribArray( aPositionLoc );
    gl.vertexAttribPointer( aPositionLoc, 3, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer( gl.ARRAY_BUFFER, null );

    this.rLoop = new RenderLoop( this.onRender ).start();
  }

  onRender(dt ) {
    GLUtil.clear();
    gl.drawArrays( gl.POINTS, 0, 2 );
  }

  shutdown( ) {

  }
}

let Engine = new EngineSingleton();

export { Engine, GLUtil, gl };
