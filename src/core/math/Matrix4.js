import { Vector3 } from './Vector3.js';
import { Quaternion } from './Quaternion.js';

/**
  @brief Represents a 4x4 matrix
    Matrices are row major, OpenGL use Column major.  It doesn't really make
      a difference.  Just reverse the order of multiplation in the shader
      example Column major model_view_projection matrix = projection * view * model;
      example Row major model_view_projection = model * view * projection;
*/
class Matrix4 extends Float32Array {
  constructor( ) {
    super(16);
    this[0] = this[5] = this[10] = this[15] = 1;
    this[1] = this[2] = this[3] = this[4] = this[6] = this[7] = this[8] = this[9] = this[11] = this[12] = this[13] = this[14] = 0;
  }

  // Setters and Getters ----------------------------------------

  copy( m ) {
    for( let i = 0; i < 16; i++ ) { this[i] = m[i]; }
    return this;
  }

  clone( ) {
    let a = new Matrix4();
    a.copy( this );
    return a;
  }
  // Methods ----------------------------------------------------

  /**
  @brief Set this matrix to the identity matrix
  */
  identity( ) {
    this[0] = this[5] = this[10] = this[15] = 1;
    this[1] = this[2] = this[3] = this[4] = this[6] = this[7] = this[8] = this[9] = this[11] = this[12] = this[13] = this[14] = 0;
    return this;
  }

  /**
  @brief Transposes this matrix4
  @param out Optional Matrix to set the value of
  */
  transpose( out = null ) {
    out = out || this;
    let xx = this[0], xy = this[1], xz = this[2], xw = this[3],
        yx = this[4], yy = this[5], yz = this[6], yw = this[7],
        zx = this[8], zy = this[9], zz = this[10], zw = this[11],
        wx = this[12], wy = this[13], wz = this[14], ww = this[15];

    out[0] = xx;
    out[1] = yx;
    out[2] = zx;
    out[3] = wx;
    out[4] = xy;
    out[5] = yy;
    out[6] = zy;
    out[7] = wy;
    out[8] = xz;
    out[9] = yz;
    out[10]= zz;
    out[11]= wz;
    out[12]= xw;
    out[13]= yw;
    out[14]= zw;
    out[15]= zz;
    return out;
  }

  /**
  @brief Multiply the this matrix and m, set out to the result
  @param m Matrix4
  @param out Matrix4 to set the value to, optional
  */
  multiply( m, out = null ) {
    out = out || this;
    let xx = this[0], xy = this[1], xz = this[2], xw = this[3],
        yx = this[4], yy = this[5], yz = this[6], yw = this[7],
        zx = this[8], zy = this[9], zz = this[10], zw = this[11],
        wx = this[12], wy = this[13], wz = this[14], ww = this[15];

    out[0] = xx * m[0] + xy * m[4] + xz * m[8 ] + xw * m[12];
    out[1] = xx * m[1] + xy * m[5] + xz * m[9 ] + xw * m[13];
    out[2] = xx * m[2] + xy * m[6] + xz * m[10] + xw * m[14];
    out[3] = xx * m[3] + xy * m[7] + xz * m[11] + xw * m[15];

    out[4] = yx * m[0] + yy * m[4] + yz * m[8 ] + yw * m[12];
    out[5] = yx * m[1] + yy * m[5] + yz * m[9 ] + yw * m[13];
    out[6] = yx * m[2] + yy * m[6] + yz * m[10] + yw * m[14];
    out[7] = yx * m[3] + yy * m[7] + yz * m[11] + yw * m[15];

    out[8] = zx * m[0] + zy * m[4] + zz * m[8 ] + zw * m[12];
    out[9] = zx * m[1] + zy * m[5] + zz * m[9 ] + zw * m[13];
    out[10]= zx * m[2] + zy * m[6] + zz * m[10] + zw * m[14];
    out[11]= zx * m[3] + zy * m[7] + zz * m[11] + zw * m[15];

    out[12]= wx * m[0] + wy * m[4] + wz * m[8 ] + ww * m[12];
    out[13]= wx * m[1] + wy * m[5] + wz * m[9 ] + ww * m[13];
    out[14]= wx * m[2] + wy * m[6] + wz * m[10] + ww * m[14];
    out[15]= wx * m[3] + wy * m[7] + wz * m[11] + ww * m[15];
    return out;
  }

