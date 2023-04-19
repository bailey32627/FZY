import * as MathUtils from './MathUtils.js';


class Vector3 extends Float32Array {

  /**
  * Creates a new instance of a Vector2
  */
  constructor( param ) {
    super( 3 );
    if( param istanceof Vector3 || ( param && param.length == 3 ) ) {
      this[0] = param[0];
      this[1] = param[1];
      this[2] = param[2];
    } else if ( arguements.length == 3 ) {
      this[ 0 ] = arguments[ 0 ];
      this[ 1 ] = arguments[ 1 ];
      this[ 2 ] = arguments[ 2 ];
    } else {
      this[ 0 ] = this[ 1 ] = this[2] = param || 0;
    }
  }

  // getters and setters
  get x() { return this[ 0 ]; }
  set x( value ) { this[ 0 ] = value; }

  get y() { return this[ 1 ]; }
  set y( value ) { this[ 1 ] = value; }

  get z() { reutrn this[2]; }
  set z( value ) { this[ 2 ] = value; }

  set( x, y, z ) { this[ 0 ] = x; this[ 1 ] = y; this[ 2 ] = z; }

  copy( vec ) { this[ 0 ] = vec[ 0 ]; this[ 1 ] = vec[ 1 ]; this[ 2 ] = vec[ 2 ]; }

  clone( vec ) { return new Vector3( this ); }

