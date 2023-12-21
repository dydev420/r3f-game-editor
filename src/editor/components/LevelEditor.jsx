import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Text, useGLTF } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { BoxGeometry, Euler, MeshStandardMaterial, Quaternion, Vector3 } from "three";
import { BlockAxe, BlockEnd, BlockLimbo, BlockSpinner, BlockStart, Bounds } from "./LevelBlocks";
import EditorGizmo from "./EditorGizmo";
import EditorActor from "./EditorActor";
import useLevelEditorStore from "../stores/useLevelEditorStore";
import GridBlock from "./GridBlock";
import { BLOCK_SIZE, GRID_SIZE } from "../utils/constants";
import GridBounds from "./GridBounds";
import Astro from "../../models/Astro";
import { Sage } from "../../models/Sage";
import Boxy from "../../models/Boxy";
import actorMap from "../mappings/actors";

/**
 * const debugActors
 */
const debugActors = [
  'boxy',
  'sage'
];

/**
 * Main Level Component
 */
export default function LevelEditor({
  gridSize = GRID_SIZE,
  blockSize = BLOCK_SIZE
}) {

  /**
   * Level Store
   */
  const actors = useLevelEditorStore(state => state.actors);
  const grid = useLevelEditorStore(state => state.grid);
  const initGrid = useLevelEditorStore(state => state.initGrid);


  useEffect(() => {
    initGrid(gridSize);
  }, [gridSize]);

  useFrame(() => {
    console.log('Actors', actors);
  });

return (
    <>
      {
        grid.map((rows, i) => {
          const cells = rows.map((cell, j) => {
            return (
              <GridBlock
                key={`$grid-block-${i}-${j}`}
                position={[i * blockSize , 0, j * blockSize]}
                blockSize={blockSize}
              />
            )
          })

          return <>
            {cells}
          </>
        })
      }

      <GridBounds gridSize={gridSize} blockSize={blockSize} />

      {
        debugActors.map((actorName, index) => {
          const Actor = actorMap[actorName];
          return (
            <EditorActor index={index} name={actorName}>
              <Actor />
            </EditorActor>
          ) 
        })
      }

      <EditorGizmo />
    </>
  )
}
