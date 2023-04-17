import { Vector3 } from './Vector3.js';
import { Vector4 } from './Vector4.js';

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
    n.multiplyVector4s( z, y );
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
  fromVector4( q ){
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

  /**
  @brief Returns an array
  */
  toArray( ) {
    let array = [ this.xx, this.xy, this.xz, this.xw,
                  this.yx, this.yy, this.yz, this.yw,
                  this.zx, this.zy, this.zz, this.zw,
                  this.wx, this.wy, this.wz, this.ww ];
    return array;
  }
}

export { Matrix4 };
