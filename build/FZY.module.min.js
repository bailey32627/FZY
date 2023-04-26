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

  /**
  @brief Returns the vertex count
  */
  getVertexCount( ) {
    let c = this.data.length / this.size;
    if( c < 1 ) {
      throw new Error( "Cannot have less than 1 vertex to render" );
    }
    return c;
  }
}

// convert degrees to radians
  const degreesToRadians = (degrees) => { return degrees * ( Math.PI / 180.0 ); };

  // smallest positive number
  const EPSILON = 1.192092896e-07;

class Vector2 extends Float32Array {

  /**
  * Creates a new instance of a Vector2
  */
  constructor( param ) {
    super( 2 );
    if( param instanceof Vector2 || ( param && param.length == 2 ) ) {
      this[0] = param[0];
      this[1] = param[1];
    } else if ( arguments.length == 2 ) {
      this[ 0 ] = arguments[ 0 ];
      this[ 1 ] = arguments[ 1 ];
    } else {
      this[ 0 ] = this[ 1 ] = param || 0;
    }
  }

  // getters and setters
  get x() { return this[ 0 ]; }
  set x( value ) { this[ 0 ] = value; }

  get y() { return this[ 1 ]; }
  set y( value ) { this[ 1 ] = value; }

  set( x, y ) { this[ 0 ] = x; this[ 1 ] = y; }

  copy( vec ) { this[ 0 ] = vec[ 0 ]; this[ 1 ] = vec[ 1 ]; }

  clone( vec ) { return new Vector2( this ); }

  fromAngleLength( angle, length ) {
    this[ 0 ] = length * Math.cos( angle );
    this[ 1 ] = length * Math.sin( angle );
  }

  getAngle( v = null ) {
    if( v ) {
      return Math.acos( Vector2.dot( this, v ) / (this.length() * v.length() ) );
    }
    return Math.atan2( this[1], this[0] );
  }

  // When values are very small, like less then 0.0000001, just make it zero
  nearZero( x = 1e-6, y = 1e-6 ){
    if( Math.abs(this[0]) <= x ) this[0] = 0;
    if( Math.abs(this[1]) <= y ) this[1] = 0;
    return this;
  }

  // Methods -------------------------------------------------------

  /**
  @brief Adds this and the given vector
  @param v The vector to add to this
  @param out The Vector2 to set to the calculated value
  */
  add( v, out = null ) {
    out = out || this;
    out[ 0 ] = this[ 0 ] + v[ 0 ];
    out[ 1 ] = this[ 1 ] + v[ 1 ];
    return this;
  }

  /**
  @brief subtracts this and the given vector
  @param v The vector to subtract to this
  @param out The Vector2 to set to the calculated value
  */
  subtract( v, out = null ) {
    out = out || this;
    out[0] = this[0] - v[0];
    out[1] = this[1] - v[1];
    return out;
  }

  /**
  @brief multiply this and the given vector
  @param v The vector to multiply to this
  @param out The Vector2 to set to the calculated value
  */
  multiply( v, out = null ) {
    out = out || this;
    out[0] = this[0] * v[0];
    out[1] = this[1] * v[1];
    return out;
  }

  /**
  @brief divids this and the given vector
  @param v The vector to divids to this
  @param out The Vector2 to set to the calculated value
  */
  divid( v, out = null ) {
    out = out || this;
    out[0] = v[0] != 0 ? this[0] / v[0] : 0;
    out[1] = v[1] != 0 ? this[1] / v[1] : 0;
    return out;
  }

  /**
  @brief scales this vector by the given value
  @param value the value to scale by
  @param out The Vector2 to set to the calculated value
  */
  scale( value, out = null ) {
    out = out || this;
    out[0] = this[0] * value;
    out[1] = this[1] * value;
    return out;
  }

  /**
  @brief Returns the int value of this vector
  @param out The Vector2 to set to the calculated value
  */
  floor( out = null ) {
    out = out || this;
    out[0] = Math.floor( this[ 0 ] );
    out[1] = Math.floor( this[ 1 ] );
    return out;
  }

  /**
  @brief Returns the length of the vector ( Magnitude )
  */
  length( ) {
    return Math.sqrt( this[0] * this[0] + this[1] * this[1] );
  }

  /**
  @brief Returns the squared magnitude of this vector
  */
  lengthSquared( ) {
    return this[ 0 ] * this[ 0 ] + this[ 1 ] * this[ 1 ];
  }

