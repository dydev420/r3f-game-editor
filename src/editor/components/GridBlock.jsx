import { Float, Text } from "@react-three/drei";
import { BoxGeometry, MeshStandardMaterial } from "three";
import { BLOCK_SIZE } from "../utils/constants";

const boxGeometry = new BoxGeometry(1, 1, 1);
const floor1Material = new MeshStandardMaterial({ color: 'limegreen'});

function GridBlock({
  position = [0, 0, 0],
  blockSize = BLOCK_SIZE
}) {
  return(
    <group position={position}>

      {/* Floor */}
      <mesh
        receiveShadow
        position={[0, -0.1, 0]}
        scale={[blockSize, 0.2, blockSize]}
        geometry={boxGeometry}
        material={floor1Material}
      />
    </group>  
  );
}

export default GridBlock;