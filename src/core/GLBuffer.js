import { gl } from './GL.js';

class GLBuffer {

  // creates a new GLBuffer ------------------------------------------------
  constructor( dataType = gl.context.FLOAT, bufferType = gl.context.ARRAY_BUFFER ) {
    this.size = 0;
    this.dataType = dataType;
    this.bufferType = bufferType;
    this.data = [];
    this.attributes = [];
    this.hasAttributes = false;
    this.stride = 0;

    switch( dataType ) {
      case gl.context.FLOAT:
      case gl.context.INT:
      case gl.context.UNSIGNED_INT:
        this.typeSize = 4;
        break;
      case gl.context.SHORT:
      case gl.context.UNSIGNED_SHORT:
        this.typeSize = 2;
        break;
      case gl.context.BYTE:
      case gl.context.UNSGINED_BYTE:
        this.typeSize = 1;
        break;
    }
    this.buffer = gl.context.createBuffer( );
  }

  // releases resources held by the buffer  --------------------------------
  destroy( ) {
    gl.context.deleteBuffer( this.buffer );
  }

  // Sets the data for this buffer, or replaces what is there -------------
  setData( data ) {
    this.data.length = 0;
    for ( let d of data ) {
      this.data.push( d );
    }
  }

  // Clears the data held by this array  ---------------------------------
  clearData( ) {
    this.data.length = 0;
  }

  // add attribute location information to this buffer -------------------
  addAttribute( location = 0, size = 3 ) {
    let rtn = {
      location: location,
      size: size,
      offset: this.size,
    };
    this.hasAttributes = true;
    this.attributes.push( rtn );
    this.size += size;
    this.stride = this.size * this.typeSize;
  }

  //  Uploads the data in the array to the GPU  ------------------------
  upload( isStatic = true, isInstance = false ) {
    gl.context.bindBuffer( this.bufferType, this.buffer );
    let ary;

    switch( this.dataType ) {
      case gl.context.FLOAT:
        ary = ( this.data instanceof Float32Array )? this.data : new Float32Array( this.data );
        break;
      case gl.context.INT:
        ary = ( this.data instanceof Int32Array )? this.data : new Int32Array( this.data );
        break;
      case gl.context.UNSIGNED_INT:
        ary = ( this.data instanceof Uint32Array )? this.data : new Uint32Array( this.data );
        break;
      case gl.context.SHORT:
        ary = ( this.data instanceof Int16Array )? this.data : new Int16Array( this.data );
        break;
      case gl.context.UNSIGNED_SHORT:
        ary = ( this.data instanceof Uint16Array )? this.data : new Uint16Array( this.data );
        break;
      case gl.context.BYTE:
        ary = ( this.data instanceof Int8Array )? this.data : new Int8Array( this.data );
        break;
      case gl.context.UNSGINED_BYTE:
        ary = ( this.data instanceof Uint8Array )? this.data : new Uint8Array( this.data );
        break;
    }

    gl.context.bufferData( this.bufferType, ary, (isStatic) ? gl.context.STATIC_DRAW : gl.context.DYNAMIC_DRAW );

    if( this.hasAttributes ) {
      for ( let it of this.attributes ) {
        gl.context.enableVertexAttribArray( it.location );
        gl.context.vertexAttribPointer( it.location, it.size, this.dataType, false, this.stride, it.offset * this.typeSize );
        if( isInstance ) { gl.context.vertexAttribDivisor( it.location, 1 ); }
      }
    }
  }

  // Returns the vertex count --------------------------------------------
  getVertexCount( ) {
    let c = this.data.length / this.size;
    if( c < 1 ) {
      throw new Error( "Cannot have less than 1 vertex to render" );
    }
    return c;
  }
}

export { GLBuffer };
