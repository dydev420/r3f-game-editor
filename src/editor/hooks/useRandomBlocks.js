import { useMemo } from "react";

const useRandomBlocks = ({
  count, 
  types,
  seed = 1
}) => {
  const blocks = useMemo(() => {
    const blocks = [];

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      blocks.push(type);
    }

    return blocks;
  }, [count, types, seed]);

  return blocks;
};

export default useRandomBlocks;
