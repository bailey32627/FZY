#ifndef FZY_MATH_H
#define FZY_MATH_H

#include "defines.h"

/*
    @brief define some commonly used mathematical terms and functions
*/

// @brief An approximate representation of PI
#define FZY_PI 3.14159265358979323846f

// @brief One devied by an approximate representation of PI
#define ONE_OVER_PI 1.0f / FZY_PI

// @brief Converts degrees to radians
#define fzy_degrees_to_radian( angle ) angle * FZY_PI / 180.0f

// @brief convers radians to degrees
#define fzy_radian_to_degrees( radians ) radian * 180.0f / FZY_PI

// @brief Clamps the value between bottom and top
#define fzy_clamp( v, bottom, top ) v < bottom ? bottom : ( v < top ? v : top )

// @brief Checks if the value is between top and bottom
#define fzy_between( v, bottom, top ) v > bottom ? ( v < top ? 1 : 0 ) : 0

// @brief Linear interpolates a and b by ratio
#define fzy_lerp( a, b, ratio ) ( b - a ) * ratio + a

// @brief A smoother interpolation of a and b by ratio
#define fzy_smooth_step( a, b, ratio ) (b-a) * ( ratio * ratio * ( 3 - 2 * ratio ) ) + a

// @brief Even smoother interpolation fo a and b by ratio
#define fzy_smoother_step( a, b, ratio ) (b-a) * (ratio * ratio * ratio * (ratio*(ratio * 6 - 15 ) + 10 ) ) + a

// @brief Returns the min number of a and b
#define fzy_min( a, b ) a < b ? a : b

// @brief Returns the max number of a and b
#define fzy_max( a, b ) a > b ? a : b

// @brief Converts seconds to milliseconds
#define fzy_seconds_to_ms( seconds ) seconds * 1000.0f

// @brief Converts ms to seconds
#define fzy_ms_to_seconds( ms ) ms * 0.001f

// @brief A huge number that should be larger tan any valid number used
#define FZY_INFINITY 1e30f

// @brief Smallest positive number where 1.0 + FLOAT_EPSILON != 0
#define FZY_EPSILON 1.192092896e-07f

//----------------------------------------------------------------------------------------------------
// General Math Functions
// ---------------------------------------------------------------------------------------------------

/*
    @brief Calculates the sine of v
    @param v - the numer to calculate the sine of.
    @return f32 - the sine of v
*/
FZY_API f32 fzy_sin( f32 v );

/*
    @brief Calculates the cosine of v.
    @param v - the number to calculate the cosine of
    @return f32 - the cosine of v
*/
FZY_API f32 fzy_cos( f32 v );

/*
    @brief Calculate the tangent of v
    @param v - the number to calculate the tangent of
    @return f32 - the tangent of v
*/
FZY_API f32 fzy_tan( f32 v );

/*
    @brief Calculates the arc cosine of v
    @param v - the nubmer to calculate the arc cosine of
    @return f32 - the arc cosine of v
*/
FZY_API f32 fzy_acos( f32 v );

/*
    @brief Calculates the square root of v
    @param v - the number to calculate the square root of
    @return f32 - the square root of v
*/
FZY_API f32 fzy_sqrt( f32 v );

/*
    @brief Calculate the absolute value of v
    @param v - the number to get the absolute value of
    @return the absolute value of x
*/
FZY_API f32 fzy_abs( f32 v );

/*
    @brief Indicates if the value is a power of 2
    @param v - the value to be interpreted
    @return true if is a power of 2
*/
FZY_INLINE b8 fzy_is_power_of_2( u64 v ) {
    return (v != 0 ) && (( v & ( v - 1 ) ) == 0 );
}

/*
    @brief Generates a random integer
    @return i32 - A random integer
*/
FZY_API i32 fzy_random();

/*
    @brief Generates a random integer that is within the range min and max
    @param min - minimum number in the range
    @param max - maximum number in the range
    @return i32 - A random integer
*/
FZY_API i32 fzy_random_in_range( i32 min, i32 max );

/*
    @brief Generates a random float
    @return f32 - A random f32
*/
FZY_API f32 fzy_random_f32();

/*
    @brief Generates a random f32 that is within the range min and max
    @param min - minimum number in the range
    @param max - maximum number in the range
    @return f32 - A random integer
*/
FZY_API f32 fzy_random_in_range_f32( f32 min, f32 max );

/*
    @brief Rounds dow the given value
    @param v - the number to round down
    @return i32 - the number rounded down
*/
FZY_API i32 fzy_floor( f32 v );

// --------------------------------------------------------------------------------------------
// ivec2
// --------------------------------------------------------------------------------------------
/*
    @brief Creates and returns a new ivec2
    @param x - the value for first element
    @param y - the value for the second element
    @return ivec2 - new 2-element vector
*/
FZY_INLINE ivec2 ivec2_create( i32 x, i32 y )
{
    ivec2 n;
    n.x = x;
    n.y = y;
    return n;
}

/*
    @brief Adds the two 2D vectors and returns the result
    @param a - the first vector
    @param b - the second vector
    @return ivec2 - new 2 element vector
*/
FZY_INLINE ivec2 ivec2_add( ivec2 a, ivec2 b )
{
    return (ivec2){ a.x + b.x, a.y + b.y };
}

/*
    @brief Subtracts the two vectors and returns the result
    @param a - the first vector
    @param b - the second vector
    @return ivec2 - new 2 element vector
*/
FZY_INLINE ivec2 ivec2_subtract( ivec2 a, ivec2 b )
{
    return (ivec2){ a.x - b.x, a.y - b.y };
}

/*
    @brief Multiples the two vectors and returns the result
    @param a - the first vector
    @param b - the second vector
    @return ivec2 - new 2 element vector
*/
FZY_INLINE ivec2 ivec2_multiply( ivec2 a, ivec2 b )
{
    return (ivec2){ a.x * b.x, a.y * b.y };
}

//--------------------------------------------------------------------------------------------
// vec2
// -------------------------------------------------------------------------------------------

/*
    @brief Creates and returns a new 2 element vector
    @param x - the x value of the vector
    @param y - the y value fo the vector
    @return vec2 - new 2 element vector with x and y values
*/
FZY_INLINE vec2 vec2_create( f32 x, f32 y )
{
    vec2 n;
    n.x = x;
    n.y = y;
    return n;
}

/*
    @brief Creates a 2 element vector pointing up (0, 1 )
*/
FZY_INLINE vec2 vec2_up()
{
    return (vec2){ 0.0f, 1.0f };
}

/*
    @brief Creates a 2 element vector pointing down (0, -1 )
*/
FZY_INLINE vec2 vec2_down()
{
    return (vec2){ 0.0f, -1.0f };
}

