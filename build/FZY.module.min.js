class gl{
  static init( canvas ) {
    // get the context
    if( typeof canvas == "string" ) {
       gl.canvas = document.getElementById( canvas );
     } else {
       gl.canvas = document.createElement( "canvas" );
       document.body.appendChild( canvas );
     }

    gl.context = gl.canvas.getContext( "webgl2" );
    if( !gl.context ) {
      console.error( "WebGL context is not available." );
      return false;
    }

    // add event listener to handle resize
    window.addEventListener( 'resize', (event) => {
      gl.fitToScreen();
    });

    // load extensions
    gl.context.getExtension( "EXT_color_buffer_float" ); // for deferred lighting

    // set some defaults
    gl.context.cullFace( gl.context.BACK );    // back is also default
    gl.context.frontFace( gl.context.CCW );    // count clock wise triangle structure
    gl.context.enable( gl.context.DEPTH_TEST ); // enable depth testing
    gl.context.enable( gl.context.CULL_FACE );  // enable face culling so only one triangle is drawn
    gl.context.depthFunc( gl.context.LEQUAL );  // near things obsure far things
    gl.context.blendFunc( gl.context.SRC_ALPHA, gl.context.ONE_MINUS_SRC_ALPHA ); // default alpha blending
    gl.fitToScreen(); // set the canvas size
    gl.setClearColor( 255, 255, 255, 255 );  // set clear color
    return true;
  }

  // gl Methods ----------------------------------------------------
  /**
  @brief Clears the screen
  */
  static clear() {
    gl.context.clear( gl.context.COLOR_BUFFER_BIT | gl.context.DEPTH_BUFFER_BIT );
    return gl;
  }

  // sets the blend mode for the context ---------------------------------
  static setBlendMode( mode ) {
    switch( mode ) {
      case gl.BLEND_ALPHA: gl.context.blendFunc( gl.context.SRC_ALPHA, gl.context.ONE_MINUS_SRC_ALPHA ); break;
      case gl.BLEND_ADDITIVE: gl.context.blendFunc( gl.contex.ONE, gl.context.ONE ); break;
      case gl.BLEND_ALPHA_ADDITIVE: gl.context.blendFunc( gl.context.SRC_ALPHA, gl.context.ONE ); break;
      case gl.BLEND_OVERRIDE: gl.context.blendFunc( gl.context.ONE, gl.context.ZERO ); break;
    }
    return gl;
  }

  // canvas methods ---------------------------------------------------

  // Set the size of the canvas to fill a percentage o fthe total screen -----

  static fitToScreen( wp = 1, hp = 1 ) {
    gl.setSize( window.innerWidth * wp, window.innerHeight * hp );
    return gl;
  }

  // Set the size of the canvas html element and the rendering view port --
  static setSize( w = 500, h = 500 ) {
    gl.context.canvas.style.width = w + "px";
    gl.context.canvas.style.height = h + "px";
    gl.context.canvas.width = w;
    gl.context.canvas.height = h;

    // update the viewport
    gl.context.viewport( 0, 0, w, h );
    gl.width = w;
    gl.height = h;
    return gl;
  }


  // Sets the clear color for webGL ----------------------------------
   static setClearColor( r, g, b, a ) {
     let c = gl.rgbaColor( r, g, b, a );
     gl.context.clearColor( c[0], c[1], c[2], c[3] );
   }

   static rgbaColor( r, g, b, a ) {
     let ary = [ ];
     ary.push( r < 0 ? 0 : ( r > 255 ? 1 : r / 255.0 ) );
     ary.push( g < 0 ? 0 : ( g > 255 ? 1 : g / 255.0 ) );
     ary.push( b < 0 ? 0 : ( b > 255 ? 1 : b / 255.0 ));
     ary.push( a < 0 ? 0 : ( a > 255 ? 1 : a / 255.0 ));
     return ary;
   }
   // Shader functions ------------------------------------------------


   // Create a shader from the source code and type --------------------
   // src The code
   // type The type of shader this is
   static compileShader( src, type ) {
     let sdr = gl.context.createShader( type );
     gl.context.shaderSource( sdr, src );
     gl.context.compileShader( sdr );

     // Get Errror data if shader failed compiling
     if( !gl.context.getShaderParameter( sdr, gl.context.COMPILE_STATUS )) {
       console.error( "Error compiling shader : " + src, gl.context.getShaderInfoLog( sdr ) );
       gl.context.deleteShader( sdr );
       return null;
     }
     return sdr;
   }

   // Creates a Shader program --------------------------------------
   static createShaderProgram( vertexShader, fragmentShader, validate = true ) {
     let prog = gl.context.createProgram();
     gl.context.attachShader( prog, vertexShader );
     gl.context.attachShader( prog, fragmentShader );

     // for predefined locations fo rspecific attributes.
     gl.context.bindAttribLocation( prog, gl.ATTRIB_POSISTION_LOC, "a_position" );
     gl.context.bindAttribLocation( prog, gl.ATTRIB_NORMAL_LOC, "a_normal" );
     gl.context.bindAttribLocation( prog, gl.ATTRIB_TEXCOORDS_LOC, "a_texcoords" );
     gl.context.bindAttribLocation( prog, gl.ATTRIB_TANGENT_LOC, "a_tangent" );
     gl.context.bindAttribLocation( prog, gl.ATTRIB_BITANGENT_LOC, "a_bitangent" );

     gl.context.linkProgram( prog );

     if( !gl.context.getProgramParameter( prog, gl.context.LINK_STATUS ) ) {
       console.error( "Error creating shader program.", gl.context.getProgramInfoLog( prog ) );
       gl.context.deleteProgram( prog );
       return null;
     }

     if( validate ) {
       gl.context.validateProgram( prog );
       if( !gl.context.getProgramParameter( prog, gl.context.VALIDATE_STATUS ) ){
         console.error( "Error validating program.", gl.context.getProgramInfoLog( prog ) );
         gl.context.deleteProgram( prog );
         return null;
       }
     }

     // delete shaders and return program
     gl.context.deleteShader( vertexShader );
     gl.context.deleteShader( fragmentShader );

     return prog;
   }

   // Create a shader ---------------------------------------------------
   static createShader( vertexSource, fragmentSource, validate = true ) {
     let vs = gl.compileShader( vertexSource, gl.context.VERTEX_SHADER );
     if( !vs ) return null;
     let fs = gl.compileShader( fragmentSource, gl.context.FRAGMENT_SHADER );
     if( !fs ) {
       gl.context.deleteShader( vs );
       return null;
     }

     return gl.createShaderProgram( vs, fs, validate );
   }

   // Destroy shader program -----------------------------------------------
   static destroyShader( sdr ) {
     if( sdr && sdr.program > 0 ) {
       gl.context.deleteProgram( sdr.program );
       sdr.program = 0;
     }
   }
}


