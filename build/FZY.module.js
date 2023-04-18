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
  constructor( vShader, fShader, doValidate = false ) {
    let vSdr = this.#createShader( vShader, gl.VERTEX_SHADER );
    let fSdr = this.#createShader( fShader, gl.FRAGMENT_SHADER );
    this._program = this.#createProgram( vSdr, fSdr, doValidate );
    this.attribLoc = this.#getStandardAttribLocations( );
    this.uniformLoc = this.#getStandardUniformLocations();
  }

  /**
  @brief cleans up resources when shader is no longer needed
  */
  destroy( ) {
    if( gl.getParameter( gl.CURRENT_PROGRAM ) === this._program ) {
      gl.useProgram( null );
    }
    gl.deleteProgram( this._program );
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

    // for predefined locations fo rspecific attributes.
    gl.bindAttribLocation( prog, Attributes.POSITION_LOC, Attributes.POSITION_NAME );
    gl.bindAttribLocation( prog, Attributes.NORMAL_LOC, Attributes.NORMAL_NAME );
    gl.bindAttribLocation( prog, Attributes.UV_LOC, Attributes.UV_NAME );

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

  /**
  @brief Activates the shader for use
  */
  activate( ) {
    gl.useProgram( this._program );
    return this;
  }

  /**
  @brief Deactivates the shader so it will no longer be used
  */
  deactivate( ) {
    gl.useProgram( null );
    return this;
  }

  /**
  @brief Retrieves the standard attribute locations from this shader
  */
  #getStandardAttribLocations( ) {
    return {
      position: gl.getAttribLocation( this._program, Attributes.POSITION_NAME ),
      normal: gl.getAttribLocation( this._program, Attributes.NORMAL_NAME ),
      uv: gl.getAttribLocation( this._program, Attributes.UV_NAME )
    };
  }

  /**
  @brief Retrieves the standard uniform locations from this shader
  */
  #getStandardUniformLocations() {
    return {};
  }

  /**
  @brief Prepares the shader for rendering
  */
  prepareToRender( ) { } // abstract method, extended object may need to do something before rendering

  /**
  @brief Renders a model with this shader
  */
  renderModel( model ) {
    gl.bindVertexArray( model.mesh.vao );  // enable vao, this will set all the predefined attributes for the shader
    if ( model.mesh.indexCount ) {
      gl.drawElements( model.mesh.mode, model.mesh.indexCount, gl.UNSIGNED_SHORT, 0 );
    } else {
      gl.drawArrays( model.mesh.mode, 0, model.mesh.vertexCount );
    }
    gl.bindVertexArray( null );
    return this;
  }
}

const ShaderLib = {
  point: {
    vertexShader:  `#version 300 es
    in vec3 a_position;

    uniform mediump float uPointSize;
    uniform float uAngle;

    void main( void ) {
      gl_PointSize = uPointSize;
      gl_Position = vec4(
        cos(uAngle) * 0.8 * a_position.x,
        sin(uAngle) * 0.8 * a_position.y,
        a_position.z, 1.0 );
    }`,

    fragmentShader:  `#version 300 es
    precision mediump float;

    uniform float uPointSize;

    out vec4 finalColor;

    void main( void ){
      float c = ( 40.0 - uPointSize ) / 20.0;
      finalColor = vec4( c, c, c, 1.0 );
    }`
  }
};

class GeometryManager {
  constructor( ) {
    this.polygons = new Map();
  }

  /**
  @brief creates a vetex array object for the geometry
  @param name The name of this geometry
  @param verticesArray array of compact vertices
  @param indicesArray Array of shorts
  */
  createMesh( name, positions = null, normals = null, uvs = null, indices = null ) {
    let rtn = { mode: gl.TRIANGLES };
    // create and bind the vao
    rtn.vao = gl.createVertexArray();
    gl.bindVertexArray( rtn.vao );  // bind it so all the calls to vertexAttribPointer/enableVertexAttribArray is aved to the vao

    // set up vertices
    if( positions !== undefined && positions != null ){
      rtn.positionBuffer = gl.createBuffer( );
      rtn.positionComponentLen = 3;
      rtn.vertexCount = positions.length / rtn.positionComponentLen;

      gl.bindBuffer( gl.ARRAY_BUFFER, rtn.positionBuffer );
      gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( positions ), gl.STATIC_DRAW );
      gl.enableVertexAttribArray( Attributes.POSITION_LOC );
      gl.vertexAttribPointer( Attributes.POSITION_LOC, 3, gl.FLOAT, false, 0, 0 );
    }

