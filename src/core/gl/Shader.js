import { GLUtil } from './GlUtil.js';

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
    this.vertexShader = loadShader( vertex, GLUtil.context.VERTEX_SHADER );
    this.fragmentShader = loadShader( fragment, GLUtil.context.FRAGMENT_SHADER );

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
  #loadShader( source, type ) {
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
  #createProgram( vertexShader, fragmentShader ) {
    this._program = GLUtil.context.createProgram();
    GLUtil.context.attachShader( this._program, vertexShader );
    GLUtil.context.attachShader( this._program, fragmentShader );
    GLUtil.context.linkProgram( this._program );

    let error = GLUtil.context.getProgramInfoLog( this._program );
    if (error !== '' )
      throw new Error( `Error linking shader: ${ this._name } : ${error}` );
  }
}

export { Shader };
