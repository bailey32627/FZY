#include "renderer/renderer.h"
#include "renderer/fzy_window.h"

#include "core/fzy_logger.h"
#include "core/fzy_memory.h"
#include "core/fzy_file.h"
#include "core/fzy_vector.h"

#include "math/fzy_math.h"

#include "resources/fzy_resource_manager.h"
#include "resources/fzy_image.h"

#ifdef USING_OPENGL
  #include "renderer/opengl/gl_backend.h"
#endif

typedef struct render_system_state
{
  mat4 orthographic_projection;  // holds an orthographic projection for the window
  renderer_backend backend;      // the backend to use

} render_system_state;

/* @brief Pointer to the render_system_state */
static render_system_state *state_ptr;

static b8 initialize_backend( renderer_backend *out )
{
  #ifdef USING_OPENGL

    out->initialize = gl_renderer_initialize;
    out->shutdown = gl_renderer_shutdown;
    out->enable = gl_renderer_enable;
    out->resized = gl_renderer_resized;
    out->begin_frame = gl_renderer_begin_frame;
    out->end_frame = gl_renderer_end_frame;

    out->create_shader = gl_shader_create;
    out->destroy_shader = gl_shader_destroy;
    out->add_shader_uniform = gl_shader_add_uniform;
    out->set_shader_uniform = gl_shader_set_uniform;
    out->use_shader = gl_shader_use;
    out->initialize_global_shaders = gl_shaders_global;

    out->create_texture = gl_texture_create;
    out->create_writeable_texture = gl_texture_create_writeable;
    out->destroy_texture = gl_texture_destroy;
    out->bind_texture = gl_texture_bind;
    out->unbind_texture = gl_texture_unbind;

    out->create_vertex_buffer = gl_vertex_buffer_create;
    out->destroy_vertex_buffer = gl_vertex_buffer_destroy;
    out->upload_vertex_buffer = gl_vertex_buffer_upload;

    out->create_mesh = gl_mesh_create;
    out->destroy_mesh = gl_mesh_destroy;
    out->upload_mesh = gl_mesh_upload;
    out->draw_mesh = gl_mesh_draw;

    out->renderpass_create = gl_renderpass_create;
    out->renderpass_destroy = gl_renderpass_destroy;
    out->renderpass_begin = gl_renderpass_begin;
    out->renderpass_end = gl_renderpass_end;

    return true;
  #endif

  #ifdef USING_VULKAN
  #endif

  #ifdef USING_DIRECTX
  #endif

  return false;
} // -------------------------------------------------------------------------

b8 render_system_initialize( void )
{
  b8 result = false;
  state_ptr = memory_allocate( sizeof( render_system_state ), MEM_TAG_RENDERER );

  if( initialize_backend( &state_ptr->backend ) )
  {
    result = state_ptr->backend.initialize( &state_ptr->backend );
    state_ptr->orthographic_projection = mat4_orthographic( 0, (i16)window_get_width(), (i16)window_get_height(), 0, -1, 1 );
  }
  return result;
} // --------------------------------------------------------------------------

b8 render_system_shutdown( )
{
  if( state_ptr )
  {
    if( !state_ptr->backend.shutdown( &state_ptr->backend ) )
    {
      FZY_WARNING( "render_sytem_shutdown :: Failed to shutdown backend" );
      return false;
    }

    memory_delete( state_ptr, sizeof( render_system_state ), MEM_TAG_RENDERER );
    state_ptr = 0;
    return true;
  }
  return false;
} // --------------------------------------------------------------------------

void renderer_enable( u8 flag, b8 enable )
{
  state_ptr->backend.enable( flag, enable );
} // --------------------------------------------------------------------------

void renderer_set_font( const char* name )
{
  //#ifdef FZY_CONFIG_DEBUG
  //  if( !fnt )
  //    FZY_WARNING( "renderer_set_font :: Attempted to load a non-existing font" );
  //#endif
  //if( fnt )
  //  state_ptr->current_font = fnt;
} // --------------------------------------------------------------------------
/*
font* renderer_font( void )
{
  return state_ptr->current_font;
} // --------------------------------------------------------------------------
*/
void renderer_on_resized( u16 width, u16 height )
{
  if( state_ptr )
    state_ptr->orthographic_projection = mat4_orthographic( 0, (i16)window_get_width(), (i16)window_get_height(), 0, -1, 1 );
} // --------------------------------------------------------------------------

