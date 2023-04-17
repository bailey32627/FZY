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
  }

  initialize( canvasID ) {
    // initialize GLUtils
    GLUtil.initialize( canvasID );
    GLUtil.setSize( 500, 500 );
    GLUtil.clear( );

    let shader = new Shader( ShaderLib.point.vertexShader, ShaderLib.point.fragmentShader, true );
    gl.useProgram( shader._program );
    let aPositionLoc = gl.getAttribLocation( shader._program, "a_position" );
    let uPointSizeLoc = gl.getUniformLocation( shader._program, "uPointSize" );
    gl.useProgram( null );
    var aryVerts = new Float32Array([ 0, 0, 0, 0.5, 0.5, 0 ] );
    var bufVerts = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufVerts );
    gl.bufferData( gl.ARRAY_BUFFER, aryVerts, gl.STATIC_DRAW );
    gl.bindBuffer( gl.ARRAY_BUFFER, null );

    // Set up for drawing
    gl.useProgram( shader._program );
    gl.uniform1f( uPointSizeLoc, 50.0 );

    gl.bindBuffer( gl.ARRAY_BUFFER, bufVerts );
    gl.enableVertexAttribArray( aPositionLoc );
    gl.vertexAttribPointer( aPositionLoc, 3, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer( gl.ARRAY_BUFFER, null );

    gl.drawArrays( gl.POINTS, 0, 2 );
  }

  loop( ) {

  }

  shutdown( ) {

  }
}

let Engine = new EngineSingleton();

export { Engine };
