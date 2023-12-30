import React from 'react'

function EmissiveShapes(type ="box") {
  switch (type) {
    default: return (
      <mesh >
        <boxGeometry />
        <meshStandardMaterial emissive="red" emissiveIntensity={10} />
      </mesh>
    )
  }
}

export default EmissiveShapes