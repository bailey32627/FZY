import { Vao } from '../gl/GLVao.js';

/**
@brief SubMeshes are used to clump all triangles with like materials together to minimize
  the number fo state changes for webGL
*/
class SubMesh {
  /**
  @brief Submesh that is geometry and a material to apply
  @param geometry Vao that holds the vertices for this subMesh
  @param material The material to apply, null for now
  */
  constructor( geometry, material = null ) {
    if( geometry === undefined || geometry === null ) {
      throw new Error( `Geometry for a SubMesh cannot be null or undefined` );
    }

    this.geometry = geometry;
    this.material = material;
  }
}


/**
@brief A Mesh holds a collection of SubMeshes used to make a complicated model in the
  3D world
*/
class Mesh {
  constructor( ) {
    this.submeshes = [ ];
  }
}
