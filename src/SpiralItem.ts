import { DoubleSide, Mesh, MeshBasicMaterial, Object3D, PlaneGeometry, TextureLoader } from "three";
import { ITEMS, SPIRAL_OFFSET_ANGLE_RAD } from "./define";
import { loadedmeshes } from "./meshLoader";

const textureLoader = new TextureLoader

export default class SpiralItem {
  object!: Object3D
  isPlane = false

  initAsModel(item: typeof ITEMS[number]) {
    this.object = loadedmeshes[item.model!].clone()
    this.object.traverse(v => {
      const mesh = v as Mesh
      if (mesh.isMesh && !Array.isArray(mesh.material)) {
        mesh.material = mesh.material.clone()
        mesh.material.transparent = true
      }
    })

    this.object.scale.set(.5, .5, .5)
    this.object.rotation.x = Math.PI * 2 * Math.random()
    this.object.rotation.y = Math.PI * 2 * Math.random()
    this.object.rotation.z = Math.PI * 2 * Math.random()
  }

  initAsPlane(item: typeof ITEMS[number]) {
    const geo = new PlaneGeometry(.5, .3)
    const mat = new MeshBasicMaterial({
      map: textureLoader.load(`imgs/${item.texture}`),
      side: DoubleSide,
      transparent: true,
    })
    this.object = new Mesh(geo, mat)
    this.isPlane = true
  }

  ajustPlaneShape() {
    const itemRot = SPIRAL_OFFSET_ANGLE_RAD * this.i
    this.object.rotation.y = itemRot
  }

  constructor(item: typeof ITEMS[number], public i: number, parent: Object3D) {
    if (item.model) this.initAsModel(item)
    else this.initAsPlane(item)
    this.object.traverse(v => v.userData = { i })
    parent.add(this.object)
  }
}