  /**
  @brief normalizes this vector
  @param out The vector to the calculated value
  */
  normalize( out = null ) {
    out = out || this;

    let mag = Math.sqrt( this[0]*this[0] + this[1]*this[1] );
    if( mag <= 0 ) return this;

    out[ 0 ] = this[ 0 ] / mag;
    out[ 1 ] = this[ 1 ] / mag;
    return this;
  }

  /**
  @brief Linear interpolate this and v by ratio t
  @param v Vector2
  @param t ratio clamped between 0 - 1
  @param out The Vector2 to set to the calculated value
  */
  lerp( v, t, out = null ) {
    out = out || this;
    var tmin = 1 - t;

    // linear Interpolate ( 1 - t ) * v0 + t * v1
    out[0] = this[0] * tmin + v[0] * t;
    out[1] = this[1] * tmin + v[1] * t;
    return out;
  }

  /**
  @brief Smoother version of a linear interpolate
  @param v Vector2
  @param t ratio clamped between 0 - 1
  @param out The Vector2 to set to the calculated value
  */
  smoothStep( v, t, out = null ) {
    out = out || this;
    // (b-a) * ( ratio * ratio * ( 3 - 2 * ratio ) ) + a;
    out[ 0 ] = ( v[0] - this[0]) * ( t * t * ( 3 - 2 * t ) ) + this[0];
    out[ 1 ] = ( v[1] - this[1]) * ( t * t * ( 3 - 2 * t ) ) + this[1];
    return out;
  }

  /**
  @brief an even smoother step of linear interplatation
  @param v Vector2
  @param t ratio clamped between 0 - 1
  @param out The Vector2 to set to the calculated value
  */
  smootherStep( v, t, out = null ) {
    out = out || this;
    // return (b-a) * (ratio * ratio * ratio * (ratio*(ratio * 6 - 15 ) + 10 ) ) + a;
    out[ 0 ] = (v[0] - this[0]) * ( t*t*t * ( t*( t * 6 - 15 ) + 10 ) ) + this[0];
    out[ 1 ] = (v[1] - this[1]) * ( t*t*t * ( t*( t * 6 - 15 ) + 10 ) ) + this[1];
    return out;
  }

  /**
  @brief Rotates this by the given angle
  @param angle The angle to rotate by
  @param out The Vector2 to set to the calculated value
  */
  rotate( angle, out = null ) {
    out = out || this;
    let radians = degreesToRadians( angle ),
    cos = Math.cos( radians ),
    sin = Math.sin( radians ),
    x = this[0],
    y = this[1];

    out[0] = x * cos - y * sin;
    out[1] = y * sin + y * cos;
    return out;
  }

  /**
  @brief inverts the vector from its current value
  @param out set to the calculated value
  */
  invert( out = null ) {
    out = out || this;
    out[ 0 ] = -this[0];
    out[ 1 ] = -this[1];
    return out;
  }

