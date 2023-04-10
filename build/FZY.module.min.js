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
      this.x = 0;
      this.y = 0;
      return;
    }
    l = 1.0 / l;
    this.x *= l;
    this.y *= l;
  }

  /**
  * Component wise comparision of this vector2 and the given vector2
  * @param v Vector2 to compare this to
  * @param tolerance The tolerance of the comparision, EPSILON by default
  * @return true if both components are within the tolerance
  */
  isEqual( v, tolerance = EPSILON ) {
    if( Math.abs( this.x - v.x() ) > tolerance ) { return false; }
    if( Math.abs( this.y - v.y() ) > tolerance ) { return false; }
    return true;
  }

  /**
  * Returns the squared distance between the this and the given vector2
  * @param v The other Vector2
  * @return The distance between the vectors
  */
  squaredDistance( v ) {
    return (( v.x - this.x ) * ( v.x - this.x ) + ( v.y - this.y ) * ( v.y - this.y ));
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

class Vector3 {

  /*
  * Creates a new Instance of a Vector3
  */
  constructor( x = 0, y = 0, z = 0 ) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
  * Returns a clone of this vector3
  * @return Vector3
  */
  clone( ) {
    return new this.constructor( this.x, this.y, this.z );
  }

  /**
  * Sets the x component of this vector
  * @param value The value to set x to
  */
  setX( value ) {
    this.x = value;
  }

  /**
  * Sets the y component of this vector
  * @param value The value to set y to
  */
  setY( value ) {
    this.y = value;
  }

  /**
  * Sets the a component of this vector
  * @param value The value to set a to
  */
  setZ( value ) {
    this.z = value;
  }

  /**
  * Sets the component by the index
  @param index The index into the vector to set
  @param value The value to set the component to
  */
  setComponent( index, value ) {
    switch( index ){
      case 0: this.x = value; break;
      case 1: this.y = value; break;
      case 2: this.z = value; break;
      default: throw new Error( "index is outside of Vector3");

    }
  }

  /**
  * Get the x component of this vector
  * @return value of x
  */
  getX( ){
    return this.x;
  }

  /**
  * Get the y component of this vector
  * @return value of y
  */
  getY( ){
    return this.x;
  }

  /**
  * Get the z component of this vector
  * @return value of z
  */
  getX( ){
    return this.x;
  }

  /**
  * Get the component by index into the vector3
  * @param index The index to access
  * @return The value at that index
  */
  getComponent( index ){
    switch( index ){
      case 0: return this.x;
      case 1: return this.y;
      case 2: return this.z;
      default: throw new Error( "Index is outside of Vector3: " + index );
    }
  }

  /**
  * Adds the given vector to this vector
  @param v The vector to add to this vector
  */
  add( v ) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
  }

  /**
  * Sets this vector to the sum of the two provided vectors
  @param a The first vector to add
  @param b The second vector to add
  */
  addVectors( a, b ) {
    this.x = a.x + b.x;
    this.y = a.y + b.y;
    this.z = a.z + b.z;
  }

  /**
  * Subtracts the provided vector from this vector
  * @param v The vector to subtract
  */
  subtract( v ) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
  }

  /**
  * Sets the value of this vector to the difference between the two provided vectors
  * @param a The first vector to subtract
  * @param b The second vector3
  */
  subtractVectors( a, b ) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    this.z = a.z - b.z;
  }

  /**
  * Multiplies this vector by the given vector
  * @param v The vector to multiply by
  */
  multiply( v ) {
    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;
  }

  /**
  * Sets The value of this vector to the product of the two provided vectors
  * @param a Vector3
  * @param b Vector3
  */
  multiplyVectors( a, b ) {
    this.x = a.x * b.x;
    this.y = a.y * b.y;
    this.z = a.z * b.z;
  }

  /**
  * Inverts the values of the this vector3
  */
  invert( ) {
    this.x *= -1;
    this.y *= -1;
    this.z *= -1;
  }

  /**
  * Scales this vector3 by the given scalar
  * @param scalar float
  */
  scale( ) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
  }

  /**
  * Sets the value of this vector to the cross product of this vector and v
  * @param v Vector3
  */
  cross( v ) {
    let x = this.y * v.z - this.z * v.y;
    let y = this.z * v.x - this.x * v.z;
    let z = this.x * v.y - this.y * v.x;
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
  * Set the value of this vector to the cross product of the two provided vectors
  * @param a Vector3
  * @param b Vector3
  */
  crossVectors( a, b ) {
    this.x = a.y * b.z - a.z * b.y;
    this.y = a.z * b.x - a.x * b.z;
    this.z = a.x * b.y - a.y * b.x;
  }

  /**
  * Returns the squared length of this vector3
  * @return Float
  */
  lengthSquared( ) {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  /**
  * Returns the dot product of this vector and the provided vector
  * @return float
  */
  dot( v ) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  /**
  * Returns the magnitude of the Vector3 ( length )
  * @return float
  */
  length( ) {
    return Math.sqrt( this.lengthSquared() );
  }

  /**
  * Returns the squared distance between this vector and the given vector
  * @param v Vector3
  * @return float
  */
  squaredDistance( v ) {
    return ( (v.x - this.x) * (v.x - this.x ) + (v.y - this.y)*(v.y - this.y) + (v.z - this.z)*(v.z-this.z) );
  }

  /**
  * Returns the distance between this vector and the given vector
  * @param v vector3
  * @return float
  */
  distance( v ) {
    return Math.sqrt( this.squaredDistance( v ) );
  }

  /**
  * sets this vectors length to 1
  */
  normalize( ) {
    let l = this.length();
    if( l > 0.0 )
    {
      l = 1.0 / l;
      this.x *= l;
      this.y *= l;
      this.z *= l;
      return;
    }
    this.x = 0;
    this.y = 0;
    this.z = 0;
  }

  /**
  * Sets this vector to v reflected by the normal n provided
  * @param v Vector3
  * @param n Vector3
  */
  reflect( v, n ) {
    let d = 2 * v.dot( n );
    this.x = a.x - ( n.x * d );
    this.y = a.y - ( n.y * d );
    this.z = a.z - ( n.z * d );
  }

  /**
  * Sets this vector as a projection of a onto b
  * @param a Vector3
  * @param b Vector3
  */
  project( a, b ) {
    let d = a.dot( b );
    this.x = a.x - ( b.x * d );
    this.y = a.y - ( b.y * d );
    this.z = a.z - ( b.z * d );
  }

  /**
  * Component wise comparision of this vector and the given vector
  * @param v Vector3
  * @param tolerance Float
  * @return True if within tolerance
  */
  isEqual( v, tolerance = EPSILON ) {
    return Math.abs( this.x - v.x ) > tolerance ? 0 : ( Math.abs(this.y - v.y) > tolerance ? 0 : ( Math.abs(this.z - v.z ) > tolerance ? 0 : 1 ) );
  }
}

class Quaternion {
  /**
  * Creates a new Instance of a Vector4
  */
  constructor( x = 0, y = 0, z = 0, w = 1 ) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  /**
  * sets this to the identity
  */
  identity() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.w = 1.0;
  }

  /**
  * Returns a clone of this vector4
  */
  clone( ) {
    return new this.constructor( this.x, this.y, this.z, this.w );
  }

  /**
  * Sets the x component of the vector4
  * @param v Float
  */
  setX( v ) {
    this.x = v;
  }

  /**
  * Sets the y component of the vector4
  * @param v Float
  */
  setY( v ) {
    this.y = v;
  }

  /**
  * Sets the z component of the vector4
  * @param v Float
  */
  setZ( v ) {
    this.z = v;
  }

  /**
  * Sets the w component of the vector4
  * @param v Float
  */
  setW( v ) {
    this.w = w;
  }

  /**
  * Sets the component at the given index to v
  * @param index int
  * @param v Float
  */
  setComponent( index, v ) {
    switch( index ) {
      case 0: this.x = v; break;
      case 1: this.y = v; break;
      case 2: this.z = v; break;
      case 3: this.w = v; break;
      default: throw new Error( "Index is out of range for a Vector4: " + index );
    }
  }

  /**
  * Returns the value of the x component
  */
  getX( ) {
    return this.x;
  }

  /**
  * Returns the value of the y component
  */
  getY( ) {
    return this.y;
  }

  /**
  * Returns the value of the z component
  */
  getZ() {
    return this.z;
  }

  /**
  * Returns the value of the w component
  */
  getW( ) {
    return this.w;
  }

  /**
  * Returns the value at index in the vector4
  * @param index int
  */
  getComponent( index ) {
    switch( index ) {
      case 0: return this.x;
      case 1: return this.y;
      case 2: return this.z;
      case 3: return this.w;
      default: throw new Error( "Index is out of range for a Quaternion: " + index );
    }
  }

  /**
  * Returns the length of the vector4
  */
  length( ){
    return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w );
  }

  /**
  * Makes the length of the vertor4 1.0
  */
  normalize( ) {
    let l = this.length();
    if( l > 0.0 )
    {
      let l = 1.0 / l;
      this.x *= l;
      this.y *= l;
      this.z *= l;
      this.w *= l;
      return;
    }
    set( 0.0, 0.0, 0.0, 0.0 );
  }

  /**
  * Sets this Vector4 to the conjugate of itself
  */
  conjugate( ) {
    this.x *= -1.0;
    this.y *= -1.0;
    this.z *= -1.0;
  }

  /**
  * Returns the inverse of this */
  inverse( ) {
    let t = this.clone();
    t.conjugate();
    t.normalize();
    return t;
  }

  /**
  * Multiplies this quaternion and sets it to the product
  * @param v Quaternion
  */
  multiply( v ) {
    let x = this.x * v.w + this.y * v.z - this.z * v.y + this.w * v.x;
    let y = -this.x * v.z + this.y * v.w + this.z * v.x + this.w * v.y;
    let z = this.x * v.y - this.y * v.x + this.z * v.w + this.w * v.z;
    let w = -this.x * v.x - this.y * v.y - this.z * v.z + this.w * v.w;
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  /**
  * Sets the value of this Quaternion to the product of a and b
  * @param a Quaternion
  * @param b Quaternion
  */
  multiplyQuaternions( a, b ) {
    this.x = a.x * b.w + a.y * b.z - a.z * b.y + a.w * b.x;
    this.y = -a.x * b.z + a.y * b.w + a.z * b.x + a.w * b.y;
    this.z = a.x * b.y - a.y * b.x + a.z * b.w + a.w * b.z;
    this.w = -a.x * b.x - a.y * b.y - a.z * b.z + a.w * b.w;
  }

  /**
  * Returns the dot product of this and b
  * @param b quaternion
  */
  dot( b ) {
    return this.x * b.x + this.y * b.y + this.z * b.z + this.w + b.w;
  }

  /**
  * Sets this quaternion from the given axis and angle
  * @param axis Vector3
  * @param angle Degrees
  * @param normalize Bool
  */
  axisAngle( axis, angle, normalize ) {
    let halfAngle = 0.5 * angle;
    let s = Math.sin( halfAngle );

    this.x = axis.x * s;
    this.y = axis.y * s;
    this.z = anis.z * s;
    this.w = Math.cos( halfAngle );

    if( normalize )
      this.normalize();
  }

  /**
  * Spherical interpolate, sets this to the result
  * Source: https://en.wikipedia.org/wiki/Slerp
  *  Only unit quaternions are valid rotations.
  * Normalize to avoid undefined behavior.
  * @param a Quaternion
  * @param b Quaternion
  * @param percentage
  */
  slerp( a, b, percentage ) {

    // Source: https://en.wikipedia.org/wiki/Slerp
    // Only unit quaternions are valid rotations.
    // Normalize to avoid undefined behavior.
    let v0 = a.clone().normalize();
    let v1 = b.clone().normalize();

    // Compute the cosine of the angle between the two vectors.
    let dot = a.dot( b );

    // If the dot product is negative, slerp won't take
    // the shorter path. Note that v1 and -v1 are equivalent when
    // the negation is applied to all four components. Fix by
    // reversing one quaternion.
    if (dot < 0.0 )
    {
      v1.x = -v1.x;
      v1.y = -v1.y;
      v1.z = -v1.z;
      v1.w = -v1.w;
      dot = -dot;
    }

    const DOT_THRESHOLD = 0.9995;
    if (dot > DOT_THRESHOLD )
    {
      // If the inputs are too close for comfort, linearly interpolate
      // and normalize the result.
      this.x = v0.x + ((v1.x - v0.x) * percentage);
      this.y = v0.y + ((v1.y - v0.y) * percentage);
      this.z = v0.z + ((v1.z - v0.z) * percentage);
      this.w = v0.w + ((v1.w - v0.w) * percentage);
      this.normalize();
      return;
    }

    // Since dot is in range [0, DOT_THRESHOLD], acos is safe
    let theta_0 = Math.acos(dot);          // theta_0 = angle between input vectors
    let theta = theta_0 * percentage;  // theta = angle between v0 and result
    let sin_theta = Math.sin(theta);       // compute this value only once
    let sin_theta_0 = Math.sin(theta_0);   // compute this value only once

    let s0 = Math.cos(theta) - dot * sin_theta / sin_theta_0;  // == sin(theta_0 - theta) / sin(theta_0)
    let s1 = sin_theta / sin_theta_0;

    this.x = (v0.x * s0) + (v1.x * s1);
    this.y = (v0.y * s0) + (v1.y * s1);
    this.z = (v0.z * s0) + (v1.z * s1);
    this.w = (v0.w * s0) + (v1.w * s1);
    return;
  }

  /**
  * Returns true of the values of this and v are within tolerance
  * @param v Quaternion
  * @param tolerance Float
  * @return Boolean
  */
  isEqual( v, tolerance ) {
    return Math.abs(this.x - v.x ) > tolerance ? 0 :
            Math.abs(this.y - v.y ) > tolerance ? 0 :
              Math.abs(this.z - v.z ) > tolerance ? 0 :
                Math.abs( this.w - v.w ) > tolerance ? 0 : 1;
  }

}

