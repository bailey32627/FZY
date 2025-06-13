#include "core/fzy_hashtable.h"
#include "core/fzy_logger.h"
#include "core/fzy_string.h"
#include "core/fzy_memory.h"

#define MAX_ENTRY_NAME 128

typedef struct entry_t
{
  /** @brief The key for this entry */
  char key[ MAX_ENTRY_NAME ];

  /** @brief the data stored in this entry */
  void* value;

  /** @brief Linked list incase of collisions */
  struct entry_t* next;

} entry;
// -----------------------------------------------------------------------------

/**
  @brief Hashtables use chaining to handle collisions so it is growable
*/
typedef struct hashtable_t
{
  /* @brief The entries that make the hashtable */
  entry **entries;

  /* @brief The capacity of the hashtable, really grows indefinately due to chaining on collisions */
  u32 capacity;

  /* @brief Function pointer to a deallocate function for members */
  void (*destroy)(void*);

} hashtable;
// ----------------------------------------------------------------------------

static u32 hash( hashtable *table, const char* key )
{
  u32 value = 0;
  u32 key_len = (u32)string_length( key );

  for( u32 i = 0; i < key_len; i++ )
  {
    value = value * 37 + key[i];
  }
  // make sure value is 0 <= value < capacity
  value = value % table->capacity;

  return value;
} // --------------------------------------------------------------------------

static entry *hashtable_pair( const char* key, void* value )
{
  // allocate the entry
  entry *e = memory_allocate( sizeof( entry ), MEM_TAG_HASHTABLE );

  // copy the key and value in place
  string_n_copy( e->key, (u64)MAX_ENTRY_NAME, key, MAX_ENTRY_NAME );
  e->value = value;

  // next starts out null but may be set later
  e->next = 0;

  return e;
} // --------------------------------------------------------------------------

hashtable *hashtable_create( u32 capacity, void(*destroy_func)(void*) )
{
  if( !destroy_func )
  {
    FZY_ERROR( "hashtable_create :: destroy func cannot be 0" );
    return 0;
  }
  hashtable* table = memory_allocate( sizeof( hashtable ), MEM_TAG_HASHTABLE );
  table->capacity = capacity;
  table->destroy = destroy_func;
  table->entries = memory_allocate( sizeof( entry* ) * capacity, MEM_TAG_HASHTABLE );
  memory_zero( table->entries, sizeof( entry*)* capacity );
  return table;
} // --------------------------------------------------------------------------

void hashtable_destroy( hashtable *table )
{
  if( table )
  {
    for( u32 i = 0; i < table->capacity; i++ )
    {
      if( table->entries[ i ] != 0 )
      {
        entry* tmp;
        entry* head = table->entries[ i ];

        // delete the list
        while( head != 0 )
        {
          tmp = head;
          head = head->next;
          // free the value

          table->destroy( tmp->value );
          memory_delete(tmp, sizeof( entry ), MEM_TAG_HASHTABLE );
        }
      }
    }
    memory_delete( table->entries, sizeof( entry* )* table->capacity, MEM_TAG_HASHTABLE );
    memory_delete( table, sizeof( hashtable), MEM_TAG_HASHTABLE );
  }
} // --------------------------------------------------------------------------

void hashtable_set( hashtable* table, const char* key, void* value)
{
  u32 slot = hash(table, key);

  // try to look up an entry set
  entry *e = table->entries[slot];

  // no entry means slot empty, insert immediately
  if (e == 0)
  {
    table->entries[slot] = hashtable_pair(key, value);
    return;
  }

  entry *prev;

  // walk through each entry until either the end is
  // reached or a matching key is found
  while (e != 0)
  {
    // check key
    if (string_n_is_equal(e->key, key, MAX_ENTRY_NAME ) == 0)
    {
      // match found, replace value
      table->destroy( e->value );
      e->value = value;
      return;
    }

    // walk to next
    prev = e;
    e = prev->next;
  }

  // end of chain reached without a match, add new
  prev->next = hashtable_pair(key, value);
} // --------------------------------------------------------------------------

void* hashtable_get( hashtable* table, const char* key)
{
  if (!table || !key) return 0;

  if (string_length(key) >= MAX_ENTRY_NAME)
  {
    FZY_WARNING("hashtable_set :: key truncated: '%s'", key);
  }

  u32 slot = hash(table, key);

  // try to find a valid slot
  entry *e = table->entries[slot];

  // no slot means no entry
  if ( !e )
  {
    return 0;
  }

  // walk through each entry in the slot, which could just be a single thing
  while( e )
  {
    // return value if found
    if (string_n_is_equal( e->key, key, MAX_ENTRY_NAME ) == 0 )
    {
      return e->value;
    }

    // proceed to next key if available
    e = e->next;
  }

  // reaching here means there were >= 1 entries but no key match
  return 0;
} // --------------------------------------------------------------------------

void hashtable_remove( hashtable* table, const char* key )
{
  if (!table || !key) return;

  u32 bucket = hash(table, key);

  // try to find a valid bucket
  entry *e = table->entries[bucket];

  entry *prev = 0;
  i32 idx = 0;

  // walk through each entry until either the end is reached or a matching key is found
  while( e )
  {
    // check key
    if (string_n_is_equal(e->key, key, MAX_ENTRY_NAME ) == 0)
    {
      // first item and no next entry
      if (e->next == 0 && idx == 0)
      {
        table->entries[bucket] = 0;
      }

      // first item with a next entry
      if (e->next != 0 && idx == 0)
      {
        table->entries[bucket] = e->next;
      }

      // last item
      if (e->next == 0 && idx != 0)
      {
        prev->next = 0;
      }

      // middle item
      if (e->next != 0 && idx != 0)
      {
        prev->next = e->next;
      }

      // free the deleted entry
      table->destroy( e->value );
      memory_delete( e, sizeof( entry ), MEM_TAG_HASHTABLE );

      return;
    }

    // walk to next
    prev = e;
    e = prev->next;

    ++idx;
  }
} // --------------------------------------------------------------------------