  /**
  @brief returns the dot product of this vector and v
  @param v The vector to subtract to this
  */
  dot( v ) {
    return this[0] * v[0] + this[1] * v[1];
  }
}

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

  // getters and setters
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

  /**
  @brief Adds this and the given vector
  @param v The vector to add to this
  @param out The Vector3 to set to the calculated value
  */
  add( v, out = null ) {
    out = out || this;
    out[ 0 ] = this[ 0 ] + v[ 0 ];
    out[ 1 ] = this[ 1 ] + v[ 1 ];
    out[ 2 ] = this[ 2 ] + v[ 2 ];
    return this;
  }

  /**
  @brief subtracts this and the given vector
  @param v The vector to subtract to this
  @param out The Vector3 to set to the calculated value
  */
  subtract( v, out = null ) {
    out = out || this;
    out[0] = this[0] - v[0];
    out[1] = this[1] - v[1];
    out[2] = this[2] - v[2];
    return out;
  }

  /**
  @brief multiply this and the given vector
  @param v The vector to multiply to this
  @param out The Vector3 to set to the calculated value
  */
  multiply( v, out = null ) {
    out = out || this;
    out[0] = this[0] * v[0];
    out[1] = this[1] * v[1];
    out[2] = this[2] * v[2];
    return out;
  }

  /**
  @brief divids this and the given vector
  @param v The vector to divids to this
  @param out The Vector3 to set to the calculated value
  */
  divid( v, out = null ) {
    out = out || this;
    out[0] = v[0] != 0 ? this[0] / v[0] : 0;
    out[1] = v[1] != 0 ? this[1] / v[1] : 0;
    out[2] = v[2] != 0 ? this[2] / v[2] : 0;
    return out;
  }

  /**
  @brief scales this vector by the given value
  @param value the value to scale by
  @param out The Vector2 to set to the calculated value
  */
  scale( value, out = null ) {
    out = out || this;
    out[0] = this[0] * value;
    out[1] = this[1] * value;
    out[2] = this[2] * value;
    return out;
  }

  /**
  @brief Returns the int value of this vector
  @param out The Vector2 to set to the calculated value
  */
  floor( out = null ) {
    out = out || this;
    out[0] = Math.floor( this[ 0 ] );
    out[1] = Math.floor( this[ 1 ] );
    out[2] = Math.floor( this[ 2 ] );
    return out;
  }

  /**
  @brief Returns the length of the vector ( Magnitude )
  */
  length( ) {
    return Math.sqrt( this[0] * this[0] + this[1] * this[1] + this[2] * this[2] );
  }

  /**
  @brief Returns the squared magnitude of this vector
  */
  lengthSquared( ) {
    return  this[0] * this[0] + this[1] * this[1] + this[2] * this[2];
  }

  /**
  @brief normalizes this vector
  @param out The vector to the calculated value
  */
  normalize( out = null ) {
    out = out || this;

    let mag = Math.sqrt( this[0]*this[0] + this[1]*this[1] );
    if( mag <= 0 ) return this;

    out[ 0 ] = this[ 0 ] / mag;
    out[ 1 ] = this[ 1 ] / mag;
    out[ 2 ] = this[ 2 ] / mag;
    return this;
  }

  /**
  @brief Linear interpolate this and v by ratio t
  @param v Vector3
  @param t ratio clamped between 0 - 1
  @param out The Vector3 to set to the calculated value
  */
  lerp( v, t, out = null ) {
    out = out || this;
    var tmin = 1 - t;

    // linear Interpolate ( 1 - t ) * v0 + t * v1
    out[0] = this[0] * tmin + v[0] * t;
    out[1] = this[1] * tmin + v[1] * t;
    out[2] = this[2] * tmin + v[2] * t;
    return out;
  }

  /**
  @brief Smoother version of a linear interpolate
  @param v Vector3
  @param t ratio clamped between 0 - 1
  @param out The Vector3 to set to the calculated value
  */
  smoothStep( v, t, out = null ) {
    out = out || this;
    // (b-a) * ( ratio * ratio * ( 3 - 2 * ratio ) ) + a;
    out[ 0 ] = ( v[0] - this[0]) * ( t * t * ( 3 - 2 * t ) ) + this[0];
    out[ 1 ] = ( v[1] - this[1]) * ( t * t * ( 3 - 2 * t ) ) + this[1];
    out[ 2 ] = ( v[2] - this[2]) * ( t * t * ( 3 - 2 * t ) ) + this[2];
    return out;
  }

  /**
  @brief an even smoother step of linear interplatation
  @param v Vector3
  @param t ratio clamped between 0 - 1
  @param out The Vector3 to set to the calculated value
  */
  smootherStep( v, t, out = null ) {
    out = out || this;
    // return (b-a) * (ratio * ratio * ratio * (ratio*(ratio * 6 - 15 ) + 10 ) ) + a;
    out[ 0 ] = (v[0] - this[0]) * ( t*t*t * ( t*( t * 6 - 15 ) + 10 ) ) + this[0];
    out[ 1 ] = (v[1] - this[1]) * ( t*t*t * ( t*( t * 6 - 15 ) + 10 ) ) + this[1];
    out[ 2 ] = (v[2] - this[2]) * ( t*t*t * ( t*( t * 6 - 15 ) + 10 ) ) + this[2];
    return out;
  }

  /**
  @brief inverts the vector from its current value
  @param out set to the calculated value
  */
  invert( out = null ) {
    out = out || this;
    out[ 0 ] = -this[0];
    out[ 1 ] = -this[1];
    out[ 2 ] = -this[2];
    return out;
  }

  /**
  @brief returns the dot product of this vector and v
  @param v The vector to subtract to this
  */
  dot( v ) {
    return this[0] * v[0] + this[1] * v[1] + this[2] * v[2];
  }

  /**
  @brief returns a vector3 that is perpendicular to this and v
  @param v the other vector3
  @param out The Vector3 to set the calculated value to
  */
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

  /**
  @brief Sets this to the cross product of the two given vectors
  @param t the first vector3
  @param v the other vector3
  */
  crossVectors( t, v ) {
    let x = t[ 1 ] * v[ 2 ] - t[ 2 ] * v[ 1 ],
        y = t[ 2 ] * v[ 0 ] - t[ 0 ] * v[ 2 ];
        z = t[ 0 ] * v[ 1 ] - t[ 1 ] * v[ 0 ];
    this[ 0 ] = x;
    this[ 1 ] = y;
    this[ 2 ] = z;
  }

  /**
  @brief Returns the distance between this vector and the given vector
  @param v Vector3
  @return number
  */
  distance( v ) {
    return Math.sqrt( ( v[0]-this[0]) * (v[0]-this[0]) + (v[1]-this[1]) * (v[1]-this[1]) + (v[2]-this[2]) * (v[2]-this[2]) );
  }

  /**
  @brief Returns the squared distance between this vector and the given vector
  @param v Vector3
  @return number
  */
  distanceSquared( v ) {
    return (v[0]-this[0]) * (v[0]-this[0]) + (v[1]-this[1]) * (v[1]-this[1]) + (v[2]-this[2]) * (v[2]-this[2]);
  }

  /**
  @brief Compares this vector and v, returns if they are within tolerance
  @param v Vector3
  @param tolerance default is EPISLON
  */
  isEqual( v, tolerance = EPSILON ) {
    if ( Math.abs( this[0] - v[0] ) > tolerance ) return false;
    if ( Math.abs( this[1] - v[1] ) > tolerance ) return false;
    if ( Math.abs( this[2] - v[2] ) > tolerance ) return false;
    return true;
  }

  /**
  @brief projects this on v and set the value to out
  @param v Vector3
  @param out The Vector to set to the calculated value
  */
  project( v, out = null ) {
    out = out || this;
    this[0]; this[1]; this[2];
    let d = this.dot( v );
    out[0] = this[0] - ( v[0] * d );
    out[1] = this[1] - ( v[1] * d );
    out[2] = this[2] - ( v[2] * d );
    return out;
  }

  /**
  @brief Rotates this vector3 on the given axis
  @param degrees the amount to rotate in degrees
  @param axis The axis to rotate on
  @param out Vector3 to set to the calculated value
  */
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