  /**
  @brief Set this matrix to be an orthographic projection
  @param left The left value to use
  @param right The right value
  @param bottom The bottom value
  @param top The top value
  @param near he near value
  @param far The far value
  */
  setOrthographic( left, right, bottom, top, near, far ) {
    let a = 2.0 / ( right - left ),
        b = 2.0 / ( top - bottom ),
        c =-2.0 / ( far - near ),
        tx = -( right + left ) / ( right - left ),
        ty = -( top + bottom ) / ( top - bottom ),
        tz = -( far + near ) / ( far - near );

    this.identity();
    this[0] = a;
    this[5] = b;
    this[10] = c;
    this[12] = tx;
    this[13] = ty;
    this[14] = tz;
    this[15] = 1;
    return this;
  }

  /**
  @brief Sets this to be a perspective view matrix
  @param fovRadians y field of view in radians
  @param aspect The aspect ratio
  @param near distance to the near clip plane
  @param far distance to the far clip plane
  */
  setPerspective( fovRadians, aspect, near, far ) {
    let htf = Math.tan( fovRadians * 0.5 );
    this.identity();
    this[0] = 1.0 / ( aspect * htf );
    this[5] = 1.0 / ftf;
    this[10] = -(( far + near ) / ( far - near ) );
    this[11] = -1.0;
    this[14] = -(( 2.0 * far * near ) / ( far - near ) );
    this[15] = 0;
    return this;
  }

  /**
  @brief set out to the inverse of this matrix
  @param out Optional Matrix4 to set the value of
  */
  inverse( out = null ) {
    out = out || this;
    let xx = this[0], xy = this[1], xz = this[2], xw = this[3],
        yx = this[4], yy = this[5], yz = this[6], yw = this[7],
        zx = this[8], zy = this[9], zz = this[10], zw = this[11],
        wx = this[12], wy = this[13], wz = this[14], ww = this[15];

  let t0 = this[10] * this[15],
      t1 = this[14] * this[11],
      t2 = this[6 ] * this[15],
      t3 = this[14] * this[7],
      t4 = this[6 ] * this[11],
      t5 = this[10] * this[7],
      t6 = this[2 ] * this[15],
      t7 = this[14] * this[3],
      t8 = this[2 ] * this[11],
      t9 = this[10] * this[3],
      t10= this[2 ] * this[7],
      t11= this[6 ] * this[3],
      t12= this[8 ] * this[13],
      t13= this[12] * this[9],
      t14= this[4 ] * this[13],
      t15= this[12] * this[5],
      t16= this[4 ] * this[9],
      t17= this[8 ] * this[5],
      t18= this[0 ] * this[13],
      t19= this[12] * this[1],
      t20= this[0 ] * this[9],
      t21= this[8 ] * this[1],
      t22= this[0 ] * this[5],
      t23= this[4 ] * this[1],
      d;

    d = 1.0 / (xx * (t0 * yy + t3 * zy + t4 * wy) - (t1 * yy + t2 * zy + t5 * wy) +
               yx * (t1 * xy + t6 * zy + t9 * wy) - (t0 * xy + t7 * zy + t8 * wy) +
               zx * (t2 * xy + t7 * yy + t10 * wy) - (t3 * xy + t6 * yy + t11 * wy) +
               wx * (t5 * xy + t8 * yy + t11 * zy) - (t4 * xy + t9 * yy + t10 * zy) );

    out[0] = d * ((t0 * yy + t3 * zy + t4 * wy) - (t1 * yy + t2 * zy + t5 * wy));
    out[1] = d * ((t1 * xy + t6 * zy + t9 * wy) - (t0 * xy + t7 * zy + t8 * wy));
    out[2] = d * ((t2 * xy + t7 * yy + t10 * wy) - (t3 * xy + t6 * yy + t11 * wy));
    out[3] = d * ((t5 * xy + t8 * yy + t11 * zy) - (t4 * xy + t9 * yy + t10 * zy));
    out[4] = d * ((t1 * yx + t2 * zx + t5 * wx) - (t0 * yx + t3 * zx + t4 * wx ));
    out[5] = d * ((t0 * xx + t7 * zx + t8 * wx) - (t1 * xx + t6 * zx + t9 * wx ));
    out[6] = d * ((t3 * xx + t6 * yx + t11 * wx) - (t2 * xx + t7 * yx + t10 * wx));
    out[7] = d * ((t4 * xx + t9 * yx + t10 * zx) - (t5 * xx + t8 * yx + t11 * zx));
    out[8] = d * ((t12 * yw + t15 * zw + t16 * ww) - (t13 * yw + t14 * zw + t17 * ww));
    out[9] = d * ((t13 * xw + t18 * zw + t21 * ww) - (t12 * xw + t19 * zw + t20 * ww));
    out[10] = d * ((t14 * xw + t19 * yw + t22 * ww) - (t15 * xw + t18 * yw + t23 * ww));
    out[11] = d * ((t17 * xw + t20 * yw + t23 * zw) - (t16 * xw + t21 * yw + t22 * zw));
    out[12] = d * ((t14 * zz + t17 * wz + t13 * yz) - (t16 * wz + t12 * yz + t15 * zz));
    out[13] = d * ((t20 * wz + t12 * xz + t19 * zz) - (t18 * zz + t21 * wz + t13 * xz));
    out[14] = d * ((t18 * yz + t23 * wz + t15 * xz) - (t22 * wz + t14 * xz + t19 * yz));
    out[15] = d * ((t22 * zz + t16 * xz + t21 * yz) - (t20 * yz + t23 * zz + t17 * xz));

    return out;
  }