class Matrix3 {
  /**
  * Creates a new Instance of the Matrix3 Class
  */
  constructor( xx = 1.0, xy = 0.0, xz = 0.0, yx = 0.0, yy = 1.0, yz = 0.0, zx = 0.0, zy = 0.0, zz = 1.0 ) {
    this.xx = xx;
    this.xy = xy;
    this.xz = xz;
    this.yx = yx;
    this.yy = yy;
    this.yz = yz;
    this.zx = zx;
    this.zy = zy;
    this.zz = zz;
  }

  /**
  * Sets this matrix to the identity matrix
  */
  identity( ) {
    this.xx = 1.0;
    this.xy = 0.0;
    this.xz = 0.0;
    this.yx = 0.0;
    this.yy = 1.0;
    this.yz = 0.0;
    this.zx = 0.0;
    this.zy = 0.0;
    this.zz = 1.0;
  }

  /**
  Returns a copy of this matrix
  */
  clone( ) {
    return new this.constructor( this.xx, this.xy, this.xz,
                                 this.yx, this.yy, this.yz,
                                 this.zx, this.zy, this.zz );
  }

  /**
  * Sets all elements of the matrix to 0
  */
  zero( ){
    this.xx = 0.0;
    this.xy = 0.0;
    this.xz = 0.0;
    this.yx = 0.0;
    this.yy = 0.0;
    this.yz = 0.0;
    this.zx = 0.0;
    this.zy = 0.0;
    this.zz = 0.0;
  }

