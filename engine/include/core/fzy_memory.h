#ifndef FZY_MEMORY_H
#define FZY_MEMORY_H

#include "defines.h"

/* @brief Tags to indicate the usage of memory allocations made in this system. */
typedef enum fzy_memory_tag {
    // For temporary use. Should be assigned one of the below or have a new tag created.
    MEM_TAG_UNKNOWN = 0,
    MEM_TAG_RENDERER,
    MEM_TAG_TEXTURE,
    MEM_TAG_SHADER,
    MEM_TAG_MATERIAL,
    MEM_TAG_MESH,
    MEM_TAG_STRING,
    MEM_TAG_EVENT,
    MEM_TAG_FILE,
    MEM_TAG_HASHTABLE,
    MEM_TAG_INPUTS,
    MEM_TAG_VIEW,
    MEM_TAG_ENTITY,
    MEM_TAG_COMPONENT,
    MEM_TAG_PROCESS,

    MEM_TAG_MAX_TAGS

} fzy_memory_tag;

/*
  @brief Initializes the memory system
*/
b8 memory_initialize( );

/*
  @brief Shutdowns the memory system
*/
b8 memory_shutdown( );

/*
  @brief Preforms a memory allocation from the host of the given size. Tracked by memory_tag
  @param size - size in bytes to be allocated
  @param tag - indicates the use of the block
  @returns Pointer to the allocated memory
*/
FZY_API void* memory_allocate( u64 size, fzy_memory_tag tag );

/*
  @brief Frees the block of memory
  @param block - the memory to be free
  @param size - size in bytes to be freed
  @param tag - indicates the use of the memory block
*/
FZY_API void memory_delete( void *block, u64 size, fzy_memory_tag tag );

/*
  @brief Reallocates the memory to the new size
  @param block The memory block to reallocate
  @param old_size The size of the block before reallocation
  @param new_size The size the block is reallocating to
  @param tag The memory tag for the allocation
  @return Pointer to the memory block
*/
FZY_API void* memory_reallocate( void* block, u64 old_size, u64 new_size, fzy_memory_tag tag );

/*
  @brief Compares the data at the two address and returns 0 if equal
  @param add1 Pointer to the address of the 1st element
  @param add2 Pointer to the address of the 2nd element
  @return 0 if equal, - or + otherwise
*/
FZY_API i32 memory_compare( void* add1, void *add2, u64 size );

/*
  @brief Set the memory block to zero
  @param block - the memory block to be zeroed
  @param size - size in bytes to be zeroed
  @return Pointer to the zeroed memory
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
