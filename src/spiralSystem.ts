import { Raycaster, Vector3 } from "three"
import { AUTO_GLOBAL_ROT_SPEED, ITEMS, SPIRAL_LOOP, SPIRAL_OFFSET_ANGLE_RAD, SPIRAL_OFFSET_Y, SPIRAL_SPLIT } from "./define"
import PointerState from "./PointerState"
import renderingSystem from "./renderingSystem"
import SpiralItem from "./SpiralItem"

class SpiralSystem {
  pointerState = new PointerState
  spiralRot = 0
  spiralYByScroll = 0
  spiralVelocity = { rot: 0, y: 0 }
  items!: SpiralItem[]
  raycaster = new Raycaster

  getPointedObj() {
    const rayFrom = {
      x: this.pointerState.currentPos.x / innerWidth * 2 - 1,
      y: (this.pointerState.currentPos.y / innerHeight * 2 - 1) * -1
    }
    this.raycaster.setFromCamera(rayFrom, renderingSystem.camera)

    const objs = this.items.map(v => v.object)
    const intersected = this.raycaster.intersectObjects(objs)
    return intersected[0]
  }

  init() {
    this.items = ITEMS.map((v, i) => {
      return new SpiralItem(v, i, renderingSystem.scene)
    })
  }

  calcItemPosition(i: number, spiralRot: number, spiralY: number, position: Vector3) {
    const itemRot = SPIRAL_OFFSET_ANGLE_RAD * i + spiralRot
    const x = Math.sin(itemRot)
    const z = Math.cos(itemRot)
    let y = SPIRAL_OFFSET_Y * i + spiralY
    y %= SPIRAL_OFFSET_Y * SPIRAL_SPLIT * SPIRAL_LOOP
    if (y < 0) y += SPIRAL_OFFSET_Y * SPIRAL_SPLIT * SPIRAL_LOOP

    position.set(x, y, z)
  }

  calcSpiralPositionAndRotation(delta: number) {
    if (this.pointerState.down) {
      this.spiralVelocity.rot = this.pointerState.deltaPos.x * .008
      this.spiralVelocity.y = this.pointerState.deltaPos.y * .008 * -1

      this.spiralRot += this.spiralVelocity.rot
      this.spiralYByScroll += this.spiralVelocity.y
    } else {
      this.spiralRot += delta / 1000 * AUTO_GLOBAL_ROT_SPEED
      this.spiralRot += this.spiralVelocity.rot
      this.spiralYByScroll += this.spiralVelocity.y

      this.spiralVelocity.rot *= .95
      this.spiralVelocity.y *= .95
    }
  }

  exec(delta: number) {
    const rotRate = this.spiralRot / (Math.PI * 2)
    const spiralYByRot = rotRate * SPIRAL_SPLIT * SPIRAL_OFFSET_Y
    const spiralY = this.spiralYByScroll + spiralYByRot

    this.calcSpiralPositionAndRotation(delta)

    this.items.forEach((v, i) => {
      this.calcItemPosition(i, this.spiralRot, spiralY, v.object.position)
      if (v.isPlane) v.ajustPlaneShape(this.spiralRot)
      else v.rotate()
    })

    if (this.pointerState.click) {
      const t = this.getPointedObj()
      if (t) console.log(t.object.userData)
    }

    this.pointerState.update()
  }
}

const spiralSystem = new SpiralSystem
export default spiralSystem
