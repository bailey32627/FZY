import { gl } from './GLUtil.js';

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
      if( !info ) { break };
      this._attributes[ info.name ] = gl.getAttribLocation( this._program, info.name );
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

export { Shader };