b8 renderer_begin_frame( f32 delta_time )
{
  state_ptr->backend.frame_number++;

  // If the begin frame returned successfully, mid-frame operations may continue.
  if( state_ptr->backend.begin_frame( &state_ptr->backend, delta_time ) )
  {
    //gui_begin();
    return true;
  }
  return false;
} // -------------------------------------------------------------------------

b8 renderer_end_frame( f32 delta_time )
{
  //gui_end();
  b8 result = state_ptr->backend.end_frame( &state_ptr->backend, delta_time );
  if( !result )
  {
    FZY_ERROR( "renderer_end_frame failed.  Application shutting down..." );
    return false;
  }

  return true;
} // --------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// Shaders
// ----------------------------------------------------------------------------

shader* shader_create( const char* vertex_source, const char* fragment_source )
{
  shader* sdr = memory_allocate( sizeof( shader ), MEM_TAG_SHADER );

  if( !state_ptr->backend.create_shader( sdr, vertex_source, fragment_source ) )
  {
    FZY_ERROR( "shader_create :: failed to create gl shader" );
    memory_delete( sdr, sizeof( shader ), MEM_TAG_SHADER );
    return 0;
  }

  return sdr;
} // -------------------------------------------------------------------------

void shader_destroy( void* sdr )
{
  if( sdr )
  {
    if( state_ptr->backend.destroy_shader( (shader*)sdr ) )
    {
      memory_delete( sdr, sizeof( shader ), MEM_TAG_SHADER );
    }
  }
} // -------------------------------------------------------------------------

b8 shader_add_uniform( shader* sdr, const char* name, u8 type )
{
  return state_ptr->backend.add_shader_uniform( sdr, name, type );
} // -------------------------------------------------------------------------

void shader_set_uniform( shader* sdr, const char* name, void* value )
{
  state_ptr->backend.set_shader_uniform( sdr, name, value );
} // -------------------------------------------------------------------------

void shader_use( shader* sdr )
{
  state_ptr->backend.use_shader( sdr );
} // -------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// Vertex buffers
// ----------------------------------------------------------------------------

vertex_buffer* _vertex_buffer_create( u32 size, u32 max, u32 layout, u32 data_type )
{
  vertex_buffer *vb = memory_allocate( sizeof( struct vertex_buffer ), MEM_TAG_MESH );
  vb->stride = size;
  vb->vertices = vector_create( size, max, MEM_TAG_MESH );
  vb->capacity = max;
  vb->is_uploaded = false;
  vb->layout = layout;
  vb->type = data_type;

  if( !state_ptr->backend.create_vertex_buffer( vb ) )
  {
    FZY_ERROR( "_vertex_buffer_create :: Failed to create backend resources" );
    memory_delete( vb, sizeof( struct vertex_buffer ), MEM_TAG_MESH );
    return 0;
  }
  return vb;
} // -------------------------------------------------------------------------

void vertex_buffer_destroy( vertex_buffer *vb )
{
  if( vb )
  {
    if( vb->vertices )
      vector_destroy( vb->vertices );

    if( !state_ptr->backend.destroy_vertex_buffer( vb ) )
    {
      FZY_ERROR( "vertex_buffer_destroy :: failed to destroy backend resources" );
    }
    memory_delete( vb, sizeof( struct vertex_buffer ), MEM_TAG_MESH );
    vb = 0;
  }
} // -------------------------------------------------------------------------

i32 vertex_buffer_add_vertex( vertex_buffer *vb, void *vertex )
{
  i32 i = -1;
  if( vb )
  {
    i = vector_size( vb->vertices );
    vector_push( vb->vertices, vertex );
    vb->is_uploaded = false;
  }
  return i;
} // -------------------------------------------------------------------------

void vertex_buffer_load_vertices( vertex_buffer* vb, void* vertices, u32 count )
{
  if( vb )
  {
    vector_fill( vb->vertices, vertices, count );
    vb->is_uploaded = false;
  }
} // -------------------------------------------------------------------------

void *vertex_buffer_get_vertex( vertex_buffer *vb, u32 index )
{
  if( vb && vb->vertices )
    return _vector_get( vb->vertices, index );
  return 0;
} // -------------------------------------------------------------------------