  /**
  * Multiplies this matrix and the given matrix, sets this to the result
  * @param m Matrix3
  */
  multiply( m ) {
    let xx = this.xx * m.xx + this.xy * m.yx + this.xz * m.zx;
    let xy = this.xx * m.xy + this.xy * m.yy + this.xz * m.zy;
    let xz = this.xx * m.xz + this.xy * m.yz + this.xz * m.zz;
    let yx = this.yx * m.xx + this.yy * m.yx + this.yz * m.zx;
    let yy = this.yx * m.xy + this.yy * m.yy + this.yz * m.zy;
    let yz = this.yx * m.xz + this.yy * m.yz + this.yz * m.zz;
    let zx = this.zx * m.xx + this.zy * m.yx + this.zz * m.zx;
    let zy = this.zx * m.xy + this.zy * m.yy + this.zz * m.zy;
    let zz = this.zx * m.xz + this.zy * m.yz + this.zz * m.zz;

    this.xx = xx;
    this.xy = xy;
    this.xz = xz;
    this.yx = yx;
    this.yy = yy;
    this.yz = yz;
    this.zx = zx;
    this.zy = zy;
    this.zz = zz;
  }

  /**
  * Multiplies this to the product of the two matrices
  * @param a Matrix3
  * @param b Matrix3
  */
  multiplyMatrices( a, b ) {
    this.xx = a.xx * b.xx + a.xy * b.yx + a.xz * b.zx;
    this.xy = a.xx * b.xy + a.xy * b.yy + a.xz * b.zy;
    this.xz = a.xx * b.xz + a.xy * b.yz + a.xz * b.zz;
    this.yx = a.yx * b.xx + a.yy * b.yx + a.yz * b.zx;
    this.yy = a.yx * b.xy + a.yy * b.yy + a.yz * b.zy;
    this.yz = a.yx * b.xz + a.yy * b.yz + a.yz * b.zz;
    this.zx = a.zx * b.xx + a.zy * b.yx + a.zz * b.zx;
    this.zy = a.zx * b.xy + a.zy * b.yy + a.zz * b.zy;
    this.zz = a.zx * b.xz + a.zy * b.yz + a.zz * b.zz;
  }