// -------------------------------------------------------------
gl.canvas = null;
gl.context = null;
gl.width = 0;
gl.height = 0;

gl.BLEND_ALPHA = 0;
gl.BLEND_ADDITIVE = 1;
gl.BLEND_ALPHA_ADDITIVE = 2;
gl.BLEND_OVERRIDE = 3;

gl.ATTRIB_POSISTION_LOC = 0;
gl.ATTRIB_NORMAL_LOC = 1;
gl.ATTRIB_TEXCOORDS_LOC = 2;
gl.ATTRIB_TANGENT_LOC = 3;
gl.ATTRIB_BITANGENT_LOC = 4;
gl.ATTRIB_JOINT_INDEX_LOC = 8;
gl.ATTRIB_JOINT_WEIGHT_LOC = 9;

// convert degrees to radians
  const degreesToRadians = (degrees) => { return degrees * ( Math.PI / 180.0 ); };

  // smallest positive number
  const EPSILON = 1.192092896e-07;

class Vector3 extends Float32Array {

  /**
  * Creates a new instance of a Vector2
  */
  constructor( param ) {
    super( 3 );
    if( param instanceof Vector3 || ( param && param.length == 3 ) ) {
      this[0] = param[0];
      this[1] = param[1];
      this[2] = param[2];
    } else if ( arguments.length == 3 ) {
      this[ 0 ] = arguments[ 0 ];
      this[ 1 ] = arguments[ 1 ];
      this[ 2 ] = arguments[ 2 ];
    } else {
      this[ 0 ] = this[ 1 ] = this[2] = param || 0;
    }
  }