class Vertex {
  constructor( position = new Vector3(), normal = new Vector3(), texcoords = new Vector2, tangent = new Vector3(), bitangents = new Vector3() ) {
    this.position = position;
    this.normal = normal;
    this.texcoords = texcoords;
    this.tangent = tangent;
    this.bitangent = bitangents;
  }

  setPosition( position ) {
    this.position = position;
  }

  setNormal( normal ) {
    this.normal = normal;
  }

  setTexcoords( texcoords ) {
    this.texcoords = texcoords;
  }

  setTangent( tangent ) {
    this.tangent = tangent;
  }

  setBitangent( bitangent ) {
    this.bitangent = bitangent;
  }
  /**
  @brief Gets the vertex in array form
  */
  toArray( array ) {
    if( array != undefined ) {
      array.push( this.position.x, this.position.y, this.position.z,
                  this.normal.x, this.normal.y, this.normal.z,
                  this.texcoords.x, this.texcoords.y,
                  this.tangent.x, this.tangent.y, this.tangent.z,
                  this.bitangent.x, this.bitangent.y, this.bitangent.z );
    }
  }
}

class Geometry {
  /**
  @brief Creates a new vetex array object to hold an array of vetex buffer objects
  */
  constructor( ) {
    this.vao = gl.context.createVertexArray( );
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
    gl.context.deleteVertexArray( this.vao );
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
    gl.context.bindVertexArray( this.vao );
    for( let [ key, value ] of Object.entries( this.buffers ) ) {
      value.upload( isStatic, isInstance );
    }
    gl.context.bindVertexArray( null );
  }

  /**
  @brief bind the vao
  */
  bind( ) {
    gl.context.bindVertexArray( this.vao );
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

  /**
  @brief Creates a quad geometry
  */
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

let instance;  // instance for the singleton

class TestShader extends Shader {
  constructor() {
    let vs = ShaderLib.basic.vertexShader;
    let fs = ShaderLib.basic.fragmentShader;
    super( vs, fs, true );

    this.unbind();
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
    this.geometry;
  }

  initialize( canvasID ) {
    // initialize GLUtils
    gl.init( canvasID );
    gl.clear( );

    // setup shader
    this.shader = new TestShader();

    // setup mesh
    this.geometry = Geometry.createBox2D( );

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
    this.shader.bind();

    this.geometry.draw( gl.context.TRIANGLES, true );

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