void vertex_buffer_upload( vertex_buffer *vb, b8 dynamic )
{
  state_ptr->backend.upload_vertex_buffer( vb, dynamic );
} // -------------------------------------------------------------------------

void vertex_buffer_clear( vertex_buffer* vb )
{
  if( vb )
  {
    vector_clear( vb->vertices );
  }
} // -------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// Meshes
// ----------------------------------------------------------------------------

mesh* mesh_create( void )
{
  struct mesh* g = memory_allocate( sizeof( struct mesh ), MEM_TAG_MESH );
  g->vertex_count = 0;
  g->elements = vector_create( sizeof( u32 ), 64, MEM_TAG_MESH );
  g->buffer_count = 0;
  memory_zero( g->buffers, sizeof( struct vertex_buffer* ) * MAX_VBOS );

  if( !state_ptr->backend.create_mesh( g ) )
  {
    FZY_ERROR( "mesh_create :: Failed to create backend reources for geometry" );
    vector_destroy( g->elements );
    memory_delete( g, sizeof( struct mesh ), MEM_TAG_MESH );
    return 0;
  }

  return g;
} // -------------------------------------------------------------------------

void mesh_destroy( void* mesh )
{
  if( mesh )
  {
    struct mesh* g = (struct mesh*)mesh;

    for( u32 i = 0; i < g->buffer_count; i++ )
    {
      // free the vertex buffers
      vertex_buffer_destroy( g->buffers[ i ] );
      g->buffers[ i ] = 0;
    }

    // free the index vector
    vector_destroy( g->elements );

    if( !state_ptr->backend.destroy_mesh( g ) )
    {
      FZY_ERROR( "mesh_destroy :: failed to destroy backend reources" );
    }

    memory_delete( g, sizeof( struct mesh ), MEM_TAG_MESH );

    g = 0;
  }
} // -------------------------------------------------------------------------

b8 mesh_add_vertex_buffer( mesh* mesh, vertex_buffer *vb )
{
  if( mesh )
  {
    if( mesh->buffer_count < MAX_VBOS )
    {
      if( mesh->buffer_count > 0 )
      {
        if( mesh->vertex_count != vector_size( vb->vertices ) )
        {
          FZY_ERROR("mesh_add_vertex_buffer :: Attempting to add a vertex_buffer with a different vertex_count" );
          return false;
        }
      }

      mesh->buffers[ mesh->buffer_count++ ] = vb;
      mesh->vertex_count = vector_size( mesh->buffers[ 0 ]->vertices );
      return true;
    }
    return false;
  }
  return false;
} // -------------------------------------------------------------------------

void mesh_upload( mesh* mesh, b8 dynamic )
{
  state_ptr->backend.upload_mesh( mesh, dynamic );
} // -------------------------------------------------------------------------

void mesh_draw( mesh* mesh )
{
  state_ptr->backend.draw_mesh( mesh );
} // -------------------------------------------------------------------------

void mesh_clear( mesh* mesh )
{
  if( mesh )
  {
    for( u8 i = 0; i < mesh->buffer_count; i++ )
    {
      vertex_buffer_clear( mesh->buffers[ i ] );
    }
    vector_clear( mesh->elements );
    mesh->is_valid = false;
  }
}

// ----------------------------------------------------------------------------
// Textures
// ----------------------------------------------------------------------------

texture* texture_create( const char* path, u32 atlas_square )
{
  texture *t = memory_allocate( sizeof( struct texture ), MEM_TAG_TEXTURE );
  if( !state_ptr->backend.create_texture( t, path, atlas_square ) )
  {
    FZY_INFO( "texture_create :: failed to load image" );
  }
  return t;
} // -------------------------------------------------------------------------

texture* texture_create_writeable( attachment attachment, u16 width, u16 height )
{
  texture *t = memory_allocate( sizeof( struct texture ), MEM_TAG_TEXTURE );

  if( !state_ptr->backend.create_writeable_texture( t, attachment, width, height ) )
  {
    FZY_INFO( "texture_create_writeable :: failed to create a writeable texture" );
  }
  return t;
} // -------------------------------------------------------------------------

void texture_destroy( void* texture )
{
  if( texture )
  {
    // free internal_data
    state_ptr->backend.destroy_texture( (struct texture*)texture );
    // free the texture struct
    memory_delete( texture, sizeof( struct texture ), MEM_TAG_TEXTURE );
  }
} // -------------------------------------------------------------------------

