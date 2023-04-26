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

  /**
  @brief sets the blend mode for the context
  @param mode The mode to use
  */
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
  /**
  @brief Set the size of the canvas to fill a percentage o fthe total screen
  */
  static fitToScreen( wp = 1, hp = 1 ) {
    gl.setSize( window.innerWidth * wp, window.innerHeight * hp );
    return gl;
  }

  /**
  @brief Set the size of the canvas html element and the rendering view port
  @param w width, default 500
  @param h height, default 500
  */
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

  /**
  @brief Sets the clear color for webGL
  @param r,
  @param g,
  @param b,
  @param a
   */
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

   /**
   @brief Create a shader from the source code and type
   @param src The code
   @param type The type of shader this is
   */
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

   /**
   @brief Creates a Shader program
   @param vertexShader compiled vertex shader
   @param fragmentShader compiled fragment shader
   @return shader program
   */
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

   /**
   @brief Create a shader
   @param vertexText text for the vertex shader code
   @param fragmentText text for the fragment shader code
   @param validate validate the code with error checking, default= true
   */
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

   /**
   @brief Destroy shader program
   @param sdr
   */
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

class Shader {
  constructor( vertexSource, fragmentSource, validate = true ) {
    this.program = gl.createShader( vertexSource, fragmentSource, validate );

    if( this.program != null ) {
      this.uniforms = new Map();

      this.#detectUniforms( );
      // add this to the resource managment

    }
  }

  /**
  @brief Cleans up the shader program
   */
   destroy( ) {
     gl.destroyShader( this );
   }

   /**
   @brief Activates the shader for use
   */
   bind( ) {
     gl.context.useProgram( this.program );
     return this;
   }

   /**
   @brief deactivates the shader
   */
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

const ShaderLib = {
  point: {
    vertexShader:  `#version 300 es
    in vec3 a_position;

    uniform mediump float uPointSize;
    uniform float uAngle;

    void main( void ) {
      gl_PointSize = uPointSize;
      gl_Position = vec4(
        cos(uAngle) * 0.8 * a_position.x,
        sin(uAngle) * 0.8 * a_position.y,
        a_position.z, 1.0 );
    }`,

    fragmentShader:  `#version 300 es
    precision mediump float;

    uniform float uPointSize;

    out vec4 finalColor;

    void main( void ){
      float c = ( 40.0 - uPointSize ) / 20.0;
      finalColor = vec4( c, c, c, 1.0 );
    }`
  }
};

class GLBuffer {
  /**
  @brief creates a new GLBuffer
  @param dataType The data type of this buffer, default gl.context.FLOAT
  @param bufferType The buffer target type, default gl.context.ARRAY_BUFFER
  */
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

  /**
  @brief releases resources held by the buffer
  */
  destroy( ) {
    gl.context.deleteBuffer( this.buffer );
  }


  /**
  @brief Sets the data for this buffer, or replaces what is there
  @param data The data array to use
  */
  setData( data ) {
    this.data.length = 0;
    for ( let d of data ) {
      this.data.push( d );
    }
  }

  /**
  @brief Clears the data held by this array
  */
  clearData( ) {
    this.data.length = 0;
  }

  /**
  @brief add attribute location information to this buffer
  @param location The attribute location to add
  @size The number of elements in this attribute
  */
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