/*
    @brief Creates a 2 element vector pointing left ( -1, 0 )
*/
FZY_INLINE vec2 vec2_left()
{
    return (vec2){ -1.0f, 0.0f };
}

/*
    @brief Creates a 2 element vector pointing right ( 1, 0 )
*/
FZY_INLINE vec2 vec2_right()
{
    return (vec2){ 1.0f, 0.0f };
}

/*
    @brief Adds the two vectors and returns the result
    @param a - the first vector
    @param b - the second vector
    @return vec2 - new 2 element vector that is the sum of a and b
*/
FZY_INLINE vec2 vec2_add( vec2 a, vec2 b )
{
    return (vec2){ a.x + b.x, a.y + b.y };
}

/*
    @brief Subtracts the two vectors and return the difference
    @param a - the first vector
    @param b - the second vector
    @return vec2 - new 2 element vector that is the difference of a and b
*/
FZY_INLINE vec2 vec2_subtract( vec2 a, vec2 b )
{
    return (vec2){ a.x - b.x, a.y - b.y };
}

/*
    @brief Multiplies the two vectors and return the product
    @param a - the first vector
    @param b - the second vector
    @return vec2 - new 2 element vector that is the product of a and b
*/
FZY_INLINE vec2 vec2_multiply( vec2 a, vec2 b )
{
    return (vec2){ a.x * b.x, a.y * b.y };
}

/*
    @brief Divides the two supplied vectors and returns the quotient
    @param a - the numerator
    @param b - the denominator
    @return vec2 - new 2 element vector that is the quotient of a and b
*/
FZY_INLINE vec2 vec2_divide( vec2 a, vec2 b )
{
    return (vec2){ a.x / b.x, a.y / b.y };
}

/*
    @brief Scales the supplied vector by the scalar and returns the result
    @param v - the vector to scale
    @param s - the scalar value
    @return vec2 - new 2 element vector that is v scaled by s
*/
FZY_INLINE vec2 vec2_scale( vec2 v, f32 s )
{
    return (vec2){ v.x * s, v.y * s };
}

/*
    @brief Rotates the given vector by the angle
    @param v - the vector to rotate
    @param degrees - the angle to rotate by in degrees
    @return vec2 - new vec2 that is v rotated by degrees
*/
FZY_INLINE vec2 vec2_rotate( vec2 v, f32 degrees )
{
    f32 r = fzy_degrees_to_radian( degrees );
    f32 s = fzy_sin( r );
    f32 c = fzy_cos( r );
    return (vec2){ v.x * c - v.y * s, v.x * s + v.y * c };
}

/*
    @brief Calculates the squared length of the provided vector
    @param v - the vec2 to get the squared length of
    @return f32 - the squared length of v
*/
FZY_INLINE f32 vec2_length_squared( vec2 v )
{
    return v.x * v.x + v.y * v.y;
}

/*
    @brief Calculates the dot product of the provided vectors
    @param a - the first vector
    @param b - the second vector
    @return f32 - the dot product of the vectors
*/
FZY_INLINE f32 vec2_dot( vec2 a, vec2 b )
{
    return a.x * b.x + a.y * b.y;
}

/*
    @brief Calculates the length of the provided vector
    @param v - the vector
    @return f32 - the length of the vector
*/
FZY_INLINE f32 vec2_length( vec2 v )
{
    return fzy_sqrt( vec2_length_squared( v ) );
}

/*
    @brief Calculates a normalized copy of the supplied vector
    @param v - the vector to be normalized
    @return vec2 - a normalized version of v
*/
FZY_INLINE vec2 vec2_normalize( vec2 v )
{
    f32 l = vec2_length( v );
    if( l <= 0 )
    {
        return (vec2){ 0.0f, 0.0f };
    }
    l = 1.0f / l;
    return (vec2){ v.x * l, v.y * l };
}

/*
    @brief Compares all elements of a and b and ensure the difference is less than the tolerance
    @param a - the first vector
    @param b - the second vector
    @param tolerance - the difference tolerance, typically FZY_EPSILON or similar
    @return true if within tolerance
*/
FZY_INLINE b8 vec2_compare( vec2 a, vec2 b, f32 tolerance )
{
    if( fzy_abs( a.x - b.x ) > tolerance ) {
        return false;
    }
    if( fzy_abs( a.y - b.y) > tolerance ) {
        return false;
    }
    return true;
}

/*
    @brief Calculates the squared distance between the two vectors
    @param a - the first vector
    @param b - the second vector
    @return f32 - the squared distance between a and b
*/
FZY_INLINE f32 vec2_distance_squared( vec2 a, vec2 b )
{
    return (( b.x - a.x ) * ( b.x - a.x ) + ( b.y - a.y ) * ( b.y - a.y ) );
}

/*
    @brief Calculates the distance between a and b
    @param a - the first vector
    @param b - the second vector
    @return f32 - the distance between a and b
*/
FZY_INLINE f32 vec2_distance( vec2 a, vec2 b )
{
    f32 d = vec2_distance_squared( a, b );
    return fzy_sqrt( d );
}

//----------------------------------------------------------------------------------------------------------------
// vec3
//----------------------------------------------------------------------------------------------------------------
/*
    @brief Creates a new 3 element vector with the given values
    @param x - the x value
    @param y - the y value
    @param z = the z value
    @return vec3 - a new vec3 with the given values
*/
FZY_INLINE vec3 vec3_create( f32 x, f32 y, f32 z )
{
    vec3 n;
    n.x = x;
    n.y = y;
    n.z = z;
    return n;
}

/*
    @brief Creates a vec3 with elements set to zero
    @return vec3 - a new vec3 with zero values
*/
FZY_INLINE vec3 vec3_zero( void )
{
    return (vec3){ 0.0f, 0.0f, 0.0f };
}

/*
    @brief Creates a vec3 that represents the up direction
    @return vec3 - vec3 with y set to 1
*/
FZY_INLINE vec3 vec3_up( void )
{
    return (vec3){ 0.0f, 1.0f, 0.0f };
}

/*
    @brief Creates a vec3 that represents the down direction
    @return vec3 - vec3 with y set to -1
*/
FZY_INLINE vec3 vec3_down( void )
{
    return (vec3){ 0.0f, -1.0f, 0.0f };
}

/*
    @brief Creates a vec3 that represents the forward direction
    @return vec3 - vec3 with z set to -1
*/
FZY_INLINE vec3 vec3_forward( void )
{
    return (vec3){ 0.0f, 0.0f, -1.0f };
}

