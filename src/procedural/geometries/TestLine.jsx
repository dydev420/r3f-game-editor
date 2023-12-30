import { useState } from "react";
import { LineGeometry } from "three";

const TestLine = React.forwardRef(function Line({ points, color = 'black', lineWidth, ...rest }, ref) {
  const [line2] = useState(() => new Line2())
  const [lineMaterial] = useState(() => new LineMaterial())
  const [resolution] = useState(() => new Vector2(512, 512))
  useEffect(() => {
    const geom = new LineGeometry()
    geom.setPositions(points.flat())
    line2.geometry = geom
    line2.computeLineDistances()
  }, [points, line2])

  return (
    <primitive dispose={undefined} object={line2} ref={ref} {...rest}>
      <primitive
        dispose={undefined}
        object={lineMaterial}
        attach="material"
        color={color}
        resolution={resolution}
        linewidth={lineWidth}
        {...rest}
      />
    </primitive>
  )
});

export default TestLine;
