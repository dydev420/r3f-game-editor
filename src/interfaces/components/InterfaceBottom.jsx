
import { useEffect, useRef } from "react";
import useLevelEditorStore from "../../editor/stores/useLevelEditorStore";
import { addEffect, useFrame } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/web"
import { TERRAIN_MATERIALS } from "../../editor/utils/constants";

function GridOptionsUI(props) {
  /**
   * Refs
   */
  const uiRef = useRef();
  
  const editorTarget = useLevelEditorStore(state => state.editorTarget);

  const showGridOptions = editorTarget.type === 'grid';

  /**
   * Animation Springs
   */
  const fadeIn = useSpring({
    opacity: showGridOptions ? 1 : 0,
  });

  

  return (
    <animated.div ref={uiRef} style={fadeIn} className="grid-options">
      { props.children }
    </animated.div>
  );
}

export default GridOptionsUI;
