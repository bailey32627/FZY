import { gl } from './GL.js';
import { GLBuffer } from './GLBuffer.js';
import { Vertex } from './math/Vertex.js';
import { Vector2 } from './math/Vector2.js';
import { Vector3 } from './math/Vector3.js';

class Geometry {
  //Creates a new vetex array object to hold an array of vetex buffer objects ---
  constructor( ) {
    this.vao = gl.context.createVertexArray( );
    this.count = 0;
    this.isIndexed = false;
    this.isInstance = false;
    this.buffers = {};
  }

  // Destroys the vao and releases the buffers it holds --------------------
  destroy( ) {
    for( let b of buffers ) {
      b.destroy( );
    }
    gl.context.deleteVertexArray( this.vao );
  }


  // Adds a buffer to this vao -------------------------------------------
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

  // Returns the vetex buffer at the given name ----------------------------
  getBuffer( name ) {
    if( this.buffers[ name ] === undefined ) {
      throw new Error( `Attempted to retrieve ${name} buffer that was not found`);
    }
    return this.buffers[ name ];
  }

  // Upload the VAO to the GPU ---------------------------------------------
  upload( isStatic = true, isInstance = false ) {
    gl.context.bindVertexArray( this.vao );
    for( let [ key, value ] of Object.entries( this.buffers ) ) {
      value.upload( isStatic, isInstance );
    }
    gl.context.bindVertexArray( null );
  }

  // bind the vao -----------------------------------------------------
  bind( ) {
    gl.context.bindVertexArray( this.vao );
  }

  // Unbind the vao ----------------------------------------------------
  unbind( ) {
    gl.context.bindVertexArray( null );
  }

  // Draws the vao -----------------------------------------------------
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

  // Creates a 2D box geometry ----------------------------------------

  static createBox2D(  ) {
    let rtn = new Geometry();
    let verts = [];
    verts.push( new Vertex( new Vector3( 1, 1, 0), new Vector3(0, 0, 1), new Vector2(1,1) )  );
    verts.push( new Vertex( new Vector3(-1, 1, 0), new Vector3(0, 0, 1), new Vector2(0,1) ) );
    verts.push( new Vertex( new Vector3(-1,-1, 0), new Vector3(0, 0, 1), new Vector2(0,0) ) );
    verts.push( new Vertex( new Vector3( 1,-1, 0), new Vector3(0, 0, 1), new Vector2(1,0) ) );

    let idxs = [ 0, 1, 2, 0, 2, 3 ];
    let vertData = [];
    for( let i = 0; i < verts.length; i++ ) { verts[i].toArray( vertData ); }

    let vertbuffer = new GLBuffer( );
    vertbuffer.addAttribute( gl.ATTRIB_POSITION_LOC, 3 );
    vertbuffer.addAttribute( gl.ATTRIB_NORMAL_LOC, 3 );
    vertbuffer.addAttribute( gl.ATTRIB_TEXCOORDS_LOC, 2 );
    vertbuffer.addAttribute( gl.ATTRIB_TANGENT_LOC, 3 );
    vertbuffer.addAttribute( gl.ATTRIB_BITANGENT_LOC, 3 );
    vertbuffer.setData( vertData );
    rtn.addBuffer( 'vertices', vertbuffer );

    let idxBuffer = new GLBuffer( gl.context.UNSIGNED_SHORT, gl.context.ELEMENT_ARRAY_BUFFER );
    idxBuffer.setData( idxs );
    rtn.addBuffer( 'indices', idxBuffer );

    rtn.upload();
    rtn.unbind();
    return rtn;
  }

}

export { Geometry };
