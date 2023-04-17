import * as MathUtils from './MathUtils.js';

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

  toArray( ) {
    return [ this.x, this.y, this.z ];
  }
}

export { Vector3 };
