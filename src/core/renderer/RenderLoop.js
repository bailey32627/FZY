
class RenderLoop {
  constructor( callback, fps ) {
    var oThis = this;

    this.lastFrame = null;     // The time in illiseconds of the last frame
    this.callback = callback;  // what fucntion to call for each frame
    this.isActive = false;     // control the on/off state of the render loop
    this.fps = 0;              // Save the value of fast to loop

    if ( !fps && fps > 0 ) { // build a run method that limits the framerate
      this.fpsLimit = 1000/fps; // calculate how many milliseconds per frame in one second of time

      this.run = function( ) {
        // calculate the deltatime between frames and the fps currently
        var current = performance.now(),
        delta = ( current - oThis.lastFrame ),
        deltaTime = delta / 1000.0;  // what fraction of a single second is the delta time

        if( delta >= oThis.fpsLimit ) { // now execute frame since the time has elasped
          oThis.fps = Math.floor( 1/deltaTime );
          oThis.lastFrame = current;
          oThis.callback( deltaTime );
        }

        if ( oThis.isActive ){ window.requestAnimationFrame( oThis.run ); }
      }

    } else {

       // build a run method that optimsied as much as possible
       this.run = function( ){
         // calculate the deltatime betweeen frames and the fps currently
         var current = performance.now(),
         deltaTime = ( current - oThis.lastFrame ) / 1000.0; // ms between frames / 1 seconds

         // new execute frame since the time has elasped
         oThis.fps = Math.floor( 1/ deltaTime );
         oThis.lastFrame = current;
         oThis.callback( deltaTime );
         if( oThis.isActive ) { window.requestAnimationFrame( oThis.run ); }
       }
    }
  }

  start( ) {
    this.isActive = true;
    this.lastFrame = performance.now();
    window.requestAnimationFrame( this.run );
    return this;
  }

  stop( ) {
    this.isActive = false;
  }
}

export { RenderLoop };