  /**
  @brief translates this matrix
  @param position Vector3
  @param out Optional Matrix4 to set the value of
  */
  translation( v, out = null ) {
    out = out || this;
    out[ 12 ] = position[ 0 ];
    out[ 13 ] = position[ 1 ];
    out[ 14 ] = position[ 2 ];
    return out;
  }

  /**
  @brief rotate the given vector3
  @param vec
  @return Vector3
  */
  rotateVector3( vec ) {
    let v = new Vector3();
    v[0] = vec[0] * this[0] + vec[1] * this[4] + vec[2] * this[8];
    v[1] = vec[0] * this[1] + vec[1] * this[5] + vec[2] * this[9];
    v[2] = vec[0] * this[2] + vec[1] * this[6] + vec[2] * this[10];

    return v;
  }

  /**
  @brief Scales this matrix
  @param scale Vector3
  @param out optional Matrix4 to set
  */
  scale( scale, out = null ) {
    out = out || this;
    out[0] = scale[0];
    out[5] = scale[1];
    out[10]= scale[2];
    return out;
  }

  /**
  @brief Transform the vector3 by this matrix
  @param v Vector3
  @return Vector3
  */
  transformVector3( v ) {
    let rtn = new Vector3();
    rtn[0] = v[0] * this[0] + v[1] * this[4] + v[2] * this[8] + this[12];
    rtn[1] = v[0] * this[1] + v[1] * this[5] + v[2] * this[9] + this[13];
    rtn[2] = v[0] * this[2] + v[1] * this[6] + v[2] * this[10] + this[14];
    return rtn;
  }

  /**
  @brief Transform transpose the vector3 by this matrix
  @param v Vector3
  @return Vector3
  */
  transformTransposeVector3( v ) {
    let rtn = new Vector3();
    let vx = v[0] - this[12], vy = v[1] - this[13], vz = v[2] - this[14];

    rtn[0] = vx * this[0] + vy * this[1] + vz * this[2];
    rtn[1] = vx * this[4] + vy * this[5] + vz * this[6];
    rtn[2] = vx * this[8] + vy * this[9] + vz * this[10];
    return rtn;
  }

  /**
  @brief creates a transfrom
  @param position Vector3
  @param scale Vector3
  @param rotation Vector3
   */
  static createTransform( position, scale, rotation ) {
    let x = Quaternion.fromAxisAngle( [1, 0, 0 ], rotation[0] ),
        y = Quaternion.fromAxisAngle( [0, 1, 0 ], rotation[1] ),
        z = Quaternion.fromAxisAngle( [0, 0, 1 ], rotation[2] ),
        n = new Quaternion( ),
        rtn = new Matrix4();
    z.multiply( y, n );
    n.normalize();

    rtn[0] = ( 1.0 - 2.0 * n.y * n.y - 2.0 * n.z * n.z ) * scale[0];
    rtn[1] = ( 2.0 * n.x * n.y - 2.0f * n.z * n.w ) * scale[0];
    rtn[2] = ( 2.0 * n.x * n.z + 2.0f * n.y * n.w ) * scale[0];

    rtn[4] = ( 2.0 * n.x * n.y + 2.0 * n.z * n.w ) * scale[1];
    rtn[5] = ( 1.0 - 2.0 * n.x * n.x - 2.0 * n.z * n.z ) * scale[1];
    rtn[6] = ( 2.0 * n.y * n.z - 2.0 * n.x * n.w ) * scale[1];

    rtn[8] = ( 2.0 * n.x * n.z - 2.0 * n.y * n.w ) * scale[2];
    rtn[9] = ( 2.0 * n.y * n.z + 2.0 * n.x * n.w ) * scale[2];
    rtn[10] = ( 1.0 - 2.0 * n.x * n.x - 2.0 * n.y * n.y ) * scale[2];

    rtn[12] = position[0];
    rtn[13] = position[1];
    rtn[14] = position[2];

    return rtn;
  }

}

export { Matrix4 };
