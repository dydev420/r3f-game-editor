import React, { forwardRef, useRef } from "react";
import { BLOCK_SIZE } from "../editor/utils/constants";

const Boxy = forwardRef((props, ref) => {
  const group = useRef();
 
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Boxy">
          <mesh scale={[BLOCK_SIZE, 1, BLOCK_SIZE]}>
            <boxGeometry args={[BLOCK_SIZE / 8 , BLOCK_SIZE / 8, BLOCK_SIZE / 8]}/>
            <meshStandardMaterial />
          </mesh>
        </group>
      </group>
    </group>
  );
})

export default Boxy;
