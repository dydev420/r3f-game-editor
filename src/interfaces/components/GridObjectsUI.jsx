
import { useEffect, useRef } from "react";
import useLevelEditorStore from "../../editor/stores/useLevelEditorStore";
import { addEffect, useFrame } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/web"
import { TERRAIN_MATERIALS } from "../../editor/utils/constants";
import actorMap from "../../editor/mappings/actors";

function GridObjectsUI() {
  /**
   * Refs
   */
  const uiRef = useRef();
  const buttonGroupRef = useRef();
  
  const editorTarget = useLevelEditorStore(state => state.editorTarget);
  const activeGridCell = useLevelEditorStore(state => state.activeGridCell);
  const setBlockTerrain = useLevelEditorStore(state => state.setBlockTerrain);
  const setBlockObject = useLevelEditorStore(state => state.setBlockObject);

  const showObjects = editorTarget.type === 'grid';

  /**
   * Animation Springs
   */
  const fadeIn = useSpring({
    opacity: showObjects ? 1 : 0,
  });

  const jumpIn = useSpring({
    transform: showObjects ? 'scaleY(100%)': 'scaleY(0%)',
    config: {
      friction: 20,
      tension: 500,
    },
  });

  /**
   * Event handler
   */
  const handleTerrainOptionClick = (e) => {
    const objectName = e.target.id;

    console.log('Object Selected from UI ::', objectName, activeGridCell);

    setBlockObject(activeGridCell, {
      name: objectName,
      type: 'object',
      position: [0, 0, 0]
    });
  }

  

  return (
    <animated.div ref={uiRef} style={fadeIn} className="grid-options">
      <animated.div ref={buttonGroupRef} style={jumpIn} className="card-stack">
        <div className="card" id="boxy" onClick={handleTerrainOptionClick}>boxy</div>
        <div className="card" id="sage" onClick={handleTerrainOptionClick}>sage</div>
        <div className="card" id="mustang" onClick={handleTerrainOptionClick}>mustang</div>
        <div className="card" id="astro" onClick={handleTerrainOptionClick}>astro</div>
      </animated.div>
    </animated.div>
  );
}

export default GridObjectsUI;
