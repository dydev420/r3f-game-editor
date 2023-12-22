import { Float, Text, useCursor } from "@react-three/drei";
import { BoxGeometry, Color, MeshStandardMaterial } from "three";
import { BLOCK_SIZE } from "../utils/constants";
import { useEffect, useRef, useState } from "react";
import useLevelEditorStore from "../stores/useLevelEditorStore";


const floorIdleColor = 'limegreen';
const floorHoverColor = 'aqua';
const floorSelectedColor = 'orange';
const boxGeometry = new BoxGeometry(1, 1, 1);
const floorMaterial = new MeshStandardMaterial({ color: floorIdleColor});

function GridBlock({
  cell = [0, 0],
  blockSize = BLOCK_SIZE,
}) {
  const cellX = cell[0];
  const cellZ = cell[1];
  const cellName = `grid-block-${cellX}-${cellZ}`;

  /**
   * Store
   */
  const grid = useLevelEditorStore(state => state.grid);
  const editorTarget = useLevelEditorStore(state => state.editorTarget);
  const updateTarget = useLevelEditorStore(state => state.updateTarget);
  const resetTarget = useLevelEditorStore(state => state.resetTarget);

  /**
   * Refs
   */
  const floorMesh = useRef(null);

   /**
    * Selected State
    */
   const [selected, setSelected ] = useState(false);

  /**
   * Methods
   */
  const updateFloorHoverColor = (isHover) => {
    if(selected) {
      return;
    }
    
    if(isHover) {
      // Set floorHoverColor to material instance of instanced mesh
      floorMesh.current.material.color.set(floorHoverColor);
    } else {
      // Set floorIdleColor
      floorMesh.current.material.color.set(floorIdleColor);
    }
  };

  const updateFloorSelectedColor = (isSelected) => {
    if(isSelected) {
      floorMesh.current.material.color.set(floorSelectedColor);
    } else {
      floorMesh.current.material.color.set(floorIdleColor);
    }
  };

  /**
   * Event Handlers
   */
  const handleClick = (e) => {
    e.stopPropagation();

    setSelected(true);

    updateTarget(cellName, 'grid');
  }

  const handlePointerMiss = () => {
    setSelected(false);

    if(editorTarget.name === cellName) {
      resetTarget();
    }
  }

  const handleContextMenu = () => {
    cycleMode();
  }

  const handlePointerOver = () => {
    updateFloorHoverColor(true);

  }

  const handlePointerOut = () => {
    updateFloorHoverColor(false);
  }


  useEffect(() => {
    updateFloorSelectedColor(selected);
  }, [selected]);

  return(
    <group
      name={cellName}
      ref={grid[cellX][cellZ]?.terrainRef}
      position={[cellX * blockSize, 0, cellZ * blockSize]}
      onClick={handleClick}
      onPointerMissed={handlePointerMiss}
      onContextMenu={handleContextMenu}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >

      {/* Floor */}
      <mesh
        receiveShadow
        ref={floorMesh}
        position={[0, -0.1, 0]}
        scale={[blockSize, 0.2, blockSize]}
        // geometry={boxGeometry}
        // material={floorMaterial}
      >
        <boxGeometry />
        <meshStandardMaterial color={floorIdleColor} />
      </mesh>
    </group>  
  );
}

export default GridBlock;