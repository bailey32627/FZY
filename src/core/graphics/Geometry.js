import { gl, GLUtil, Attributes } from '../gl/GLUtil.js';


class GeometryManager {
  constructor( ) {
    this.polygons = new Map();
  }

  /**
  @brief creates a vetex array object for the geometry
  @param name The name of this geometry
  @param verticesArray array of compact vertices
  @param indicesArray Array of shorts
  */
  createMesh( name, positions = null, normals = null, uvs = null, indices = null ) {
    let rtn = { mode: gl.TRIANGLES };
    // create and bind the vao
    rtn.vao = gl.createVertexArray();
    gl.bindVertexArray( rtn.vao );  // bind it so all the calls to vertexAttribPointer/enableVertexAttribArray is aved to the vao

    // set up vertices
    if( positions !== undefined && positions != null ){
      rtn.positionBuffer = gl.createBuffer( );
      rtn.positionComponentLen = 3;
      rtn.vertexCount = positions.length / rtn.positionComponentLen;

      gl.bindBuffer( gl.ARRAY_BUFFER, rtn.positionBuffer );
      gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( positions ), gl.STATIC_DRAW );
      gl.enableVertexAttribArray( Attributes.POSITION_LOC );
      gl.vertexAttribPointer( Attributes.POSITION_LOC, 3, gl.FLOAT, false, 0, 0 );
    }

    // set up normals
    if( normals !== undefined && normals != null ) {
      rtn.normalBuffer = gl.createBuffer();
      gl.bindBuffer( gl.ARRAY_BUFFER, rtn.normalBuffer );
      gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( normals ), gl.STATIC_DRAW );
      gl.enableVertexAttribArray( Attributes.NORMAL_LOC );
      gl.vertexAttribPointer( Attributes.NORMAL_LOC, 3, gl.FLOAT, false, 0, 0 );
    }

    // setup uvs
    if( uvs !== undefined && uvs != null ) {
      rtn.uvBuffer = gl.createBuffer( );
      gl.bindBuffer( gl.ARRAY_BUFFER, rtn.uvBuffer );
      gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( uvs ), gl.STATIC_DRAW );
      gl.enableVertexAttribArray( Attributes.UV_LOC );
      gl.vertexAttribPointer( Attributes.UV_LOC, 2, gl.FLOAT, false, 0, 0 );
    }

    if ( indices !== undefined && indices != null ) {
      rtn.indexBuffer = this.createBuffer();
      rtn.indexCount = indices.length;
      gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, rtn.indexBuffer );
      gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( indices ), gl.STATIC_DRAW );
      gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null );
    }

    // clean up
    gl.bindVertexArray( null ); // unbind the VAO, very IMPORTANT
    gl.bindBuffer( gl.ARRAY_BUFFER, null ); // unbind any buffers that might be set

    this.polygons[ name ] = rtn;
    return rtn;
  }

  /**
  @brief gets the geometry from the manager
  @param name The name of the geometry to retrieve
  */
  getGeometry( name ) {
    return this.polygons[ name ];
  }

  /**
  @brief Removes the geometry from the manger
  @param name The name of the geometry to remove
  */
  removeGeometry( name ) {
    this.polygons.delete( name );
  }

}

let Geometry = new GeometryManager();

export { Geometry };
