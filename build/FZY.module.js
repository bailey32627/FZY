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

// Represents a webGL Shader
class Shader {
  /**
  * private name of the shader
  */
  #_name;
  #_program;

  /**
  * Creates a new instance of Shader
  * @param name The name of the shader
  * @param vertex The vertex shader source to use
  * @param fragment The fragment shader source to use
  */
  constructor( name, vertex, fragment ) {
    this._name = name;
    this.vertexShader = this.loadShader( vertex, GLUtil.context.VERTEX_SHADER );
    this.fragmentShader = this.loadShader( fragment, GLUtil.context.FRAGMENT_SHADER );

    this.createProgram( this.vertexShader, this.fragmentShader );
  }

  /**
  * Returns the name of the shader
  */
  get name() {
    return _name;
  }

  /**
  * Tell webGL to render with this shader
  */
  use( ) {
    GLUtil.context.useProgram( this._program );
  }

  /**
  * Loads a shaders source code to the webGL shader and returns it
  * @param source The source code to load
  * @param type The webGL type of shader
  * @return A new webGL shader with the compiled source code
  */
  loadShader( source, type ) {
    let shader = GLUtil.context.createShader( type );

    GLUtil.context.shaderSource( shader, source );
    GLUtil.context.compileShader( shader );
    let error = GLUtil.context.getShaderInfoLog( shader );

    if( error !== '' )
      throw new Error( `Error compiling shader: ${ this._name } : ${error}` );

    return shader;
  }

  /**
  * Creates the webGL shader program and links the two shaders to it
  * @param vertexShader The compiled vertex shader to use
  * @param fragmentShader The compiled fragment shader to use
  */
  createProgram( vertexShader, fragmentShader ) {
    this._program = GLUtil.context.createProgram();
    GLUtil.context.attachShader( this._program, vertexShader );
    GLUtil.context.attachShader( this._program, fragmentShader );
    GLUtil.context.linkProgram( this._program );

    let error = GLUtil.context.getProgramInfoLog( this._program );
    if (error !== '' )
      throw new Error( `Error linking shader: ${ this._name } : ${error}` );
  }
}

const ShaderLib = {
  basic: {
    vertexShader:  `
    attribute vec3 position;
    void main() {
      gl_Position = vec4( position, 1.0 );
    }`,

    fragmentShader:  `
    precision mediump float;
    void main() {
      gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
    }`
  }
};

class Engine {

  #_shader;

  /**
  * Creates a new instance of the engine
  */
  constructor( ) {
    this.count = 0;
  }

  /**
  * Initializes the engine resources and starts the game loop
    */
  initialize() {

    // initialize webGL
    GLUtil.initialize();
    // set the webGL clear color
    GLUtil.context.clearColor( 0, 0, 0, 1 );

    // load the shaders and set it to be used
    this._shader = new Shader( 'basic', ShaderLib.basic.vertexShader, ShaderLib.basic.fragmentShader );
    this._shader.use();

    this.run();
  }

  /**
  * The main game loop
   */
  run( ) {
    // clear the color buffer
    GLUtil.context.clear( GLUtil.context.COLOR_BUFFER_BIT );

    requestAnimationFrame( this.run.bind( this ) );
  }

  /**
  * Frees the engine resources and shuts down all engine components
  */
  shutdown() {

  }
}

class Vector2 {

  /**
  * Creates a new instance of a Vector2
  */
  constructor( x = 0, y = 0 ) {
    this.x = x;
    this.y = y;
  }

  /**
    Getter to retrieve the x component
  */
  get width() {
    return this.x;
  }

  /**
    Getter to retrieve the y component
  */
  get height() {
    return this.y;
  }

  set width( value ) {
    this._x = value;
  }

  /**
  * Setter for the y component
  */
  set height( value ) {
    this.y = value;
  }

  /**
  * Sets the x component of this vector2
  * @param value The value to set x to
  */
  setX( value ){
    this.x = value;
  }

  /**
  * Sets the y component of this vector2
  * @param value The value to set y to
  */
  setY( value ){
    this.y = value;
  }

  /**
  * Setter for both components
  * @param x The value for x
  * @param y The value for y
  */
  set( x, y ) {
    this.x = x;
    this.y = y;
  }

