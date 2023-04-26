import { gl } from './gl/GL.js';
import { Shader } from './graphics/Shader.js';
import { ShaderLib } from './gl/ShaderLib.js';
import { Geometry } from './graphics/Geometry.js';
import { Model } from './graphics/Model.js';

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

export { Engine };
