import { gl } from '../gl/GL.js';
import { GLBuffer } from '../gl/GLBuffer.js';
import { Vao } from '../gl/GLVao.js';


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
    let rtn = new Vao();
    // create and bind the vao
  //  rtn.vao = gl.context.createVertexArray();
  //  gl.context.bindVertexArray( rtn.vao );  // bind it so all the calls to vertexAttribPointer/enableVertexAttribArray is aved to the vao

    // set up vertices
    if( positions !== undefined && positions != null ){
      let pb = new GLBuffer();
      pb.setData( positions );
      pb.addAttribute( gl.ATTRIB_POSISTION_LOC, 3 );

      rtn.addBuffer( "positions", pb );
    //  rtn.positionBuffer = new GLBuffer( );
    //  rtn.positionBuffer.setData( positions );
    //  rtn.positionBuffer.addAttribute( gl.ATTRIB_POSISTION_LOC, 3 );
    // rtn.positionBuffer.upload( );
    // rtn.vertexCount = rtn.positionBuffer.getVertexCount();
      /*
      rtn.positionBuffer = gl.context.createBuffer( );
      rtn.positionComponentLen = 3;
      rtn.vertexCount = positions.length / rtn.positionComponentLen;

      gl.context.bindBuffer( gl.context.ARRAY_BUFFER, rtn.positionBuffer );
      gl.context.bufferData( gl.context.ARRAY_BUFFER, new Float32Array( positions ), gl.context.STATIC_DRAW );
      gl.context.enableVertexAttribArray( gl.ATTRIB_POSISTION_LOC );
      gl.context.vertexAttribPointer( gl.ATTRIB_POSISTION_LOC, 3, gl.context.FLOAT, false, 0, 0 );
      */
    }

    // set up normals
    if( normals !== undefined && normals != null ) {
      rtn.normalBuffer = gl.createBuffer();
      gl.context.bindBuffer( gl.context.ARRAY_BUFFER, rtn.normalBuffer );
      gl.context.bufferData( gl.context.ARRAY_BUFFER, new Float32Array( normals ), gl.context.STATIC_DRAW );
      gl.context.enableVertexAttribArray( gl.ATTRIB_NORMAL_LOC );
      gl.context.vertexAttribPointer( gl.ATTRIB_NORMAL_LOC, 3, gl.context.FLOAT, false, 0, 0 );
    }

    // setup uvs
    if( uvs !== undefined && uvs != null ) {
      rtn.uvBuffer = gl.createBuffer( );
      gl.context.bindBuffer( gl.context.ARRAY_BUFFER, rtn.uvBuffer );
      gl.context.bufferData( gl.context.ARRAY_BUFFER, new Float32Array( uvs ), gl.context.STATIC_DRAW );
      gl.context.enableVertexAttribArray( gl.ATTRIB_TEXCOORDS_LOC );
      gl.context.vertexAttribPointer( gl.ATTRIB_TEXCOORDS_LOC, 2, gl.context.FLOAT, false, 0, 0 );
    }

    if ( indices !== undefined && indices != null ) {
      rtn.indexBuffer = this.createBuffer();
      rtn.indexCount = indices.length;
      gl.context.bindBuffer( gl.context.ELEMENT_ARRAY_BUFFER, rtn.indexBuffer );
      gl.context.bufferData( gl.context.ELEMENT_ARRAY_BUFFER, new Uint16Array( indices ), gl.context.STATIC_DRAW );
      gl.context.bindBuffer( gl.context.ELEMENT_ARRAY_BUFFER, null );
    }

    // clean up
    rtn.upload();
    rtn.unbind();
    //gl.context.bindVertexArray( null ); // unbind the VAO, very IMPORTANT
  //  gl.context.bindBuffer( gl.context.ARRAY_BUFFER, null ); // unbind any buffers that might be set

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
