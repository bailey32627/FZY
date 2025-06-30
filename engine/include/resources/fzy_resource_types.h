#ifndef FZY_RESOURCE_TYPES_H
#define FZY_RESOURCE_TYPES_H

#include "defines.h"
#include "math/fzy_math.h"


#define MAX_VBOS 12

#define ASCII_SPACE 32
#define DESIRED_PADDING 5
#define MAX_WORD_CHARACTERS 32
#define MAX_WORDS 32

struct vector;
typedef struct vector_t vector;

/**
  @brief Represents an image loaded from stb_lib
*/
typedef struct image
{
  i32 width;      // holds the width of the image
  i32 height;     // holds the height of the image
  i32 channels;   // holds the number of channels used for the image
  u8 *pixels;     // hold the array of pixels for the image

} image;
// -----------------------------------------------------------------------

/**
  @brief Represents the texture attachments for a frame buffer
*/
typedef enum attachment
{
  ATTACHMENT_POSITION = 0,
  ATTACHMENT_NORMAL,
  ATTACHMENT_COLOR,
  ATTACHMENT_DEPTH,
  ATTACHMENT_TOTAL

} attachment;
// -------------------------------------------------------------------------

/**
  @brief Describes data in a uniform, Placed here to expose to all shader types
*/
typedef enum uniform_type
{
  UNIFORM_TYPE_INT = 0,
  UNIFORM_TYPE_FLOAT,
  UNIFORM_TYPE_VEC2,
  UNIFORM_TYPE_VEC3,
  UNIFORM_TYPE_VEC4,
  UNIFORM_TYPE_MAT3,
  UNIFORM_TYPE_MAT4

} uniform_type;
// ---------------------------------------------------------------------------

/**
  @brief Represents a generic shader, implement in the backend
*/
typedef struct shader
{
  void *internal_data;   // data maintained by the backend

} shader;
// ---------------------------------------------------------------------------

/**
  @brief Represents a generic texture
*/
typedef struct texture
{
  void *internal_data;

} texture;
// ----------------------------------------------------------------------------

/**
  @brief Represents a material used for renderering
*/
typedef struct material
{
  texture *albedo;      // texture to apply
  texture *normal_map;   // texture to use as the normal map or 0 if not used
  u32 texture_index;     // index into the texture atlas or 1 if not a atlas
  u32 normal_index;      // the index used if the normal map is an atlas, 1 otherwise
  f32 reflectivity;      // 0 - 1 value indicating the reflectivity of the material

} material;
// ----------------------------------------------------------------------------

/**
  @brief Variables defined by the backend
*/
extern const u32 FZY_BYTE;
extern const u32 FZY_UBYTE;
extern const u32 FZY_INT;
extern const u32 FZY_UINT;
extern const u32 FZY_SHORT;
extern const u32 FZY_USHORT;
extern const u32 FZY_FLOAT;
extern const u32 FZY_DOUBLE;
// ----------------------------------------------------------------------------

/**
@brief Represents a vertex buffer to be passed to the gpu, should represent just once
  element of a vertex, such as position, then another buffer for normals, texcoords, tangents, ect
*/
typedef struct vertex_buffer
{
  vector *vertices;    // array of vertices
  u32 capacity;        // the max number of vertices in the array
  u32 stride;          // the stride in bytes of each vertex
  u32 layout;          // Indicates the layout of the data type ( vec3 = 3, vec2 = 2, vec4 = 4 )
  u32 type;            // Indicates the type of data help in each vertex (vec3 = FZY_FLOAT, ivec2 = FZY_INT, etc )
  u8 is_uploaded;      // Indicates if the vertex buffer has been upladed internally
  void *internal_data; // pointer to data maintained by the back end
  b8 dirty;            // indicates that the buffer needs to be uploaded again

} vertex_buffer;
// ----------------------------------------------------------------------------

/**
  @brief Represents geometry used vertex buffer with textures in the engine
*/
typedef struct mesh
{
  vector *elements;                     // the index buffer array for the geometry if it has one
  vertex_buffer * buffers[ MAX_VBOS ];  // the vertex buffer objects used to draw this
  u32 capacity;                         // the max number of elements loaded in the ibo
  u32 vertex_count;                     // the number of vertices each buffer must have
  u32 buffer_count;                     // the number of buffers held
  b8 is_valid;                          // Indicates that the geomtry is ready to draw
  void *internal_data;                  // internal resources used by the backend

} mesh;
// ----------------------------------------------------------------------------


#endif // FZY_RESOURCE_TYPES_H
