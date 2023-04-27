import { gl } from './GL.js';


class Shader {
  constructor( vertexSource, fragmentSource, validate = true ) {
    this.program = gl.createShader( vertexSource, fragmentSource, validate );

    if( this.program != null ) {
      this.uniforms = new Map();

      this.#detectUniforms( );
      // add this to the resource managment

    }
  }

  // Cleans up the shader program ------------------------------------
   destroy( ) {
     gl.destroyShader( this );
   }

   // Activates the shader for use -----------------------------------
   bind( ) {
     gl.context.useProgram( this.program );
     return this;
   }

   // deactivates the shader ------------------------------------------
   unbind( ) {
     gl.context.useProgram( null );
     return this;
   }

   /**
   @brief Gets the attributes location from the attributes map
   @param name The name of the attribute
   @return int value location of the attribute or Error
   */
   getAttributeLocation( name ) {
     return gl.context.getAttribLocation( this.program, name );
   }

   /**
   @brief Gets the uniform location from the uniforms map
   @param name The name of the uniform to retrieve
   @return int value of the uniform location or Error
   */
   getUniformLocation( name ) {
     if( this.uniforms[ name ] === undefined ) {
       throw new Error( `Unable to find uniform name ${name} in shader program.`);
     }
     return this.uniforms[ name ];
   }

   /**
   @brief Detects the uniforms in this shader program and pushes maps their int value to their names
   */
   #detectUniforms( ) {
     let count = gl.context.getProgramParameter( this.program, gl.context.ACTIVE_UNIFORMS );
     for ( let i = 0; i < count; i++ ) {
       let info = gl.context.getActiveUniform( this.program, i );
       if( !info ) { break; }
       this.uniforms[ info.name ] = gl.context.getUniformLocation( this.program, info.name );
     }
   }

}


export { Shader };
