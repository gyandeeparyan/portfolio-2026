"use client";
import { Component, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Avatar from "./Avatar";
import { AVATAR } from "@/lib/avatar";
import PortraitFallback from "./PortraitFallback";

/** What <Avatar> measures off the loaded model, in model units. */
export interface Fit {
  crownY: number;
  height: number;
  centerX: number;
  centerZ: number;
}

/* Used until the model reports in — a nominal 1.7 m humanoid standing on y = 0. */
const NOMINAL: Fit = { crownY: 1.7, height: 1.7, centerX: 0, centerZ: 0 };

function Framing({ fit }: { fit: Fit | null }) {
  const { camera, size } = useThree();
  useEffect(() => {
    const f = AVATAR.frame[AVATAR.framing];
    const m = fit ?? NOMINAL;

    /* Phones, not narrow canvases. useThree's `size` is the canvas, which is only
       ~620px wide on a wide desktop — reading that here pushed the camera back on
       every screen and made the model render larger than intended. */
    const phone = typeof window !== "undefined" && window.innerWidth < 760;

    const fov = f.fov * (phone ? 1.08 : 1);
    /* Show `span` of the model's height, plus headroom above the crown. */
    const span = m.height * f.span * (1 + AVATAR.headroom) * (phone ? 1.12 : 1);
    const targetY = m.crownY - span / 2 + m.height * f.span * AVATAR.headroom * 0.5;

    /* Distance that makes `span` exactly fill the vertical field of view. A canvas
       narrower than it is tall would crop the sides, so widen for that too. */
    const vFov = (fov * Math.PI) / 180;
    let distance = span / 2 / Math.tan(vFov / 2);
    const aspect = size.width / Math.max(1, size.height);
    if (aspect < 0.72) distance *= 0.72 / aspect;

    camera.position.set(m.centerX, targetY + span * 0.06, m.centerZ + distance);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
    camera.lookAt(new THREE.Vector3(m.centerX, targetY, m.centerZ));
  }, [camera, size.width, size.height, fit]);
  return null;
}

/** GLTFLoader throws when the .glb is missing (a static host returns a 404 page).
 *  Catch it so the hero degrades to a portrait instead of blanking the section. */
class Boundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function AvatarStage() {
  const [failed, setFailed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [fit, setFit] = useState<Fit | null>(null);
  const host = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  /* Only build a WebGL context once the hero is actually on screen. */
  useEffect(() => {
    setMounted(true);
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={host} className="av-stage">
      {failed || !mounted ? (
        <PortraitFallback hint="avatar" />
      ) : (
        <Canvas
          className="av-canvas"
          frameloop={near ? "always" : "demand"}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
          camera={{ fov: AVATAR.frame[AVATAR.framing].fov, near: 0.1, far: 50 }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.05;
          }}
        >
          <Framing fit={fit} />
          {/* Explicit lights rather than drei's <Environment>, which would fetch an HDR from a CDN. */}
          <ambientLight intensity={0.85} />
          <hemisphereLight args={["#fff6e8", "#d9d2c6", 0.75]} />
          {/* key */}
          <directionalLight position={[2.2, 3.4, 2.6]} intensity={2.1} color="#fff4e2" />
          {/* fill, warmed towards the India Post red so the hero ties to the palette */}
          <directionalLight position={[-2.6, 1.4, 1.8]} intensity={0.75} color="#ffd9d2" />
          {/* rim */}
          <directionalLight position={[0, 2.2, -3]} intensity={1.5} color="#ffe9a8" />
          <Suspense fallback={null}>
            <Boundary onError={() => setFailed(true)}>
              <Avatar onMeasure={setFit} />
            </Boundary>
          </Suspense>
        </Canvas>
      )}

      <style>{`
        .av-stage { position: relative; width: 100%; height: 100%; }

        /* Two masks intersected: the torso dissolves into the page at the bottom
           instead of being sliced off by the viewport edge, and the shoulders fade
           at the sides so they never hard-edge into the headline beside them.
           The reference site does the same thing to its hero video. */
        .av-canvas {
          width: 100% !important;
          height: 100% !important;
          touch-action: pan-y;
          -webkit-mask-image:
            linear-gradient(to bottom, #000 58%, rgba(0,0,0,.55) 80%, transparent 97%),
            linear-gradient(to right, transparent 0%, #000 14%, #000 86%, transparent 100%);
          mask-image:
            linear-gradient(to bottom, #000 58%, rgba(0,0,0,.55) 80%, transparent 97%),
            linear-gradient(to right, transparent 0%, #000 14%, #000 86%, transparent 100%);
          -webkit-mask-composite: source-in;
          mask-composite: intersect;
        }

      `}</style>
    </div>
  );
}
