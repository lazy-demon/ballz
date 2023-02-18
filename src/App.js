import * as THREE from 'three'
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MarchingCubes, MarchingCube, MeshTransmissionMaterial, Environment, Bounds } from '@react-three/drei'
import { Physics, RigidBody, BallCollider } from '@react-three/rapier'

const vec = new THREE.Vector3()

function MetaBall({ color, ...props }) {
  const api = useRef()
  useFrame((state, delta) => {
    delta = Math.min(delta, 0.1)
    api.current.applyImpulse(
      vec
        .copy(api.current.translation())
        .normalize()
        .multiplyScalar(delta * -0.05),
    )
  })
  return (
    <RigidBody ref={api} colliders={false} linearDamping={4} angularDamping={0.95} {...props}>
      <MarchingCube strength={0.35} subtract={6} color={color} />
      <mesh>
        <sphereGeometry args={[0.04]} />
        <meshBasicMaterial color="black" toneMapped={false} />
      </mesh>
      <BallCollider args={[0.1]} type="dynamic" />
    </RigidBody>
  )
}

function Pointer() {
  const ref = useRef()
  useFrame(({ mouse, viewport }) => {
    const { width, height } = viewport.getCurrentViewport()
    vec.set(mouse.x * (width / 2), mouse.y * (height / 2), 0)
    ref.current.setNextKinematicTranslation(vec)
  })
  return (
    <RigidBody type="kinematicPosition" colliders={false} ref={ref}>
      <MarchingCube strength={0.5} subtract={10} color="white" />
      <mesh>
        <sphereGeometry args={[0.04]} />
        <meshBasicMaterial color="black" toneMapped={false} />
      </mesh>
      <BallCollider args={[0.1]} type="dynamic" />
    </RigidBody>
  )
}

export default function App() {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5], fov: 25 }}>
      <color attach="background" args={['#151520']} />
      <ambientLight intensity={2} />
      <Physics gravity={[0, 2, 0]}>
        <MarchingCubes resolution={64} maxPolyCount={20000} enableUvs={false} enableColors>
          <MeshTransmissionMaterial
            vertexColors
            transmissionSampler
            transmission={0.9}
            thickness={0.1}
            roughness={0}
            chromaticAberration={0.3}
            anisotropy={1}
            envMapIntensity={0.05}
            distortion={1}
            distortionScale={1}
            temporalDistortion={0.1}
            iridescence={1}
            iridescenceIOR={1}
            iridescenceThicknessRange={[0, 1400]}
          />
          <MetaBall color="red" position={[1, 1, 0.5]} />
          <MetaBall color="blue" position={[-1, -1, -0.5]} />
          <MetaBall color="green" position={[2, 2, 0.5]} />
          <MetaBall color="orange" position={[-2, -2, -0.5]} />
          <MetaBall color="hotpink" position={[3, 3, 0.5]} />
          <MetaBall color="aquamarine" position={[-3, -3, -0.5]} />
          <Pointer />
        </MarchingCubes>
      </Physics>
      <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/industrial_workshop_foundry_1k.hdr" />
      {/* Zoom to fit a 1/1/1 box to match the marching cubes */}
      <Bounds fit clip observe margin={1}>
        <mesh visible={false}>
          <boxGeometry />
        </mesh>
      </Bounds>
    </Canvas>
  )
}