  /**
  @brief Uploads the data in the array to the GPU
  */
  upload( isStatic = true, isInstance = false ) {
    gl.context.bindBuffer( this.bufferType, this.buffer );
    let ary;

    switch( this.dataType ) {
      case gl.context.FLOAT:
        ary = ( this.data instanceof Float32Array )? this.data : new Float32Array( this.data );
        break;
      case gl.context.INT:
        ary = ( this.data instanceof Float32Array )? this.data : new Float32Array( this.data );
        break;
      case gl.context.UNSIGNED_INT:
        ary = ( this.data instanceof Float32Array )? this.data : new Float32Array( this.data );
        break;
      case gl.context.SHORT:
        ary = ( this.data instanceof Float32Array )? this.data : new Float32Array( this.data );
        break;
      case gl.context.UNSGINED_SHORT:
        ary = ( this.data instanceof Float32Array )? this.data : new Float32Array( this.data );
        break;
      case gl.context.BYTE:
        ary = ( this.data instanceof Float32Array )? this.data : new Float32Array( this.data );
        break;
      case gl.context.UNSGINED_BYTE:
        ary = ( this.data instanceof Float32Array )? this.data : new Float32Array( this.data );
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

  /**
  @brief Returns the vertex count
  */
  getVertexCount( ) {
    return this.data.length / this.size;
  }
}

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

class Model {
  constructor( meshData ) {
    this.mesh = meshData;
  }

  /**
  @brief Prepare the mesh for rendering
  */
  prepareToRender() {

  }
}

let instance;  // instance for the singleton

class TestShader extends Shader {
  constructor() {
    let vs = ShaderLib.point.vertexShader;
    let fs = ShaderLib.point.fragmentShader;
    super( vs, fs, true );

    this.unbind();
  }

  set( size, angle ) {
    gl.context.uniform1f( this.getUniformLocation( "uPointSize"), size );
    gl.context.uniform1f( this.getUniformLocation( "uAngle" ), angle );
    return this;
  }
}

class EngineSingleton {

  constructor( ) {
    if( instance ) {
      throw new Error( "Cannot create another instance of singleton Engine" );
    }
    instance = this;

    this.fps = 60;
    this.fpsInterval = 1000.0 / this.fps;
    this.then;
    this.now;
    this.startTime;
    this.elaspedTime;

    // remove
    this.pointSize = 0;
    this.pointSizeStep = 3;
    this.angle = 0;
    this.angleStep = ( Math.PI / 180.0 ) * 90;
    this.uAngle = -1;
    this.model;
  }

  initialize( canvasID ) {
    // initialize GLUtils
    gl.init( canvasID );
    gl.clear( );

    // setup shader
    this.shader = new TestShader();

    // setup mesh
    let mesh = Geometry.createMesh( "dots", [0, 0, 0] );
    mesh.mode = gl.POINTS;

    this.model = new Model( mesh );

    this.startAnimating( );
  }

  startAnimating( ) {
    this.then = Date.now();
    this.startTime = this.then;
    this.animate();
  }

  animate( ) {
    // request another animation frame
    requestAnimationFrame( this.animate.bind( this ) );
    // calculate elaspedTime
    this.now = Date.now();
    this.elaspedTime = this.now - this.then;
    // if enough time has elasped, draw the next frame
    if( this.elaspedTime > this.fpsInterval ) {
      // get ready for next frame by setting then=now, but also adjust for your specified fpsInterval not being a
      // multiple of RAF's interval ( 16.7ms )
      this.then = this.now - ( this.elaspedTime % this.fpsInterval );

      // drawing code here
      this.update( this.elapsedTime );
      this.render( this.elaspedTime );
    }

  }

  update( delta ) {
  }

  render( delta ) {
    gl.clear();
    this.shader.bind().set(
      (Math.sin( ( this.pointSize += this.pointSizeStep * delta ) ) * 10.0 ) + 30.0,
      ( this.angle += this.angleStep * delta )
    );

    this.model.mesh.draw( gl.context.POINTS, true );

    /*
    if ( this.model.mesh.indexCount ) {
      gl.context.drawElements( this.model.mesh.mode, this.model.mesh.indexCount, gl.context.UNSIGNED_SHORT, 0 );
    } else {
      gl.context.drawArrays( this.model.mesh.mode, 0, this.model.mesh.vertexCount );
    }
    gl.context.bindVertexArray( null );
    */
  }

  shutdown( ) {

  }
}

let Engine = new EngineSingleton();

export { Engine, gl };
