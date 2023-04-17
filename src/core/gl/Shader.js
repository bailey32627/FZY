import { gl } from './GLUtil.js';

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

export { Shader };
