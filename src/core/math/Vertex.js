import {Vector2 } from './Vector2.js';
import { Vector3 } from './Vector3.js';

class Vertex {
  constructor( position = new Vector3(), normal = new Vector3(), texcoords = new Vector2, tangent = new Vector3(), bitangents = new Vector3() ) {
    this.position = position;
    this.normal = normal;
    this.texcoords = texcoords;
    this.tangent = tangent;
    this.bitangent = bitangents;
  }

  setPosition( position ) {
    this.position = position;
  }

  setNormal( normal ) {
    this.normal = normal;
  }

  setTexcoords( texcoords ) {
    this.texcoords = texcoords;
  }

  setTangent( tangent ) {
    this.tangent = tangent;
  }

  setBitangent( bitangent ) {
    this.bitangent = bitangent;
  }

  
  // Gets the vertex in array form -----------------------------------------
  toArray( array ) {
    if( array != undefined ) {
      array.push( this.position.x, this.position.y, this.position.z,
                  this.normal.x, this.normal.y, this.normal.z,
                  this.texcoords.x, this.texcoords.y,
                  this.tangent.x, this.tangent.y, this.tangent.z,
                  this.bitangent.x, this.bitangent.y, this.bitangent.z );
    }
  }
}

export { Vertex };