  // getters and setters ---------------------------------------------------
  get x() { return this[ 0 ]; }
  set x( value ) { this[ 0 ] = value; }

  get y() { return this[ 1 ]; }
  set y( value ) { this[ 1 ] = value; }

  get z() { return this[2]; }
  set z( value ) { this[ 2 ] = value; }

  set( x, y, z ) { this[ 0 ] = x; this[ 1 ] = y; this[ 2 ] = z; }

  copy( vec ) { this[ 0 ] = vec[ 0 ]; this[ 1 ] = vec[ 1 ]; this[ 2 ] = vec[ 2 ]; }

  clone( vec ) { return new Vector3( this ); }

  setLength( len ) { return this.normalize().scale(len); }

  // When values are very small, like less then 0.0000001, just make it zero
  nearZero( x = 1e-6, y = 1e-6 ){
    if( Math.abs(this[0]) <= x ) this[0] = 0;
    if( Math.abs(this[1]) <= y ) this[1] = 0;
    return this;
  }

  // Methods -------------------------------------------------------

  // Adds this and the given vector ------------------------------
  add( v, out = null ) {
    out = out || this;
    out[ 0 ] = this[ 0 ] + v[ 0 ];
    out[ 1 ] = this[ 1 ] + v[ 1 ];
    out[ 2 ] = this[ 2 ] + v[ 2 ];
    return this;
  }

  // subtracts this and the given vector -------------------------
  subtract( v, out = null ) {
    out = out || this;
    out[0] = this[0] - v[0];
    out[1] = this[1] - v[1];
    out[2] = this[2] - v[2];
    return out;
  }

  // multiply this and the given vector ---------------------------
  multiply( v, out = null ) {
    out = out || this;
    out[0] = this[0] * v[0];
    out[1] = this[1] * v[1];
    out[2] = this[2] * v[2];
    return out;
  }

  // divids this and the given vector --------------------------------
  divid( v, out = null ) {
    out = out || this;
    out[0] = v[0] != 0 ? this[0] / v[0] : 0;
    out[1] = v[1] != 0 ? this[1] / v[1] : 0;
    out[2] = v[2] != 0 ? this[2] / v[2] : 0;
    return out;
  }

  // scales this vector by the given value -----------------------------
  scale( value, out = null ) {
    out = out || this;
    out[0] = this[0] * value;
    out[1] = this[1] * value;
    out[2] = this[2] * value;
    return out;
  }

  // Returns the int value of this vector --------------------------------
  floor( out = null ) {
    out = out || this;
    out[0] = Math.floor( this[ 0 ] );
    out[1] = Math.floor( this[ 1 ] );
    out[2] = Math.floor( this[ 2 ] );
    return out;
  }

  // Returns the length of the vector ( Magnitude ) -----------------------
  length( ) {
    return Math.sqrt( this[0] * this[0] + this[1] * this[1] + this[2] * this[2] );
  }

  // Returns the squared magnitude of this vector ------------------------
  lengthSquared( ) {
    return  this[0] * this[0] + this[1] * this[1] + this[2] * this[2];
  }

  // normalizes this vector -----------------------------------------
  normalize( out = null ) {
    out = out || this;

    let mag = Math.sqrt( this[0]*this[0] + this[1]*this[1] );
    if( mag <= 0 ) return this;

    out[ 0 ] = this[ 0 ] / mag;
    out[ 1 ] = this[ 1 ] / mag;
    out[ 2 ] = this[ 2 ] / mag;
    return this;
  }

  // Linear interpolate this and v by ratio t --------------------------------
  lerp( v, t, out = null ) {
    out = out || this;
    var tmin = 1 - t;

    // linear Interpolate ( 1 - t ) * v0 + t * v1
    out[0] = this[0] * tmin + v[0] * t;
    out[1] = this[1] * tmin + v[1] * t;
    out[2] = this[2] * tmin + v[2] * t;
    return out;
  }

