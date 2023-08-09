import { MODELS } from "./define";
import { load } from "./meshLoader";
import renderingSystem from "./renderingSystem";
import spiralSystem from "./spiralSystem";

Promise
  .all(MODELS.map(v => load(v)))
  .then(() => {
    spiralSystem.init()
    const loop = () => {
      spiralSystem.exec()
      renderingSystem.exec()
      requestAnimationFrame(loop)
    }
    loop()
  })

