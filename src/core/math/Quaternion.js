import * as MathUtils from './MathUtils.js';

//http://physicsforgames.blogspot.com/2010/03/quaternion-tricks.html
//http://physicsforgames.blogspot.com/2010/02/quaternions.html

class Quaternion extends Float32Array {
  constructor( q = null ) {
    super( 4 );
    if( q != null && q instanceof Quaternion ) {
      this[0] = q[0];
      this[1] = q[1];
      this[2] = q[2];
      this[3] = q[3];
    }else {
      this[0] = 0;
      this[1] = 0;
      this[2] = 0;
      this[3] = 1;
    }
  }

  // Setters and Getters ---------------------------------------------
  identity( ) {
    this[0] = 0;
    this[1] = 0;
    this[2] = 0;
    this[3] = 1;
  }

  get x() { return this[0]; }
  set x( value ) { this[0] = value; }

  get y() { return this[1]; }
  set y(value) { this[1] = value; }

  get z() { return this[2]; }
  set z( value ) { this[2] = value; }

  get w() { return this[3]; }
  set w( value ) { this[3] = value; }

  copy( q ){ this[0] = q[0]; this[1] = q[1]; this[2] = q[2]; this[3] = q[3]; }

  clone( ) { return new Quaternion( this ); }
  /**
  @brief Sets the values of the quaternion for a NORMALIZED axis and angle
  @param axis Normalized Vector3
  @param angle degrees
  */
  setAxisAngle( axis, angle ) {
    let ha = angle * 0.5;
    let s = Math.sin( ha );

    this[0] = axis[0] * s;
    this[1] = axis[1] * s;
    this[2] = axis[2] * s;
    this[3] = Math.cos( ha );

    return this;
  }

  static fromAxisAngle( axis, angle ) {
    let rtn = new Quaternion();
    let ha = angle * 0.5;
    let s = Math.sin( ha );

    rtn[ 0 ] = axis[0] * s;
    rtn[ 1 ] = axis[1] * s;
    rtn[ 2 ] = axis[2] * s;
    rtn[ 3 ] = Math.cos( ha );
    return rtn;
  }

  /**
  @brief Returns an array that has the axis and angle of this quaternion
  */
  getAxisAngle( ) {
    if( this[3] > 1 ) this.normalize();

    let angle = 2 * Math.acos( this[3] ),
    s = Math.sqrt( 1 - this[3] * this[3] );
    if( s < 0.0001 ) return [ 1, 0, 0, 0 ];
    return [ this[0]/s, this[1]/s, this[2]/s, angle ];
  }

  /**
  @brief Sets out to the conjugate of this
  @param out Quaternion to set the value to
  */
  conjugate( out = null ) {
    out = out || this;
    out[0] = -this[0];
    out[1] = -this[1];
    out[2] = -this[2];
    out[3] = this[3];
    return out;
  }

  length( ) {
    return this[0] * this[0] + this[1] * this[1] + this[2] * this[2] + this[3] * this[3];
  }

  /**
  @brief Normalizes this vector and sets the value to out
  @param out Quaternion to set the value to
  */
  normalize( out = null ) {
    out = out || this;
    let len = this.length();
    if( len <= 0 ) return this;
    out[0] = this[0]/len;
    out[1] = this[1]/len;
    out[2] = this[2]/len;
    out[3] = this[3]/len;
    return out;
  }

  /**
  @brief multiplies this and q, sets out to the product
  @param q Quaternion
  @param out Quaternion
  */
  multiply( q, out = null ) {
    out = out || this;
    let x = this[0], y = this[1], z = this[2], w = this[3];
    out[0] =  x * q[3] + y * q[2] - z * q[1] + w * q[0];
    out[1] = -x * q[2] + y * q[3] + z * q[0] + w * q[1];
    out[2] =  x * q[1] - y * q[0] + z * q[3] + w * q[2];
    out[3] = -x * q[0] - y * q[1] - z * q[2] + w * q[3];
    return out;
  }

  /**
  @brief Sprical linear interpolation
  @param q The other quaternion
  @param t The percentage to interpolate by
  @param out The quaternion to set to the value
  */
  slerp( q, t, out = null ) {
    out = out || this;
    // Source: https://en.wikipedia.org/wiki/Slerp
    // Only unit quaternions are valid rotations.
    // Normalize to avoid undefined behavior.
    let al = this.length();
    let ax = this[0]/al, ay = this[1]/al, az = this[2]/al, aw = this[3]/al;
    let bl = q.length();
    let bx = q[0]/bl, by = q[1]/bl, bz = q[2]/bl, bw = q[3]/bl;
    let d = ax * bx + ay * by + az * bz + aw * bw;
    let dot_threshold = 0.9995;
    // If the dot product is negative, slerp won't take
    // the shorter path. Note that v1 and -v1 are equivalent when
    // the negation is applied to all four components. Fix by
    // reversing one quaternion.
    if( d < 0.0 ) {
      bx = -bx;
      by = -by;
      bz = -bz;
      bw = -bw;
      d = -d;
    }
    if( d > dot_threshold ) {
      // If the inputs are too close for comfort, linearly interpolate
      // and normalize the result.
      out[ 0 ] = ax + (( bx - ax ) * t );
      out[ 1 ] = ay + (( by - ay ) * t );
      out[ 2 ] = az + (( bz - az ) * t );
      out[ 3 ] = aw + (( bw - aw ) * t );

      out.normalize( );
      return out;
    }

    // Since dot is in range [0, DOT_THRESHOLD], acos is safe
    let theta0 = Math.acos( d ); // theta0 = angle between inputs
    let theta = thata0 * t; // thata = angle between a and result
    let sinTheta = Math.sin( theta ); // compute this value only once
    let sinTheta0 = Math.sin( theta0 );
    let s0 = Math.cos( theta) - d * sinTheta / sinTheta0;
    let s1 = sinTheta / sinTheta0;

    out[0] = (ax * s0 ) + ( bx * s1 );
    out[1] = (ay * s0 ) + ( by * s1 );
    out[2] = (az * s0 ) + ( bz * s1 );
    out[2] = (aw * s0 ) + ( bw * s1 );
    return out;
  }

  /**
  @brief compare this and q and return true if within tolerance
  @param q Quaternion
  @param tolerance default is EPSILON
  @return true if within tolerance
  */
  isEqual( q, tolerance = MathUtils.EPSILON ) {
    if( Math.abs( this[0] - q[0] ) > tolerance ) return false;
    if( Math.abs( this[1] - q[1] ) > tolerance ) return false;
    if( Math.abs( this[2] - q[2] ) > tolerance ) return false;
    if( Math.abs( this[3] - q[3] ) > tolerance ) return false;
    return true;
  }

}

export { Quaternion };
