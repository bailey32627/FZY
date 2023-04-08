class GLUtil {
  /**
  * Creates a new instance of the GLUtils, one per canvas
  */
  constructor() {
  }

  /**
  * static variable to hold the canvas element
  * initialized to undefined until the initialze function is called
  */
  static canvas = undefined;

  /**
  * static variable to hold the webGL context
  * initialized to undefined until the initialze function is called
  */
  static glConext = undefined;

  /**
  * Resposible for creating and initialing a canvas and webGL context
  * @param elementID - Id of the element to search for
  */
  static initialize( elementID ) {

    this.canvas = elementID !== undefined ? document.getElementById( elementID ) :
                                            document.createElement( "canvas" );
    if( elementID === undefined )
      document.body.appendChild( this.canvas );

    if( !this.canvas )
      throw new Error( `Cannot find a canvas element name ${elementID}` );

    this.context = this.canvas.getContext( "webgl" );

    if( this.context === undefined )
      throw new Error( "Unable to initialize webGL" );
  }
}

// Represents a webGL Shader
class Shader {
  /**
  * private name of the shader
  */
  #_name;
  #_program;

  /**
  * Creates a new instance of Shader
  * @param name The name of the shader
  * @param vertex The vertex shader source to use
  * @param fragment The fragment shader source to use
  */
  constructor( name, vertex, fragment ) {
    this._name = name;
    this.vertexShader = this.loadShader( vertex, GLUtil.context.VERTEX_SHADER );
    this.fragmentShader = this.loadShader( fragment, GLUtil.context.FRAGMENT_SHADER );

    this.createProgram( this.vertexShader, this.fragmentShader );
  }

  /**
  * Returns the name of the shader
  */
  get name() {
    return _name;
  }

  /**
  * Tell webGL to render with this shader
  */
  use( ) {
    GLUtil.context.useProgram( this._program );
  }

  /**
  * Loads a shaders source code to the webGL shader and returns it
  * @param source The source code to load
  * @param type The webGL type of shader
  * @return A new webGL shader with the compiled source code
  */
  loadShader( source, type ) {
    let shader = GLUtil.context.createShader( type );

    GLUtil.context.shaderSource( shader, source );
    GLUtil.context.compileShader( shader );
    let error = GLUtil.context.getShaderInfoLog( shader );

    if( error !== '' )
      throw new Error( `Error compiling shader: ${ this._name } : ${error}` );

    return shader;
  }

  /**
  * Creates the webGL shader program and links the two shaders to it
  * @param vertexShader The compiled vertex shader to use
  * @param fragmentShader The compiled fragment shader to use
  */
  createProgram( vertexShader, fragmentShader ) {
    this._program = GLUtil.context.createProgram();
    GLUtil.context.attachShader( this._program, vertexShader );
    GLUtil.context.attachShader( this._program, fragmentShader );
    GLUtil.context.linkProgram( this._program );

    let error = GLUtil.context.getProgramInfoLog( this._program );
    if (error !== '' )
      throw new Error( `Error linking shader: ${ this._name } : ${error}` );
  }
}

const ShaderLib = {
  basic: {
    vertexShader:  `
    attribute vec3 position;
    void main() {
      gl_Position = vec4( position, 1.0 );
    }`,

    fragmentShader:  `
    precision mediump float;
    void main() {
      gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
    }`
  }
};

class Engine {

  #_shader;

  /**
  * Creates a new instance of the engine
  */
  constructor( ) {
    this.count = 0;
  }

  /**
  * Initializes the engine resources and starts the game loop
    */
  initialize() {

    // initialize webGL
    GLUtil.initialize();
    // set the webGL clear color
    GLUtil.context.clearColor( 0, 0, 0, 1 );

    // load the shaders and set it to be used
    this._shader = new Shader( 'basic', ShaderLib.basic.vertexShader, ShaderLib.basic.fragmentShader );
    this._shader.use();

    this.run();
  }

  /**
  * The main game loop
   */
  run( ) {
    // clear the color buffer
    GLUtil.context.clear( GLUtil.context.COLOR_BUFFER_BIT );

    requestAnimationFrame( this.run.bind( this ) );
  }

  /**
  * Frees the engine resources and shuts down all engine components
  */
  shutdown() {

  }
}

class Vector2 {
  constructor( x = 0, y = 0 ) {
    this.x = x;
    this.y = y;
  }

  width( ) {
    return this.x;
  }

  height() {
    return this.y;
  }
}

export { Engine, GLUtil, Vector2 };
