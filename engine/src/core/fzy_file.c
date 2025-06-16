#include "core/fzy_file.h"
#include "core/fzy_memory.h"

#include <stdio.h>
#include <string.h>
#include <sys/stat.h>


/* @brief A standard buffer to increase by for adding data to write */
static const u32 default_buffer = 1024;


b8 file_read( const char* path, file_handle* out_handle )
{
  if( !out_handle ) return false;

  FILE *f = NULL;

  #ifdef FZY_PLATFORM_WINDOWS
    if (fopen_s(&f, path, "rb") != 0 || !f) return false;
  #else
    f = fopen(path, "rb");
    if (!f) return false;
  #endif

  fseek( f, 0, SEEK_END );
  out_handle->size = ftell( f ) + 1;
  fseek( f, 0, SEEK_SET );

  out_handle->data = memory_allocate( out_handle->size, MEM_TAG_FILE );

  fread( out_handle->data, 1, out_handle->size - 1, f );
  out_handle->pos = 0;
  out_handle->data[ out_handle->size - 1 ] = '\0';
  fclose( f );
  return true;
} // ---------------------------------------------------------------------------

void file_close( file_handle *handle )
{
  if( !handle || !handle->data ) return;

  memory_delete( handle->data, handle->size, MEM_TAG_FILE );
  handle->pos = 0;
  handle->size = 0;
  handle->data = 0;
} // ---------------------------------------------------------------------------

b8 file_read_bytes( file_handle *handle, u64 size_to_read, void* data )
{
  if( !handle || !handle->data ) return false;

  if( ( handle->pos + size_to_read ) > handle->size ) return false;

  memory_copy( data, &handle->data[handle->pos], size_to_read );
  handle->pos += size_to_read;
  return true;
} // ---------------------------------------------------------------------------

void file_add_data( file_handle* handle, const void* data, u64 data_size )
{
  if( handle->data == 0 )
  {
    handle->data = memory_allocate( default_buffer, MEM_TAG_FILE );
    handle->pos = 0;
    handle->size = default_buffer;
  }
  if( handle->pos + data_size >= handle->size )
  {
    u64 ns = handle->size + data_size + default_buffer;
    u8* tmp = memory_allocate( ns, MEM_TAG_FILE );
    memory_copy( tmp, handle->data, handle->pos );
    memory_delete( handle->data, handle->size, MEM_TAG_FILE );
    handle->data = tmp;
    handle->size = ns;
  }

  memory_copy( &handle->data[ handle->pos], data, data_size );
  handle->pos += data_size;
} // ---------------------------------------------------------------------------

b8 file_write( file_handle* handle, const char* path, b8 truncate )
{
  if( !handle || !handle->data || handle->size == 0 ) return false;

  FILE* f = NULL;
  #ifdef FZY_PLATFORM_WINDOWS
    if (fopen_s(&f, path, truncate ? "w" : "a") != 0 || !f) return false;
  #else
    f = fopen(path, "rb");
    if (!f) return false;
  #endif

  fwrite( handle->data, 1, handle->pos, f );
  fclose( f );
  return true;
} // ---------------------------------------------------------------------------
