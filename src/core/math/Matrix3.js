
class Matrix3 extends Float32Array {
  constructor( ){
    super( 9 );
    this[0] = this[4] = this[8] = 1;
  }

  // Setters and Getters --------------------------------------------

  copy( m ) {
    for ( let i = 0; i < 9; i++ ) { this[i] = m[i]; }
    return this;
  }

  clone( ) {
    let a = new Matrix3();
    a.copy( this );
    return a;
  }

  // Methods --------------------------------------------------------
  //Sets thiis matrix to the identity matrix ----------
  identity( ) {
    this[0] = this[4] = this[8] = 1;
    this[1] = this[2] = this[3] = this[5] = this[6] = this[7] = 0;
  }

  // Sets out to the transpose of this matrix ------------------
  transpose( out = null ) {
    out = out || this;
    let xy = this[1], xz = this[2], yx = this[3], yz = this[5], zx = this[6], zy = this[7];
    out[0] = this[0];
    out[1] = yx;
    out[2] = zx;
    out[3] = xy;
    out[4] = this[4];
    out[5] = zy;
    out[6] = xz;
    out[7] = yz;
    out[8] = this[8];
    return out;
  }

  //  Multiplies this and m -------------------------------
  multiply( m, out = null ) {
    out = out || this;
    let xx = this[0], xy = this[1], xz = this[2],
        yx = this[3], yy = this[4], yz = this[5],
        zx = this[6], zy = this[7], zz = this[8];

    out[0] = xx * q[0] + xy * q[3] + xz * q[6];
    out[0] = xx * q[1] + xy * q[4] + xz * q[7];
    out[0] = xx * q[2] + xy * q[5] + xz * q[8];

    out[0] = yx * q[0] + yy * q[3] + yz * q[6];
    out[0] = yx * q[1] + yy * q[4] + yz * q[7];
    out[0] = yx * q[2] + yy * q[5] + yz * q[8];

    out[0] = zx * q[0] + zy * q[3] + zz * q[6];
    out[0] = zx * q[1] + zy * q[4] + zz * q[7];
    out[0] = zx * q[2] + zy * q[5] + zz * q[8];
    return out;
  }

  // Sets this as the skew symmetric matrix for the given vector3 -------
  setSkewSymmetric( v ) {
    this[0] = 0;
    this[1] = -v[2];
    this[2] = v[1];
    this[3] = v[2];
    this[4] = 0;
    this[5] = -v[0];
    this[6] = -v[1];
    this[7] = v[0];
    this[8] = 0;
    return this;
  }

  //Sets out to the inverse of this matrix ----------------------------
  inverse( out = null ) {
    out = out || this;

    let xx = this[0], xy = this[1], xz = this[2],
        yx = this[3], yy = this[4], yz = this[5],
        zx = this[6], zy = this[7], zz = this[8];

    let det = ((xx * yy * zz) - (xx * yz * zy) -
               (xy * yx * zz) + (xz * yx * zy) +
               (xy * zx * yz) - (xz * zx * yy));

    if( det === 0 ) {
      return this;
    }

    det = 1.0 / det;

    out[0] = (yy * zz - yz * zy) * det;
    out[1] =-(xy * zz - xz * zy) * det;
    out[2] = (xy * yz - xz * yy) * det;
    out[3] =-(yx * zz - yz * zx) * det;
    out[4] = (xx * zz - xz * zx) * det;
    out[5] =-(xx * yz - xz * yx) * det;
    out[6] = (yx * zy - yy * zx) * det;
    out[7] =-(xx * zy - yy * zx) * det;
    out[8] = (xx * yy - xy * yx) * det;
    return out;
  }
}

export { Matrix3 };
