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
  multiplyQuaternion( a, b ) {
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

export { Engine, GLUtil, Quaternion, Vector2, Vector3 };
