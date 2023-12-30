import React from 'react';
import { BoxGeometry, MeshStandardMaterial, Vector2 } from 'three';
import { getSideWindowTexture, getWindShieldTexture } from '../textures/carTexture';

const wheelGeometry = new BoxGeometry(32, 12, 12);
const wheelMaterial = new MeshStandardMaterial({ color: '#333333' });

const mainGeometry = new BoxGeometry(30, 14, 60);
const mainMaterial = new MeshStandardMaterial({ color: '#a52523' });

const cabinGeometry = new BoxGeometry(26, 12, 32);
const cabinMaterial = new MeshStandardMaterial({ color: '#ffffff' });

const carFrontTexture = getWindShieldTexture();
const carBackTexture = getWindShieldTexture();
const carRightTexture = getSideWindowTexture()
const carLeftTexture = getSideWindowTexture();

// carLeftTexture.center = new Vector2(0.5, 0,5);
// carLeftTexture.rotation = - Math.PI/2;
// carLeftTexture.flipY = false;


function CarPrefab(props) {
  return (
    <group {...props}>
      <mesh
        geometry={wheelGeometry}
        material={wheelMaterial}
        position={[0, 6, -16]}
      />
      <mesh
        geometry={wheelGeometry}
        material={wheelMaterial}
        position={[0, 6, 16]}
      />
      <mesh
        geometry={mainGeometry}
        material={mainMaterial}
        position={[0, 12, 0]}
      />
      <mesh
        geometry={cabinGeometry}
        position={[0, 24, -6]}
        >
          <meshStandardMaterial attach="material-0" map={carLeftTexture} />
          <meshStandardMaterial attach="material-1" map={carRightTexture} />
          <meshStandardMaterial attach="material-2" color="#ffffff" />
          <meshStandardMaterial attach="material-3" color="#ffffff" />
          <meshStandardMaterial attach="material-4" map={carFrontTexture} />
          <meshStandardMaterial attach="material-5" map={carBackTexture} />
        </mesh>
    </group>
  );
}

export default CarPrefab;
