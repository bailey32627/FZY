import { gl } from './gl/GLUtil.js';
import { GLUtil } from './gl/GLUtil.js';
import { Shader } from './gl/Shader.js';
import { ShaderLib } from './gl/ShaderLib.js';
import { RenderLoop } from './renderer/RenderLoop.js';

let instance;  // instance for the singleton

class EngineSingleton {
  constructor( ) {
    if( instance ) {
      throw new Error( "Cannot create another instance of singleton Engine" );
    }
    instance = this;
  }

  initialize( canvasID ) {
    // initialize GLUtils
    GLUtil.initialize( canvasID );
    GLUtil.setSize( 500, 500 );
    GLUtil.clear( );

    let shader = new Shader( 'point', ShaderLib.point.vertexShader, ShaderLib.point.fragmentShader, true );
    gl.useProgram( shader._program );
    let aPositionLoc = shader.getAttributeLocation( "a_position" );
    this.uPointSizeLoc = shader.getUniformLocation( 'uPointSize' );
    gl.useProgram( null );
    var aryVerts = new Float32Array([ 0, 0, 0, 0.5, 0.5, 0 ] );
    var bufVerts = GLUtil.createArrayBuffer( aryVerts );

    // Set up for drawing
    gl.useProgram( shader._program );
    gl.uniform1f( this.uPointSizeLoc, 50.0 );

    gl.bindBuffer( gl.ARRAY_BUFFER, bufVerts );
    gl.enableVertexAttribArray( aPositionLoc );
    gl.vertexAttribPointer( aPositionLoc, 3, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer( gl.ARRAY_BUFFER, null );

    this.rLoop = new RenderLoop( this.onRender ).start();
  }

  onRender(dt ) {
    GLUtil.clear();
    gl.drawArrays( gl.POINTS, 0, 2 );
  }

  shutdown( ) {

  }
}

let Engine = new EngineSingleton();

export { Engine };
