#include "core/fzy_string.h"
#include "core/fzy_memory.h"
#include "core/fzy_logger.h"

#include <string.h>
#include <stdio.h>
#include <stdarg.h>
#include <ctype.h>

const u32 max_buffer = 32000;

u64 string_length( const char *str )
{
    return strlen( str );
} // ---------------------------------------------------------------------------------------------------------------

char *string_duplicate( const char* str )
{
    u64 length = string_length( str );
    char* copy = memory_allocate( length + 1, MEM_TAG_STRING );
    memory_copy( copy, str, length );
    copy[ length ] = 0;
    return copy;
} // ---------------------------------------------------------------------------------------------------------------

void string_free( char* str )
{
    if( str )
    {
        memory_delete( str, string_length( str ) + 1, MEM_TAG_STRING );
        str = NULL;
        return;
    }
    FZY_WARNING( "string_free :: passed a null pointer." );
} // ---------------------------------------------------------------------------------------------------------------

b8 string_is_equal( const char* str0, const char* str1 )
{
    return strcmp( str0, str1 ) == 0;
} // ---------------------------------------------------------------------------------------------------------------

b8 string_n_is_equal( const char* str0, const char* str1, i32 length )
{
    return strncmp( str0, str1, length ) == 0;
} // ---------------------------------------------------------------------------------------------------------------

i32 string_format( char* dest, const char* format, ... )
{
    if( dest )
    {
        i32 written = 0;
        #ifdef FZY_PLATFORM_WINDOWS
            va_list args;
            va_start(args, format);
            written = string_format_v( dest, format, args );
            va_end(args);
        #else
            __builtin_va_list arg_ptr;
            va_start( arg_ptr, format );
            written = string_format_v( dest, format, arg_ptr );
            va_end( arg_ptr );
        #endif

        return written;
    }
    return -1;
} // ---------------------------------------------------------------------------------------------------------------

i32 string_format_v( char* dest, const char* format, va_list  args )
{
    if (dest)
    {
        // Big, but can fit on the stack.
        char buffer[32000];
        i32 written = vsnprintf(buffer, 32000, format, args );
        buffer[written] = 0;
        memory_copy( dest, buffer, written + 1 );

        return written;
    }
    return -1;
} // ---------------------------------------------------------------------------------------------------------------

char* string_empty( char* str )
{
    if (str)
    {
        str[0] = 0;
    }

    return str;
} // ---------------------------------------------------------------------------------------------------------------

char* string_copy( char* dest, u64 dest_size, const char* src )
{
    strcpy_s( dest, dest_size, src );
    return dest;
} // ---------------------------------------------------------------------------------------------------------------

char* string_n_copy( char* dest, u64 dest_size, const char* src, i32 length )
{
    strncpy_s( dest, dest_size, src, length );
    return dest;
} // ---------------------------------------------------------------------------------------------------------------

char* string_trim(char* str)
{
    if (!str) return NULL;

    char* end;

    // Trim leading space
    while (isspace((unsigned char)*str)) str++;

    if (*str == 0) {
        // All spaces
        *str = '\0';
        return str;
    }

    // Find the end
    end = str + strlen(str) - 1;
    while (end > str && isspace((unsigned char)*end)) end--;

    // Null terminate just after the last non-space
    end[1] = '\0';

    return str;
}// ---------------------------------------------------------------------------------------------------------------

void string_substring( char* dest, const char* src, i32 start, i32 length )
{
    if( length == 0 )
    {
        return;
    }
    u64 src_length = string_length( src );
    if( start >= src_length )
    {
        dest[0] = 0;
        return;
    }
    if( length > 0 )
    {
        for( u64 i = start, j = 0; j < length && src[i]; ++i, ++j )
        {
        dest[j] = src[i];
        }
        dest[start + length] = 0;
    } else {
        // If a negative value is passed, proceed to the end of the string.
        u64 j = 0;
        for( u64 i = start; src[i]; ++i, ++j )
        {
        dest[j] = src[i];
        }
        dest[start + j] = 0;
    }
} // ---------------------------------------------------------------------------------------------------------------

i32 string_index_of( char* str, char c )
{
    if( !str )
    {
        return -1;
    }
    u64 length = string_length( str );
    if( length > 0 )
    {
        for( u32 i = 0; i < length; ++i )
        {
            if( str[i] == c )
            {
                return i;
            }
        }
    }

    return -1;
} // ---------------------------------------------------------------------------------------------------------------

b8 string_to_vec4( char* str, vec4* out )
{
    if( !str )
    {
        return false;
    }
    memory_zero( out, sizeof( vec4 ) );
    i32 result = sscanf( str, "%f %f %f %f", &out->x, &out->y, &out->z, &out->w );
    return result != -1;
} // ---------------------------------------------------------------------------------------------------------------

b8 string_to_vec3( char* str, vec3* out )
{
    if( !str )
    {
        return false;
    }

    memory_zero( out, sizeof( vec3 ) );
    i32 result = sscanf( str, "%f %f %f", &out->x, &out->y, &out->z );
    return result != -1;
} // ---------------------------------------------------------------------------------------------------------------

b8 string_to_vec2( char* str, vec2* out )
{
    if( !str )
    {
        return false;
    }

    memory_zero( out, sizeof( vec2 ) );
    i32 result = sscanf(str, "%f %f", &out->x, &out->y);
    return result != -1;
} // ---------------------------------------------------------------------------------------------------------------

