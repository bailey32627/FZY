#ifndef FZY_RENDERER_H
#define FZY_RENDERER_H

#include "defines.h"
#include "renderer/renderer_types.h"
#include "resources/fzy_resource_types.h"

/**
  @brief Initializes the renderer frontend/system.

  @param application_name The name of the application.
  @return True on success; otherwise false.
*/
b8 render_system_initialize( void );

/**
  @brief Shuts the renderer system/frontend down.

  @param state A pointer to the state block of memory.
  @return true if successful, otherwise false
*/
b8 render_system_shutdown( );

/**
  @brief allows tests to be enabled and disabled on the backend

  @param flag The test to enable/disable
  @param enable True to enable, false to disable
*/
void renderer_enable( u8 flag, b8 enable );

/**
  @brief Set the font to use when rendering text

  @param name The name of the font that is stored in the resource manager
*/
//void renderer_set_font( const char* name );

/**
  @brief Returns the current bound font to render

  @return Pointer to the current font
*/
//font* renderer_font( void );

/**
  @brief Handles resize events.

  @param width The new window width.
  @param height The new window height.
*/
void renderer_on_resized( u16 width, u16 height );

/**
  @brief Draws the next frame using the data stored in the view controller.

  @param delta_time The time in milliseconds of the last frame
  @return True on success; otherwise false.
*/
b8 renderer_begin_frame( f32 delta_time );

/**
  @brief Ends drawing the next frame using the data stored in the view controller.

  @param delta_time The time in milliseconds of the last frame
  @return True on success; otherwise false.
*/
b8 renderer_end_frame( f32 delta_time );

//------------------------------------------------------------------------------
// Shaders
//------------------------------------------------------------------------------
/**
  @brief creates an shader and allocates backend resources

  @param vertex_source Source code for the vertex shader ( Required )
  @param fragment_source Source code for the fragment shader ( Required )
  @return Pointer to the new shader
*/
shader* shader_create( const char* vertex_source, const char* fragment_source );

/**
  @brief Frees the shader and the backend resources

  @param shader The shader to free resources for
*/
void shader_destroy( void* sdr );

/**
  @brief Add a uniform to the uniforms table in the shader

  @param shader The shader to add uniform to
  @param name The name of the uniform
  @param type The uniform type
  @return True if successful, false otherwise
*/
b8 shader_add_uniform( shader* sdr, const char* name, u8 type );

/**
  @brief Sets the value of the uniform with the given name

  @param sdr The shader to access
  @param name The name of the uniform
  @param value Pointer to the value to copy to the uniform
*/
void shader_set_uniform( shader* sdr, const char* name, void* value );

/**
  @brief Tells the backend to bind this shader

  @param shader The shader to bind, 0 to unbind
*/
void shader_use( shader* sdr );

//------------------------------------------------------------------------------
// Vertex buffers
//------------------------------------------------------------------------------

/**
  @brief Private function to create a vertex buffer. Use renderer_create_vertex_buffer instead

  @param size The size of each vertex
  @param count The maximum number of vertices
  @param layout The layout of the data type
  @param data_type The type of data each vertex is make of ( vec3 = FZY_FLOAT, b8 = FZY_BYTE )
  @return Pointer to the new vertex buffer or 0
*/
vertex_buffer* _vertex_buffer_create( u32 size, u32 max, u32 layout, u32 data_type );
#define vertex_buffer_create( type, max, layout, data_type ) _vertex_buffer_create( sizeof( type ), max, layout, data_type )

/**
  @brief Frees all resources held by the vertex buffer and the back end resouces

  @param vb Vertex buffer to destroy
*/
void vertex_buffer_destroy( vertex_buffer *vb );

/**
  @brief Pushes a vertex onto the vertex buffer, buffer will have to be reloaded for use

  @param vb The vertex buffer to add the vertex to
  @param vertex The vertex to add
*/
i32 vertex_buffer_add_vertex( vertex_buffer *vb, void *vertex );

/**
  @brief Loadsthe vertex buffer from an array

  @param vb The vertex buffer to load
  @param vertices The array of vertices to load
  @param count The number of vertices in the vertices array
*/
void vertex_buffer_load_vertices( vertex_buffer* vb, void* vertices, u32 count );

/**
  @brief Retrieves the vertex at the given index from a vertex buffer

  @param vb The vertex buffer to access
  @param index The vertex index to access
  @return Pointer to the vertex at the index
*/
void *vertex_buffer_get_vertex( vertex_buffer *vb, u32 index );

