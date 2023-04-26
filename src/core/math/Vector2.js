import * as MathUtils from './MathUtil.js';


class Vector2 extends Float32Array {

  /**
  * Creates a new instance of a Vector2
  */
  constructor( param ) {
    super( 2 );
    if( param instanceof Vector2 || ( param && param.length == 2 ) ) {
      this[0] = param[0];
      this[1] = param[1];
    } else if ( arguments.length == 2 ) {
      this[ 0 ] = arguments[ 0 ];
      this[ 1 ] = arguments[ 1 ];
    } else {
      this[ 0 ] = this[ 1 ] = param || 0;
    }
  }

  // getters and setters
  get x() { return this[ 0 ]; }
  set x( value ) { this[ 0 ] = value; }

  get y() { return this[ 1 ]; }
  set y( value ) { this[ 1 ] = value; }

  set( x, y ) { this[ 0 ] = x; this[ 1 ] = y; }

  copy( vec ) { this[ 0 ] = vec[ 0 ]; this[ 1 ] = vec[ 1 ]; }

  clone( vec ) { return new Vector2( this ); }

  fromAngleLength( angle, length ) {
    this[ 0 ] = length * Math.cos( angle );
    this[ 1 ] = length * Math.sin( angle );
  }

  getAngle( v = null ) {
    if( v ) {
      return Math.acos( Vector2.dot( this, v ) / (this.length() * v.length() ) );
    }
    return Math.atan2( this[1], this[0] );
  }

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
  @param out The Vector2 to set to the calculated value
  */
  add( v, out = null ) {
    out = out || this;
    out[ 0 ] = this[ 0 ] + v[ 0 ];
    out[ 1 ] = this[ 1 ] + v[ 1 ];
    return this;
  }

  /**
  @brief subtracts this and the given vector
  @param v The vector to subtract to this
  @param out The Vector2 to set to the calculated value
  */
  subtract( v, out = null ) {
    out = out || this;
    out[0] = this[0] - v[0];
    out[1] = this[1] - v[1];
    return out;
  }

  /**
  @brief multiply this and the given vector
  @param v The vector to multiply to this
  @param out The Vector2 to set to the calculated value
  */
  multiply( v, out = null ) {
    out = out || this;
    out[0] = this[0] * v[0];
    out[1] = this[1] * v[1];
    return out;
  }

  /**
  @brief divids this and the given vector
  @param v The vector to divids to this
  @param out The Vector2 to set to the calculated value
  */
  divid( v, out = null ) {
    out = out || this;
    out[0] = v[0] != 0 ? this[0] / v[0] : 0;
    out[1] = v[1] != 0 ? this[1] / v[1] : 0;
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
    return out;
  }

  /**
  @brief Returns the length of the vector ( Magnitude )
  */
  length( ) {
    return Math.sqrt( this[0] * this[0] + this[1] * this[1] );
  }

  /**
  @brief Returns the squared magnitude of this vector
  */
  lengthSquared( ) {
    return this[ 0 ] * this[ 0 ] + this[ 1 ] * this[ 1 ];
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
    return this;
  }

  /**
  @brief Linear interpolate this and v by ratio t
  @param v Vector2
  @param t ratio clamped between 0 - 1
  @param out The Vector2 to set to the calculated value
  */
  lerp( v, t, out = null ) {
    out = out || this;
    var tmin = 1 - t;

    // linear Interpolate ( 1 - t ) * v0 + t * v1
    out[0] = this[0] * tmin + v[0] * t;
    out[1] = this[1] * tmin + v[1] * t;
    return out;
  }

  /**
  @brief Smoother version of a linear interpolate
  @param v Vector2
  @param t ratio clamped between 0 - 1
  @param out The Vector2 to set to the calculated value
  */
  smoothStep( v, t, out = null ) {
    out = out || this;
    // (b-a) * ( ratio * ratio * ( 3 - 2 * ratio ) ) + a;
    out[ 0 ] = ( v[0] - this[0]) * ( t * t * ( 3 - 2 * t ) ) + this[0];
    out[ 1 ] = ( v[1] - this[1]) * ( t * t * ( 3 - 2 * t ) ) + this[1];
    return out;
  }

  /**
  @brief an even smoother step of linear interplatation
  @param v Vector2
  @param t ratio clamped between 0 - 1
  @param out The Vector2 to set to the calculated value
  */
  smootherStep( v, t, out = null ) {
    out = out || this;
    // return (b-a) * (ratio * ratio * ratio * (ratio*(ratio * 6 - 15 ) + 10 ) ) + a;
    out[ 0 ] = (v[0] - this[0]) * ( t*t*t * ( t*( t * 6 - 15 ) + 10 ) ) + this[0];
    out[ 1 ] = (v[1] - this[1]) * ( t*t*t * ( t*( t * 6 - 15 ) + 10 ) ) + this[1];
    return out;
  }

  /**
  @brief Rotates this by the given angle
  @param angle The angle to rotate by
  @param out The Vector2 to set to the calculated value
  */
  rotate( angle, out = null ) {
    out = out || this;
    let radians = MathUtils.degreesToRadians( angle ),
    cos = Math.cos( radians ),
    sin = Math.sin( radians ),
    x = this[0],
    y = this[1];

    out[0] = x * cos - y * sin;
    out[1] = y * sin + y * cos;
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
    return out;
  }

  /**
  @brief returns the dot product of this vector and v
  @param v The vector to subtract to this
  */
  dot( v ) {
    return this[0] * v[0] + this[1] * v[1];
  }
}

export { Vector2 };
