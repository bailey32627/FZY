#include "core/logger.h"

// todo :: temporary
#include <stdio.h>
#include <string.h>
#include <stdarg.h>
#include <stdlib.h>


#ifdef FZY_PLATFORM_WINDOWS
#include <windows.h>
#else
#include <unistd.h> // getcwd
#include <limits.h> // PATH_MAX
#endif

b8 logger_initialize( )
{
  return true;
} // -----------------------------------------------------------------
void logger_shutdown( )
{
  // todo:: clean up logger / write queued entries
} // -----------------------------------------------------------------

void write_windows_file( const char* file, const char* message )
{
  FILE* log = fopen( file, "a" );
  fprintf( log, message );
  fclose( log );
} // -----------------------------------------------------------------

void logger_output( log_level level, const char *message )
{
  const char* level_strings[ 6 ] = { "[ FATAL ]: ", "[ ERROR ]: ", "[ WARNING ]: ", "[ INFO ]: ", "[ DEBUG ]: ", "[ TRACE ]: " };
  b8 is_error = level < 2;

  // technically imposes a 32K character limit on a single log entry, but...
  char out_message[ 32000 ];
  memset( out_message, 0, sizeof( out_message ) );
  snprintf( out_message, sizeof( out_message), "%s%s\n", level_strings[ level ], message );

  // get platform-specific working DIRECTORY
  char full_path[ 1024 ] = {0};


  #ifdef FZY_PLATFORM_WINDOWS
    wchar_t wdir[MAX_PATH];
    DWORD ret = GetCurrentDirectoryW(MAX_PATH, wdir);
    if( ret == 0 ) {
      fprintf( stderr, "Failed to get working directory on Windows.\n" );
      exit( 1 );
    }
    char dir[ MAX_PATH ];
    size_t conv_len;
    wcstombs_s( &conv_len, dir, MAX_PATH, wdir, MAX_PATH );
    snprintf( full_path, sizeof( full_path), "%s\\log.txt", dir );

  #else
    char dir[ MAX_PATH ];
    if( getcwd( dir, sizeof( dir ) ) == NULL ) {
      perror( "getcwd() error" );
      exit( 1 );
    }
    snprintf( full_path, sizeof( full_path ), "%s/log.txt", dir );

  #endif

  FILE* log = fopen( full_path, "a" );
  if( log ) {
    fprintf( log, "%s", out_message );
    fclose( log );
  } else {
    fprintf( stderr, "Failed to open log file: %s\n", full_path );
  }

  // exit if error
  if( is_error ) {
    exit( 1 );
  }
} // -----------------------------------------------------------------