  // Smoother version of a linear interpolate ---------------------------------
  smoothStep( v, t, out = null ) {
    out = out || this;
    // (b-a) * ( ratio * ratio * ( 3 - 2 * ratio ) ) + a;
    out[ 0 ] = ( v[0] - this[0]) * ( t * t * ( 3 - 2 * t ) ) + this[0];
    out[ 1 ] = ( v[1] - this[1]) * ( t * t * ( 3 - 2 * t ) ) + this[1];
    out[ 2 ] = ( v[2] - this[2]) * ( t * t * ( 3 - 2 * t ) ) + this[2];
    return out;
  }

  // an even smoother step of linear interplatation ---------------------------
  smootherStep( v, t, out = null ) {
    out = out || this;
    // return (b-a) * (ratio * ratio * ratio * (ratio*(ratio * 6 - 15 ) + 10 ) ) + a;
    out[ 0 ] = (v[0] - this[0]) * ( t*t*t * ( t*( t * 6 - 15 ) + 10 ) ) + this[0];
    out[ 1 ] = (v[1] - this[1]) * ( t*t*t * ( t*( t * 6 - 15 ) + 10 ) ) + this[1];
    out[ 2 ] = (v[2] - this[2]) * ( t*t*t * ( t*( t * 6 - 15 ) + 10 ) ) + this[2];
    return out;
  }

  // inverts the vector from its current value -------------------------------
  invert( out = null ) {
    out = out || this;
    out[ 0 ] = -this[0];
    out[ 1 ] = -this[1];
    out[ 2 ] = -this[2];
    return out;
  }

  // returns the dot product of this vector and v ----------------------------
  dot( v ) {
    return this[0] * v[0] + this[1] * v[1] + this[2] * v[2];
  }

  // returns a vector3 that is perpendicular to this and v -------------------
  cross( v, out = null ) {
    out = out || this;
    let x = this[ 1 ] * v[ 2 ] - this[ 2 ] * v[ 1 ],
        y = this[ 2 ] * v[ 0 ] - this[ 0 ] * v[ 2 ];
        z = this[ 0 ] * v[ 1 ] - this[ 1 ] * v[ 0 ];
    out[ 0 ] = x;
    out[ 1 ] = y;
    out[ 2 ] = z;
    return out;
  }

  // Sets this to the cross product of the two given vectors ------------------
  crossVectors( t, v ) {
    let x = t[ 1 ] * v[ 2 ] - t[ 2 ] * v[ 1 ],
        y = t[ 2 ] * v[ 0 ] - t[ 0 ] * v[ 2 ];
        z = t[ 0 ] * v[ 1 ] - t[ 1 ] * v[ 0 ];
    this[ 0 ] = x;
    this[ 1 ] = y;
    this[ 2 ] = z;
  }

  // Returns the distance between this vector and the given vector -----------
  distance( v ) {
    return Math.sqrt( ( v[0]-this[0]) * (v[0]-this[0]) + (v[1]-this[1]) * (v[1]-this[1]) + (v[2]-this[2]) * (v[2]-this[2]) );
  }

  // Returns the squared distance between this vector and the given vector ----
  distanceSquared( v ) {
    return (v[0]-this[0]) * (v[0]-this[0]) + (v[1]-this[1]) * (v[1]-this[1]) + (v[2]-this[2]) * (v[2]-this[2]);
  }

  // Compares this vector and v, returns if they are within tolerance ---------
  isEqual( v, tolerance = EPSILON ) {
    if ( Math.abs( this[0] - v[0] ) > tolerance ) return false;
    if ( Math.abs( this[1] - v[1] ) > tolerance ) return false;
    if ( Math.abs( this[2] - v[2] ) > tolerance ) return false;
    return true;
  }

  // projects this on v and set the value to out --------------------------
  project( v, out = null ) {
    out = out || this;
    this[0]; this[1]; this[2];
    let d = this.dot( v );
    out[0] = this[0] - ( v[0] * d );
    out[1] = this[1] - ( v[1] * d );
    out[2] = this[2] - ( v[2] * d );
    return out;
  }

