import Astro from "../../models/Astro";
import Boxy from "../../models/Boxy";
import Mustang from "../../models/Mustang";
import Sage from "../../models/Sage";

const actorMap = {
  'boxy': Boxy,
  'sage': Sage,
  'mustang': Mustang,
  'astro': Astro,
};

export default actorMap;