  /**
  * Get the component at the given index
  * @param index The index of the component to set x = 0, y = 1
  */
  getComponent( index ) {
    switch( index ) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      default: throw new Error( "index is outside of Vector2");
    }
  }

  /**
  * Set the component at the given index
  * @param index The index of the component to set x = 0, y = 1
  * @param value The value to set the component to
  */
  setComponent( index, value ) {
    switch( index ) {
      case 0:
        this.x = value;
        break;
      case 1:
        this.y = value;
        break;
      default: throw new Error( "index is outside of Vector2");
    }
  }

  /**
  * adds the given vector2 to this
  * @param v The vector2 to add to this
  */
  add( v ) {
    this.x += v.x;
    this.y += v.y;
  }

  /**
  * Sets this value to the value of the added vectors
  * @param a The first vector2 arguement
  * @param b The second vector2 arguement
  */
  addVectors( a, b ) {
    this.x = a.x + b.x;
    this.y = a.y + b.y;
  }

  /**
  * subtracts the given vector2 from this
  * @param v The Vector2 to subtract from this
  */
  subtract( v ) {
    this.x -= v.x;
    this.y -= v.y;
  }

  /**
  * Sets this value to the value of the added vectors
  * @param a The first vector2 arguement
  * @param b The second vector2 arguement
  */
  subtractVectors( a, b ) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
  }

  /**
  * Component wise multiplation of this vector2 and the given vector2
  * @param v The vector to multiply with this
  */
  multiply( v ) {
    this.x *= v.x;
    this.y *= v.y;
  }

  /**
  * Sets this value to the value of the multiplied vectors
  * @param a The first vector2 arguement
  * @param b The second vector2 arguement
  */
  multiplyVectors( a, b ) {
    this.x = a.x * b.x;
    this.y = a.y * b.y;
  }

  /**
  * Scales this vector2 by the given scalar
  * @param scalar The scalar to scale this vector2 by
  */
  scale( scalar ) {
    this.x *= scalar;
    this.y *= scalar;
  }

  /**
  * Rotates this vector2 by the given degrees
  * @param degrees The amount to rotate this vector by
  */
  rotate( degrees ) {
    let radians = degreesToRadians( degrees );
    let s = Math.sin( radians );
    let c = Math.cos( radians );
    let x = this.x * c - this.y * s;
    let y = this.x * s + this.y * c;
    this.x = x;
    this.y = y;
  }

  /**
  * Returns the squared length of the Vector2
  */
  squaredLength( ) {
    return this.x * this.x + this.y * this.y;
  }

  /**
  * Returns the length of this Vector2
  */
  length( ) {
    return Math.sqrt( this.x * this.x + this.y * this.y );
  }

  /**
  * Returns the dot product of the two vectors
  * @param v The other vector to use
  * @return The dot product of the 2 vectors
  */
  dot( v ) {
    return this.x * v.x + this.y * v.y;
  }

  /**
  * Normailzes the vector ( makes length 1 )
  */
  normalize( ) {
    let l = this.length();
    if( l <= 0 )
    {
      this._x = 0;
      this._y = 0;
      return;
    }
    l = 1.0 / l;
    this._x *= l;
    this._y *= l;
  }

  /**
  * Component wise comparision of this vector2 and the given vector2
  * @param v Vector2 to compare this to
  * @param tolerance The tolerance of the comparision, EPSILON by default
  * @return true if both components are within the tolerance
  */
  equals( v, tolerance = EPSILON ) {
    if( Math.abs( this._x - v.x() ) > tolerance ) { return false; }
    if( Math.abs( this._y - v.y() ) > tolerance ) { return false; }
    return true;
  }

  /**
  * Returns the squared distance between the this and the given vector2
  * @param v The other Vector2
  * @return The distance between the vectors
  */
  squaredDistance( v ) {
    return (( v.x() - this._x ) * ( v.x() - this._x ) + ( v.y() - this._y ) * ( v.y() - this._y ));
  }

  /**
  * Returns the distance between the this and the given vector2
  * @param v The other Vector2
  * @return The distance between the vectors
  */
  distance( v ) {
    let d = this.squaredDistance( v );
    return Math.sqrt( d );
  }

  /**
  * Sets the values of this vector to the minimum values between this and the given vector2
  @param v The other Vector2
  */
  min( v ) {
    this.x = Math.min( this.x, v.x );
    this.y = Math.min( this.y, v.y );
  }

  /**
  * Sets the values of this vector to the maximum values between this and the given vector2
  @param v The other Vector2
  */
  max( v ) {
    this.x = Math.max( this.x, v.x );
    this.y = Math.max( this.y, v.y );
  }


}

export { Engine, GLUtil, Vector2 };