  /**
    Transpose this matrix
  */
  transpose( ) {
    let t = this.xy;
    this.xy = this.yx;
    this.yx = t;
    t = this.xz;
    this.xz = this.zx;
    this.zx = t;
    t = this.yz;
    this.yz = this.zy;
    this.zy = t;
  }

  /**
  Sets this to be the skew symmetric of the given vector3
  @param v Vector3
  */
  skewSymmtric( v ) {
    this.xx = 0;
    this.xy = -v.z;
    this.xz = v.y;
    this.yx = v.z;
    this.yy = 0;
    this.yz = -v.x;
    this.zx = -v.y;
    this.zy = v.x;
    this.zz = 0;
  }

  /**
  Sets this to the inverse of itself
  */
  inverse( ) {
    let det =((this.xx * this.yy * this.zz) - (this.xx * this.yz * this.zy) -
              (this.xy * this.yx * this.zz) + (this.xz * this.yx * this.zy) +
              (this.xy * this.zx * this.yz) - (this.xz * this.zx * this.yy));
    if( det === 0.0 ) {
      this.zero();
      return;
    }
    det = 1.0 / det;

    let xx = (this.yy * this.zz - this.yz * this.zy) * det;
    let xy =-(this.xy * this.zz - this.xz * this.zy) * det;
    let xz = (this.xy * this.yz - this.xz * this.yy) * det;
    let yx =-(this.yx * this.zz - this.yz * this.zx) * det;
    let yy = (this.xx * this.zz - this.xz * this.zx) * det;
    let yz =-(this.xx * this.yz - this.xz * this.yx) * det;
    let zx = (this.yx * this.zy - this.yy * this.zx) * det;
    let zy =-(this.xx * this.zy - this.yy * this.zx) * det;
    let zz = (this.xx * this.yy - this.xy * this.yx) * det;

    this.xx = xx;
    this.xy = xy;
    this.xz = xz;
    this.yx = yx;
    this.yy = yy;
    this.yz = yz;
    this.zx = zx;
    this.zy = zy;
    this.zz = zz;
  }
}

