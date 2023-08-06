import { BoxGeometry, DirectionalLight, GridHelper, Mesh, MeshStandardMaterial, PerspectiveCamera, Scene, WebGLRenderer } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

class RenderingSystem {
  canvas = document.createElement("canvas")
  renderer = new WebGLRenderer({
    canvas: this.canvas,
    antialias: true,
    alpha: true,
  })

  fov = 25

  camera = new PerspectiveCamera(this.fov)
  controls = new OrbitControls(this.camera, this.canvas)

  scene = new Scene

  constructor() {
    const width = window.innerWidth
    const height = window.innerHeight
    this.renderer.setSize(width, height)
    this.renderer.setClearColor(0x333333)
    this.renderer.setPixelRatio(devicePixelRatio)

    this.camera.aspect = width / height
    this.camera.position.set(20, 20, 20)
    this.camera.lookAt(0, 0, 0)
    this.camera.updateProjectionMatrix()

    const grid = new GridHelper(100, 100)
    this.scene.add(grid)

    const boxGeo = new BoxGeometry
    const boxMat = new MeshStandardMaterial({
      color: 0x0000ff,
      transparent: true,
      opacity: .3,
    })
    const box = new Mesh(boxGeo, boxMat)
    this.scene.add(box)

    const directionalLight = new DirectionalLight(0xffffff)
    directionalLight.position.set(10, 20, 20)
    directionalLight.lookAt(0, 0, 0)
    this.scene.add(directionalLight)

    document.body.append(this.canvas)
  }

  exec() {
    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }
}

const renderingSystem = new RenderingSystem
export default renderingSystem