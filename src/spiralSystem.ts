import { Vector3 } from "three"
import { AUTO_GLOBAL_ROT_SPEED, ITEMS, SPIRAL_OFFSET_ANGLE_RAD, SPIRAL_OFFSET_Y } from "./define"
import renderingSystem from "./renderingSystem"
import SpiralItem from "./SpiralItem"

class SpiralSystem {
  spiralRot = 0
  items!: SpiralItem[]
  init() {
    this.items = ITEMS.map((v, i) => {
      return new SpiralItem(v, i, renderingSystem.scene)
    })
  }

  calcItemPosition(i: number, spiralRot: number, position: Vector3) {
    const itemRot = SPIRAL_OFFSET_ANGLE_RAD * i + spiralRot
    const x = Math.sin(itemRot)
    const z = Math.cos(itemRot)
    const y = SPIRAL_OFFSET_Y * i

    position.set(x, y, z)
  }

  calcSpiralPositionAndRotation(delta: number) {
    this.spiralRot += delta / 1000 * AUTO_GLOBAL_ROT_SPEED
  }

  exec(delta: number) {
    this.calcSpiralPositionAndRotation(delta)

    this.items.forEach((v, i) => {
      this.calcItemPosition(i, this.spiralRot, v.object.position)
      if (v.isPlane) v.ajustPlaneShape(this.spiralRot)
      else v.rotate()
    })
  }
}

const spiralSystem = new SpiralSystem
export default spiralSystem
