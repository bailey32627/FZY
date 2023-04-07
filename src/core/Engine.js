import { GLUtil } from './gl/GlUtil.js';
import { Shader } from './gl/Shader.js';

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
    this.loadShaders();
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

  /**
  * loads the shader resources on startup
  */
  #loadShaders() {
    let vertexShaderSource = `
    attribute vec3 position;
    void main() {
      gl_Position = vec4( position, 1.0 );
    }`;

    let fragmentShaderSource = `
    precision mediump float;
    void main() {
      gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
    }`;

    this._shader = new Shader( "basic", vertexShaderSource, fragmentShaderSource );
  }
}

export { Engine };