/**
  @brief Represents a 4x4 matrix
    Matrices are row major, OpenGL use Column major.  It doesn't really make
      a difference.  Just reverse the order of multiplation in the shader
      example Column major model_view_projection matrix = projection * view * model;
      example Row major model_view_projection = model * view * projection;
*/
class Matrix4 {
  /**
    @brief Creates a new instance of a Matrix4
  */
  constructor( xx = 1, xy = 0, xz = 0, xw = 0,
               yx = 0, yy = 1, yz = 0, yw = 0,
               zx = 0, zy = 0, zz = 1, zw = 0,
               wx = 0, wy = 0, wz = 0, ww = 1 ) {
    this.xx = xx;
    this.xy = xy;
    this.xz = xz;
    this.xw = xw;
    this.yx = yx;
    this.yy = yy;
    this.yz = yz;
    this.yw = yw;
    this.zx = zx;
    this.zy = zy;
    this.zz = zz;
    this.zw = zw;
    this.wx = wx;
    this.wy = wy;
    this.wz = wz;
    this.ww = ww;
  }

  /**
    @brief Sets this to the identity matrix
  */
  identity( ) {
    this.xx = 1.0;
    this.xy = 0.0;
    this.xz = 0.0;
    this.xw = 0.0;
    this.yx = 0.0;
    this.yy = 1.0;
    this.yz = 0.0;
    this.yw = 0.0;
    this.zx = 0.0;
    this.zy = 0.0;
    this.zz = 1.0;
    this.zw = 0.0;
    this.wx = 0.0;
    this.wy = 0.0;
    this.wz = 0.0;
    this.ww = 1.0;
  }

  /**
    @brief Sets this matrix to be filled with zeros
  */
  zero( ) {
    this.xx = 0.0;
    this.xy = 0.0;
    this.xz = 0.0;
    this.xw = 0.0;
    this.yx = 0.0;
    this.yy = 0.0;
    this.yz = 0.0;
    this.yw = 0.0;
    this.zx = 0.0;
    this.zy = 0.0;
    this.zz = 0.0;
    this.zw = 0.0;
    this.wx = 0.0;
    this.wy = 0.0;
    this.wz = 0.0;
    this.ww = 0.0;
  }

  /**
    @brief Creates a clone of this matrix
  */
  clone( ) {
    return new this.constructor( this.xx, this.xy, this.xz, this.xw,
                                 this.yx, this.yy, this.yz, this.yw,
                                 this.zx, this.zy, this.zx, this.zw,
                                 this.wx, this.wy, this.wz, this.ww );
  }

  /**
    @brief Multiplies this matrix by the given matrix and sets this to the product
    @param m Matrix4
  */
  multiply( m ) {
    let xx = this.xx * m.xx + this.xy * m.yx + this.xz * m.zx + this.xw * m.wx;
    let xy = this.xx * m.xy + this.xy * m.yy + this.xz * m.zy + this.xw * m.wy;
    let xz = this.xx * m.xz + this.xy * m.yz + this.xz * m.zz + this.xw * m.wz;
    let xw = this.xx * m.xw + this.xy * m.yw + this.xz * m.zw + this.xw * m.ww;

    let yx = this.yx * m.xx + this.yy * m.yx + this.yz * m.zx + this.yw * m.wx;
    let yy = this.yx * m.xy + this.yy * m.yy + this.yz * m.zy + this.yw * m.wy;
    let yz = this.yx * m.xz + this.yy * m.yz + this.yz * m.zz + this.yw * m.wz;
    let yw = this.yx * m.xw + this.yy * m.yw + this.yz * m.zw + this.yw * m.ww;

    let zx = this.zx * m.xx + this.zy * m.yx + this.zz * m.zx + this.zw * m.wx;
    let zy = this.zx * m.xy + this.zy * m.yy + this.zz * m.zy + this.zw * m.wy;
    let zz = this.zx * m.xz + this.zy * m.yz + this.zz * m.zz + this.zw * m.wz;
    let zw = this.zx * m.xw + this.zy * m.yw + this.zz * m.zw + this.zw * m.ww;

    let wx = this.wx * m.xx + this.wy * m.yx + this.wz * m.zx + this.ww * m.wx;
    let wy = this.wx * m.xy + this.wy * m.yy + this.wz * m.zy + this.ww * m.wy;
    let wz = this.wx * m.xz + this.wy * m.yz + this.wz * m.zz + this.ww * m.wz;
    let ww = this.wx * m.xw + this.wy * m.yw + this.wz * m.zw + this.ww * m.ww;

    this.xx = xx;
    this.xy = xy;
    this.xz = xz;
    this.xw = xw;
    this.yx = yx;
    this.yy = yy;
    this.yz = yz;
    this.yw = yw;
    this.zx = zx;
    this.zy = zy;
    this.zz = zz;
    this.zw = zw;
    this.wx = wx;
    this.wy = wy;
    this.wz = wz;
    this.ww = ww;
  }