    // set up normals
    if( normals !== undefined && normals != null ) {
      rtn.normalBuffer = gl.createBuffer();
      gl.bindBuffer( gl.ARRAY_BUFFER, rtn.normalBuffer );
      gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( normals ), gl.STATIC_DRAW );
      gl.enableVertexAttribArray( Attributes.NORMAL_LOC );
      gl.vertexAttribPointer( Attributes.NORMAL_LOC, 3, gl.FLOAT, false, 0, 0 );
    }

    // setup uvs
    if( uvs !== undefined && uvs != null ) {
      rtn.uvBuffer = gl.createBuffer( );
      gl.bindBuffer( gl.ARRAY_BUFFER, rtn.uvBuffer );
      gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( uvs ), gl.STATIC_DRAW );
      gl.enableVertexAttribArray( Attributes.UV_LOC );
      gl.vertexAttribPointer( Attributes.UV_LOC, 2, gl.FLOAT, false, 0, 0 );
    }

    if ( indices !== undefined && indices != null ) {
      rtn.indexBuffer = this.createBuffer();
      rtn.indexCount = indices.length;
      gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, rtn.indexBuffer );
      gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( indices ), gl.STATIC_DRAW );
      gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null );
    }

    // clean up
    gl.bindVertexArray( null ); // unbind the VAO, very IMPORTANT
    gl.bindBuffer( gl.ARRAY_BUFFER, null ); // unbind any buffers that might be set

    this.polygons[ name ] = rtn;
    return rtn;
  }

  /**
  @brief gets the geometry from the manager
  @param name The name of the geometry to retrieve
  */
  getGeometry( name ) {
    return this.polygons[ name ];
  }

  /**
  @brief Removes the geometry from the manger
  @param name The name of the geometry to remove
  */
  removeGeometry( name ) {
    this.polygons.delete( name );
  }

}

let Geometry = new GeometryManager();

class Model {
  constructor( meshData ) {
    this.mesh = meshData;
  }

  /**
  @brief Prepare the mesh for rendering
  */
  prepareToRender() {

  }
}

let instance;  // instance for the singleton

class TestShader extends Shader {
  constructor() {
    let vs = ShaderLib.point.vertexShader;
    let fs = ShaderLib.point.fragmentShader;
    super( vs, fs, true );

    // shader uses custom uniforms, this i sthe time to get its location for future use
    this.uniformLoc.uPointSize = gl.getUniformLocation( this._program, "uPointSize" );
    this.uniformLoc.uAngle = gl.getUniformLocation( this._program, "uAngle" );

    this.deactivate();
  }

  set( size, angle ) {
    gl.uniform1f( this.uniformLoc.uPointSize, size );
    gl.uniform1f( this.uniformLoc.uAngle, angle );
    return this;
  }
}

class EngineSingleton {

  constructor( ) {
    if( instance ) {
      throw new Error( "Cannot create another instance of singleton Engine" );
    }
    instance = this;

    this.fps = 60;
    this.fpsInterval = 1000.0 / this.fps;
    this.then;
    this.now;
    this.startTime;
    this.elaspedTime;

    // remove
    this.pointSize = 0;
    this.pointSizeStep = 3;
    this.angle = 0;
    this.angleStep = ( Math.PI / 180.0 ) * 90;
    this.uAngle = -1;
    this.model;
  }

  initialize( canvasID ) {
    // initialize GLUtils
    GLUtil.initialize( canvasID );
    GLUtil.setSize( 500, 700 );
    GLUtil.clear( );

    // setup shader
    this.shader = new TestShader();

    // setup mesh
    let mesh = Geometry.createMesh( "dots", [0, 0, 0] );
    mesh.mode = gl.POINTS;

    this.model = new Model( mesh );

    this.startAnimating( );
  }

  startAnimating( ) {
    this.then = Date.now();
    this.startTime = this.then;
    this.animate();
  }

  animate( ) {
    // request another animation frame
    requestAnimationFrame( this.animate.bind( this ) );
    // calculate elaspedTime
    this.now = Date.now();
    this.elaspedTime = this.now - this.then;
    // if enough time has elasped, draw the next frame
    if( this.elaspedTime > this.fpsInterval ) {
      // get ready for next frame by setting then=now, but also adjust for your specified fpsInterval not being a
      // multiple of RAF's interval ( 16.7ms )
      this.then = this.now - ( this.elaspedTime % this.fpsInterval );

      // drawing code here
      this.update( this.elapsedTime );
      this.render( this.elaspedTime );
    }

  }

  update( delta ) {
  }

  render( delta ) {
    GLUtil.clear();
    this.shader.activate().set(
      (Math.sin( ( this.pointSize += this.pointSizeStep * delta ) ) * 10.0 ) + 30.0,
      ( this.angle += this.angleStep * delta )
    ).renderModel( this.model );
  }

  shutdown( ) {

  }
}

let Engine = new EngineSingleton();

export { Engine, GLUtil, gl };