  // Rotates this vector3 on the given axis --------------------------------
  rotate( degrees, axis="x", out=null) {
    out = out || this;
    let radians = degreesToRadians( degrees ),
    sin = Math.sin( radians ),
    cos = Math.cos( radians ),
    x = this[ 0 ], y = this[ 1 ], z = this[2];

    switch( axis ) {
      case "y":
        out[0] = z * sin + x * cos;
        out[2] = z * cos - x * sin;
        break;
      case "x":
        out[1] = y * cos - z * sin;
        out[2] = y * sin + z * cos;
        break;
      case "z":
        out[0] = x * cos - y * sin;
        out[1] = x * sin + y * cos;
        break;
    }
    return out;
  }
}

Vector3.UP = [ 0, 1, 0 ];
Vector3.DOWN = [ 0, -1, 0 ];
Vector3.LEFT = [ 1, 0, 0 ];
Vector3.RIGHT = [ -1, 0, 0 ];
Vector3.ZERO = [ 0, 0, 0 ];

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
};

const ShaderLib = {
  basic: {
    vertexShader:  `#version 300 es
    in vec3 a_position;

    void main( void ) {
      gl_Position = vec4( a_position.x * 0.5, a_position.y * 0.5, a_position.z * 0.5, 1.0 );
    }`,

    fragmentShader:  `#version 300 es
    precision mediump float;

    out vec4 finalColor;

    void main( void ){
      finalColor = vec4( 0.3, 0.4, 0.5, 1.0 );
    }`
  }
};

/*/////////////////////////////////////////////////////////////////////////////////
	Components
	Creates a Factory to generate new Components which for ECS should just be data only
	Ex:
	Components(
		class Test{
			constructor(){
				this.x = 0;
			}
		}
	);
	var com = Components("Test"); 	// New Component by calling its name
	var com = Components(1); 		// New Component by calling its ComponentTypeID
	both returns "new Test()";
/////////////////////////////////////////////////////////////////////////////////*/

const Components = ( component ) => {
  switch( typeof component ){
    case "function":
      if( Components.list.has( component.name ) ) {
        console.log( "Component name already exist: %s", component.name );
        return Components;
      }

      let typeID = Util.hashCode( component.name );   // generate hash code for component type
      component.prototype.componentTypeID = typeID;   // add the typeID to the objects prototype
      component.prototype.entity = null;              // reference to the Entity attached to

      Components.list.set( component.name, { // Add object to list with extra meta data that may be needed
        typeID: typeID,
        object: component
      });

      console.log( "Registered Component: %s, typeID: %s", component.name, typeID );
      break;

    case "string":
      let c = Components.list.get( component );
      return (c) ? new c.object() : null;
    case "number":
      let v;
      for([,v] of Components.list) {
        if( v.typeID == component ) {
          return new v.object();
        }
      }
      break;
  }
  return null;
};

Components.list = new Map();
Components.exists = (name) => { return Components.list.has(name); };
Components.destroy = (component) => { component.entity = null; };

/*/////////////////////////////////////////////////////////////////////////////////
	Entities
	Basicly just a container for a list of Components
	var ent = new Entity("test", ["Transform","Drawable"]);
/////////////////////////////////////////////////////////////////////////////////*/

class Entity {
  constructor( name = "", componentList = null ) {
    this.id = Util.randomID(); // used as the key in the entities list
    this.name = name;          // given name of the entity
    this.active = true;        // indicates if the entity is active
    this.components = [ ];     // list of components

    if( componentList ) {
      this.addComponentByArray( componentList );
    }
  }

  // Add a component instance to this entity ---------------------------------
  addComponent( component ) {
    if( !component.componentTypeID ) {
      console.log( "Entity.addComponent : not a component instance" );
      return this;
    }

    component.entity = this;
    this.component[ component.constructor.name ] = component;
    return this;
  }

  //  Add component by component name -------------------------------------
  addComponentByName( name ) {
    let c;
    if( !(c = Components( name ) ) ) {
      console.log( "Could not find component ", name );
      return null;
    }
    this.addComponent( c );
    return c;
  }

