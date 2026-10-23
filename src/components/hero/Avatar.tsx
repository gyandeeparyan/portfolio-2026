"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useGraph } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { AVATAR } from "@/lib/avatar";
import { prefersReducedMotion } from "@/lib/hooks";

/** Smoothly ease `cur` towards `to`, frame-rate independent. */
const damp = (cur: number, to: number, lambda: number, dt: number) => THREE.MathUtils.damp(cur, to, lambda, dt);

export interface Fit {
  crownY: number;
  height: number;
  centerX: number;
  centerZ: number;
}

export default function Avatar({ url = AVATAR.url, onMeasure }: { url?: string; onMeasure?: (f: Fit) => void }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(url);

  /* Clone so React strict-mode double-mounts and multiple instances stay independent. */
  const cloned = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = false;
        m.frustumCulled = false;
      }
    });
    return c;
  }, [scene]);

  const { nodes } = useGraph(cloned);
  const { actions, names } = useAnimations(animations, group);

  /* Measure the model so the camera can fit itself to it. Exports differ wildly in
     height — some tools ship a 1.7-unit humanoid, others a 170-unit one — so the
     camera works from proportions of this box rather than hard-coded metres.
     Horizontal extent is ignored on purpose: a T-pose's arm span says nothing
     useful about where the head is. */
  useEffect(() => {
    if (!onMeasure) return;
    const box = new THREE.Box3().setFromObject(cloned);
    if (!box.isEmpty()) {
      const center = box.getCenter(new THREE.Vector3());
      onMeasure({
        crownY: box.max.y,
        height: box.max.y - box.min.y,
        centerX: center.x,
        centerZ: center.z,
      });
    }
  }, [cloned, onMeasure]);

  /* Play a baked idle clip when the GLB ships one (photo-to-avatar tools export none by default). */
  useEffect(() => {
    if (!names.length) return;
    const a = actions[names[0]];
    a?.reset().fadeIn(0.4).play();
    return () => void a?.fadeOut(0.3);
  }, [actions, names]);

  /* Rigs disagree on naming: older rigs used a bare "Head", Mixamo-derived
     rigs (Avaturn, MetaPerson) use "mixamorig:Head", others use "Neck_01". Strip
     everything decorative and match on the bare word, so any of them resolve. */
  const bones = useMemo(() => {
    const norm = (s: string) =>
      s
        .toLowerCase()
        .replace(/^.*[:|]/, "") // drop a rig prefix like "mixamorig:"
        .replace(/[\s._-]/g, "");

    const byName = new Map<string, THREE.Bone>();
    for (const [name, node] of Object.entries(nodes)) {
      const b = node as THREE.Bone;
      if (b?.isBone) byName.set(norm(name), b);
    }

    const pick = (aliases: readonly string[]) => {
      for (const a of aliases) {
        const hit = byName.get(norm(a));
        if (hit) return hit;
      }
      return null;
    };

    const found = { head: pick(AVATAR.bones.head), neck: pick(AVATAR.bones.neck), spine: pick(AVATAR.bones.spine) };

    if (AVATAR.debugBones) {
      if (!byName.size) console.warn("[avatar] no bones found — the model is not rigged, so the head will not track.");
      else if (!found.head)
        console.warn("[avatar] no head bone matched. Bones in this model:", [...byName.keys()].join(", "), "\nAdd the right name to AVATAR.bones.head in src/lib/avatar.ts");
    }
    return found;
  }, [nodes]);

  /* Rest rotations, so tracking is applied relative to the rig's own pose. */
  const rest = useMemo(() => {
    const snap = (b: THREE.Bone | null) => (b ? { x: b.rotation.x, y: b.rotation.y } : { x: 0, y: 0 });
    return { head: snap(bones.head), neck: snap(bones.neck), spine: snap(bones.spine) };
  }, [bones]);

  const pointer = useRef({ x: 0, y: 0 });
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = prefersReducedMotion();
    /* Track the whole window, not just the canvas — the head should follow the
       cursor even while the reader is on the other side of the hero. */
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onLeave = () => {
      pointer.current.x = 0;
      pointer.current.y = 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerout", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onLeave);
    };
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const still = reduced.current;

    const px = still ? 0 : pointer.current.x;
    const py = still ? 0 : pointer.current.y;

    /* The neck takes a third of the turn, the head the rest — reads as a real glance. */
    if (bones.head) {
      bones.head.rotation.y = damp(bones.head.rotation.y, rest.head.y + px * AVATAR.lookYaw * 0.68, 4, dt);
      bones.head.rotation.x = damp(bones.head.rotation.x, rest.head.x + py * AVATAR.lookPitch * 0.68, 4, dt);
    }
    if (bones.neck) {
      bones.neck.rotation.y = damp(bones.neck.rotation.y, rest.neck.y + px * AVATAR.lookYaw * 0.32, 3.2, dt);
      bones.neck.rotation.x = damp(bones.neck.rotation.x, rest.neck.x + py * AVATAR.lookPitch * 0.32, 3.2, dt);
    }
    /* Breathing, plus a touch of shoulder follow. */
    if (bones.spine && !still) {
      bones.spine.rotation.x = damp(bones.spine.rotation.x, rest.spine.x + Math.sin(t * 1.1) * 0.014, 2.5, dt);
      bones.spine.rotation.y = damp(bones.spine.rotation.y, rest.spine.y + px * 0.06, 2, dt);
    }
    /* Whole-model float. */
    if (group.current && !still) {
      group.current.position.y = AVATAR.offsetY + Math.sin(t * 0.85) * 0.006;
    }
  });

  return (
    <group ref={group} position={[0, AVATAR.offsetY, 0]} dispose={null}>
      <primitive object={cloned} />
    </group>
  );
}

/* No useGLTF.preload here on purpose: with no avatar.glb in place yet it would fire a
   fetch nobody awaits, and the 404 would surface as an unhandled promise rejection.
   AvatarStage already defers mounting until the hero is near the viewport. */