  setLength( len ) { return this.normalize().scale(len);

  // When values are very small, like less then 0.0000001, just make it zero
  nearZero( x = 1e-6, y = 1e-6 ){
    if( Math.abs(this[0]) <= x ) this[0] = 0;
    if( Math.abs(this[1]) <= y ) this[1] = 0;
    return this;
  }

  // Methods -------------------------------------------------------

  /**
  @brief Adds this and the given vector
  @param v The vector to add to this
  @param out The Vector3 to set to the calculated value
  */
  add( v, out = null ) {
    out = out || this;
    out[ 0 ] = this[ 0 ] + v[ 0 ];
    out[ 1 ] = this[ 1 ] + v[ 1 ];
    out[ 2 ] = this[ 2 ] + v[ 2 ];
    return this;
  }

  /**
  @brief subtracts this and the given vector
  @param v The vector to subtract to this
  @param out The Vector3 to set to the calculated value
  */
  subtract( v, out = null ) {
    out = out || this;
    out[0] = this[0] - v[0];
    out[1] = this[1] - v[1];
    out[2] = this[2] - v[2];
    return out;
  }

  /**
  @brief multiply this and the given vector
  @param v The vector to multiply to this
  @param out The Vector3 to set to the calculated value
  */
  multiply( v, out = null ) {
    out = out || this;
    out[0] = this[0] * v[0];
    out[1] = this[1] * v[1];
    out[2] = this[2] * v[2];
    return out;
  }

  /**
  @brief divids this and the given vector
  @param v The vector to divids to this
  @param out The Vector3 to set to the calculated value
  */
  divid( v, out = null ) {
    out = out || this;
    out[0] = v[0] != 0 ? this[0] / v[0] : 0;
    out[1] = v[1] != 0 ? this[1] / v[1] : 0;
    out[2] = v[2] != 0 ? this[2] / v[2] : 0;
    return out;
  }

  /**
  @brief scales this vector by the given value
  @param value the value to scale by
  @param out The Vector2 to set to the calculated value
  */
  scale( value, out = null ) {
    out = out || this;
    out[0] = this[0] * value;
    out[1] = this[1] * value;
    out[2] = this[2] * value;
    return out;
  }

  /**
  @brief Returns the int value of this vector
  @param out The Vector2 to set to the calculated value
  */
  floor( out = null ) {
    out = out || this;
    out[0] = Math.floor( this[ 0 ] );
    out[1] = Math.floor( this[ 1 ] );
    out[2] = Math.floor( this[ 2 ] );
    return out;
  }

  /**
  @brief Returns the length of the vector ( Magnitude )
  */
  length( ) {
    return Math.sqrt( this[0] * this[0] + this[1] * this[1] + this[2] * this[2] );
  }

  /**
  @brief Returns the squared magnitude of this vector
  */
  lengthSquared( ) {
    return  this[0] * this[0] + this[1] * this[1] + this[2] * this[2];
  }

  /**
  @brief normalizes this vector
  @param out The vector to the calculated value
  */
  normalize( out = null ) {
    out = out || this;

    let mag = Math.sqrt( this[0]*this[0] + this[1]*this[1] );
    if( mag <= 0 ) return this;

    out[ 0 ] = this[ 0 ] / mag;
    out[ 1 ] = this[ 1 ] / mag;
    out[ 2 ] = this[ 2 ] / mag;
    return this;
  }

  /**
  @brief Linear interpolate this and v by ratio t
  @param v Vector3
  @param t ratio clamped between 0 - 1
  @param out The Vector3 to set to the calculated value
  */
  lerp( v, t, out = null ) {
    out = out || this;
    var tmin = 1 - t;

    // linear Interpolate ( 1 - t ) * v0 + t * v1
    out[0] = this[0] * tmin + v[0] * t;
    out[1] = this[1] * tmin + v[1] * t;
    out[2] = this[2] * tmin + v[2] * t;
    return out;
  }

  /**
  @brief Smoother version of a linear interpolate
  @param v Vector3
  @param t ratio clamped between 0 - 1
  @param out The Vector3 to set to the calculated value
  */
  smoothStep( v, t, out = null ) {
    out = out || this;
    // (b-a) * ( ratio * ratio * ( 3 - 2 * ratio ) ) + a;
    out[ 0 ] = ( v[0] - this[0]) * ( t * t * ( 3 - 2 * t ) ) + this[0];
    out[ 1 ] = ( v[1] - this[1]) * ( t * t * ( 3 - 2 * t ) ) + this[1];
    out[ 2 ] = ( v[2] - this[2]) * ( t * t * ( 3 - 2 * t ) ) + this[2];
    return out;
  }

  /**
  @brief an even smoother step of linear interplatation
  @param v Vector3
  @param t ratio clamped between 0 - 1
  @param out The Vector3 to set to the calculated value
  */
  smootherStep( v, t, out = null ) {
    out = out || this;
    // return (b-a) * (ratio * ratio * ratio * (ratio*(ratio * 6 - 15 ) + 10 ) ) + a;
    out[ 0 ] = (v[0] - this[0]) * ( t*t*t * ( t*( t * 6 - 15 ) + 10 ) ) + this[0];
    out[ 1 ] = (v[1] - this[1]) * ( t*t*t * ( t*( t * 6 - 15 ) + 10 ) ) + this[1];
    out[ 2 ] = (v[2] - this[2]) * ( t*t*t * ( t*( t * 6 - 15 ) + 10 ) ) + this[2];
    return out;
  }

  /**
  @brief inverts the vector from its current value
  @param out set to the calculated value
  */
  invert( out = null ) {
    out = out || this;
    out[ 0 ] = -this[0];
    out[ 1 ] = -this[1];
    out[ 2 ] = -this[2];
    return out;
  }

  /**
  @brief returns the dot product of this vector and v
  @param v The vector to subtract to this
  */
  dot( v ) {
    return this[0] * v[0] + this[1] * v[1] + this[2] * v[2];
  }

  /**
  @brief returns a vector3 that is perpendicular to this and v
  @param v the other vector3
  @param out The Vector3 to set the calculated value to
  */
  cross( v, out = null ) {
    out = out || this;
    let x = this[ 1 ] * v[ 2 ] - this[ 2 ] * v[ 1 ],
        y = this[ 2 ] * v[ 0 ] - this[ 0 ] * v[ 2 ];
        z = this[ 0 ] * v[ 1 ] - this[ 1 ] * v[ 0 ];
    out[ 0 ] = x;
    out[ 1 ] = y;
    out[ 2 ] = z;
    return out;
  }

  /**
  @brief Sets this to the cross product of the two given vectors
  @param t the first vector3
  @param v the other vector3
  */
  crossVectors( t, v ) {
    let x = t[ 1 ] * v[ 2 ] - t[ 2 ] * v[ 1 ],
        y = t[ 2 ] * v[ 0 ] - t[ 0 ] * v[ 2 ];
        z = t[ 0 ] * v[ 1 ] - t[ 1 ] * v[ 0 ];
    this[ 0 ] = x;
    this[ 1 ] = y;
    this[ 2 ] = z;
  }

  /**
  @brief Returns the distance between this vector and the given vector
  @param v Vector3
  @return number
  */
  distance( v ) {
    return Math.sqrt( ( v[0]-this[0]) * (v[0]-this[0]) + (v[1]-this[1]) * (v[1]-this[1]) + (v[2]-this[2]) * (v[2]-this[2]) );
  }

  /**
  @brief Returns the squared distance between this vector and the given vector
  @param v Vector3
  @return number
  */
  distanceSquared( v ) {
    return (v[0]-this[0]) * (v[0]-this[0]) + (v[1]-this[1]) * (v[1]-this[1]) + (v[2]-this[2]) * (v[2]-this[2]);
  }

  /**
  @brief Compares this vector and v, returns if they are within tolerance
  @param v Vector3
  @param tolerance default is EPISLON
  */
  isEqual( v, tolerance = MathUtils.EPSILON ) {
    if ( Math.abs( this[0] - v[0] ) > tolerance ) return false;
    if ( Math.abs( this[1] - v[1] ) > tolerance ) return false;
    if ( Math.abs( this[2] - v[2] ) > tolerance ) return false;
    return true;
  }

  /**
  @brief projects this on v and set the value to out
  @param v Vector3
  @param out The Vector to set to the calculated value
  */
  project( v, out = null ) {
    out = out || this;
    let x = this[0], y = this[1], z = this[2],
    d = this.dot( v );
    out[0] = this[0] - ( v[0] * d );
    out[1] = this[1] - ( v[1] * d );
    out[2] = this[2] - ( v[2] * d );
    return out;
  }

  /**
  @brief Rotates this vector3 on the given axis
  @param degrees the amount to rotate in degrees
  @param axis The axis to rotate on
  @param out Vector3 to set to the calculated value
  */
  rotate( degrees, axis="x", out=null) {
    out = out || this;
    let radians = MathUtils.degreesToRadians( degrees ),
    sin = Math.sin( radians ),
    cos = Math.cos( radians ),
    x = this[ 0 ], y = this[ 1 ], z = this[2];

    switch( axis ) {
      case "y":
        out[0] = z * sin + x * cos;
        out[2] = z * cos - x * sin;
        break;
      case "x":
        out[1] = y * cos - z * sin;
        out[2] = y * sin + z * cos;
        break;
      case "z":
        out[0] = x * cos - y * sin;
        out[1] = x * sin + y * cos;
        break;
    }
    return out;
  }
}

Vector3.UP = [ 0, 1, 0 ];
Vector3.DOWN = [ 0, -1, 0 ];
Vector3.LEFT = [ 1, 0, 0 ];
Vector3.RIGHT = [ -1, 0, 0 ];
Vector3.ZERO = [ 0, 0, 0 ];

export { Vector3 };