  // Add a list of components-------------------------------------------
  addComponentByArray( array ) {
    let i, c;
    for( i of array ) {
      if( c = Components( i ) ) { this.addComponent( c ); }
      else { console.log( "Could not find component ", i ); }
    }
    return this;
  }

  // Removes the component --------------------------------------------
  removeComponent( name ) {
    if ( this.components[ name ] ) {
      Components.destroy( this.components[ name ] );
      delete this.components[ name ];
    } else {
      console.log( "Entity.removeComponent name not found: ", name );
    }
    return this;
  }

  // object handling -------------------------------------------------
  static destroy( entity ) {
    let c;
    for( c in entity.components ) {
      entity.removeComponent( c );
    }
  }
}

/*/////////////////////////////////////////////////////////////////////////////////
	Assemblies
	Some predefined entities, to make it easy to create common entity objects
	with the right set of components.
	Ex:
	Assemblies.add("particle", ["Movement", "Transform"]);
	var ent = Assemblages.new("particle","MyParticle");
/////////////////////////////////////////////////////////////////////////////////*/

class Assemblies {
  static async add( name, componentList ) {
    // dynamically load components that are not registred
    for ( let c of componentList ) {
      if( !Components.exists( c ) ) await import( `./components/${c}.js`);
    }
    // create assemblage instance
    Assemblies.list.set( name, { componentsList: componentList } );

    console.log( "New Assemblage: %s with components: %s", name, componentList.join( ", " ) );
    return Assemblies;
  }

  // Returns a new entity from the Assemblage ------------------------------
  static new( assemblyName, entityName = "New_Entity" ) {
    let item = Assemblies.list.get( assemblyName );
    if( item ) return new Entity( entityName, item.componentsList );
    else console.log( "No Assemblies with the name: ", name );

    return null;
  }
}

Assemblies.list = new Map();

/*/////////////////////////////////////////////////////////////////////////////////
Ecs
/////////////////////////////////////////////////////////////////////////////////*/

let gSystemCount = 0; // used to create an order id for systems when added to an ECS object

class Ecs {
  constructor( ) {
    this.entities = new Map();
    this.systems = new Array();
    this.queryCache = new Map();
  }

  // Entities -------------------------

  // Creates a new Entity based on an assemblage name ------------------------
  newEntityFromAssembly( assemblyName, entityName = "New_Entity" ) {
    let e = Assemblies.new( assemblyName, entityName );
    if( e ) {
      this.addEntity( e );
      return e;
    }
    return null;
  }

  // Creaes a new Entity and add it to the list automatically -----------------
  newEntity( entityName = "New_Entity", componentList = null ) {
    let e = new Entity( entityName, componentList );
    if( e ){
      this.addEntity( e );
      return e;
    }
    return null;
  }

  // Adds the entity instance to the entities list ----------------------------
  addEntity( entity ) {
    this.entities.set( entity.id, entity );
    return this;
  }

  // Removes an entity from the entities list and destroys it ------------------
  removeEntity( entityID ) {
    let e = this.entities.get( entityID );
    if( e ) {
      Entity.destroy( e );
      this.entities.remove( entityID );
    } else {
      console.log( "Entity does not exist when trying to remove: ", entityID );
    }
    return this;
  }

  // SYSTEMS ---------------------------------

  // Add a system to the ecs, ordered by priority ------------------------------
  addSystem( system, priority = 50 ) {
    let order = ++gSystemCount,
    item = { system, priority, order, name:system.constructor.name },
    saveIndex = -1,
    i = -1;
    s;

    // Find where on the area to put the system
    for( s of this.systems ){
      i++;
      if( s.priority < priority ) continue; // Order by priority first
      if( s.priority === priority && s.order < order ) continue; // Then by order of insertion
      saveIndex = i;
      break;
    }

    // insert system in the sorted location in the array
    if( saveIndex === -1 ) { this.systems.push( itm ); }
    else {
      this.systems.push( null); // add blank space to the array
      for( var x = this.systems.length - 1; x > saveIndex; x-- ) { // shift the array contents one index up
        this.systems[ x ] = this.systems[ x - 1 ];
      }
      this.systems[ saveIndex ] = item; // Save new item in its sorted location
    }
    console.log( "Adding System: %s with priority: %s and insert order of %d, system.constructor.name, priority, order" );
    return this;
  }

