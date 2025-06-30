#include "renderer/opengl/gl_mesh.h"

#include "core/fzy_vector.h"
#include "core/fzy_memory.h"
#include "core/fzy_logger.h"

#ifdef USING_OPENGL

#include "renderer/opengl/gl_types.h"
#include <glad/glad.h>


b8 gl_vertex_buffer_create( vertex_buffer* vb )
{
  if( !vb->vertices || !vb->stride || !vb->layout || !vb->type )
  {
    FZY_WARNING( "gl_vertex_buffer :: attempted to create opengl vertex bufer with incomplete data" );
    return false;
  }

  gl_vertex_buffer* backend = memory_allocate( sizeof( gl_vertex_buffer ), MEM_TAG_MESH );
  b->vbo = 0;
  vb->internal_data = backend;
  return true;
} // --------------------------------------------------------------------------

b8 gl_vertex_buffer_destroy( vertex_buffer *vb )
{
  if( !vb || vb->internal_data ) return false;

  gl_vertex_buffer* buffer = (gl_vertex_buffer*)vb->internal_data;
  if( buffer->vbo){
    glDeleteBuffers( 1, &buffer->vbo);
  }
  memory_delete( buffer, sizeof( gl_vertex_buffer ), MEM_TAG_MESH );
  return true;
} // --------------------------------------------------------------------------

void gl_vertex_buffer_upload( vertex_buffer *vb, b8 dynamic )
{
  if( !vb || !vb->internal_data || !vb->vertices ) return;

  gl_vertex_buffer* buffer = (gl_vertex_buffer*)vb->internal_data;
  u32 size_bytes = vector_stride( vb->vertices) * vector_size( vb->vertices );

  if( buffer->vbo )
  {
    glGenBuffers(1, &buffer->vbo);
    glBindBuffer(GL_ARRAY_BUFFER, buffer->vbo); FZY_CHECK_GL_ERROR;
    glBufferData(GL_ARRAY_BUFFER, size_bytes, _vector_data(vb->vertices), dynamic ? GL_DYNAMIC_DRAW : GL_STATIC_DRAW); FZY_CHECK_GL_ERROR;
    glBindBuffer(GL_ARRAY_BUFFER, 0); FZY_CHECK_GL_ERROR;
    vb->is_uploaded = true;
    return;
  }

  glBindBuffer(GL_ARRAY_BUFFER, buffer->vbo); FZY_CHECK_GL_ERROR;

  if (vector_size(vb->vertices) <= vb->capacity)
  {
    glBufferSubData(GL_ARRAY_BUFFER, 0, size_bytes, _vector_data(vb->vertices)); FZY_CHECK_GL_ERROR;
  }
  else
  {
    glBufferData(GL_ARRAY_BUFFER, size_bytes, _vector_data(vb->vertices), dynamic ? GL_DYNAMIC_DRAW : GL_STATIC_DRAW); FZY_CHECK_GL_ERROR;
    vb->max = vector_size(vb->vertices);
  }

  glBindBuffer(GL_ARRAY_BUFFER, 0); FZY_CHECK_GL_ERROR;
  vb->is_uploaded = true;
} // --------------------------------------------------------------------------


b8 gl_mesh_create( mesh* mesh )
{
  if (!mesh || mesh->internal_data) return false;

  gl_mesh* backend = memory_allocate(sizeof(gl_mesh), MEM_TAG_MESH);
  backend->vao = 0;
  backend->ibo = 0;
  mesh->internal_data = backend;
  return true;
} // --------------------------------------------------------------------------

b8 gl_mesh_destroy( mesh* mesh )
{
  if (!mesh || !mesh->internal_data) return false;

  gl_mesh* backend = (gl_mesh*)mesh->internal_data;
  if (backend->ibo) glDeleteBuffers(1, &backend->ibo);
  if (backend->vao) glDeleteVertexArrays(1, &backend->vao);

  memory_delete(backend, sizeof(gl_mesh), MEM_TAG_MESH);
  return true;
} // --------------------------------------------------------------------------

