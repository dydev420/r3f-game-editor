import React from 'react'
import { BoxGeometry, BufferAttribute, BufferGeometry, Float32BufferAttribute, MeshNormalMaterial, MeshStandardMaterial } from 'three';

const geometry  = new BufferGeometry();
const material = new MeshNormalMaterial({wireframe: true});

const size = 20;
const segments = 10;

const halfSize = size / 2;
const segmentSize = size / segments;

const vertices = [];
const indices = [];
const normals = [];

// generate vertices, normals for a simple grid geometry

for ( let i = 0; i <= /*1*/ segments; i ++ ) {

  const y = ( i * /*1*/ segmentSize ) - /*0.5*/ halfSize;

  for ( let j = 0; j <= segments; j ++ ) {

    const x = ( j * /*1*/ segmentSize ) - halfSize;

    vertices.push( x, - y, 0 );
    normals.push( 0, 0, 1 );
  }

}

// generate indices (data for element array buffer)

for ( let i = 0; i < segments; i ++ ) {

  for ( let j = 0; j < segments; j ++ ) {

    const a = i * ( segments + 1 ) + ( j + 1 );
    const b = i * ( segments + 1 ) + j;
    const c = ( i + 1 ) * ( segments + 1 ) + j;
    const d = ( i + 1 ) * ( segments + 1 ) + ( j + 1 );

    // generate two faces (triangles) per iteration

    indices.push( a, b, d ); // face one
    indices.push( b, c, d ); // face two

  }

}

geometry.setIndex( indices );
geometry.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
geometry.setAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );



function ProceduralRoad(props) {
  return (
    <mesh {...props}
      geometry={geometry}
      material={material}
    />
  )
}

export default ProceduralRoad;
