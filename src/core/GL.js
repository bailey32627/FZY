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


export { gl };
