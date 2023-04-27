
const Manager = {
  // Global data ----------------------------------------
  deltaTime : 0,

  // Resources -----------------------------------------
  shaders : new Map(),
  materials : new Map(),
  geometries : new Map(),
  meshes : new Map(),
  textures : new Map(),
  tmpCache : new Map(),

  // functions ------------------------------------------
  addShader : function( key, shader ) {
    let s = this.shaders.get( key );
    if( s !== undefined ) {
      console.log( "Overriding shader at %s", key );
    }
    this.shaders.set( key, shader );
  },

  getShader : function( key ) {
    let m = this.shaders.get( key );
    if( !m ) {
      console.log( "Shader not found %s", key );
      return null;
    }
  },

  addMaterial : function( key, material ) {
    let s = this.materials.get( key );
    if( s !== undefined ) {
      console.log( "Overriding material at %s", key );
    }
    this.materials.set( key, material );
  },

  getMaterial : function( key ) {
    let m = this.materials.get( key );
    if( !m ) {
      console.log( "Material not found %s", key );
      return null;
    }
  },

  addGeometry : function( key, geometry ) {
    let s = this.geometries.get( key );
    if( s !== undefined ) {
      console.log( "Overriding geometry at %s", key );
    }
    this.geometries.set( key, geometry );
  },

  getGeometry : function( key ) {
    let m = this.geometry.get( key );
    if( !m ) {
      console.log( "Geometry not found %s", key );
      return null;
    }
  },

  addTexture : function( key, texture ) {
    let s = this.textures.get( key );
    if( s !== undefined ) {
      console.log( "Overriding texture at %s", key );
    }
    this.textures.set( key, texture );
  },

  getTexture : function( key ) {
    let t = this.textures.get( key );
    if( !t ) {
      console.log( "Texture not found %s", key );
      return null;
    }
  },

  addShader : function( key, mesh ) {
    let s = this.meshes.get( key );
    if( s !== undefined ) {
      console.log( "Overriding mesh at %s", key );
    }
    this.meshes.set( key, mesh );
  },

  getMesh : function( key ) {
    let m = this.meshes.get( key );
    if( !m ) {
      console.log( "Mesh not found %s", key );
      return null;
    }
  },

  popCache : function( key ) {
    let m = this.tmpCache.get( key );
    if( !m ) {
      console.log( "TmpCache not found %s", key );
      return null;
    }
  }
}

export { Manager };
