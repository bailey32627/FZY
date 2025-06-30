#ifndef FZY_RESOURCE_MANAGER_H
#define FZY_RESOURCE_MANAGER_H

#include "defines.h"
#include "resources/fzy_resource_types.h"

// ----------------------------------------------------------------------------
// Resource manager ensures that each resource is only loaded once, and is
//  responsible for the memory used by resources
// ----------------------------------------------------------------------------

/**
  @brief Indentities the type of resource held
*/
typedef enum resource_type
{
  RESOURCE_TYPE_SHADER = 0,
  RESOURCE_TYPE_TEXTURE,
  RESOURCE_TYPE_MATERIAL,
  RESOURCE_TYPE_MESH,

} resource_type;

/**
  @brief Initialize the internal resource manager

  @returns b8 - true if successful
*/
b8 resource_manager_initialize( void );

/**
  @brief Releases internal resources held by the resources manager
*/
b8 resource_manager_shutdown( void );

/**
  @brief Add a resource to the manager

  @param type - The type of resource to add
  @param resource - The resource to add
*/
void resource_manager_add( u16 type, const char *name, void *resource );

/**
  @brief Returns the resource if found and will increment the references

  @param type - the type of resource to retrueve
  @param name - the name of the resource to retrieve
  @return ptr - Pointer to the resource or 0 in not found
*/
void* resource_manager_get( u16 type, const char *name );

/**
  @brief Releases a reference to the resource and will remove it if not referenced anymore

  @param type - the type of resource to release
  @param name - The name of the resource to release
*/
void resource_manager_remove( u16 type, const char *name );




#endif // FZY_RESOURCE_MANAGER_H