/*
    @brief Creates a vec3 that represents the backward direction
    @return vec3 - vec3 with z set to 1
*/
FZY_INLINE vec3 vec3_backward( void )
{
    return (vec3){ 0.0f, 0.0f, 1.0f };
}

/*
    @brief Calculates the sum of the two vectors
    @param a - the first vector
    @param b - the second vector
    @return vec3 - new vec3 that is the sum of the elements of a and b
*/
FZY_INLINE vec3 vec3_add( vec3 a, vec3 b )
{
    return (vec3){ a.x + b.x, a.y + b.y, a.z + b.z };
}

/*
    @brief Calculates the difference of the two vectors
    @param a - the first vector
    @param b - the second vector
    @return vec3 - new vec3 that is the difference of the elements of a and b
*/
FZY_INLINE vec3 vec3_subtract( vec3 a, vec3 b )
{
    return (vec3){ a.x - b.x, a.y - b.y, a.z - b.z };
}

/*
    @brief Calculate the product of vectors a and b
    @param a - the first vector
    @param b - the second vector
    @return vec3 - the product of a and b
*/
FZY_INLINE vec3 vec3_multiply( vec3 a, vec3 b )
{
    return (vec3){ a.x * b.x, a.y * b.y, a.z * b.z };
}

/*
    @brief Calculates a vector that is the product of scaling the given vector
    @param v - the vector to scale
    @param s - the scalar to use
    @return vec3 - the product of scaling v by s
*/
FZY_INLINE vec3 vec3_scale( vec3 v, f32 s )
{
    return (vec3){ v.x * s, v.y * s, v.z * s };
}

/*
    @brief Returns a mirror image of the provided vector
    @param v - the vector to invert
    @return vec3 - the inverted copy of v
*/
FZY_INLINE vec3 vec3_invert( vec3 v )
{
    return vec3_scale( v, -1.0f );
}

/*
    @brief Calculates the cross product of the supplied vectors.
        The cross product is a vector which is ortoganal to both provided vectors
    @param a - the first vector
    @param b - the second vector
    @return vec3 - Orthonanal vector to both a and b
*/
FZY_INLINE vec3 vec3_cross( vec3 a, vec3 b )
{
    return (vec3){ a.y * b.z - a.z * b.y,
                   a.z * b.x - a.x * b.z,
                   a.x * b.y - a.y * b.x };
}

/*
    @brief Calculates the dot product of the two supplied vectors
    @param a - the first vector
    @param b - the second vector
    @return f32 - the dot product of a and b
*/
FZY_INLINE f32 vec3_dot( vec3 a, vec3 b )
{
    return a.x * b.x + a.y * b.y + a.z * b.z;
}

/*
    @brief Calculates the squared length of the vector
    @param v - the vector
    @return f32 - the squared length of v
*/
FZY_INLINE f32 vec3_length_squared( vec3 v )
{
    return v.x * v.x + v.y * v.y + v.z * v.z;
}

/*
    @brief Calculates the length ( magnitude ) of the vector
    @param v - the vector
    @return f32 - the length ( magnitude ) of the vector
*/
FZY_INLINE f32 vec3_length( vec3 v )
{
    return fzy_sqrt( v.x * v.x + v.y * v.y + v.z * v.z );
}

/*
    @brief Calculates the squared distance between the 2 vectors
    @param a - the first vector
    @param b - the second vector
    @return f32 - the squared distance between a and b
*/
FZY_INLINE f32 vec3_distance_squared( vec3 a, vec3 b )
{
    return (( b.x - a.x ) * ( b.x - a.x ) +
            ( b.y - a.y ) * ( b.y - a.y ) +
            ( b.z - a.z ) * ( b.z - a.z ) );
}

/*
    @brief Calculates the distance between the 2 vectors
    @param a - the first vector
    @param b - the second vector
    @return f32 - the distance between a and b
*/
FZY_INLINE f32 vec3_distance( vec3 a, vec3 b )
{
    return fzy_sqrt( vec3_distance_squared( a, b ) );
}

/*
    @brief Calculates a normalized version of the provided vector
    @param v - the vector to normalize
    @return vec3 - the normalized copy of v
*/
FZY_INLINE vec3 vec3_normalize( vec3 v )
{
    f32 l = vec3_length( v );
    if( l > 0.0f )
    {
        l = 1.0f / l;
        return (vec3){ v.x * l, v.y * l, v.z * l };
    }
    return vec3_zero();
}

/*
    @brief Calculates a vector that is reflected across the provided normal
    @param a - the vector to reflect
    @param normal - the noraml vector to reflect across
    @return vec3 - reflected vector
*/
FZY_INLINE vec3 vec3_reflect( vec3 a, vec3 normal )
{
    return vec3_subtract( a, vec3_scale( normal, 2 * vec3_dot( a, normal ) ) );
}

/*
    @brief Calculates a vector projected onto b
    @param a - the vector to project
    @param b - the vector to project onto
    @return vec3 - the projected a onto b
*/
FZY_INLINE vec3 vec3_project( vec3 a, vec3 b )
{
    return vec3_subtract( a, vec3_scale( b, vec3_dot( a, b ) ) );
}

/*
    @brief Compares all elements of a and b and ensures the difference is less than tolerance
    @param a - the first vector
    @param b - the second vector
    @param tolerance - the difference tolerance.  Typically FZY_EPSILON or similar
    @return true - if within tolerance
*/
FZY_INLINE b8 vec3_compare( vec3 a, vec3 b, f32 tolerance )
{
    if( fzy_abs( a.x - b.x ) > tolerance ){ return false; }
    if( fzy_abs( a.y - b.y ) > tolerance ){ return false; }
    if( fzy_abs( a.z - b.z ) > tolerance ){ return false; }
    return true;
}

/*
    @brief Transform a point by a 4x4 matrix.
        NOTE: It is assumed by this function that the vector v is a point, not a direction,
              and is calcualted as if a w component with a value of 1.0f is there
    @param v - the point vector
    @param m - the transform matrix
    @return vec3 - a copy of v transformed by m
*/
FZY_INLINE vec3 vec3_transform( vec3 v, mat4 m )
{
    vec3 r;
    r.x = v.x * m.xx + v.y * m.yx + v.z * m.zx + m.wx;
    r.y = v.x * m.xy + v.y * m.yy + v.z * m.zy + m.wy;
    r.z = v.x * m.xz + v.y * m.yz + v.z * m.zz + m.wz;
    return r;
}

/*
    @brief Transforms a vector by 3x3 matrix.
    @param v - the vector to transform
    @param m - the matrix to transform by
    @return vec3 - copy of v transformed by m
*/
FZY_INLINE vec3 vec3_transform_mat3( vec3 v, mat3 m )
{
    vec3 r;
    r.x = v.x * m.xx + v.y * m.yx + v.z * m.zx;
    r.y = v.x * m.xy + v.y * m.yy + v.z * m.zy;
    r.z = v.x * m.xz + v.y + m.yz + v.z * m.zz;
    return r;
}

