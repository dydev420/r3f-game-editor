import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Line, Text, useGLTF } from "@react-three/drei";
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
import RoadSegment from "../../procedural/geometries/RoadSegment";
import LevelLights from "./LevelLights";
import CarPrefab from "../../prefabs/car/components/CarPrefab";
import GridRoadBlocks from "./GridRoadBlocks";
import useWaveAlt from "../hooks/useWaveAlt";
import useWaveCollapse from "../hooks/useWaveCollapse";
import useWaveSockets from "../hooks/useWaveSockets";
import useWaveRoads from "../hooks/useWaveRoads";

/**
 * const debugActors
 */
const debugActors = [
  'boxy',
  'sage',
  'mustang'
];
const debugPositions = [
  [1,0,0],
  [2,0,0],
  [3,0,0]
];

/**
 * Main Level Component
 */
export default function LevelWaveFunction({
  gridSize = GRID_SIZE,
  blockSize = BLOCK_SIZE,
}) {

  /**
   * Level Store
   */
  const actors = useLevelEditorStore(state => state.actors);
  const grid = useLevelEditorStore(state => state.grid);
  const initGrid = useLevelEditorStore(state => state.initGrid);

  /**
   * Wave Function Collapse Hooks
   */
  const { waveGrid } = useWaveRoads(gridSize);

  useEffect(() => {
    initGrid(gridSize);
  }, [gridSize]);

  useFrame(() => {
    // console.log('Actors', actors);
    // console.log('Grid', grid);
  });

return (
    <>
      {/* {
        grid.map((rows, i) => {
          return rows.map((column, j) => {
            return (
              <GridRoadBlocks
                key={`$grid-road-${i}-${j}`}
                cell={column.gridCell}
                blockSize={blockSize}
                type={column?.object?.name}
                meshRotation={0}
              />
            )
          });
        })
      } */}

      {
        waveGrid.current.map((item, i) => {
          return (
            <GridRoadBlocks
              key={`$grid-road-${i}`}
              cell={item.cell}
              blockSize={blockSize}
              type={item.type}
              collapsed={item.collapsed}
              meshRotation={item.rotation}
            />
          );
        })
      }

      <GridBounds gridSize={gridSize} blockSize={blockSize} />
      <LevelLights gridSize={gridSize} blockSize={blockSize} />

      <EditorGizmo />
    </>
  )
}
