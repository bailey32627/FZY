import { gl, Attributes } from './GLUtil.js';

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

export { Shader };
