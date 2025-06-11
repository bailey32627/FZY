#ifndef FZY_HASHTABLE_H
#define FZY_HASHTABLE_H

#include "defines.h"

/**
  @brief Represents a hashtable for fast lookups, uses chaining for
      collision resolution
*/
typedef struct hashtable_t hashtable;


/**
  @brief Creates a new hashtable and returns a pointer to it
  @param capacity The initialize size of the table
  @param memory_tag The memory scope to assign this table to
  @param destroy_func Function to free memory held in the table
  @return Pointer to the hashtable
*/
FZY_API hashtable *hashtable_create( u32 capacity, void (*destroy_func)(void*) );

/**
  @brief Frees the hashtable, has the ability to provide a free function for the data
    stored in the table
  @param table - The table to be freed
*/
FZY_API void hashtable_set( hashtable *table, const char *key, void* value );

/**
  @brief Retrieve the value stored at the key in the hashtable
  @param table - the hashtabel to access
  @param key - the key to access
  @return Ptr - pointer to the element at the key
*/
FZY_API void *hashtable_get( hashtable *table, const char* key );

/**
  @brief Removes the value at the key and returns it
    sets the value at the key to null
  @param table - The table to access
  @param key - the key to remove
*/
FZY_API void hashtable_remove( hashtable* table, const char* key );

#endif // FZY_HASHTABLE_H
