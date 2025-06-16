#ifndef FZY_FILE_H
#define FZY_FILE_H

#include "defines.h"

/**
  @brief Holds a file handle
*/
typedef struct file_handle
{
  u8 *data;    // holds the internal file data
  u64 pos;     // holds the position in the file
  u64 size;    // holds the size of the data array

} file_handle;

/**
  @brief Read the file at the path in a file handle

  @param path - the full path to the file to read
  @param out_handle - the file handle struct to load into
  @return b8 - true if successful
*/
FZY_API b8 file_read( const char* path, file_handle* out_handle );

/**
  @brief Releases the file handle data

  @param handle - The file handle to release
*/
FZY_API void file_close( file_handle *handle );

/**
  @brief Read a set amount of bytes from the handle buffer into the data array

  @param handle - the file handle to read bytes fro
  @param size_to_read - the number of bytes to read
  @param data - Pointer to the memory to read from
  @return b8 - true if successful
*/
FZY_API b8 file_read_bytes( file_handle *handle, u64 size_to_read, void* data );

/**
  @brief Adds data to a file handle to write

  @param handle - the file handle to add data to
  @param data - the data to add to the file
  @param data_size - the number of bytes to add to the file
*/
FZY_API void file_add_data( file_handle* handle, const void* data, u64 data_size );

/**
  @brief Writes the file handle to the path

  @param handle - the file to write
  @param path - the path to the location to write to
  @param truncate - Indicates if the file should override itself or not
  @return b8 - true if successful
*/
FZY_API b8 file_write( file_handle* handle, const char* path, b8 truncate );
#endif // FZY_FILE_H