  /**
  @brief Sets this to the product of the two provided matrices
  @param a Matrix4
  @param b Matrix4
  */
  multiplyMatrices( a, b ) {
    this.xx = a.xx * b.xx + a.xy * b.yx + a.xz * b.zx + a.xw * b.wx;
    this.xy = a.xx * b.xy + a.xy * b.yy + a.xz * b.zy + a.xw * b.wy;
    this.xz = a.xx * b.xz + a.xy * b.yz + a.xz * b.zz + a.xw * b.wz;
    this.xw = a.xx * b.xw + a.xy * b.yw + a.xz * b.zw + a.xw * b.ww;

    this.yx = a.yx * b.xx + a.yy * b.yx + a.yz * b.zx + a.yw * b.wx;
    this.yy = a.yx * b.xy + a.yy * b.yy + a.yz * b.zy + a.yw * b.wy;
    this.yz = a.yx * b.xz + a.yy * b.yz + a.yz * b.zz + a.yw * b.wz;
    this.yw = a.yx * b.xw + a.yy * b.yw + a.yz * b.zw + a.yw * b.ww;

    this.zx = a.zx * b.xx + a.zy * b.yx + a.zz * b.zx + a.zw * b.wx;
    this.zy = a.zx * b.xy + a.zy * b.yy + a.zz * b.zy + a.zw * b.wy;
    this.zz = a.zx * b.xz + a.zy * b.yz + a.zz * b.zz + a.zw * b.wz;
    this.zw = a.zx * b.xw + a.zy * b.yw + a.zz * b.zw + a.zw * b.ww;

    this.wx = a.wx * b.xx + a.wy * b.yx + a.wz * b.zx + a.ww * b.wx;
    this.wy = a.wx * b.xy + a.wy * b.yy + a.wz * b.zy + a.ww * b.wy;
    this.wz = a.wx * b.xz + a.wy * b.yz + a.wz * b.zz + a.ww * b.wz;
    this.ww = a.wx * b.xw + a.wy * b.yw + a.wz * b.zw + a.ww * b.ww;
  }

  /**
    @brief Creates a ortographics projection matrix
    @param left Float
    @param right Float
    @param bottom Float
    @param top Float
    @param near_clip Float
    @param far_clip Float
  */
  orthographicView( left, right, bottom, top, near_clip, far_clip ) {
    let a = 2.0 / ( right - left );
    let b = 2.0 / ( top - bottom );
    let c = -2.0 / ( far_clip - near_clip );
    let tx = -( right + left ) / ( right - left );
    let ty = -( top + bottom ) / ( top - bottom );
    let tz = -( far_clip + near_clip ) / ( far_clip - near_clip );

    this.identity();
    this.xx = a;
    this.yy = b;
    this.zz = c;
    this.wx = tx;
    this.wy = ty;
    this.wz = tz;
    this.ww = 1.0;
  }

  /**
   @brief Craetes a perspective view matrix
   @param fov_radians Float, field of view y, in radians
   @param aspect_ratio Float, aspect ratio of the canvas
   @param near_clip Float, distance to the near clip plane
   @param far_clip Float, distance to the far clip plane
   */
   perspectiveView( fov_radians, aspect_ratio, near_clip, far_clip ) {
     let htf = Math.tan( fov_radians * 0.5 );
     this.identity();
     this.xx = 1.0 / ( aspect_ratio * htf );
     this.yy = 1.0 / htf;
     this.zz = -(( far_clip + near_clip ) / ( far_clip - near_clip ) );
     this.zw = -1.0;
     this.wz = -(( 2.0 * far_clip * near_clip ) / ( far_clip - near_clip ) );
   }

   /**
    @brief Creates a view matrix that is at position and view the direction of target
    @param position The position of the camera
    @param target The target to look at
    @param up The up axis
  */
  lookAt( position, target, up ) {
    let z = new Vector3( target.x - position.x, target.y - position.y, target.z - position.z );
    let x = new Vector3();
    x.crossVectors( z, up ).normalize();
    let y = new Vector3();
    y.crossVectors( x, z );
    this.xx = x.x;
    this.xy = y.x;
    this.xz = z.x;
    this.xw = 0;
    this.yx = x.y;
    this.yy = y.y;
    this.zy = z.y;
    this.yw = 0;
    this.zx = x.z;
    this.zy = y.z;
    this.zz = z.z;
    this.zw = 0;
    this.wx = -x.dot( position );
    this.wy = -y.dot( position );
    this.wz = -z.dot( position );
    this.ww = 1.0;
  }

