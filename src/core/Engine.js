import { gl } from './gl/GLUtil.js';
import { GLUtil } from './gl/GLUtil.js';
import { Shader } from './gl/Shader.js';
import { ShaderLib } from './gl/ShaderLib.js';

let instance;  // instance for the singleton

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
  }

  initialize( canvasID ) {
    // initialize GLUtils
    GLUtil.initialize( canvasID );
    GLUtil.setSize( 500, 500 );
    GLUtil.clear( );

    this.shader = new Shader( 'point', ShaderLib.point.vertexShader, ShaderLib.point.fragmentShader, true );
    gl.useProgram( this.shader._program );
    let aPositionLoc = this.shader.getAttributeLocation( "a_position" );
    gl.useProgram( null );
    var aryVerts = new Float32Array([ 0, 0, 0, 0.5, 0.5, 0 ] );
    var bufVerts = GLUtil.createArrayBuffer( aryVerts );

    // Set up for drawing
    gl.useProgram( this.shader._program );


    gl.bindBuffer( gl.ARRAY_BUFFER, bufVerts );
    gl.enableVertexAttribArray( aPositionLoc );
    gl.vertexAttribPointer( aPositionLoc, 3, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer( gl.ARRAY_BUFFER, null );

    this.fpsLimit = 1000 / 60; // calculate how many milliseconds per frame in one second of time

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
    this.pointSize += this.pointSizeStep * delta;
    let size = ( Math.sin( this.pointSize ) * 10.0 ) + 30.0;

    this.angle += this.angleStep * delta;
    gl.uniform1f( this.shader.getUniformLocation( "uAngle" ), this.angle );

    gl.uniform1f( this.shader.getUniformLocation( "uPointSize"), size );
    GLUtil.clear();
    gl.drawArrays( gl.POINTS, 0, 2 );
  }

  shutdown( ) {

  }
}

let Engine = new EngineSingleton();

export { Engine };