b8 string_to_f32( char* str, f32* f )
{
    if( !str )
    {
        return false;
    }

    *f = 0;
    i32 result = sscanf( str, "%f", f );
    return result != -1;
} // ---------------------------------------------------------------------------------------------------------------

b8 string_to_f64( char* str, f64* f )
{
    if( !str )
    {
        return false;
    }

    *f = 0;
    i32 result = sscanf( str, "%lf", f );
    return result != -1;
} // ---------------------------------------------------------------------------------------------------------------

b8 string_to_i8( char* str, i8* i )
{
    if( !str )
    {
        return false;
    }

    *i = 0;
    i32 result = (i32)sscanf( str, "%hhi", i );
    return result != -1;
} // ---------------------------------------------------------------------------------------------------------------

b8 string_to_i16( char* str, i16* i )
{
    if( !str )
    {
        return false;
    }

    *i = 0;
    i32 result = (i32)sscanf( str, "%hi", i );
    return result != -1;
} // ---------------------------------------------------------------------------------------------------------------

b8 string_to_i32( char* str, i32* i )
{
    if( !str )
    {
        return false;
    }

    *i = 0;
    i32 result = (i32)sscanf( str, "%i", i );
    return result != -1;
} // ---------------------------------------------------------------------------------------------------------------

b8 string_to_i64( char* str, i64* i )
{
    if( !str )
    {
        return false;
    }

    *i = 0;
    i32 result = (i32)sscanf( str, "%lli", i );
    return result != -1;
} // ---------------------------------------------------------------------------------------------------------------

b8 string_to_u8( char* str, u8* u )
{
    if( !str )
    {
        return false;
    }

    *u = 0;
    i32 result = (i32)sscanf( str, "%hhu", u );
    return result != -1;
} // ---------------------------------------------------------------------------------------------------------------

b8 string_to_u16( char* str, u16* u )
{
    if( !str )
    {
        return false;
    }

    *u = 0;
    i32 result = (i32)sscanf( str, "%hu", u );
    return result != -1;
} // ---------------------------------------------------------------------------------------------------------------

b8 string_to_u32( char* str, u32* u )
{
    if( !str )
    {
        return false;
    }

    *u = 0;
    i32 result = (i32)sscanf( str, "%u", u );
    return result != -1;
} // ---------------------------------------------------------------------------------------------------------------

b8 string_to_u64( char* str, u64* u )
{
    if( !str )
    {
        return false;
    }

    *u = 0;
    i32 result = (i32)sscanf( str, "%llu", u );
    return result != -1;
} // ---------------------------------------------------------------------------------------------------------------

b8 string_to_bool( char* str, b8* b )
{
    if( !str )
    {
        return false;
    }

    *b = string_is_equal( str, "1" ) || string_is_equal( str, "true" );
    return *b;
} // ---------------------------------------------------------------------------------------------------------------

void string_append_string( char* dest, const char* source, const char* append )
{
    sprintf_s(dest, max_buffer, "%s%s", source, append);
} // ---------------------------------------------------------------------------------------------------------------

void string_append_int( char* dest, const char* source, i64 i )
{
    sprintf_s(dest, max_buffer, "%s%lli", source, i);
} // ---------------------------------------------------------------------------------------------------------------

void string_append_float( char* dest, const char* source, f32 f )
{
    sprintf_s(dest, max_buffer, "%s%f", source, f);
} // ---------------------------------------------------------------------------------------------------------------

void string_append_bool( char* dest, const char* source, b8 b )
{
    sprintf_s(dest, max_buffer, "%s%s", source, b ? "true" : "false");
} // ---------------------------------------------------------------------------------------------------------------

void string_append_char( char* dest, const char* source, char c )
{
    sprintf_s(dest, max_buffer, "%s%c", source, c);
} // ---------------------------------------------------------------------------------------------------------------

void string_directory_from_path( char* dest, const char* path )
{
    u64 length = strlen( path );
    for (i64 i = (i64)length - 1; i >= 0; --i)
    {
        char c = path[i];
        if( c == '/' || c == '\\' )
        {
        strncpy_s(dest, string_length( dest), path, i + 1);
        return;
        }
    }
} // ---------------------------------------------------------------------------------------------------------------

void string_filename_from_path( char* dest, const char* path )
{
    u64 length = strlen( path );
    for( u64 i = length; i >= 0; --i )
    {
        char c = path[i];
        if( c == '/' || c == '\\' )
        {
        strcpy_s( dest, string_length( dest ), path + i + 1 );
        return;
        }
    }
} // ---------------------------------------------------------------------------------------------------------------

void string_filename_no_extension_from_path( char* dest, const char* path )
{
    u64 length = strlen( path );
    u64 start = 0;
    u64 end = 0;
    for( u64 i = length; i >= 0; --i )
    {
        char c = path[i];
        if( end == 0 && c == '.' )
        {
            end = i;
        }
        if( start == 0 && ( c == '/' || c == '\\' ) )
        {
            start = i + 1;
            break;
        }
    }

    string_substring(dest, path, (i32)start, (i32)(end - start));
} // ---------------------------------------------------------------------------------------------------------------