//-------------------------------------------------------------------------------------------------------
// vec4  - all vec4 are quaternions
// ------------------------------------------------------------------------------------------------------
/*
    @brief Creates a 4 element vector with the given values
    @param x - the x value of the vector
    @param y - the y value of the vector
    @param z - the z value of the vector
    @param w - the w value of the vector
    @return vec4 - new vec4 with the given values
*/
FZY_INLINE vec4 vec4_create( f32 x, f32 y, f32 z, f32 w )
{
    return (vec4){ x, y, z, w };
}

/*
    @brief Creates an identity quaternion
    @return vec4 - a identity quaternion
*/
FZY_INLINE vec4 vec4_identity()
{
    return (vec4){ 0.0f, 0.0f, 0.0f, 1.0f };
}

/*
    @brief Calculates the length of the provided vector
    @param a - the vector to retrieve the length of
    @return f32 - the length of the vector
*/
FZY_INLINE f32 vec4_length( vec4 v )
{
    return fzy_sqrt( v.x * v.x + v.y * v.y + v.z * v.z + v.w * v.w );
}

/*
    @brief Calculates a normalized copy of the provided quaternion
    @param q - the quaternion to normalize
    @return vec4 - a normalized copy of q
*/
FZY_INLINE vec4 vec4_normalize( vec4 q )
{
    f32 l = vec4_length(q);
    if( l > 0.0 )
    {
        l = 1.0f / l;
        return (vec4){ q.x * l, q.y * l, q.z * l, q.w * l };
    }
    return vec4_create( 0, 0, 0, 0 );
}

/*
    @brief Calculates the conjugate of the provided quaternion.  That is, the
        x,y,z elements are negated, but the w element is untouched.
    @param q - the quaternion to obtain the conjugate of.
    @return vec4 - the conjuage quaternion
*/
FZY_INLINE vec4 vec4_conjugate( vec4 q )
{
    return (vec4){ q.x * -1.0f, q.y * -1.0f, q.z * -1.0f, q.w };
}

/*
    @brief Calculates an inverse copy of the provided quaternion
    @param q - the quaternion to invert
    @return vec4 - the inverse copy of the provided quaternion
*/
FZY_INLINE vec4 vec4_inverse( vec4 q )
{
    return vec4_normalize( vec4_conjugate( q ) );
}

/*
    @brief Multiplies the provided quaternions.  Not communicable, ie a * b is not = to b * a
    @param a - the first quaternion
    @param b - the second quaternion
    @return vec4 - the product of a and b
*/
FZY_INLINE vec4 vec4_multiply( vec4 a, vec4 b )
{
    return (vec4){
        ( a.x * b.w + a.y * b.z - a.z * b.y + a.w * b.x ),
        (-a.x * b.z + a.y * b.w + a.z * b.x + a.w * b.y ),
        ( a.x * b.y - a.y * b.x + a.z * b.w + a.w * b.z ),
        (-a.x * b.x - a.y * b.y - a.z * b.z + a.w * b.w )
    };
}

/*
    @brief Calculates the dot producto the provided quaternions
    @param a - the first quaternion
    @param b - the second quaternion
    @return f32 - The dot product of the provided quaternions
*/
FZY_INLINE f32 vec4_dot( vec4 a, vec4 b )
{
    return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
}

/*
    @brief Calculates a rotation quaternion from the given axis and angle
    @param axis - the axis of the rotation
    @param angle - the angle of the rotation in degrees
    @param normalize - indicates if the quaternion should be normalized
*/
FZY_INLINE vec4 vec4_from_axis_angle( vec3 axis, f32 angle, b8 normalize )
{
    const f32 half_angle = 0.5f * angle;
    f32 s = fzy_sin( half_angle );
    f32 c = fzy_cos( half_angle );

    vec4 q = (vec4){ s * axis.x, s * axis.y, s * axis.z, c };
    if( normalize )
    {
        return vec4_normalize( q );
    }
    return q;
}

/*
    @brief Calculates spherical linear interpolation of a given percentage between
        two quaternions
    @param a - the first quaternion
    @param b - the second quaternion
    @param percentage - the percentage of interpolation, typically a value from 0.0f to 1.0f
    @return vec4 - a quaternion representing a interpolated with b by percentage
*/
FZY_INLINE vec4 vec4_slerp( vec4 a, vec4 b, f32 percentage )
{
    vec4 out_quaternion;
    // only unit quaternions are valid rotations.  Normalize to avoid undefined behavior
    vec4 v0 = vec4_normalize(a);
    vec4 v1 = vec4_normalize(b);
    // compute the cosine of the angle between the two vectors
    f32 dot = vec4_dot(a,b);
    // if dot is negative, slerp wont take the shorter path.  Note that v1 and -v1 are
    // equivalent when the negation is applied to all four components.  Fix by
    // reversing one quaternion.
    if( dot < 0.0f )
    {
        v1.x = -v1.x;
        v1.y = -v1.y;
        v1.z = -v1.z;
        v1.w = -v1.w;
        dot = -dot;
    }
    const f32 DOT_THRESHOLD = 0.9995f;
    if( dot > DOT_THRESHOLD )
    {
        // if the imputs are too close for comfort, linearly interplate and normalize the result
        out_quaternion = (vec4){ v0.x + ((v1.x - v0.x) * percentage),
                                 v0.y + ((v1.y - v0.y) * percentage),
                                 v0.z + ((v1.z - v0.z) * percentage),
                                 v0.w + ((v1.w - v0.w) * percentage) };
        return vec4_normalize( out_quaternion );
    }
    // since dot is in range [ 0, DOT_THRESHOLD ], acos is safe
    f32 theta_0 = fzy_acos(dot); // theta_0 = angle between input vectors
    f32 theta = theta_0 * percentage; // theta = angle between v0 and result
    f32 sin_theta = fzy_sin(theta); // compute this value only once
    f32 sin_theta_0 = fzy_sin( theta_0); // compute this value only once

    f32 s0 = fzy_cos(theta) - dot * sin_theta / sin_theta_0; // == sin( theta_0 - theta) / sin( theta_0 )
    f32 s1 = sin_theta / sin_theta_0;

    return (vec4){ (v0.x * s0) + (v1.x * s1),
                   (v0.y * s0) + (v1.y * s1),
                   (v0.z * s0) + (v1.z * s1),
                   (v0.w * s0) + (v1.w * s1) };
}

