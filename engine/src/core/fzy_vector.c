#include "core/fzy_vector.h"

#include "core/fzy_memory.h"
#include "core/fzy_logger.h"

/* @brief Represents a vector in the engine. Holds what memory type it belongs to */
typedef struct vector_t
{
  u64 size;        // The size of each element in the array
  u32 capacity;    // The capacity of the array
  u32 count;       // The number of elements in the array
  u16 memory_tag;  // The memeory group the vector belongs to
  void *data;      // The data array

} vector;

// returns a pointer to the address in vector memory
static inline void *vector_offset( vector *vector, u64 idx )
{
  return (void*)((u8*)vector->data + (idx * vector->size ) );
} // ---------------------------------------------------------------------------

vector* vector_create(u64 element_size, u32 capacity, u16 memory_tag)
{
  vector* v = memory_allocate(sizeof(vector), memory_tag);
  if (!v) return 0;

  v->size = element_size;
  v->count = 0;
  v->capacity = capacity;
  v->memory_tag = memory_tag;
  v->data = memory_allocate(v->size * v->capacity, memory_tag);
  if (!v->data) {
      memory_delete(v, sizeof(vector), memory_tag);
      return 0;
  }
  return v;
} // ---------------------------------------------------------------------------

void vector_destroy( vector *vector )
{
  if( !vector ) return;
  if( vector->data )
  {
    memory_delete(vector->data, vector->size * vector->capacity, vector->memory_tag);
    vector->data = 0;
  }
  memory_delete(vector, sizeof(vector), vector->memory_tag);

} // ---------------------------------------------------------------------------

void vector_push( vector *vector, void *element )
{
  #ifdef FZY_CONFIG_DEBUG
    if( vector == 0 ) FZY_ERROR( "fzy_vector_push :: vector is null." );
  #endif

  u8 *pos = 0;
  // grow the vector
  if( vector->count == vector->capacity )
  {
    u64 new_size = vector->size * vector->capacity * 2;
    void *new_data = memory_reallocate( vector->data, vector->size * vector->capacity, new_size, vector->memory_tag );
    if( !new_data )
    {
      FZY_ERROR( "fzy_vector_push :: failed to reallocate data array." );
    }
    vector->data = new_data;
    vector->capacity *= 2;
  }

  pos = (u8*)vector->data + (vector->count * vector->size );
  pos = memory_copy( pos, element, vector->size );
  if( !pos )
  {
    FZY_ERROR( "fzy_vector_push :: failed to copy the element into the data array." );
  }
  vector->count++;
} // ---------------------------------------------------------------------------

void vector_pop( vector *vector )
{
  #ifdef FZY_CONFIG_DEBUG
    if( vector == 0 ) FZY_ERROR( "fzy_vector_pop :: vector is null." );
  #endif

  if( vector->count > 0 )
    vector_remove_index( vector, vector_size( vector ) - 1 );
} // ---------------------------------------------------------------------------

void *_vector_get( vector *vector, u32 index )
{
  #ifdef FZY_CONFIG_DEBUG
    if( vector == 0 ) FZY_ERROR( "_vector_get :: vector is null." );
  #endif
  if( index < vector->count )
  {
    return vector_offset( vector, index );
  }
  return 0;
} // ---------------------------------------------------------------------------

void vector_remove( vector *vector, void *element )
{
  #ifdef FZY_CONFIG_DEBUG
    if( vector == 0 ) FZY_ERROR( "fzy_vector_remove :: vector is null." );
  #endif

  u8* pos = (u8*)vector->data;
  for (u32 i = 0; i < vector->count; ++i)
  {
    if (memory_compare(pos, element, vector->size) == 0)
    {
      u32 count = vector->capacity - i - 1;
      u64 remainder = count * vector->size;
      if (!memory_copy(pos, pos + vector->size, remainder))
      {
        FZY_ERROR("fzy_vector_remove :: failed to copy memory.");
      }
      vector->count--;
      return;
    }
    pos += vector->size;
  }
} // ---------------------------------------------------------------------------

void vector_remove_index( vector *vector, u32 index )
{
  #ifdef FZY_CONFIG_DEBUG
    if( vector == 0 ) FZY_ERROR( "fzy_vector_remove_index :: vector is null." );
  #endif

  if( index < vector->count )
  {
    u8 *pos = (u8*)vector_offset( vector, index );
    u32 count = vector->capacity - index - 1;
    u64 remainder = count * vector->size;
    pos = memory_copy( pos, pos + vector->size, remainder );
    if( !pos )
    {
      FZY_ERROR( "fzy_vector_remove_index :: failed to copy memory" );
    }
    vector->count--;
  }
} // ---------------------------------------------------------------------------

u32 vector_size( vector *vector )
{
  #ifdef FZY_CONFIG_DEBUG
    if( vector == 0 ) FZY_ERROR( "fzy_vector_size :: vector is null." );
  #endif
  return vector->count;
} // ---------------------------------------------------------------------------

u32 vector_capacity( vector *vector )
{
  #ifdef FZY_CONFIG_DEBUG
    if( vector == 0 ) FZY_ERROR( "fzy_vector_capacity :: vector is null." );
  #endif
  return vector->capacity;
} // ---------------------------------------------------------------------------

void vector_clear( vector *vector )
{
  #ifdef FZY_CONFIG_DEBUG
    if( vector == 0 ) FZY_ERROR( "fzy_vector_clear :: vector is null." );
  #endif
  vector->count = 0;
} // ---------------------------------------------------------------------------

void vector_shrink( vector *vector )
{
  #ifdef FZY_CONFIG_DEBUG
    if( vector == 0 ) FZY_ERROR( "fzy_vector_shrink :: vector is null." );
  #endif
  if( vector->count == vector->capacity )
  {
    return;
  }

  void* new_data = memory_reallocate( vector->data,
                                      vector->size * vector->capacity,
                                      vector->size * vector->count,
                                      vector->memory_tag );

  if( new_data )
  {
    vector->data = new_data;
    vector->capacity = vector->count;
  }
} // ---------------------------------------------------------------------------

void vector_fill( vector *vector, void *data, u32 count )
{
  #ifdef FZY_CONFIG_DEBUG
    if( vector == 0 ) FZY_ERROR( "fzy_vector_fill :: vector is null." );
  #endif

  if( vector->capacity < count )
  {
    u64 new_size = vector->size * count;
    vector->capacity = count;
    void* new_data = memory_reallocate( vector->data, vector->size * vector->capacity, new_size, vector->memory_tag );
    if( !new_data )
    {
      FZY_ERROR( "fzy_vector_fill :: failed to reallocate data array." );
    }
    memory_copy( vector->data, new_data, vector->size * count );
    vector->count = count;
  }
} // ---------------------------------------------------------------------------

u32 vector_stride( vector* vector )
{
  return (u32)vector->size;
} // ---------------------------------------------------------------------------

void* _vector_data( vector* vector )
{
  return vector->data;
} // ---------------------------------------------------------------------------