  //  Updates the systems in order------------------------------------------
  updateSystems( ) {
    let s;
    for( s of this.systems ) { s.systems.update( this ); }
    return this;
  }

  // Removes the named system from the ecs ----------------------------------
  removeSystem( name ) {
    let i;
    for( i = 0; i < this.systems.length; i++ ) {
      if( this.systems[ i ].name === name ) {
        this.systems.splice( i, 1 );
        console.log( "Removing system: ", name );
        break;
      }
    }
    return this;
  }

  // Queries ----------------------------------------------------

  // Searches the entities and returns an array of entities that have the components
    //in the componentList ----------------------------------------------------
  queryEntities( componentList, sorFunc=null ){
    // check if query has already been cached
    let queryName = "query~" + componentsList.join( "_" ),
    out = this.queryCache.get( queryName );
    if( out ) return out;

    // not in cache, run search
    let cLen = componentList.length,
    cFind = 0,
    e, c;

    out = new Array();
    for( [,e] of this.entities ) {
      cFind = 0;
      for( c of componentList ) {
        if( !e.components[ c ] ) break;  // break loop if Component is not found
        else cFind++;  // Add to find count if component is found
      }
      if( cFind === cLen ) out.push( e );
    }

    // save results for other systems
    if( out.length > 0 ) {
      this.queryCache.set( queryName, out );
      if( sortFunc ) {
        out.sort( sortFunc );
      }
    }
    return out;
  }
}

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

/*
System Notes:
  Systems should have a priority from execute first to last
  ie
  update camera, 100
  update physics, 200
  update transforms, 300
  update rendering, 400
  the ECS will arrange them in the correct order by the priority
  */
const Engine = {
  // Main Objects --------------------------------------
  camera : null,
  ecs : null,
  imput : null,
  components : null,
  assemblies : null,

  // debuging, set to false to remove error checking ------------
  debug : true,

  // frame timer ------------------------------------------------
  timerActive : true,
  fps : 60,
  fpsInterval : 1000.0 / 60.0,
  then : 0,
  now : 0,
  elaspedTime : 0,
  startTime : 0,

  // initialize the engine --------------------------------------
  initialize : function( canvasID ) {
    gl.init( canvasID );  // initialize gl

    // initialize the ECS framework -------
    this.ecs = new Ecs();

    // create assemblies ------------------

    // load default systems ---------------

    // setup components -------------------

    // initialize inputs ------------------

    // initialize default shaders ---------
    Manager.addShader( 'basic', new Shader( ShaderLib.basic.vertexShader, ShaderLib.basic.fragmentShader, this.debug ) );

    // load other resources ---------------
  },

  // start the engine timer ---------------------------------------------
  startTimer : function() {
    this.timerActive = true;
    this.then = Date.now();
    this.startTime = this.then;
    this.tick();
  },

  // called each frame ---------------------------------------------------
  tick : function( ) {

    // request another animation frame
    requestAnimationFrame( this.tick.bind( this ) );

    // calculate elaspedTime
    this.now = Date.now();
    this.elaspedTime = this.now - this.then;

    // if enough time has elasped, draw the next frame
    if( this.elaspedTime > this.fpsInterval ) {
      // get ready for next frame by setting then=now, but also adjust for your specified fpsInterval not being a
      // multiple of RAF's interval ( 16.7ms )
      this.then = this.now - ( this.elaspedTime % this.fpsInterval );

      Manager.deltaTime = this.elaspedTime;
      console.log( "tick" );
      this.ecs.updateSystems();
    }
  },

  // starts the engine running ------------------------------------------
  run : function( ) {
    Engine.then = Date.now();
    Engine.startTime = Engine.then;
    Engine.tick( );
  }
};

export { Engine, gl };