  /**
    @brief Makes a transposed copy of the given matrix4
    @param m Matrix4
  */
  transpose( m ) {
    this.xx = m.xx;
    this.xy = m.yx;
    this.xz = m.zx;
    this.xw = m.wx;

    this.yx = m.xy;
    this.yy = m.yy;
    this.yz = m.zy;
    this.yw = m.wy;

    this.zx = m.xz;
    this.zy = m.yz;
    this.zz = m.zz;
    this.zw = m.wz;

    this.wx = m.xw;
    this.wy = m.yw;
    this.wz = m.zw;
    this.ww = m.ww;
  }

  /**
    @brief Make this matrix the inverse of the given matrix4
    @param m Matrix4
  */
  inverse( m ) {
    let t0 = m.zz * m.ww;
    let t1 = m.wz * m.zw;
    let t2 = m.yz * m.ww;
    let t3 = m.wz * m.yw;
    let t4 = m.yz * m.zw;
    let t5 = m.zz * m.yw;
    let t6 = m.xz * m.ww;
    let t7 = m.wz * m.xw;
    let t8 = m.xz * m.zw;
    let t9 = m.zz * m.xw;
    let t10 = m.xz * m.yw;
    let t11 = m.yz * m.xw;
    let t12 = m.zx * m.wy;
    let t13 = m.wx * m.zy;
    let t14 = m.yx * m.wy;
    let t15 = m.wx * m.yy;
    let t16 = m.yx * m.zy;
    let t17 = m.zx * m.yy;
    let t18 = m.xx * m.wy;
    let t19 = m.wx * m.xy;
    let t20 = m.xx * m.zy;
    let t21 = m.zx * m.xy;
    let t22 = m.xx * m.yy;
    let t23 = m.yx * m.xy;

    this.xx = (t0 * m.yy + t3 * m.zy + t4 * m.wy) - (t1 * m.yy + t2 * m.zy + t5 * m.wy);
    this.xy = (t1 * m.xy + t6 * m.zy + t9 * m.wy) - (t0 * m.xy + t7 * m.zy + t8 * m.wy);
    this.xz = (t2 * m.xy + t7 * m.yy + t10 * m.wy) - (t3 * m.xy + t6 * m.yy + t11 * m.wy);
    this.xw = (t5 * m.xy + t8 * m.yy + t11 * m.zy) - (t4 * m.xy + t9 * m.yy + t10 * m.zy);

    let d = 1.0 / (m.xx * this.xx + m.yx * this.xy + m.zx * this.xz + m.wx * this.xw );

    this.xx *= d;
    this.xy *= d;
    this.xz *= d;
    this.xw *= d;
    this.yx = d * ((t1 * m.yx + t2 * m.zx + t5 * m.wx) - (t0 * m.yx + t3 * m.zx + t4 * m.wx));
    this.yy = d * ((t0 * m.xx + t7 * m.zx + t8 * m.wx) - (t1 * m.xx + t6 * m.zx + t9 * m.wx));
    this.yz = d * ((t3 * m.xx + t6 * m.yx + t11 * m.wx) - (t2 * m.xx + t7 * m.yx + t10 * m.wx));
    this.yw = d * ((t4 * m.xx + t9 * m.yx + t10 * m.zx) - (t5 * m.xx + t8 * m.yx + t11 * m.zx));
    this.zx = d * ((t12 * m.yw + t15 * m.zw + t16 * m.ww) - (t13 * m.yw + t14 * m.zw + t17 * m.ww));
    this.zy = d * ((t13 * m.xw + t18 * m.zw + t21 * m.ww) - (t12 * m.xw + t19 * m.zw + t20 * m.ww));
    this.zz = d * ((t14 * m.xw + t19 * m.yw + t22 * m.ww) - (t15 * m.xw + t18 * m.yw + t23 * m.ww));
    this.zw = d * ((t17 * m.xw + t20 * m.yw + t23 * m.zw) - (t16 * m.xw + t21 * m.yw + t22 * m.zw));
    this.wx = d * ((t14 * m.zz + t17 * m.wz + t13 * m.yz) - (t16 * m.wz + t12 * m.yz + t15 * m.zz));
    this.wy = d * ((t20 * m.wz + t12 * m.xz + t19 * m.zz) - (t18 * m.zz + t21 * m.wz + t13 * m.xz));
    this.wz = d * ((t18 * m.yz + t23 * m.wz + t15 * m.xz) - (t22 * m.wz + t14 * m.xz + t19 * m.yz));
    this.ww = d * ((t22 * m.zz + t16 * m.xz + t21 * m.yz) - (t20 * m.yz + t23 * m.zz + t17 * m.xz));
  }

