import { gl } from './GL.js';
import { Geometry } from './Geometry.js';
import { Manager } from './Manager.js';
import { ShaderLib } from './graphics/ShaderLib.js';
import { Entity, Components, Ecs, Assemblies } from './Ecs.js';
import { Shader } from './Shader.js';


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
}

/*
let instance;  // instance for the singleton

class EngineSingleton {

  constructor( ) {
    if( instance ) {
      throw new Error( "Cannot create another instance of singleton Engine" );
    }
    instance = this;

    // set the engine to debug mode ------------------------------------
    this.debug = true;

    // Timer -----------------------------------------------------------
    this.fps = 60;
    this.fpsInterval = 1000.0 / this.fps;
    this.then;
    this.now;
    this.startTime;
    this.elaspedTime;

    // Resource Managers --------------------------------------------
    this.shaders = new Map();   // shaders that are available in the engine
    this.geometry = new Map();   // geometry available in the engine, mustly used to allow meshes to share resources
    this.textures = new Map();   // textures available in the engine
    this.materials = new Map();  // materials available in the engine

    // remove
    this.geometry;
  }

  /**
  @brief Initializes the engine and sets the canvas to draw to
  @param canvasID the id of the hmtl canvas

  initialize( canvasID ) {
    // initialize GLUtils
    gl.init( canvasID );
    gl.clear( );

    // setup shader
    this.addShader( "basic", new Shader( ShaderLib.basic.vertexShader, ShaderLib.basic.fragmentShader, this.debug ) );

    // setup mesh
    this.geometry = Geometry.createBox2D( );

    this.startTimer( );
  }

  startTimer( ) {
    this.then = Date.now();
    this.startTime = this.then;
    this.tick();
  }

  tick( ) {
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
      this.render( this.elaspedTime );  // this should go away and just use update to update the ECS
    }

  }

  update( delta ) {
  }

  render( delta ) {
    gl.clear();
    let sdr = this.getShader( 'test' );
    sdr.bind();

    this.geometry.draw( gl.context.TRIANGLES, true );
  }

  // Shader management -------------------------------------------------------
  /**
  @brief Adds a shader resource to the engine
  @param name The name of the shader in the engine
  @param shader The shader to add

  addShader( name, shader ) {
    if( this.shaders[ name ] !== undefined ) {
      console.log( `Warning, overriding shader ${name} in the Engine.` );
    }
    this.shaders.set( name, shader );
  }

  /**
  @brief Retrieves a shader from the Engine
  @param name The name of the shader to retrieve

  getShader( name ) {
    return this.shaders[ name ];
  }

  shutdown( ) {
    this.shaders.forEach( (v,k)=> { v.destroy(); } );
  }
}

let Engine = new EngineSingleton();
*/

export { Engine };