/*
    @brief Compares all elements of a and b and ensures the difference is less than tolerance
    @param a - the first vector
    @param b - the second vector
    @param tolerance - the difference tolerance.  Typically FZY_EPSILON
    @return true if within tolerance
*/
FZY_INLINE const b8 vec4_compare( vec4 a, vec4 b, f32 tolerance )
{
    if( fzy_abs( a.x - b.x ) > tolerance ) { return false; }
    if( fzy_abs( a.y - b.y ) > tolerance ) { return false; }
    if( fzy_abs( a.z - b.z ) > tolerance ) { return false; }
    if( fzy_abs( a.w - b.w ) > tolerance ) { return false; }
    return false;
}

//--------------------------------------------------------------------------------------------------------
// mat3
//--------------------------------------------------------------------------------------------------------
/*
    @brief Creates a new 3x3 matrix
    @param xx - zz - the individual values of each fo the elements
    @return mat3 - a new matrix with elements set to the given values
*/
FZY_INLINE mat3 mat3_create( f32 xx, f32 xy, f32 xz, f32 yx, f32 yy, f32 yz, f32 zx, f32 zy, f32 zz )
{
    return (mat3){ xx, xy, xz, yx, yy, yz, zx, zy, zz };
}

/*
    @brief Creates a matrix that is set to the identity matrix
    @return mat3 - identity matrix
*/
FZY_INLINE mat3 mat3_identity( void )
{
    return (mat3){ 1.0f, 0.0f, 0.0f, 0.0f, 1.0f, 0.0f, 0.0f, 0.0f, 1.0f };
}

/*
    @brief Creates a matrix with all elements set to zero
    @return mat3 - zero matrix
*/
FZY_INLINE mat3 mat3_zero( void )
{
    return (mat3){ 0.0f, 0.0f, 0.0f, 0.0f, 0.0f, 0.0f, 0.0f, 0.0f, 0.0f };
}

/*
    @brief Multiplies the matrices and returns the result
    @param a - the first matrix
    @param b - the second matrix
    @return mat3 - the result
*/
FZY_INLINE mat3 mat3_multiply( mat3 a, mat3 b )
{
    return (mat3){
        a.xx * b.xx + a.xy * b.yx + a.xz * b.zx,
        a.xx * b.xy + a.xy * b.yy + a.xz * b.zy,
        a.xx * b.xz + a.xy * b.yz + a.xz * b.zz,
        a.yx * b.xx + a.yy * b.yx + a.yz * b.zx,
        a.yx * b.xy + a.yy * b.yy + a.yz * b.zy,
        a.yx * b.xz + a.yy * b.yz + a.yz * b.zz,
        a.zx * b.xx + a.zy * b.yx + a.zz * b.zx,
        a.zx * b.xy + a.zy * b.yy + a.zz * b.zy,
        a.zx * b.xz + a.zy * b.yz + a.zz * b.zz
    };
}

/*
    @brief Returns a transposed version fo the provided matrix
    @param m - the matrix to transpose
    @return mat3 - the transposed copy of the matrix
*/
FZY_INLINE mat3 mat3_transpose( mat3 m )
{
  mat3 r;
  r.xx = m.xx;
  r.xy = m.yx;
  r.xz = m.zx;
  r.yx = m.xy;
  r.yy = m.yy;
  r.yz = m.zy;
  r.zx = m.xz;
  r.zy = m.yz;
  r.zz = m.zz;
  return r;
}

/*
    @brief Calculates a skew symmetric matrix for inertia tensors
    @param v - the vector to set a skew sysmmetric for
    @return mat3 - a skew symmetric matrix
*/
FZY_INLINE mat3 mat3_skew_symmetric( vec3 v )
{
    return mat3_create( 0, -v.z, v.y,
                        v.z, 0, -v.x,
                       -v.y, v.x, 0 );
}

/*
    @brief Creates an inverse of the provided matrix
    @param m - the matrix to calculate the inverse of
    @return mat3 - the inverse matrix
*/
FZY_INLINE mat3 mat3_inverse( mat3 m )
{
    f32 det = ((m.xx * m.yy * m.zz) - (m.xx * m.yz * m.zy) -
               (m.xy * m.yx * m.zz) + (m.xz * m.yx * m.zy) +
               (m.xy * m.zx * m.yz) - (m.xz * m.zx * m.yy) );
    if( det == 0 )
    {
        return mat3_zero();
    }
    f32 f = 1.0f / det;
    return (mat3){
         (m.yy * m.zz - m.yz * m.zy) * f,
        -(m.xy * m.zz - m.xz * m.zy) * f,
         (m.xy * m.yz - m.xz * m.yy) * f,
        -(m.yx * m.zz - m.yz * m.zx) * f,
         (m.xx * m.zz - m.xz * m.zx) * f,
        -(m.xx * m.yz - m.xz * m.yx) * f,
         (m.yx * m.zy - m.yy * m.zx) * f,
        -(m.xx * m.zy - m.yy * m.zx) * f,
         (m.xx * m.yy - m.xy * m.yx) * f
    };
}

//--------------------------------------------------------------------------------------------------------
// mat4
//--------------------------------------------------------------------------------------------------------
/*
    @brief Creates an identity matrix
    @return mat4 - the new matrix
*/
FZY_INLINE mat4 mat4_identity( void )
{
    return (mat4){1.0f, 0.0f, 0.0f, 0.0f, 0.0f, 1.0f, 0.0f, 0.0f, 0.0f, 0.0f, 1.0f, 0.0f, 0.0f, 0.0f, 0.0f, 1.0f };
}

/*
    @brief Creates a matrix with all elements set to zero
    @return mat4 - zero matrix
*/
FZY_INLINE mat4 mat4_zero( void )
{
    return (mat4){0.0f, 0.0f, 0.0f, 0.0f, 0.0f, 0.0f, 0.0f, 0.0f, 0.0f, 0.0f, 0.0f, 0.0f, 0.0f, 0.0f, 0.0f, 0.0f };
}

