#ifndef FZY_STRING_H
#define FZY_STRING_H

#include "defines.h"

/*
    @brief Gets the length of the given string
    @param str - the string to retrieve the length of
    @return u64 - the length of the string
*/
FZY_API u64 fzy_string_length( const char *str );

/*
    @brief Duplicates the provided string.  Note that this allocates new memory,
        and should be freed by the caller.
    @param str - the string to be duplicated
    @return ptr - returns a pointer to the newly-created character array
*/
FZY_API char *fzy_string_duplicate( const char* str );

/*
    @brief Frees the memory of the given string
    @param str - the string to be freed
*/
FZY_API void fzy_string_free( char* str );

/*
    @brief Case-sensitive string comparison.
    @param str0 - the first string to be compared
    @param str1 - the second string to be compared
    @return b8 - returns true if the same, otherwise false
*/
FZY_API b8 fzy_string_is_equal( const char* str0, const char* str1 );

/*
    @brief Case-sensitive string comparison for two strings
    @param str0 - the first string to be compared.
    @param str1 - the second string to be compared
    @param length - the number of characters to compare
    @return b8 - true if the string are not the same
*/
FZY_API b8 fzy_string_n_is_equal( const char* str0, const char* str1, i32 length );

/*
    @brief Preforms string formatting to dest given format string and parameters
    @param dest - the destination for the formatted string
    @param format - the format string to use for the operation
    @param ... - the format arguements
    @reutrn i32 - the length of the newly-formatted string
*/
FZY_API i32 fzy_string_format( char* dest, const char* format, ... );

/*
    @brief Preforms variadic string fomratting to destation by the given format
        string and va_list
    @param dest - the destination for the formatted string
    @param format - the string to be format
    @param va_list - the variadic arguement list
    @return i32 - the size fo the data written
*/
FZY_API i32 fzy_string_format_v( char* dest, const char* format, void* va_list );

/*
    @brief Empties the provided string by setting the first charactor to 0
    @param str - the string to be emptied
    @return ptr - returns a pointer to the string
*/
FZY_API char* fzy_string_empty( char* str );

/*
    @brief Copies the string in source to the destination.  Does not preform any memory
        allocations
    @param dest - the destination string
    @param dest_size - the size of the destination string
    @param src - the source string
    @return ptr - returns a pointer to the destination string
*/
FZY_API char* fzy_string_copy( char* dest, u64 dest_size, const char* src );

/*
    @brief Copies a number of caracters into the destination.  Does not preform any memory
        allocations
    @param dest - The destination string
    @param dest_size - the destination string
    @param src - the source to be copied
    @param length - the number of characters to be copied
    @return ptr - Pointer to dest
*/
FZY_API char* fzy_string_n_copy( char* dest, u64 dest_size, const char* src, i32 length );

/*
    @brief Preforms an in-place trim of the provided string.  This removes all whitespace
        from both ends of the string.  Don by placing zeroes in the string at relevant points
    @param str - The string to be trimmed
    @returns ptr - Pointer the the trimmed string
*/
FZY_API char* fzy_string_trim( char* str );

/*
    @brief Gets a substring of the source string that is between the start and length or to the
        end fo the string
    @param dest - The destination of the new string
    @param src - The source string to copy from
    @param start - where to start the substring at in src
    @param length - number of characters to copy into dest
    @return void
*/
FZY_API void fzy_string_substring( char* dest, const char* src, i32 start, i32 length );

/*
    @brief Returns the index of the first occurance of the character in the string, or -1 if not found
    @param str - The string to search
    @param c - The character to find
    @return i32 - The index of the first occurance of c or -1
*/
FZY_API i32 fzy_string_index_of( char* str, char c );

/*
    @brief Attemts to parse a vector from the provided string
    @param str - The string to parse from.  Should be space-delimited ( ie "1.0 2.0 3.0 4.0" )
    @param out - Pointer to the vector to write to
    @return b8 - True if parsed successfully
*/
FZY_API b8 fzy_string_to_vec4( char* str, vec4* out );

/*
    @brief Attempts to parse a vec3 from the provided string
    @param str - the string to be parsed from. Should be space-delimited ( ie "1.0 2.0 3.0" )
    @param out - The vec3 to write to
    @return b8 - True if successful
*/
FZY_API b8 fzy_string_to_vec3( char* str, vec3* out );

/*
    @brief Attempts to parse a vec2 from the provided string
    @param str - the string to be parsed from. Should be space-delimited ( ie "2.0 3.0" )
    @param out - The vec2 to write to
    @return b8 - True if successful
*/
FZY_API b8 fzy_string_to_vec2( char* str, vec2* out );

/*
  @brief Attempts to parse a 32-bit floating-point number from the provided string.
  @param str - The string to parse from. Should *not* be postfixed with 'f'.
  @param f - A pointer to the float to write to.
  @return b8 - true if parsed successfully; otherwise false.
*/
FZY_API b8 fzy_string_to_f32( char* str, f32* f );

