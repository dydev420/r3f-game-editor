import { OrbitControls } from '@react-three/drei'
import Lights from './Lights.jsx'
import { Physics } from '@react-three/rapier'
import Player from './Player.jsx'
import useGame from './stores/useGame.js'
import LevelEditor from './editor/components/LevelEditor.jsx'
import { Perf } from 'r3f-perf'
import { useControls } from 'leva'
import { BLOCK_SIZE, GRID_SIZE } from './editor/utils/constants.js'
import LevelLights from './editor/components/LevelLights.jsx'
import IsoPerspectiveCam from './cameras/components/IsoPerspectiveCam.jsx'
import LevelWaveFunction from './editor/components/LevelWaveFunction.jsx'

export default function Experience()
{
    const blocksCount = useGame((state) => state.blocksCount);
    const blocksSeed = useGame((state) => state.blocksSeed);

    const {
        gridSize,
        blockSize,
        showDirectionLight,
        useGameCamera,
        hasPlayer
    } = useControls({
        gridSize: { value: GRID_SIZE, min: 1, max: 32, step: 2 },
        blockSize: { value: BLOCK_SIZE, min: 1, max: 32, step: 1 },
        showDirectionLight: { value: true },
        useGameCamera: { value: true },
        hasPlayer: { value: false },
    });

    return <>
        <Perf position="top-left" showGraph={false} />

        <color args={['#bdedfc']} attach="background" />

        {
            useGameCamera
                ? <IsoPerspectiveCam makeDefault />
                : <OrbitControls makeDefault />
        }

        <Physics timeStep="vary" debug={true}>
            {
                showDirectionLight && <Lights />
            }
            {
                hasPlayer && <Player />
            }

            {/* <LevelEditor gridSize={gridSize} blockSize={blockSize} /> */}
            
            <LevelWaveFunction gridSize={gridSize} blockSize={blockSize} />
        
        </Physics>

    </>
}
