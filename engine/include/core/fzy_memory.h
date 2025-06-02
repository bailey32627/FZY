#ifndef FZY_MEMORY_H
#define FZY_MEMORY_H

#include "../defines.h"

/*
  @brief Tags to indicate the usage of memory allocations made in this system
*/
typedef enum memory_tag {
  MEMORY_TAG_UNKNOWN = 0, // for temporary use, should be assigned to one of the below or have a new tag created
  MEMORY_TAG_APPLICATION,
  MEMORY_TAG_RENDERER,
  MEMORY_TAG_TEXTURE,
  MEMORY_TAG_SHADER,
  MEMORY_TAG_MATERIAL,
  MEMORY_TAG_MESH,
  MEMORY_TAG_STRING,
  MEMORY_TAG_EVENT,
  MEMORY_TAG_FILE,
  MEMORY_TAG_HASHTABLE,
  MEMORY_TAG_INPUTS,
  MEMORY_TAG_GUI,
  MEMORY_TAG_ENTITY,
  MEMORY_TAG_COMPONENT,
  MEMORY_TAG_PROCESS,

  MEMORY_TAG_MAX_TAGS
} memory_tag;

/* @brief Initializes the memory system */
FZY_API void memory_initialize( );

/* @brief Shuts down the memory system and ensures all memory is freed */
FZY_API void memory_shutdown( );

/* @brief Preforms a memory allocation from the host o fthe given size.  Tracked by memory_tag
   @param size - the size in bytes to be allocated
   @param tag - indicates the use of the memory block
   @return pointer to the allocated memory
*/
FZY_API void* memory_allocate( u64 size, memory_tag tag );

/*
  @brief Frees the block of memory
  @param block - the memory to be freed
  @param size - the size in bytes to be freed
  @param tag - indicates the use fo the memeory block
*/
FZY_API void memory_delete( void* block, u64 size, memory_tag tag );

/*
  @brief Reallocates the memory to the new size
  @param block - the memory block to reallocate
  @param old_size - the size of the block before reallocation
  @param new_size - the size the block is reallocating to
  @param tag - the memory tag for the allocation
  @return pointer to the memory block
*/
FZY_API void* memory_reallocate( void *block, u64 old_size, u64 new_size, memory_tag tag );

/*
  @brief Compares the data at the two address and returns 0 if equal
  @param add1 - painter to the address of the 1st element
  @param add2 - pointer to the address of the 2nd element
  @return 0 if equal, - or + otherwise
*/
FZY_API i32 memory_compare( void* add1, void *add2, u64 size );

/*
  @brief Sets the memory block to zero
  @param block - the memory block to be zeroed
  @param size - the size in bytes to be zeroed
  @return Pointer to the zeroed memeory block
*/
FZY_API void* memory_zero( void *block, u64 size );

/*
  @brief Copy the memory from the source to the dest
  @param dest - location to copy memory to
  @param source - memory to copy
  @param size - size in bytes to copy
  @return Pointer to the dest
*/
FZY_API void* memory_copy( void *dest, const void *source, u64 size );

/*
  @brief Sets the memory to the value given
  @param dest - pointer to the memory to set
  @param value - int value to set the memory to
  @param size - size of the memory in bytes to set
  @return Pointer to the dest
*/
FZY_API void *memory_set( void *dest, i32 value, u64 size );

/*
  @brief Obtains a string containing a "printout" of memory usage, categorized by
    memory tag. The memory should be freed by the caller.
  @returns The total count of allocations since the system's initialization.
*/
FZY_API char* memory_get_usage_str( );



#endif // FZY_MEMORY_H
