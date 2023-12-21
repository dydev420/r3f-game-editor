import { OrbitControls } from '@react-three/drei'
import Lights from './Lights.jsx'
import { Physics } from '@react-three/rapier'
import Player from './Player.jsx'
import useGame from './stores/useGame.js'
import LevelEditor from './editor/components/LevelEditor.jsx'
import { Perf } from 'r3f-perf'
import { useControls } from 'leva'
import { BLOCK_SIZE, GRID_SIZE } from './editor/utils/constants.js'

export default function Experience()
{
    const blocksCount = useGame((state) => state.blocksCount);
    const blocksSeed = useGame((state) => state.blocksSeed);

    const { gridSize, blockSize } = useControls({
        gridSize: { value: GRID_SIZE, min: 1, max: 32, step: 2 },
        blockSize: { value: BLOCK_SIZE, min: 1, max: 32, step: 1 },
    });

    return <>
        <Perf />

        <color args={['#bdedfc']} attach="background" />

        <Physics timeStep="vary" debug={true}>
            <Lights />
            <LevelEditor gridSize={gridSize} blockSize={blockSize} />
            
            {/* <Player /> */}
        </Physics>

    </>
}