/*
    @brief Calculates the product of the two matrices
    @param a - The first matrix
    @param b - the second matrix
    @return mat4 - the product matrix
*/
FZY_INLINE mat4 mat4_multiply( mat4 a, mat4 b )
{
    mat4 r;
    r.xx = a.xx * b.xx + a.xy * b.yx + a.xz * b.zx + a.xw * b.wx;
    r.xy = a.xx * b.xy + a.xy * b.yy + a.xz * b.zy + a.xw * b.wy;
    r.xz = a.xx * b.xz + a.xy * b.yz + a.xz * b.zz + a.xw * b.wz;
    r.xw = a.xx * b.xw + a.xy * b.yw + a.xz * b.zw + a.xw * b.ww;

    r.yx = a.yx * b.xx + a.yy * b.yx + a.yz * b.zx + a.yw * b.wx;
    r.yy = a.yx * b.xy + a.yy * b.yy + a.yz * b.zy + a.yw * b.wy;
    r.yz = a.yx * b.xz + a.yy * b.yz + a.yz * b.zz + a.yw * b.wz;
    r.yw = a.yx * b.xw + a.yy * b.yw + a.yz * b.zw + a.yw * b.ww;

    r.zx = a.zx * b.xx + a.zy * b.yx + a.zz * b.zx + a.zw * b.wx;
    r.zy = a.zx * b.xy + a.zy * b.yy + a.zz * b.zy + a.zw * b.wy;
    r.zz = a.zx * b.xz + a.zy * b.yz + a.zz * b.zz + a.zw * b.wz;
    r.zw = a.zx * b.xw + a.zy * b.yw + a.zz * b.zw + a.zw * b.ww;

    r.wx = a.wx * b.xx + a.wy * b.yx + a.wz * b.zx + a.ww * b.wx;
    r.wy = a.wx * b.xy + a.wy * b.yy + a.wz * b.zy + a.ww * b.wy;
    r.wz = a.wx * b.xz + a.wy * b.yz + a.wz * b.zz + a.ww * b.wz;
    r.ww = a.wx * b.xw + a.wy * b.yw + a.wz * b.zw + a.ww * b.ww;
  return r;
}

/*
  @brief Creates and returns an orthographic projection matrix. Typically used to
    render flat or 2D scenes.
  @param left - The left side of the view frustum.
  @param right - The right side of the view frustum.
  @param bottom - The bottom side of the view frustum.
  @param top - The top side of the view frustum.
  @param near_clip - The near clipping plane distance.
  @param far_clip - The far clipping plane distance.
  @return mat4 - A new orthographic projection matrix.
*/
FZY_INLINE mat4 mat4_orthographic(f32 left, f32 right, f32 bottom, f32 top, f32 near_clip, f32 far_clip) {
    mat4 out = mat4_identity();

    f32 a = 2.0f / (right - left);
    f32 b = 2.0f / (top - bottom);
    f32 c = -2.0f / (far_clip - near_clip);

    f32 tx = -(right + left)/(right - left);
    f32 ty = -(top + bottom)/(top - bottom);
    f32 tz = -(far_clip + near_clip)/(far_clip - near_clip);
    /*
    f32 lr = 1.0f / (left - right);
    f32 bt = 1.0f / ( bottom - top);
    f32 nf = 1.0f / (near_clip - far_clip);

    out.xx = -2.0f * lr;
    out.yy = -2.0f * bt;
    out.zz = 2.0f * nf;

    out.wx = (left + right) * lr;
    out.wy = (top + bottom) * bt;
    out.wz = (far_clip + near_clip) * nf;
    */
    out.xx = a;
    out.yy = b;
    out.zz = c;
    out.wx = tx;
    out.wy = ty;
    out.wz = tz;
    out.ww =  1;
    return out;
}

/*
  @brief Creates and returns a perspective matrix. Typically used to render 3d scenes.
  @param fov_radians - The field of view in radians.
  @param aspect_ratio - The aspect ratio.
  @param near_clip - The near clipping plane distance.
  @param far_clip - The far clipping plane distance.
  @return mat4 - A new perspective matrix.
*/
FZY_INLINE mat4 mat4_perspective(f32 fov_radians, f32 aspect_ratio, f32 near_clip, f32 far_clip)
{
    f32 half_tan_fov = fzy_tan(fov_radians * 0.5f);
    mat4 out = mat4_zero();
    out.xx = 1.0f / (aspect_ratio * half_tan_fov);
    out.yy = 1.0f / half_tan_fov;
    out.zz = -((far_clip + near_clip) / (far_clip - near_clip));
    out.zw = -1.0f;
    out.wz = -((2.0f * far_clip * near_clip) / (far_clip - near_clip));
    return out;
}

/*
  @brief Creates and returns a look-at matrix, or a matrix looking
    at target from the perspective of position.
  @param position - The position of the matrix.
  @param target - The position to "look at".
  @param up - The up vector.
  @return mat4 - matrix looking at target from the perspective of position.
*/
FZY_INLINE mat4 mat4_look_at(vec3 position, vec3 target, vec3 up)
{
    mat4 out;
    vec3 z_axis;
    z_axis.x = target.x - position.x;
    z_axis.y = target.y - position.y;
    z_axis.z = target.z - position.z;

    z_axis = vec3_normalize( z_axis );
    vec3 x_axis = vec3_normalize( vec3_cross( z_axis, up ) );
    vec3 y_axis = vec3_cross( x_axis, z_axis );

    out.xx = x_axis.x;
    out.xy = y_axis.x;
    out.xz = -z_axis.x;
    out.xw = 0;
    out.yx = x_axis.y;
    out.yy = y_axis.y;
    out.yz = -z_axis.y;
    out.yw = 0;
    out.zx = x_axis.z;
    out.zy = y_axis.z;
    out.zz = -z_axis.z;
    out.zw = 0;
    out.wx = -vec3_dot(x_axis, position);
    out.wy = -vec3_dot(y_axis, position);
    out.wz = vec3_dot(z_axis, position);
    out.ww = 1.0f;

    return out;
}

/*
  @brief Returns a transposed copy of the provided matrix (rows->colums)

  @param matrix - The matrix to be transposed.
  @return mat4 - transposed copy of of the provided matrix.
*/
FZY_INLINE mat4 mat4_transpose( mat4 a )
{
    mat4 out;
    out.xx = a.xx;
    out.xy = a.yx;
    out.xz = a.zx;
    out.xw = a.wx;

    out.yx = a.xy;
    out.yy = a.yy;
    out.yz = a.zy;
    out.yw = a.wy;

    out.zx = a.xz;
    out.zy = a.yz;
    out.zz = a.zz;
    out.zw = a.wz;

    out.wx = a.xw;
    out.wy = a.yw;
    out.wz = a.zw;
    out.ww = a.ww;

    return out;
}

/*
    @brief Creates and returns an inverse of the provided matrix.
    @param matrix - The matrix to be inverted.
    @return mat4 - inverted copy of the provided matrix.
 */