/*
  @brief Attempts to parse a 64-bit floating-point number from the provided string.
  @param str - The string to parse from.
  @param f - A pointer to the float to write to.
  @return b8 - true if parsed successfully; otherwise false.
*/
FZY_API b8 fzy_string_to_f64( char* str, f64* f );

/*
  @brief Attempts to parse an 8-bit signed integer from the provided string.
  @param str - The string to parse from.
  @param i - A pointer to the int to write to.
  @return b8 - true if parsed successfully; otherwise false.
*/
FZY_API b8 fzy_string_to_i8( char* str, i8* i );

/*
  @brief Attempts to parse a 16-bit signed integer from the provided string.
  @param str - The string to parse from.
  @param i - A pointer to the int to write to.
  @return b8 - true if parsed successfully; otherwise false.
*/
FZY_API b8 fzy_string_to_i16( char* str, i16* i );

/*
  @brief Attempts to parse a 32-bit signed integer from the provided string.
  @param str - The string to parse from.
  @param i - A pointer to the int to write to.
  @return b8 - True if parsed successfully; otherwise false.
*/
FZY_API b8 fzy_string_to_i32( char* str, i32* i );

/*
  @brief Attempts to parse a 64-bit signed integer from the provided string.
  @param str - The string to parse from.
  @param i - A pointer to the int to write to.
  @return b8 - True if parsed successfully; otherwise false.
*/
FZY_API b8 fzy_string_to_i64( char* str, i64* i );

/*
  @brief Attempts to parse an 8-bit unsigned integer from the provided string.
  @param str - The string to parse from.
  @param u - A pointer to the int to write to.
  @return b8 - True if parsed successfully; otherwise false.
*/
FZY_API b8 fzy_string_to_u8( char* str, u8* u );

/*
    @brief Attempts to parse a 16-bit unsigned integer from the provided string.
    @param str - The string to parse from.
    @param u - A pointer to the int to write to.
    @return b8 - True if parsed successfully; otherwise false.
*/
FZY_API b8 fzy_string_to_u16( char* str, u16* u );

/*
    @brief Attempts to parse a 32-bit unsigned integer from the provided string.
    @param str - The string to parse from.
    @param u - A pointer to the int to write to.
    @return b8 - True if parsed successfully; otherwise false.
*/
FZY_API b8 fzy_string_to_u32( char* str, u32* u );

/*
    @brief Attempts to parse a 64-bit unsigned integer from the provided string.
    @param str - The string to parse from.
    @param u - A pointer to the int to write to.
    @return b8 - True if parsed successfully; otherwise false.
*/
FZY_API b8 fzy_string_to_u64( char* str, u64* u );

/*
    @brief Attempts to parse a boolean from the provided string.
        "true" or "1" are considered true; anything else is false.
    @param str - The string to parse from. "true" or "1" are considered true; anything else is false.
    @param b - A pointer to the boolean to write to.
    @return b8 - True if parsed successfully; otherwise false.
*/
FZY_API b8 fzy_string_to_bool( char* str, b8* b );

/*
    Appends append to source and returns a new string.
    @param dest - The destination string.
    @param source - The string to be appended to.
    @param append - The string to append to source.
    @returns A new string containing the concatenation of the two strings.
*/
FZY_API void fzy_string_append_string( char* dest, const char* source, const char* append );

/*
    @brief Appends the supplied integer to source and outputs to dest.
    @param dest - The destination for the string.
    @param source - The string to be appended to.
    @param i - The integer to be appended.
*/
FZY_API void fzy_string_append_int( char* dest, const char* source, i64 i );

/*
    @brief Appends the supplied float to source and outputs to dest.
    @param dest - The destination for the string.
    @param source - The string to be appended to.
    @param f - The float to be appended.
*/
FZY_API void fzy_string_append_float( char* dest, const char* source, f32 f );

/*
    @brief Appends the supplied boolean (as either "true" or "false") to source and outputs to dest.
    @param dest - The destination for the string.
    @param source - The string to be appended to.
    @param b - The boolean to be appended.
*/
FZY_API void fzy_string_append_bool( char* dest, const char* source, b8 b );

/*
    @brief Appends the supplied character to source and outputs to dest.
    @param dest - The destination for the string.
    @param source - The string to be appended to.
    @param c - The character to be appended.
*/
FZY_API void fzy_string_append_char( char* dest, const char* source, char c );

/*
    @brief Extracts the directory from a full file path.
    @param dest - The destination for the path.
    @param path - The full path to extract from.
*/
FZY_API void fzy_string_directory_from_path( char* dest, const char* path );

/*
    @brief Extracts the filename (including file extension) from a full file path.
    @param dest - The destination for the filename.
    @param path - The full path to extract from.
*/
FZY_API void fzy_string_filename_from_path( char* dest, const char* path );

/*
  @brief Extracts the filename (excluding file extension) from a full file path.
  @param dest - The destination for the filename.
  @param path - The full path to extract from.
*/
FZY_API void fzy_string_filename_no_extension_from_path( char* dest, const char* path );


#endif // FZY_STRING_H
