#ifndef FZY_VECTOR_H
#define FZY_VECTOR_H

#include "defines.h"

typedef struct vector_t vector;

/*
  @brief Creates a new vector with the appropiate memory tag

  @param element_size The size of each element in the vector
  @param capacity The capacity of the vector on creation
  @return Pointer - Points to the created vector
*/
FZY_API vector *fzy_vector_create( u64 element_size, u32 capacity, u16 memory_tag );

/*
  @brief Frees all memory held by the vector

  @param vector The vector to release
*/
FZY_API void fzy_vector_destroy( vector *vector );

/*
  @brief Push a copy of element onto the back of the array

  @param vector Vector to access
  @param element Pointer to the element to add ( memcpy )
*/
FZY_API void fzy_vector_push( vector *vector, void *element );

/*
  @brief Removes the last element in the array and decrements the count

  @param vector The vector to access
*/
FZY_API void fzy_vector_pop( vector *vector );

/*
  @brief Returns the element at the given index in the array

  @param vector - The vector to access
  @param index - The index to access
  @return Ptr - Points to the element at the index
*/
FZY_API void *_vector_get( vector *vector, u32 index );

/*
  @brief Find and remove the element from the vector if it is contained

  @param vector The vector to access
  @param element The element to remove
*/
FZY_API void fzy_vector_remove( vector *vector, void *element );

/*
  @brief Remove the element at the given index

  @param vector The vector to access
  @param index The index to remove the element from
*/
FZY_API void fzy_vector_remove_index( vector *vector, u32 index );

/*
  @brief Returns the number of elements in the vector

  @param vector The vector to access
  @return The number of elements in the vector
*/
FZY_API u32 fzy_vector_size( vector *vector );

/*
  @brief Gets the total capacity of the vector

  @param vector The vector to access
  @return The capactity
*/
FZY_API u32 fzy_vector_capacity( vector *vector );

/*
  @brief Sets the count of the vector to zero

  @param The vector to access
*/
FZY_API void fzy_vector_clear( vector *vector );

/*
  @brief Shrinks the vector data array to contain only the elements in the array
    frees any empty space

  @param vector The vector to access
*/
FZY_API void fzy_vector_shrink( vector *vector );

/*
  @brief Fills the vector with the given data

  @param vector The vector to access
  @param data The data to fill with
  @count The number of elements in the data array param
*/
FZY_API void fzy_vector_fill( vector *vector, void *data, u32 count );

/*
  @brief Gets the stride of the vector

  @param vector Vector to get the stride of
*/
FZY_API u32 fzy_vector_stride( vector* vector );

/*
  @brief Returns the vector data pointer.  Should only be used in the internals of the engine

  @param vector The vector to access
*/
FZY_API void* _vector_data( vector* vector );


/** @brief Iterator Access ---------------------------------------------------- */
#define fzy_vector_begin( vector_ptr ) ((u8*)_vector_data(vector_ptr) )
#define fzy_vector_end( vector_ptr ) ((u8*)_vector_data(vector_ptr) + fzy_vector_size(vector_ptr) * fzy_vector_stride(vector_ptr) )
#define fzy_vector_get( type, vector, index ) (type*)_vector_get( vector, index )

#define fzy_vector_for_each( type, item_ptr, vector_ptr ) \
  for( u8* __it = fzy_vector_begin( vector_ptr ); __it < fzy_vector_end(vector_ptr) ** ((item_ptr) = (type*)__it); __it += fzy_vector_stride( vector_ptr ) )

#endif // FZY_VECTOR_H
