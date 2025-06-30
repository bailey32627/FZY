#include "resources/fzy_resource_manager.h"
#include "resources/fzy_resource_types.h"

#include "renderer/renderer.h"

#include "core/fzy_memory.h"
#include "core/fzy_logger.h"
#include "core/fzy_hashtable.h"



static hashtable* shaders = 0;
static hashtable* textures = 0;
static hashtable* materials = 0;
static hashtable* meshes = 0;

static b8 initialized = false;


b8 resource_manager_initialize( void )
{
  if( initialized )
  {
    FZY_ERROR( "resource_manager_initialize :: called after being initialized" );
    return false;
  }

  if( !shaders )
    shaders = hashtable_create( 27, shader_destroy );
  if( !textures )
    textures = hashtable_create( 64, texture_destroy );
  if( !materials )
    materials = hashtable_create( 64, material_destroy );
  if( !meshes )
    meshes = hashtable_create( 512, mesh_destroy );

  if( shaders && textures && materials && meshes )
  {
    initialized = true;
    return true;
  }

  FZY_ERROR( "resource_manager_initialize :: failed to initialize" );
  return false;
} // ---------------------------------------------------------------------------

b8 resource_manager_shutdown( void )
{
  if( shaders )
  {
    hashtable_destroy( shaders );
    shaders = 0;
  }
  if( textures )
  {
    hashtable_destroy( textures );
    textures = 0;
  }
  if( materials )
  {
    hashtable_destroy( materials );
    materials = 0;
  }
  if( meshes )
  {
    hashtable_destroy( meshes );
    meshes = 0;
  }

  if( shaders != 0 || textures != 0 || materials != 0 || meshes != 0  )
  {
    FZY_ERROR( "resource_manager_shutdown :: Failed to free all resource managers");
    return false;
  }

  return true;
} // ---------------------------------------------------------------------------

void resource_manager_add( u16 type, const char *name, void *resource )
{
  switch( type )
  {
    case RESOURCE_TYPE_SHADER:
    {
      hashtable_set( shaders, name, resource );
      break;
    }
    case RESOURCE_TYPE_TEXTURE:
    {
      hashtable_set( textures, name, resource );
      break;
    }

    case RESOURCE_TYPE_MATERIAL:
    {
      hashtable_set( materials, name, resource );
      break;
    }
    case RESOURCE_TYPE_MESH:
    {
      hashtable_set( meshes, name, resource );
      break;
    }

    default:
      break;
  }
} // ---------------------------------------------------------------------------

void* resource_manager_get( u16 type, const char *name )
{
  switch( type )
  {
    case RESOURCE_TYPE_SHADER:
    {
      return hashtable_get( shaders, name );
      break;
    }
    case RESOURCE_TYPE_TEXTURE:
    {
      return hashtable_get( textures, name );
      break;
    }

    case RESOURCE_TYPE_MATERIAL:
    {
      return hashtable_get( materials, name );
      break;
    }
    case RESOURCE_TYPE_MESH:
    {
      return hashtable_get( meshes, name );
      break;
    }

    default:
      break;
  }

  return 0;
} // --------------------------------------------------------------------------

void resource_manager_remove( u16 type, const char *name )
{
  switch( type )
  {
    case RESOURCE_TYPE_SHADER:
    {
      hashtable_remove( shaders, name );
      break;
    }
    case RESOURCE_TYPE_TEXTURE:
    {
      hashtable_remove( textures, name );
      break;
    }

    case RESOURCE_TYPE_MATERIAL:
    {
      hashtable_remove( materials, name );
      break;
    }
    case RESOURCE_TYPE_MESH:
    {
      hashtable_remove( meshes, name );
      break;
    }

    default:
      break;
  }
} // --------------------------------------------------------------------------

//-----------------------------------------------------------------------------
// Resource creation
//-----------------------------------------------------------------------------