  /**
    @brief Makes this matrix a translation matrix
    @param position Vector3, the position to translate to
  */
  toTranslation( position ) {
    this.identity();
    this.wx = position.x;
    this.wy = position.y;
    this.wz = position.z;
  }

  /**
   @brief Rotate the given vector3 by this matrix
   @param v The vector3 to rotate
  */
  rotateVector3( v ) {
    let r = new Vector3();
    r.x = v.x * this.xx + v.y * this.yx + v.z * this.zx;
    r.y = v.x * this.xy + v.y * this.yy + v.z * this.zy;
    r.z = v.x * this.xz + v.y * this.yz + v.z * this.zz;
  }

  /**
    @brief Sets the scale of this matrix
    @param s Vector3
  */
  scale( s ) {
    this.xx = s.x;
    this.yy = s.y;
    this.zz = s.z;
  }

  /**
   @brief Makes this matrix a transform matrix from the given position, orientation, and scale
   @param position vector3
   @param scale Vector3
   @param rotation Vector3
  */
  toTransform( position, scale, rotation ){
    let x = new Quaternion( 1, 0, 0, rotation.x );
    let y = new Quaternion( 0, 1, 0, rotation.y );
    let z = new Quaternion( 0, 0, 1, rotation.z );
    let n = new Quaternion();
    n.multiplyQuaternions( z, y );
    n.multiply( x );
    n.normalize();

    this.xx = ( 1.0 - 2.0 * n.y * n.y - 2.0 * n.z * n.z ) * scale.x;
    this.xy = ( 2.0 * n.x * n.y - 2.0 * n.z * n.w ) * scale.x;
    this.xz = ( 2.0 * n.x * n.z + 2.0 * n.y * n.w ) * scale.x;

    this.yx = ( 2.0 * n.x * n.y + 2.0 * n.z * n.w ) * scale.y;
    this.yy = ( 1.0 - 2.0 * n.x * n.x - 2.0 * n.z * n.z ) * scale.y;
    this.yz = ( 2.0 * n.y * n.z - 2.0 * n.x * n.w ) * scale.y;

    this.zx = ( 2.0 * n.x * n.z - 2.0 * n.y * n.w ) * scale.z;
    this.zy = ( 2.0 * n.y * n.z + 2.0 * n.x * n.w ) * scale.z;
    this.zz = ( 1.0 - 2.0 * n.x * n.x - 2.0 * n.y * n.y ) * scale.z;

    this.wx = position.x;
    this.wy = position.y;
    this.wz = position.z;
    this.ww = 1.0;
  }

  /**
    @brief Converts a rotation quaternion to a matrix4
    @param q Rotation Quaternion
  */
  fromQuaternion( q ){
    let n = q.clone();
    n.normalize();
    out.xx = 1.0 - 2.0 * n.y * n.y - 2.0 * n.z * n.z;
    out.xy = 2.0 * n.x * n.y - 2.0 * n.z * n.w;
    out.xz = 2.0 * n.x * n.z + 2.0 * n.y * n.w;

    out.yx = 2.0 * n.x * n.y + 2.0 * n.z * n.w;
    out.yy = 1.0 - 2.0 * n.x * n.x - 2.0 * n.z * n.z;
    out.yz = 2.0 * n.y * n.z - 2.0 * n.x * n.w;

    out.zx = 2.0 * n.x * n.z - 2.0 * n.y * n.w;
    out.zy = 2.0 * n.y * n.z + 2.0 * n.x * n.w;
    out.zz = 1.0 - 2.0 * n.x * n.x - 2.0 * n.y * n.y;
  }

  /**
    @brief Transforms the given Vector3 by this matrix
    @param v Vector3
    @return Vector3 Transfromed version of v
  */
  transformVector3( v ) {
    return new Vector3( v.x * m.xx + v.y * m.yx + v.z * m.zx + m.wx,
                        v.x * m.xy + v.y * m.yy + v.z * m.zy + m.wy,
                        v.x * m.xz + v.y * m.yz + v.z * m.zz + m.wz );
  }

  /**
    @brief Transforms the given Vector3 by the transpose of this matrix
    @param v Vector3
    @return Vector3 Transfromed transposed version of v
  */
  transposeTransformVector3( v ) {
    let t = v.clone();
    t.x -= m.wx;
    t.y -= m.wy;
    t.z -= m.wz;

    return new Vector3( t.x * m.xx + t.y * m.yx + t.z * m.xz,
                        t.x * m.yx + t.y * m.yy + t.z * m.yz,
                        t.x * m.zx + t.y * m.zy + t.z * m.zz );
  }
}

export { Engine, GLUtil, Matrix3, Matrix4, Quaternion, Vector2, Vector3 };