FZY_INLINE mat4 mat4_inverse( mat4 matrix )
{
    const f32* m = matrix.elements;

    f32 t0 = m[10] * m[15];
    f32 t1 = m[14] * m[11];
    f32 t2 = m[6] * m[15];
    f32 t3 = m[14] * m[7];
    f32 t4 = m[6] * m[11];
    f32 t5 = m[10] * m[7];
    f32 t6 = m[2] * m[15];
    f32 t7 = m[14] * m[3];
    f32 t8 = m[2] * m[11];
    f32 t9 = m[10] * m[3];
    f32 t10 = m[2] * m[7];
    f32 t11 = m[6] * m[3];
    f32 t12 = m[8] * m[13];
    f32 t13 = m[12] * m[9];
    f32 t14 = m[4] * m[13];
    f32 t15 = m[12] * m[5];
    f32 t16 = m[4] * m[9];
    f32 t17 = m[8] * m[5];
    f32 t18 = m[0] * m[13];
    f32 t19 = m[12] * m[1];
    f32 t20 = m[0] * m[9];
    f32 t21 = m[8] * m[1];
    f32 t22 = m[0] * m[5];
    f32 t23 = m[4] * m[1];

    mat4 out_matrix;
    f32* o = out_matrix.elements;

    o[0] = (t0 * m[5] + t3 * m[9] + t4 * m[13]) - (t1 * m[5] + t2 * m[9] + t5 * m[13]);
    o[1] = (t1 * m[1] + t6 * m[9] + t9 * m[13]) - (t0 * m[1] + t7 * m[9] + t8 * m[13]);
    o[2] = (t2 * m[1] + t7 * m[5] + t10 * m[13]) - (t3 * m[1] + t6 * m[5] + t11 * m[13]);
    o[3] = (t5 * m[1] + t8 * m[5] + t11 * m[9]) - (t4 * m[1] + t9 * m[5] + t10 * m[9]);

    f32 d = 1.0f / (m[0] * o[0] + m[4] * o[1] + m[8] * o[2] + m[12] * o[3]);

    o[0] = d * o[0];
    o[1] = d * o[1];
    o[2] = d * o[2];
    o[3] = d * o[3];
    o[4] = d * ((t1 * m[4] + t2 * m[8] + t5 * m[12]) - (t0 * m[4] + t3 * m[8] + t4 * m[12]));
    o[5] = d * ((t0 * m[0] + t7 * m[8] + t8 * m[12]) - (t1 * m[0] + t6 * m[8] + t9 * m[12]));
    o[6] = d * ((t3 * m[0] + t6 * m[4] + t11 * m[12]) - (t2 * m[0] + t7 * m[4] + t10 * m[12]));
    o[7] = d * ((t4 * m[0] + t9 * m[4] + t10 * m[8]) - (t5 * m[0] + t8 * m[4] + t11 * m[8]));
    o[8] = d * ((t12 * m[7] + t15 * m[11] + t16 * m[15]) - (t13 * m[7] + t14 * m[11] + t17 * m[15]));
    o[9] = d * ((t13 * m[3] + t18 * m[11] + t21 * m[15]) - (t12 * m[3] + t19 * m[11] + t20 * m[15]));
    o[10] = d * ((t14 * m[3] + t19 * m[7] + t22 * m[15]) - (t15 * m[3] + t18 * m[7] + t23 * m[15]));
    o[11] = d * ((t17 * m[3] + t20 * m[7] + t23 * m[11]) - (t16 * m[3] + t21 * m[7] + t22 * m[11]));
    o[12] = d * ((t14 * m[10] + t17 * m[14] + t13 * m[6]) - (t16 * m[14] + t12 * m[6] + t15 * m[10]));
    o[13] = d * ((t20 * m[14] + t12 * m[2] + t19 * m[10]) - (t18 * m[10] + t21 * m[14] + t13 * m[2]));
    o[14] = d * ((t18 * m[6] + t23 * m[14] + t15 * m[2]) - (t22 * m[14] + t14 * m[2] + t19 * m[6]));
    o[15] = d * ((t22 * m[10] + t16 * m[2] + t21 * m[6]) - (t20 * m[6] + t23 * m[10] + t17 * m[2]));

    return out_matrix;
}

/*
    @brief Creates and returns a translation matrix from the given position.
    @param position - The position to be used to create the matrix.
    @return mat4 - A newly created translation matrix.
*/
FZY_INLINE mat4 mat4_translation(vec3 position )
{
    mat4 out = mat4_identity();
    out.wx = position.x;
    out.wy = position.y;
    out.wz = position.z;
    return out;
}

/*
    @brief Rotates the given vec3 by the matrix rotation, no translation

    @param matrix - The matrix to get rotation from
    @param vec - The vec3 to rotate
    @return vec3 - vector that is rotated by the matrix
*/
FZY_INLINE vec3 mat4_rotate_vec3( mat4 *matrix, vec3 vec )
{
    vec3 r;
    r.x = vec.x * matrix->elements[0] + vec.y * matrix->elements[4] + vec.z * matrix->elements[8];
    r.y = vec.x * matrix->elements[1] + vec.y * matrix->elements[5] + vec.z * matrix->elements[9];
    r.z = vec.x * matrix->elements[2] + vec.y * matrix->elements[6] + vec.z * matrix->elements[10];
    return r;
}

/*
    @brief Returns a scale matrix using the provided scale.
    @param scale - The 3-component scale.
    @return mat4 - scale matrix.
*/
FZY_INLINE mat4 mat4_scale( vec3 scale )
{
    mat4 out = mat4_identity();
    out.xx = scale.x;
    out.yy = scale.y;
    out.zz = scale.z;
    return out;
}


/*
    @brief Returns a forward vector relative to the provided matrix.
    @param a - The matrix from which to base the vector.
    @return vec3 - A 3-component directional vector.
*/
FZY_INLINE vec3 mat4_forward( mat4 a )
{
    vec3 forward;
    forward.x = -a.xz;
    forward.y = -a.yz;
    forward.z = -a.zz;
    return vec3_normalize( forward );
}

/*
    @brief Returns a backward vector relative to the provided matrix.
    @param a  - The matrix from which to base the vector.
    @return vec3 - A 3-component directional vector.
*/
FZY_INLINE vec3 mat4_backward( mat4 a )
{
    vec3 backward;
    backward.x = a.xz;
    backward.y = a.yz;
    backward.z = a.zz;
    return vec3_normalize( backward );
}

/*
    @brief Returns a upward vector relative to the provided matrix.
    @param a - The matrix from which to base the vector.
    @return vec3 - A 3-component directional vector.
*/
FZY_INLINE vec3 mat4_up( mat4 a )
{
    vec3 up;
    up.x = a.xy;
    up.y = a.yy;
    up.z = a.zy;
    return vec3_normalize( up );
}

/*
    @brief Returns a downward vector relative to the provided matrix.
    @param a - The matrix from which to base the vector.
    @return vec3 - A 3-component directional vector.
*/
FZY_INLINE vec3 mat4_down( mat4 a )
{
    vec3 down;
    down.x = -a.xy;
    down.y = -a.yy;
    down.z = -a.zy;
    return vec3_normalize( down );
}

