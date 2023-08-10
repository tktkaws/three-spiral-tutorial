import { Vector3 } from "three"
import { ITEMS, SPIRAL_OFFSET_ANGLE_RAD, SPIRAL_OFFSET_Y } from "./define"
import renderingSystem from "./renderingSystem"
import SpiralItem from "./SpiralItem"

class SpiralSystem {
  items!: SpiralItem[]
  init() {
    this.items = ITEMS.map((v, i) => {
      return new SpiralItem(v, i, renderingSystem.scene)
    })
  }

  calcItemPosition(i: number, position: Vector3) {
    const itemRot = SPIRAL_OFFSET_ANGLE_RAD * i
    const x = Math.sin(itemRot)
    const z = Math.cos(itemRot)
    const y = SPIRAL_OFFSET_Y *  i

    position.set(x, y, z)
  }

  exec() {
    this.items.forEach((v, i) => {
      this.calcItemPosition(i, v.object.position)
      if (v.isPlane) v.ajustPlaneShape()
      else v.rotate()
    })
  }
}

const spiralSystem = new SpiralSystem
export default spiralSystem