void gl_mesh_upload( mesh* mesh, b8 dynamic )
{
  if (!mesh || !mesh->internal_data || !mesh->elements) return;

  gl_mesh* backend = (gl_mesh*)mesh->internal_data;

  if (backend->vao == 0) {
    glGenVertexArrays(1, &backend->vao); FZY_CHECK_GL_ERROR;
    glBindVertexArray(backend->vao); FZY_CHECK_GL_ERROR;

    if (backend->ibo == 0) glGenBuffers(1, &backend->ibo); FZY_CHECK_GL_ERROR;
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, backend->ibo); FZY_CHECK_GL_ERROR;

    mesh->max = vector_size(mesh->elements);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, mesh->capacity * sizeof(u32), _vector_data(mesh->elements), dynamic ? GL_DYNAMIC_DRAW : GL_STATIC_DRAW); FZY_CHECK_GL_ERROR;

    u32 attrib_index = 0;
    for (i32 i = 0; i < mesh->buffer_count; ++i) {
      vertex_buffer* vb = mesh->buffers[i];
      if (!vb->is_uploaded) gl_vertex_buffer_upload(vb, dynamic);

      gl_vertex_buffer* gl_vb = (gl_vertex_buffer*)vb->internal_data;
      if (!gl_vb || !gl_vb->vbo) continue;

      glBindBuffer(GL_ARRAY_BUFFER, gl_vb->vbo); FZY_CHECK_GL_ERROR;
      glVertexAttribPointer(attrib_index, vb->layout, vb->type, GL_FALSE, vb->stride, (void*)0); FZY_CHECK_GL_ERROR;
      glEnableVertexAttribArray(attrib_index++); FZY_CHECK_GL_ERROR;
      glBindBuffer(GL_ARRAY_BUFFER, 0); FZY_CHECK_GL_ERROR;
    }

    glBindVertexArray(0); FZY_CHECK_GL_ERROR;
    mesh->is_valid = true;
    return;
  }

  // Update path
  glBindVertexArray(backend->vao); FZY_CHECK_GL_ERROR;
  u32 current_size = vector_size(mesh->elements);

  if (current_size > mesh->max) {
    mesh->max = current_size;
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, backend->ibo); FZY_CHECK_GL_ERROR;
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, mesh->max * sizeof(u32), _vector_data(mesh->elements), dynamic ? GL_DYNAMIC_DRAW : GL_STATIC_DRAW); FZY_CHECK_GL_ERROR;
  } else {
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, backend->ibo); FZY_CHECK_GL_ERROR;
    glBufferSubData(GL_ELEMENT_ARRAY_BUFFER, 0, sizeof(u32) * current_size, _vector_data(mesh->elements)); FZY_CHECK_GL_ERROR;
  }

  for (u32 i = 0; i < mesh->buffer_count; ++i) {
    gl_vertex_buffer_upload(mesh->buffers[i], true);
  }

  glBindVertexArray(0); FZY_CHECK_GL_ERROR;
  mesh->is_valid = true;
} // --------------------------------------------------------------------------

void gl_mesh_draw( mesh* mesh )
{
  if (!mesh || !mesh->is_valid) return;

  gl_mesh* backend = (gl_mesh*)mesh->internal_data;
  glBindVertexArray(backend->vao); FZY_CHECK_GL_ERROR;

  u32 index_count = vector_size(mesh->elements);
  if (index_count > 0)
  {
    glDrawElements(GL_TRIANGLES, index_count, GL_UNSIGNED_INT, 0); FZY_CHECK_GL_ERROR;
  }
  else
  {
    glDrawArrays(GL_TRIANGLE_STRIP, 0, mesh->vertex_count); FZY_CHECK_GL_ERROR;
  }

  glBindVertexArray(0); FZY_CHECK_GL_ERROR;

} // ---------------------------------------------------------------------------


#endif