/*
    @brief Returns a left vector relative to the provided matrix.
    @param a - The matrix from which to base the vector.
    @return vec3 - A 3-component directional vector.
*/
FZY_INLINE vec3 mat4_left( mat4 a )
{
    vec3 left;
    left.x = -a.xx;
    left.y = -a.yx;
    left.z = -a.zx;
    return vec3_normalize( left );
}

/*
    @brief Returns a right vector relative to the provided matrix.
    @param a - The matrix from which to base the vector.
    @return vec3 - A 3-component directional vector.
*/
FZY_INLINE vec3 mat4_right(mat4 a )
{
    vec3 right;
    right.x = a.xx;
    right.y = a.yx;
    right.z = a.zx;
    return vec3_normalize( right );
}


/*
    @brief Returns a transformation matrix created from the position scale and rotation
    @param position - Position to use
    @param scale - Scale to use
    @param rotation - Rotation to use
    @return mat4 - A transformation mat4
*/
FZY_INLINE mat4 mat4_create_transform( vec3 position, vec3 scale, vec3 rotation )
{
    vec4 x = vec4_create( 1, 0, 0, rotation.x );
    vec4 y = vec4_create( 0, 1, 0, rotation.y );
    vec4 z = vec4_create( 0, 0, 1, rotation.z );
    vec4 n = vec4_multiply( z, y );
    n = vec4_multiply( n, x );
    n = vec4_normalize( n );

    mat4 out = mat4_identity();

    out.xx = ( 1.0f - 2.0f * n.y * n.y - 2.0f * n.z * n.z ) * scale.x;
    out.xy = ( 2.0f * n.x * n.y - 2.0f * n.z * n.w ) * scale.x;
    out.xz = ( 2.0f * n.x * n.z + 2.0f * n.y * n.w ) * scale.x;

    out.yx = ( 2.0f * n.x * n.y + 2.0f * n.z * n.w ) * scale.y;
    out.yy = ( 1.0f - 2.0f * n.x * n.x - 2.0f * n.z * n.z ) * scale.y;
    out.yz = ( 2.0f * n.y * n.z - 2.0f * n.x * n.w ) * scale.y;

    out.zx = ( 2.0f * n.x * n.z - 2.0f * n.y * n.w ) * scale.z;
    out.zy = ( 2.0f * n.y * n.z + 2.0f * n.x * n.w ) * scale.z;
    out.zz = ( 1.0f - 2.0f * n.x * n.x - 2.0f * n.y * n.y ) * scale.z;

    out.wx = position.x;
    out.wy = position.y;
    out.wz = position.z;

    return out;
}


/*
    @brief Creates a rotation matrix from the given quaternion.
    @param q - The quaternion to be used.
    @return mat4 - A rotation matrix.
*/
FZY_INLINE mat4 vec4_to_mat4( vec4 q )
{
    mat4 out = mat4_identity();

    // https://stackoverflow.com/questions/1556260/convert-quaternion-rotation-to-rotation-matrix

    vec4 n = vec4_normalize( q );

    out.xx = 1.0f - 2.0f * n.y * n.y - 2.0f * n.z * n.z;
    out.xy = 2.0f * n.x * n.y - 2.0f * n.z * n.w;
    out.xz = 2.0f * n.x * n.z + 2.0f * n.y * n.w;

    out.yx = 2.0f * n.x * n.y + 2.0f * n.z * n.w;
    out.yy = 1.0f - 2.0f * n.x * n.x - 2.0f * n.z * n.z;
    out.yz = 2.0f * n.y * n.z - 2.0f * n.x * n.w;

    out.zx = 2.0f * n.x * n.z - 2.0f * n.y * n.w;
    out.zy = 2.0f * n.y * n.z + 2.0f * n.x * n.w;
    out.zz = 1.0f - 2.0f * n.x * n.x - 2.0f * n.y * n.y;

    return out;
}

/*
    @brief Calculates a rotation matrix based on the quaternion and the passed in center point.

    @param q - The quaternion.
    @param center - The center point.
    @return mat4 - A rotation matrix.
*/
FZY_INLINE mat4 vec4_to_rotation_matrix(vec4 q, vec3 center )
{
    mat4 out;

    f32* o = out.elements;
    o[0] = (q.x * q.x) - (q.y * q.y) - (q.z * q.z) + (q.w * q.w);
    o[1] = 2.0f * ((q.x * q.y) + (q.z * q.w));
    o[2] = 2.0f * ((q.x * q.z) - (q.y * q.w));
    o[3] = center.x - center.x * o[0] - center.y * o[1] - center.z * o[2];

    o[4] = 2.0f * ((q.x * q.y) - (q.z * q.w));
    o[5] = -(q.x * q.x) + (q.y * q.y) - (q.z * q.z) + (q.w * q.w);
    o[6] = 2.0f * ((q.y * q.z) + (q.x * q.w));
    o[7] = center.y - center.x * o[4] - center.y * o[5] - center.z * o[6];

    o[8] = 2.0f * ((q.x * q.z) + (q.y * q.w));
    o[9] = 2.0f * ((q.y * q.z) - (q.x * q.w));
    o[10] = -(q.x * q.x) - (q.y * q.y) + (q.z * q.z) + (q.w * q.w);
    o[11] = center.z - center.x * o[8] - center.y * o[9] - center.z * o[10];

    o[12] = 0.0f;
    o[13] = 0.0f;
    o[14] = 0.0f;
    o[15] = 1.0f;
    return out;
}

/*
    @brief Transforms a vec3 by the given mat4

    @param m - The matrix to transfrom by
    @param v - The vector to transfrom
    @return vec3 - copy of the vector transformed by m
*/
FZY_INLINE vec3 mat4_transform_vec3( mat4 m, vec3 v )
{
    vec3 result;
    result.x = v.x * m.xx + v.y * m.yx + v.z * m.zx + m.wx;
    result.y = v.x * m.xy + v.y * m.yy + v.z * m.zy + m.wy;
    result.z = v.x * m.xz + v.y * m.yz + v.z * m.zz + m.wz;
    return result;
}

FZY_INLINE vec3 mat4_transform_transpose_vec3( mat4 m, vec3 v )
{
    vec3 t = vec3_create( v.x - m.wx, v.y - m.wy, v.z - m.wz );
    return (vec3){ t.x * m.xx + t.y * m.xy + t.z * m.xz,
                    t.x * m.yx + t.y * m.yy + t.z * m.yz,
                    t.x * m.zx + t.y * m.zy + t.z * m.zz };
}


#endif // FZY_MATH_H
