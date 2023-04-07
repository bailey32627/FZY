class GLUtil {
  /**
  * Creates a new instance of the GLUtils, one per canvas
  */
  constructor() {
  }

  /**
  * static variable to hold the canvas element
  * initialized to undefined until the initialze function is called
  */
  static canvas = undefined;

  /**
  * static variable to hold the webGL context
  * initialized to undefined until the initialze function is called
  */
  static glConext = undefined;

  /**
  * Resposible for creating and initialing a canvas and webGL context
  * @param elementID - Id of the element to search for
  */
  static initialize( elementID ) {

    this.canvas = elementID !== undefined ? document.getElementById( elementID ) :
                                            document.createElement( "canvas" );
    if( elementID === undefined )
      document.body.appendChild( this.canvas );

    if( !this.canvas )
      throw new Error( `Cannot find a canvas element name ${elementID}` );

    this.context = this.canvas.getContext( "webgl" );

    if( this.context === undefined )
      throw new Error( "Unable to initialize webGL" );
  }
}

export { GLUtil };
