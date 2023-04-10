import * as MathUtils from './MathUtils.js';


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
        break;
      case 1:
        return this.y;
        break;
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

export { Vector2 };
