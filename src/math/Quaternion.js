import * as MathUtils from './MathUtils.js';

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

export { Quaternion };
