import { Vector3 } from './Vector3.js';
import { Quaternion } from './Quaternion.js'

class Matrix3 {
  /**
  * Creates a new Instance of the Matrix3 Class
  */
  constructor( xx = 1.0, xy = 0.0, xz = 0.0, yx = 0.0, yy = 1.0, yz = 0.0, zx = 0.0, zy = 0.0, zz = 1.0 ) {
    this.xx = xx;
    this.xy = xy;
    this.xz = xz;
    this.yx = yx;
    this.yy = yy;
    this.yz = yz;
    this.zx = zx;
    this.zy = zy;
    this.zz = zz;
  }

  /**
  * Sets this matrix to the identity matrix
  */
  identity( ) {
    this.xx = 1.0;
    this.xy = 0.0;
    this.xz = 0.0;
    this.yx = 0.0;
    this.yy = 1.0;
    this.yz = 0.0;
    this.zx = 0.0;
    this.zy = 0.0;
    this.zz = 1.0;
  }

  /**
  Returns a copy of this matrix
  */
  clone( ) {
    return new this.constructor( this.xx, this.xy, this.xz,
                                 this.yx, this.yy, this.yz,
                                 this.zx, this.zy, this.zz );
  }

  /**
  * Sets all elements of the matrix to 0
  */
  zero( ){
    this.xx = 0.0;
    this.xy = 0.0;
    this.xz = 0.0;
    this.yx = 0.0;
    this.yy = 0.0;
    this.yz = 0.0;
    this.zx = 0.0;
    this.zy = 0.0;
    this.zz = 0.0;
  }

  /**
  * Multiplies this matrix and the given matrix, sets this to the result
  * @param m Matrix3
  */
  multiply( m ) {
    let xx = this.xx * m.xx + this.xy * m.yx + this.xz * m.zx;
    let xy = this.xx * m.xy + this.xy * m.yy + this.xz * m.zy;
    let xz = this.xx * m.xz + this.xy * m.yz + this.xz * m.zz;
    let yx = this.yx * m.xx + this.yy * m.yx + this.yz * m.zx;
    let yy = this.yx * m.xy + this.yy * m.yy + this.yz * m.zy;
    let yz = this.yx * m.xz + this.yy * m.yz + this.yz * m.zz;
    let zx = this.zx * m.xx + this.zy * m.yx + this.zz * m.zx;
    let zy = this.zx * m.xy + this.zy * m.yy + this.zz * m.zy;
    let zz = this.zx * m.xz + this.zy * m.yz + this.zz * m.zz;

    this.xx = xx;
    this.xy = xy;
    this.xz = xz;
    this.yx = yx;
    this.yy = yy;
    this.yz = yz;
    this.zx = zx;
    this.zy = zy;
    this.zz = zz;
  }

  /**
  * Multiplies this to the product of the two matrices
  * @param a Matrix3
  * @param b Matrix3
  */
  multiplyMatrices( a, b ) {
    this.xx = a.xx * b.xx + a.xy * b.yx + a.xz * b.zx;
    this.xy = a.xx * b.xy + a.xy * b.yy + a.xz * b.zy;
    this.xz = a.xx * b.xz + a.xy * b.yz + a.xz * b.zz;
    this.yx = a.yx * b.xx + a.yy * b.yx + a.yz * b.zx;
    this.yy = a.yx * b.xy + a.yy * b.yy + a.yz * b.zy;
    this.yz = a.yx * b.xz + a.yy * b.yz + a.yz * b.zz;
    this.zx = a.zx * b.xx + a.zy * b.yx + a.zz * b.zx;
    this.zy = a.zx * b.xy + a.zy * b.yy + a.zz * b.zy;
    this.zz = a.zx * b.xz + a.zy * b.yz + a.zz * b.zz;
  }

  /**
    Transpose this matrix
  */
  transpose( ) {
    let t = this.xy;
    this.xy = this.yx;
    this.yx = t;
    t = this.xz;
    this.xz = this.zx;
    this.zx = t;
    t = this.yz;
    this.yz = this.zy;
    this.zy = t;
  }

  /**
  Sets this to be the skew symmetric of the given vector3
  @param v Vector3
  */
  skewSymmtric( v ) {
    this.xx = 0;
    this.xy = -v.z;
    this.xz = v.y;
    this.yx = v.z;
    this.yy = 0;
    this.yz = -v.x;
    this.zx = -v.y;
    this.zy = v.x;
    this.zz = 0;
  }

  /**
  Sets this to the inverse of itself
  */
  inverse( ) {
    let det =((this.xx * this.yy * this.zz) - (this.xx * this.yz * this.zy) -
              (this.xy * this.yx * this.zz) + (this.xz * this.yx * this.zy) +
              (this.xy * this.zx * this.yz) - (this.xz * this.zx * this.yy));
    if( det === 0.0 ) {
      this.zero();
      return;
    }
    det = 1.0 / det;

    let xx = (this.yy * this.zz - this.yz * this.zy) * det;
    let xy =-(this.xy * this.zz - this.xz * this.zy) * det;
    let xz = (this.xy * this.yz - this.xz * this.yy) * det;
    let yx =-(this.yx * this.zz - this.yz * this.zx) * det;
    let yy = (this.xx * this.zz - this.xz * this.zx) * det;
    let yz =-(this.xx * this.yz - this.xz * this.yx) * det;
    let zx = (this.yx * this.zy - this.yy * this.zx) * det;
    let zy =-(this.xx * this.zy - this.yy * this.zx) * det;
    let zz = (this.xx * this.yy - this.xy * this.yx) * det;

    this.xx = xx;
    this.xy = xy;
    this.xz = xz;
    this.yx = yx;
    this.yy = yy;
    this.yz = yz;
    this.zx = zx;
    this.zy = zy;
    this.zz = zz;
  }
}

export { Matrix3 };
