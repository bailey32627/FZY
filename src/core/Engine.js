import { gl } from './gl/GL.js';
import { Shader } from './graphics/Shader.js';
import { ShaderLib } from './gl/ShaderLib.js';
import { Geometry } from './graphics/Geometry.js';
import { Model } from './graphics/Model.js';

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

export { Engine };
