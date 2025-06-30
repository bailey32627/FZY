#include "resources/fzy_image.h"
#include "core/fzy_memory.h"
#include "core/fzy_logger.h"

#define STB_IMAGE_IMPLEMENTATION
#include "stb_image.h"


image *image_create( const char *path )
{
  image *image = memory_allocate( sizeof( image ), MEM_TAG_TEXTURE );
  image->pixels = 0;

  image->pixels = stbi_load( path, &image->width, &image->height, &image->channels, 0 );

  if( image->pixels == 0 )
  {
    FZY_WARNING( "image_create :: unable to load image from path [ %s ]" );
    image_destroy( image );
    return 0;
  }
  return image;
} // --------------------------------------------------------------------------

void image_destroy( image *image )
{
  if( !image ) return;

  if( image->pixels != 0 )
  {
    stbi_image_free( image->pixels );
    image->pixels = 0;
  }
  memory_delete( image, sizeof(image), MEM_TAG_TEXTURE );
  image = 0;
} // --------------------------------------------------------------------------