void texture_bind( texture* texture, u32 active_texture )
{
  state_ptr->backend.bind_texture( texture, active_texture );
} // -------------------------------------------------------------------------

void texture_unbind( )
{
  state_ptr->backend.unbind_texture( );
} // -------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// Materials
// ----------------------------------------------------------------------------

material* material_create( struct texture* texture, u32 texture_index, struct texture* normal_map, u32 normal_index, f32 reflectivity )
{
  material* mtl = memory_allocate( sizeof( struct material ), MEM_TAG_MATERIAL );
  if( texture )
  {
    mtl->reflectivity = (f32)(fzy_clamp( reflectivity, 0.0, 1.0 ));
    mtl->albedo = texture;
    if( texture_index <= 1 )
      mtl->texture_index = 1;
    else
      mtl->texture_index = texture_index;
  }
  if( normal_map )
  {
    mtl->normal_map = normal_map;
    if( normal_index <= 1 )
      mtl->normal_index = 1;
    else
      mtl->normal_index = normal_index;
  }
  return mtl;
} // -------------------------------------------------------------------------

void material_destroy( void* material )
{
  if( material )
  {
    memory_delete( material, sizeof( struct material ), MEM_TAG_MATERIAL );
  }
} // -------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// Renderpass
// ----------------------------------------------------------------------------

renderpass* renderpass_create( u8 attachments, vec2 size, u32 clear_flags, vec4 clear_color, renderpass* previous )
{
  if( attachments == 0 )
    return 0;

  renderpass* rp = memory_allocate( sizeof( struct renderpass ), MEM_TAG_RENDERER );
  rp->internal_data = 0;
  rp->width = (i32)size.x;
  rp->height = (i32)size.y;
  rp->clear_color = clear_color;
  rp->previous = previous;
  memory_zero( rp->attachments, sizeof( struct texture* ) );

  if( bitmask_test( attachments, ATTACHMENT_POSITION ) )
    rp->attachments[ ATTACHMENT_POSITION ] = texture_create_writeable( ATTACHMENT_POSITION, rp->width, rp->height );
  if( bitmask_test( attachments, ATTACHMENT_NORMAL ) )
    rp->attachments[ ATTACHMENT_NORMAL ] = texture_create_writeable( ATTACHMENT_NORMAL, rp->width, rp->height );
  if( bitmask_test( attachments, ATTACHMENT_COLOR ) )
    rp->attachments[ ATTACHMENT_COLOR ] = texture_create_writeable( ATTACHMENT_COLOR, rp->width, rp->height );
  if( bitmask_test( attachments, ATTACHMENT_DEPTH ) )
    rp->attachments[ ATTACHMENT_DEPTH ] = texture_create_writeable( ATTACHMENT_DEPTH, rp->width, rp->height );


  if( !state_ptr->backend.renderpass_create( rp, clear_flags ) )
  {
    FZY_ERROR( "framebuffer_create :: failed to create framebuffer internal data" );
    for( u8 i = 0; i < ATTACHMENT_TOTAL; i++ )
      if( rp->attachments[ i ] )
        texture_destroy( rp->attachments[ i ] );
    memory_delete( rp, sizeof( struct renderpass ), MEM_TAG_RENDERER );
    rp = 0;
    return 0;
  }


  return rp;
} // -------------------------------------------------------------------------

void renderpass_destroy( renderpass* pass )
{
  if( pass )
  {
    if( !state_ptr->backend.renderpass_destroy( pass ) )
    {
      FZY_ERROR( "renderpass_destroy :: failed to destroy backend resources" );
    }

    for( u8 i = 0; i < ATTACHMENT_TOTAL; i++ )
    {
      if( pass->attachments[ i ] )
        texture_destroy( pass->attachments[ i ] );
    }

    memory_delete( pass, sizeof( struct renderpass ), MEM_TAG_RENDERER );
  }
} // -------------------------------------------------------------------------

void renderpass_begin( renderpass* pass )
{
  state_ptr->backend.renderpass_begin( pass );
} // -------------------------------------------------------------------------

void renderpass_end( renderpass* pass )
{
  state_ptr->backend.renderpass_end( pass );
} // -------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// Draw functions
// ----------------------------------------------------------------------------
