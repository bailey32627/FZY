#include "core/fzy_memory.h"

#include "core/logger.h"

// TODO: custom string lib
#include <string.h>
#include <stdio.h>
#include <stdlib.h>

struct memory_stats
{
  u64 total_allocated;
  u64 tagged_allocations[MEM_TAG_MAX_TAGS];
};

static struct memory_stats stats;


static const char* memory_tag_strings[MEM_TAG_MAX_TAGS] = {
  "UNKNOWN    ",
  "RENDERER   ",
  "TEXTURE    ",
  "SHADER     ",
  "MATERIAL   ",
  "MESH       ",
  "STRING     ",
  "EVENTS     ",
  "FILE       ",
  "HASHTABLE  ",
  "INPUTS     ",
  "VIEWS      ",
  "ENTITY     ",
  "COMPONENT  ",
  "PROCESS    ",
};

static void *allocate( u64 size, b8 aligned )
{
  return malloc( size );
} // -----------------------------------------------------------------------

static void *reallocate( void *block, u64 size, b8 aligned )
{
   return realloc( block, size );
} // -----------------------------------------------------------------------

static void delete( void *block, b8 aligned )
{
  free( block );
} // -----------------------------------------------------------------------

b8 memory_initialize( )
{
  FZY_INFO( "memory initialized" );
  return true;
} // -----------------------------------------------------------------------

b8 memory_shutdown( )
{
  FZY_INFO( "memory shutdown" );
  return true;
} // -----------------------------------------------------------------------

void* fzy_memory_allocate( u64 size, fzy_memory_tag tag )
{
  if( tag == MEM_TAG_UNKNOWN )
    FZY_WARNING( "memory_allocate called using MEMORY_TAG_UNKNOWN.  Re-class this allocation." );

  stats.total_allocated += size;
  stats.tagged_allocations[ tag ] += size;

  // TODO : memory alignment
  void *block = allocate( size, false );
  return fzy_memory_zero( block, size );
} // -----------------------------------------------------------------------

void fzy_memory_delete( void *block, u64 size, fzy_memory_tag tag )
{
  if( tag == MEM_TAG_UNKNOWN )
    FZY_WARNING( "memory_free called using MEM_TAG_UNKNOWN.  Re-class this allocation." );

  stats.total_allocated -= size;
  i64 remove = (i64)stats.tagged_allocations - size;
  if( remove < 0 )
    FZY_ERROR( "memory_free :: freeing more than allocated" );
  stats.tagged_allocations[ tag ] -= size;

  // TODO: memory alignment
  delete( block, false );
  block = 0;
} // -----------------------------------------------------------------------

void* memory_reallocate( void* block, u64 old_size, u64 new_size, fzy_memory_tag tag )
{
  if( tag == MEM_TAG_UNKNOWN )
    FZY_WARNING( "memory_reallocate called using MEM_TAG_UNKNOWN.  Re-class this allocation." );

  i64 change = new_size - old_size;
  stats.total_allocated += change;
  stats.tagged_allocations[ tag ] += change;

  // TODO: memory alignment
  block = reallocate( block, new_size, false );
  return block;
} // -----------------------------------------------------------------------

i32 fzy_memory_compare( void* add1, void *add2, u64 size )
{
  return memcmp( add1, add2, size );
} // ----------------------------------------------------------------------

void* fzy_memory_zero( void *block, u64 size )
{
  return memset( block, 0, size );
} // -----------------------------------------------------------------------

void* fzy_memory_copy( void *dest, const void *source, u64 size )
{
  return memcpy( dest, source, size );
} // -----------------------------------------------------------------------

void *fzy_memory_set( void *dest, i32 value, u64 size )
{
  return memset( dest, value, size );
} // -----------------------------------------------------------------------

char* fzy_memory_get_usage_str( )
{
  const u64 gib = 1024 * 1024 * 1024;
  const u64 mib = 1024 * 1024;
  const u64 kib = 1024;

  char buffer[ 8000 ] = "System memory usage (tagged):\n";
  u64 offset = strlen( buffer );

  for( u32 i = 0; i < MEM_TAG_MAX_TAGS; i++ )
  {
    char unit[ 4 ] = "xiB";
    float amount = 1.0f;

    if( stats.tagged_allocations[ i ] >= gib )
    {
      unit[ 0 ] = 'G';
      amount = stats.tagged_allocations[ i ] / (float)gib;
    }
    else if( stats.tagged_allocations[ i ] >= mib )
    {
      unit[ 0 ] = 'M';
      amount = stats.tagged_allocations[ i ] / (float)mib;
    }
    else if( stats.tagged_allocations[ i ] >= kib )
    {
      unit[ 0 ] = 'K';
      amount = stats.tagged_allocations[ i ] / (float)kib;
    }
    else
    {
      unit[ 0 ] = 'B';
      unit[ 1 ] = 0;
      amount = (float)stats.tagged_allocations[ i ];
    }

    i32 length = snprintf( buffer + offset, 8000, "  %s: %.2f%s\n", memory_tag_strings[ i ], amount, unit );
    offset += length;
  }

  char* out_string = strdup( buffer );
  return out_string;
} // -----------------------------------------------------------------------
