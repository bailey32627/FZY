import { gl } from './gl/GLUtil.js';
import { GLUtil } from './gl/GLUtil.js';
import { Shader } from './gl/Shader.js';
import { ShaderLib } from './gl/ShaderLib.js';
import { Geometry } from './graphics/Geometry.js';
import { Model } from './graphics/Model.js';

let instance;  // instance for the singleton

class TestShader extends Shader {
  constructor() {
    let vs = ShaderLib.point.vertexShader;
    let fs = ShaderLib.point.fragmentShader;
    super( vs, fs, true );

    // shader uses custom uniforms, this i sthe time to get its location for future use
    this.uniformLoc.uPointSize = gl.getUniformLocation( this._program, "uPointSize" );
    this.uniformLoc.uAngle = gl.getUniformLocation( this._program, "uAngle" );

    this.deactivate();
  }

  set( size, angle ) {
    gl.uniform1f( this.uniformLoc.uPointSize, size );
    gl.uniform1f( this.uniformLoc.uAngle, angle );
    return this;
  }
}

class EngineSingleton {

  constructor( ) {
    if( instance ) {
      throw new Error( "Cannot create another instance of singleton Engine" );
    }
    instance = this;
    this.frameNumber = 0;
    this.previousTime = 0;

    this.pointSize = 0;
    this.pointSizeStep = 3;
    this.angle = 0;
    this.angleStep = ( Math.PI / 180.0 ) * 90;
    this.uAngle = -1;
    this.model;
  }

  initialize( canvasID ) {
    // initialize GLUtils
    GLUtil.initialize( canvasID );
    GLUtil.setSize( 500, 500 );
    GLUtil.clear( );

    // setup shader
    this.shader = new TestShader();

    // setup mesh
    let mesh = Geometry.createMesh( "dots", [0, 0, 0] );
    mesh.mode = gl.POINTS;

    this.model = new Model( mesh );

    // start the loop
    this.loop();
  }

  loop( ) {
    let current = performance.now();
    let delta = current - this.previousTime;

    this.update( delta );
    this.render( delta );

    this.previousTime = performance.now();
    requestAnimationFrame( this.loop.bind( this ) );
  }

  update( delta ) {
  }

  render( delta ) {
    GLUtil.clear();
    this.shader.activate().set(
      (Math.sin( ( this.pointSize += this.pointSizeStep * delta ) ) * 10.0 ) + 30.0,
      ( this.angle += this.angleStep * delta )
    ).renderModel( this.model ); 
  }

  shutdown( ) {

  }
}

let Engine = new EngineSingleton();

export { Engine };
