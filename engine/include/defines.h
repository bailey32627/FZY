#ifndef FZY_DEFINES_H
#define FZY_DEFINES_H

#include <stdint.h>

// unsigned int types
typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;
typedef uint64_t u64;

// signed int types
typedef signed char i8;
typedef signed short i16;
typedef signed int i32;
typedef int64_t i64;

// floating point types
typedef float f32;
typedef double f64;

// boolean types
typedef int b32;
typedef _Bool b8;

#define bitmask_set( mask, type ) mask |= (1 << type )
#define bitmask_remove( mask, type ) mask &= ~( 1 << type )
#define bitmask_test( mask, type ) mask & ( 1 << type )
#define bitmask_check( mask, other ) (mask & other ) == other

// properly define static assertions
#if defined(__clang__) || defined(__gcc__)
/* @brief Static assertion */
#define STATIC_ASSERT _Static_assert
#else
/* @brief Static assertion */
#define STATIC_ASSERT static_assert
#endif

// Ensure all types are of the correct size
/* @brief assert u8 is 1 byte */
STATIC_ASSERT( sizeof( u8 ) == 1, "Expected u8 to be 1 byte." );

/* @brief assert u16 is 2 byte */
STATIC_ASSERT( sizeof( u16 ) == 2, "Expected u16 to be 2 bytes." );

/* @brief assert u32 is 4 byte */
STATIC_ASSERT( sizeof( u32 ) == 4, "Expected u32 to be 4 bytes." );

/* @brief assert u64 is 8 byte */
STATIC_ASSERT( sizeof( u64 ) == 8, "Expected u64 to be 8 bytes." );

/* @brief Assert i8 to be 1 byte.*/
STATIC_ASSERT(sizeof(i8) == 1, "Expected i8 to be 1 byte.");

/* @brief Assert i16 to be 2 bytes.*/
STATIC_ASSERT(sizeof(i16) == 2, "Expected i16 to be 2 bytes.");

/* @brief Assert i32 to be 4 bytes.*/
STATIC_ASSERT(sizeof(i32) == 4, "Expected i32 to be 4 bytes.");

/* @brief Assert i64 to be 8 bytes.*/
STATIC_ASSERT(sizeof(i64) == 8, "Expected i64 to be 8 bytes.");

/* @brief Assert f32 to be 4 bytes.*/
STATIC_ASSERT(sizeof(f32) == 4, "Expected f32 to be 4 bytes.");

/* @brief Assert f64 to be 8 bytes.*/
STATIC_ASSERT(sizeof(f64) == 8, "Expected f64 to be 8 bytes.");

/* @brief True */
#define true 1

/* @brief False */
#define false 0

#ifdef FZY_PLATFORM_WINDOWS
#ifdef FZY_EXPORTS
#define FZY_API __declspec( dllexport )
#else
#define FZY_API __declspec( dllimport )
#endif
#else
#define FZY_API
#endif

#if defined(__clang__) || defined(__GNUC__)
  /** @brief Inline qualifier */
  #define FZY_INLINE __attribute__((always_inline)) inline

  /** @brief No-inline qualifier */
  #define FZY_NOINLINE __attribute__((noinline))

#elif defined(_MSC_VER)
  /** @brief Inline qualifier */
  #define FZY_INLINE __forceinline

  /** @brief No-inline qualifier */
  #define FZY_NOINLINE __declspec(noinline)

#else
  /** @brief Inline qualifier */
  #define FZY_INLINE static inline

  /** @brief No-inline qualifier */
  #define FZY_NOINLINE /* fallback: no-op */

#endif

/*
    @Brief Defines the mathematics types used in the engine
*/
/* @brief a 2 element vector holding int values */
typedef union ivec2
{
    i32 elments[ 2 ];
    struct
    {
        union
        {
            // first element by different identifiers
            i32 x, w;
        };
        union
        {
            // second element by different identifiers
            i32 y, h;
        };
    };
} ivec2;

/* @brief a 2 element vector holding float values */
typedef union vec2
{
    f32 elements[ 2 ];
    struct
    {
        union
        {
            // first element by different identifiers
            f32 x, r, s, u;
        };
        union
        {
            // second element by different identifiers
            f32 y, g, t, v;
        };
    };
} vec2;

/* @brief a 3 element vector holding float values */
typedef union vec3
{
    f32 elements[ 3 ];
    struct
    {
        union
        {
            // first element by different identifiers
            f32 x, r, s, u;
        };
        union
        {
            // second element by different identifiers
            f32 y, g, t, v;
        };
        union
        {
            // third element by different identifiers
            f32 z, b;
        };
    };
} vec3;

/* @brief a 4 element vector holding float values ( Quaternion )*/
typedef union vec4
{
    f32 elements[ 4 ];
    struct
    {
        union
        {
            // first element by different identifiers
            f32 x, r, s, u;
        };
        union
        {
            // second element by different identifiers
            f32 y, g, t, v;
        };
        union
        {
            // third element by different identifiers
            f32 z, b;
        };
        union
        {
            // forth element by different identifiers
            f32 w, a;
        };
    };
} vec4;

/* @brief a 3x3 matrix, typically used to represent inertia tensors. */
typedef union mat3
{
    f32 elements[ 9 ];
    struct
    {
        f32 xx, xy, xz;
        f32 yx, yy, yz;
        f32 zx, zy, zz;
    };

} mat3;

/* @brief a 4x4 matrix, typically used to represnt object transformations */
typedef union mat4
{
    f32 elements[ 16 ];
    struct
    {
        f32 xx, xy, xz, xw;
        f32 yx, yy, yz, yw;
        f32 zx, zy, zz, zw;
        f32 wx, wy, wz, ww;
    };
} mat4;

#endif // FZY_DEFINES_H