/**
  @brief Uploads the vertex buffer to the backend renderer for use

  @param vb The vertex buffer to upload
*/
void vertex_buffer_upload( vertex_buffer *vb, b8 dynamic );

/**
  @brief clears the vector in the buffer

  @param vb The vertex buffer to clear
*/
void vertex_buffer_clear( vertex_buffer* vb );

//------------------------------------------------------------------------------
//  Mesh
//------------------------------------------------------------------------------

/**
  @brief Creates the internal resources for a piece of mesh

  @returns Pointer to the new mesh
*/
mesh* mesh_create( void );

/**
  @brief Frees all the resources associated with the mesh

  @param mesh The mesh to destroy
*/
void mesh_destroy( void* mesh );

/**
  @brief Adds a vertex buffer to the mesh. This will invalidate the mesh
    and will need to be uploaded again

  @param geoemtry The mesh to access
  @param vb The vertex buffer to add
  @return True if successful, false otherwise
*/
b8 mesh_add_vertex_buffer( mesh* mesh, vertex_buffer *vb );

/**
  @brief Uploads the mesh to the backend

  @param mesh The geometry to upload
  @param dyanmic Indicates if the mesh is dynamic
*/
void mesh_upload( mesh* mesh, b8 dynamic );

/**
  @brief Update the vertex buffers for the mesh

  @brief mesh The mesh to update
*/
void mesh_update( mesh* mesh );

/**
  @brief Render the mesh, adds a render command to the render buffer to be processed
    on the flush

  @param mesh The mesh to draw
*/
void mesh_draw( mesh* mesh );

void mesh_clear( mesh* mesh );

//------------------------------------------------------------------------------
// Textures
//------------------------------------------------------------------------------

/**
  @brief Creates a texture on the backend

  @param path The path the texture file
  @param atlas_square The number of rows and columns in the atlas
  @return Pointer to the new generic texture
*/
texture* texture_create( const char* path, u32 atlas_square );

/**
  @brief Creates a writeable texture that is empty

  @param attachment The type of attachment this texture will be
  @param width The width of the texture
  @param height The height of the texture
  @return Pointer to the new texture
*/
texture* texture_create_writeable( attachment attachment, u16 width, u16 height );

/**
  @brief Destroys the texture on the backend and clean up the memory

  @param tex The texture to free
*/
void texture_destroy( void* tex );

/**
  @brief Binds the texture for rendering

  @param texture The texture to bind
  @param active_texture The position to bind the texture to
*/
void texture_bind( texture* texture, u32 active_texture );

/**
  @brief unbinds the textures
*/
void texture_unbind( );

//------------------------------------------------------------------------------
// Materials
//------------------------------------------------------------------------------

/**
  @brief Creates a material for rendering

  @param texture The texture to apply
  @param texture_index index into the texture atlas, pass 0 or 1 if not an atlas
  @param normal_map The nomral map to apply or 0 if not used
  @param normal_index index into the texture atlas holding the normal map or 1, 0 if not used
  @param reflectivity The reflectivity of the material
*/
material* material_create( struct texture* texture, u32 texture_index, struct texture* normal_map, u32 normal_index, f32 reflectivity );

/**
  @brief Destroys a material and frees memory

  @param material The material to destroy
*/
void material_destroy( void* material );

// -----------------------------------------------------------------------------
//  Renderpass
// -----------------------------------------------------------------------------

/**
  @brief Creates a framebuffer and initializes its textures and resources

  @param attachments List of attachments to add
  @param size The width and height
  @param clear_flags The type of clear to preform
  @param previous A pointer to a renderpass this depends on to render properly
  @return Pointer to the framebuffer
*/
renderpass* renderpass_create( u8 attachments, vec2 size, u32 clear_flags, vec4 clear_color, renderpass* previous );

/**
  @brief Frees memory associated with the renderpass and frees backend resources

  @param pass The renderbuffer to free
*/
void renderpass_destroy( renderpass* pass );

/**
  @brief begins rendering to the renderpass framebuffer

  @param The framebuffer to render to or 0 to unbind
*/
void renderpass_begin( renderpass* pass );

/**
  @brief Ends the rendering to the renderpass buffer

  @param pass The pass to end
*/
void renderpass_end( renderpass* pass );

//------------------------------------------------------------------------------
// draw calls
//------------------------------------------------------------------------------


#endif // FZY_RENDERER_H
