import { gl } from './GL.js';
import { GLBuffer } from './GLBuffer.js';

class Vao {
  /**
  @brief Creates a new vetex array object to hold an array of vetex buffer objects
  */
  constructor( ) {
    this.id = gl.context.createVertexArray( );
    this.count = 0;
    this.isIndexed = false;
    this.isInstance = false;
    this.buffers = {};
  }

  /**
  @brief Destroys the vao and releases the buffers it holds
  */
  destroy( ) {
    for( let b of buffers ) {
      b.destroy( );
    }
    gl.context.deleteVertexArray( this.id );
  }

  /**
  @brief Adds a buffer to this vao
  @param name The name of the buffer
  @param buffer The buffer to add
  */
  addBuffer( name, buffer ) {
    if( this.buffers[ name ] != undefined ) {
      throw new Error( `Attempted to override the vertex buffer ${name} in the VAO` );
    }

    if( buffer.bufferType === gl.context.ELEMENT_ARRAY_BUFFER ) {
      this.isIndexed = true;
      this.count = buffer.data.length;
    }
    if( !this.isIndexed ) { this.count = buffer.getVertexCount(); }

    this.buffers[ name ] = buffer;
  }

  /**
  @brief Returns the vetex buffer at the given name
  @param name name of the vertex buffer to retrieve
  */
  getBuffer( name ) {
    if( this.buffers[ name ] === undefined ) {
      throw new Error( `Attempted to retrieve ${name} buffer that was not found`);
    }
    return this.buffers[ name ];
  }

  /**
  @brief Upload the VAO to the GPU
  @param isStatic is data Static or dynamic, default true
  @param isIntance is the data an Intance model, default false
  */
  upload( isStatic = true, isInstance = false ) {
    gl.context.bindVertexArray( this.id );
    for( let [ key, value ] of Object.entries( this.buffers ) ) {
      value.upload( isStatic, isInstance );
    }
    gl.context.bindVertexArray( null );
  }

  /**
  @brief bind the vao
  */
  bind( ) {
    gl.context.bindVertexArray( this.id );
  }

  /**
  @brief Unbind the vao
  */
  unbind( ) {
    gl.context.bindVertexArray( null );
  }

  /**
  @brief Draws the vao
  @param mode The draw mode to use default is gl.context.TRIANGLES
  @param doBinding Tells the function to bind the vao before rendering, default = false
  */
  draw( mode = gl.context.TRIANGLES, doBinding = false ) {
    if( doBinding ) { this.bind(); }
    if( this.count != 0 ) {
      if( this.isIndexed ) {
         gl.context.drawElements( mode, this.count, gl.context.UNSIGNED_SHORT, 0 );
        }
      else { gl.context.drawArrays( mode, 0, this.count ); }
    }
    if( doBinding ) { this.unbind(); }
  }

}

export { Vao };
