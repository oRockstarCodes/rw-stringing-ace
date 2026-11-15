import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

// A procedural cartoon head for the home hero. It floats, turns toward the pointer, its eyes
// track the pointer, it blinks, and it smiles when the pointer is over it. Nothing is loaded
// from the network: every shape is built here, so there is no model file to host.

const SKIN = "#edbf9f";
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const damp = (cur: number, target: number, lambda: number, dt: number) =>
  cur + (target - cur) * (1 - Math.exp(-lambda * dt));
// A cheap smooth -1..1 noise, so the hair's irregularities are the same on every load.
const noise = (x: number, y: number, z: number) =>
  (Math.sin(x * 1.7 + y * 2.3 + 0.5) * Math.sin(y * 1.9 - z * 2.9 + 1.3) +
    Math.sin(z * 2.2 + x * 1.1 + 2.1) * Math.sin(x * 2.6 - y * 1.4 + 0.7)) *
  0.5;

// The skull's surface in direction d (a unit vector). Below the eyes the front-view outline
// is pushed toward a superellipse, which gives the jaw corners and a flatter chin without
// pushing the face forward, then the jaw tapers a little. The hair is built on the same
// surface so it sits snugly on the head.
function skullPoint(d: THREE.Vector3, out: THREE.Vector3) {
  let x = d.x;
  let y = d.y;
  let z = d.z;
  if (y < 0) {
    const p = 3.4;
    const r = Math.hypot(x, y);
    const q = Math.pow(Math.abs(x) ** p + (-y) ** p, 1 / p);
    const k = 1 + (r / Math.max(q, 1e-6) - 1) * 0.35 * Math.min(1, -y / 0.35);
    x *= k;
    y *= k;
    const t = Math.pow(-d.y, 1.4);
    x *= 1 - 0.32 * t;
    z *= 1 - 0.06 * t;
  }
  return out.set(x * 0.86, y * (y > 0 ? 1.1 : 0.98), z * 0.95);
}

function buildHead() {
  const root = new THREE.Group();
  const head = new THREE.Group();
  root.add(head);

  const skin = new THREE.MeshPhysicalMaterial({
    color: SKIN,
    roughness: 0.55,
    clearcoat: 0.25,
    clearcoatRoughness: 0.5,
    sheen: 0.6,
    sheenColor: new THREE.Color("#ff9c7a"),
  });
  const hairMat = new THREE.MeshPhysicalMaterial({
    color: "#0d0b0b",
    roughness: 0.32,
    metalness: 0.1,
    clearcoat: 0.8,
    clearcoatRoughness: 0.18,
    sheen: 0.8,
    sheenColor: new THREE.Color("#7a6a5e"),
  });
  const ink = new THREE.MeshStandardMaterial({ color: "#1a0f0c", roughness: 0.6 });
  const white = new THREE.MeshPhysicalMaterial({ color: "#fdfdfb", roughness: 0.15, clearcoat: 1 });
  const iris = new THREE.MeshPhysicalMaterial({ color: "#5b2c14", roughness: 0.25, clearcoat: 1 });

  // Skull: a sphere with a squared-off jaw.
  const skullGeo = new THREE.SphereGeometry(1, 96, 64);
  const sp = skullGeo.attributes.position as THREE.BufferAttribute;
  const sd = new THREE.Vector3();
  for (let i = 0; i < sp.count; i++) {
    skullPoint(sd.fromBufferAttribute(sp, i).normalize(), sd);
    sp.setXYZ(i, sd.x, sd.y, sd.z);
  }
  skullGeo.computeVertexNormals();
  head.add(new THREE.Mesh(skullGeo, skin));

  // Ears
  for (const s of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 24), skin);
    ear.scale.set(0.55, 1.05, 0.8);
    ear.position.set(s * 0.87, -0.02, -0.04);
    ear.rotation.z = s * -0.12;
    head.add(ear);

  }

  // Eyes: each has a group that can turn toward the pointer and squash for a blink.
  const eyes: THREE.Group[] = [];
  for (const s of [-1, 1]) {
    const eye = new THREE.Group();
    eye.position.set(s * 0.37, 0.1, 0.78);
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.235, 48, 32), white);
    ball.scale.set(1.05, 0.7, 0.55);
    eye.add(ball);
    const pupilGroup = new THREE.Group();
    pupilGroup.position.z = 0.04;
    const irisM = new THREE.Mesh(new THREE.SphereGeometry(0.125, 40, 28), iris);
    irisM.scale.set(1, 1, 0.5);
    irisM.position.z = 0.06;
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.066, 32, 24), ink);
    pupil.scale.set(1, 1, 0.5);
    pupil.position.z = 0.092;
    const glint = new THREE.Mesh(
      new THREE.SphereGeometry(0.026, 16, 12),
      new THREE.MeshBasicMaterial({ color: "#ffffff" }),
    );
    glint.position.set(0.04, 0.045, 0.125);
    pupilGroup.add(irisM, pupil, glint);
    pupilGroup.name = "pupil";
    eye.add(pupilGroup);
    // Upper lid: a skin-colored cap that closes over the eyeball.
    const lid = new THREE.Mesh(
      new THREE.SphereGeometry(0.255, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2),
      skin,
    );
    lid.scale.set(1, 1, 0.62);
    lid.rotation.x = -Math.PI / 2 + 0.42;
    lid.name = "lid";
    lid.position.z = 0.0;
    eye.add(lid);
    head.add(eye);
    eyes.push(eye);
  }

  // Brows
  const brows: THREE.Mesh[] = [];
  for (const s of [-1, 1]) {
    const brow = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.3, 8, 16), hairMat);
    brow.rotation.z = Math.PI / 2;
    brow.scale.set(1, 1, 0.9);
    brow.position.set(s * 0.4, 0.42, 0.88);
    brow.userData.base = brow.position.clone();
    brow.userData.side = s;
    head.add(brow);
    brows.push(brow);
  }

  // Nose
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.15, 40, 28), skin);
  nose.scale.set(0.95, 1.05, 0.9);
  nose.position.set(0, -0.2, 0.96);
  head.add(nose);

  // Mouth: an arc whose vertical scale flips between a frown (-1) and a smile (1).
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.026, 12, 40, Math.PI), ink);
  mouth.position.set(0, -0.52, 0.86);
  mouth.rotation.z = Math.PI; // arc opens upward by default = frown
  head.add(mouth);

  // Glasses: thin dark rectangular frames with a bridge and temple arms.
  const frameMat = new THREE.MeshStandardMaterial({ color: "#2a2d33", metalness: 0.5, roughness: 0.35 });
  const rrect = (w: number, h: number, r: number, hole = false) => {
    const sh = new THREE.Path();
    const x = -w / 2;
    const y = -h / 2;
    sh.moveTo(x + r, y);
    sh.lineTo(x + w - r, y);
    sh.quadraticCurveTo(x + w, y, x + w, y + r);
    sh.lineTo(x + w, y + h - r);
    sh.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    sh.lineTo(x + r, y + h);
    sh.quadraticCurveTo(x, y + h, x, y + h - r);
    sh.lineTo(x, y + r);
    sh.quadraticCurveTo(x, y, x + r, y);
    return hole ? sh : new THREE.Shape(sh.getPoints());
  };
  const outer = rrect(0.66, 0.46, 0.1) as THREE.Shape;
  outer.holes.push(rrect(0.59, 0.39, 0.08, true));
  const frameGeo = new THREE.ExtrudeGeometry(outer, { depth: 0.035, bevelEnabled: false });
  for (const s of [-1, 1]) {
    const rim = new THREE.Mesh(frameGeo, frameMat);
    rim.position.set(s * 0.4, 0.08, 0.95);
    head.add(rim);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 1.0), frameMat);
    arm.position.set(s * 0.87, 0.12, 0.5);
    arm.rotation.y = s * -0.1;
    head.add(arm);
  }
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.03, 0.03), frameMat);
  bridge.position.set(0, 0.2, 0.965);
  head.add(bridge);

  // Hair: one sculpted mass. A dense sphere is pushed out over the skull where there is hair
  // and pulled under the skin where there isn't, so the hairline is wherever it dips inside.
  // It is a middle-part slick-back: a parting down the centre, each side lifted a little at
  // the front and combed back, tight at the sides.
  const hairGeo = new THREE.SphereGeometry(1, 224, 160);
  hairGeo.deleteAttribute("normal");
  hairGeo.deleteAttribute("uv");
  const hp = hairGeo.attributes.position as THREE.BufferAttribute;
  const d = new THREE.Vector3();
  const sk = new THREE.Vector3();
  const smooth = (a: number, b: number, x: number) => {
    const t = clamp((x - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  };
  // Hairline height by angle around the head (0 = middle of the forehead, PI = nape).
  const lineAt: [number, number][] = [
    [0, 0.6],
    [0.55, 0.56],
    [0.95, 0.42], // slightly receded at the temples
    [1.3, 0.26], // over the ear
    [1.75, 0.24],
    [2.1, -0.25], // behind the ear
    [Math.PI, -0.5], // the nape
  ];
  const hairline = (a: number) => {
    for (let k = 1; k < lineAt.length; k++) {
      const [a1, y1] = lineAt[k];
      if (a <= a1) {
        const [a0, y0] = lineAt[k - 1];
        return y0 + (y1 - y0) * smooth(a0, a1, a);
      }
    }
    return lineAt[lineAt.length - 1][1];
  };
  for (let i = 0; i < hp.count; i++) {
    d.fromBufferAttribute(hp, i).normalize();
    skullPoint(d, sk);

    // Comb phase: angle away from the parting around the front-to-back axis, so on each side
    // lines run back from the forehead, fanning outward from the part as they go, and wrap
    // horizontally along the sides. A little noise keeps them from being ruled.
    const n1 = noise(d.x * 2.1, d.y * 2.1, d.z * 2.1);
    const n2 = noise(d.x * 4.7 + 3, d.y * 4.7, d.z * 4.7 - 1);
    const ax = Math.abs(d.x + 0.012 * n2); // distance from the parting
    const phase = Math.atan2(ax, d.y + 0.25) * 15 + n1 * 0.5 + d.z * 2.2;
    const comb = Math.abs(Math.cos(phase * 0.5));

    const a = Math.abs(Math.atan2(d.x, d.z));
    let line = hairline(a) + 0.015 * n2;
    line += 0.06 * (1 - smooth(0.0, 0.07, ax)) * smooth(0.0, 0.6, d.z); // notch at the part
    const w = smooth(line - 0.03, line + 0.05, d.y);

    // Thickness: thin and close to the head. Each side of the part is lifted at the front and
    // swept back, and the parting itself is a groove from the hairline to the crown.
    const onTop = smooth(0.45, 0.75, d.y) * smooth(-0.6, -0.1, d.z);
    const part = -0.09 * (1 - smooth(0.0, 0.06, ax)) * onTop;
    const sides = smooth(0.02, 0.17, ax) * (1 - smooth(0.45, 0.85, ax));
    const lift = 0.18 * sides * smooth(0.4, 0.85, d.y) * smooth(-0.45, 0.45, d.z);
    const top = 0.06 + 0.08 * smooth(0.2, 0.95, d.y) + lift + part;
    const groove = 0.018 * (comb - 0.6) + 0.006 * Math.sin(phase * 3.1) + 0.01 * n1;
    const thick = w * (top + groove) - (1 - w) * 0.1;
    sk.addScaledVector(d, thick);
    hp.setXYZ(i, sk.x, sk.y, sk.z);
  }
  const hairMesh = new THREE.Mesh(mergeVertices(hairGeo), hairMat);
  hairMesh.geometry.computeVertexNormals();
  head.add(hairMesh);
  hairGeo.dispose();

  return { root, head, eyes, brows, mouth };
}

const HeroHead = ({ animate = true }: { animate?: boolean }) => {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // No WebGL: the headline stands on its own.
    }
    // 1.5x is sharp enough for a soft cartoon head; full 2x retina quadruples the shading
    // work over 1x. If frames still run slow, the loop below steps this down further.
    let pixelRatio = Math.min(window.devicePixelRatio, 1.5);
    renderer.setPixelRatio(pixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.cssText = "display:block;width:100%;height:100%";
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.55;

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0, 14);

    const key = new THREE.DirectionalLight("#fff1e6", 2.6);
    key.position.set(-3, 4, 6);
    const rim = new THREE.DirectionalLight("#ffc105", 3.2);
    rim.position.set(5, 2.5, -4);
    const rimL = new THREE.DirectionalLight("#9db8ff", 1.6);
    rimL.position.set(-5, 1, -4);
    const fill = new THREE.DirectionalLight("#ffd6c2", 0.6);
    fill.position.set(3, -2, 5);
    scene.add(key, rim, rimL, fill);

    const { root, head, eyes, brows, mouth } = buildHead();
    const pupils = eyes.map((eye) => eye.getObjectByName("pupil")!);
    const lids = eyes.map((eye) => eye.getObjectByName("lid")!);
    let baseY = -0.6;
    scene.add(root);

    // The host's box, kept here so pointer moves don't force a layout read each time.
    let rect = el.getBoundingClientRect();
    const remeasure = () => (rect = el.getBoundingClientRect());
    window.addEventListener("scroll", remeasure, { passive: true });

    const resize = () => {
      remeasure();
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // Keep the whole head (and quiff) in frame on both wide and tall screens.
      const visH = Math.max(4.7, 3.9 / camera.aspect);
      const dist = visH / (2 * Math.tan((camera.fov * Math.PI) / 360));
      camera.position.z = dist;
      baseY = camera.aspect < 0.8 ? 0.5 : -0.6; // tall screens: the headline wraps, so lift the head
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    // Pointer, normalised to -1..1 across the window.
    const ptr = { x: 0, y: 0, over: false, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      ptr.tx = (e.clientX / window.innerWidth) * 2 - 1;
      ptr.ty = -((e.clientY / window.innerHeight) * 2 - 1);
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height * 0.55;
      ptr.over = Math.hypot(e.clientX - cx, e.clientY - cy) < rect.height * 0.28;
    };
    const onLeave = () => {
      ptr.tx = 0;
      ptr.ty = 0;
      ptr.over = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    const st = {
      ry: 0,
      rx: 0,
      gx: 0,
      gy: 0,
      smile: -0.12,
      blink: 0,
      nextBlink: 1.8,
      intro: animate ? 0 : 1,
      browLift: 0,
    };
    const clock = new THREE.Clock();
    let raf = 0;
    let running = false;
    let visible = true;
    let slowFrames = 0;

    const frame = () => {
      raf = 0;
      const raw = clock.getDelta();
      const dt = Math.min(raw, 0.05);
      const t = clock.elapsedTime;

      // On a GPU that can't keep up, drop the resolution a step at a time until it can.
      // Counts frames under 45fps once the intro is done (and ignores gaps like a tab switch).
      if (pixelRatio > 1 && st.intro === 1 && raw < 0.25) {
        slowFrames = raw > 1 / 45 ? slowFrames + 1 : Math.max(0, slowFrames - 1);
        if (slowFrames > 45) {
          slowFrames = 0;
          pixelRatio = Math.max(1, pixelRatio - 0.25);
          renderer.setPixelRatio(pixelRatio);
          resize();
        }
      }

      st.intro = Math.min(1, st.intro + dt / 1.3);
      const e = 1 - Math.pow(1 - st.intro, 3);
      const back = 1 + 1.6 * Math.pow(st.intro - 1, 3) + 0.6 * Math.pow(st.intro - 1, 2);
      root.scale.setScalar(0.6 + 0.4 * back);
      root.position.y = baseY + (1 - e) * -1.2 + Math.sin(t * 1.1) * 0.07;

      ptr.x = damp(ptr.x, ptr.tx, 5, dt);
      ptr.y = damp(ptr.y, ptr.ty, 5, dt);
      st.ry = damp(st.ry, ptr.x * 0.55, 6, dt);
      st.rx = damp(st.rx, -ptr.y * 0.32, 6, dt);
      head.rotation.y = st.ry + Math.sin(t * 0.7) * 0.04;
      head.rotation.x = st.rx + Math.sin(t * 0.9 + 1) * 0.025;
      head.rotation.z = -ptr.x * 0.05 + Math.sin(t * 0.6) * 0.015;

      // Eyes lead the head: they turn further than the skull does.
      st.gx = damp(st.gx, ptr.x, 12, dt);
      st.gy = damp(st.gy, ptr.y, 12, dt);
      for (const pupil of pupils) {
        pupil.position.x = clamp(st.gx * 0.16 - st.ry * 0.1, -0.12, 0.12);
        pupil.position.y = clamp(st.gy * 0.12 - st.rx * 0.1, -0.1, 0.1);
      }

      // Blink
      st.nextBlink -= dt;
      if (st.nextBlink <= 0) {
        st.blink = 1;
        st.nextBlink = 2.4 + Math.random() * 3;
      }
      st.blink = Math.max(0, st.blink - dt * 7);
      const closed = Math.sin(st.blink * Math.PI); // 0 -> 1 -> 0
      for (const lid of lids) {
        lid.rotation.x = -Math.PI / 2 + 0.42 + closed * 1.0;
      }

      // Smile when the pointer is on the face; brows rise with it.
      st.smile = damp(st.smile, ptr.over ? 0.9 : -0.12, 8, dt);
      mouth.scale.y = st.smile;
      mouth.position.y = -0.52 + (st.smile > 0 ? 0.05 : 0) * st.smile;
      st.browLift = damp(st.browLift, ptr.over ? 0.07 : 0, 8, dt);
      for (const b of brows) {
        const s = b.userData.side as number;
        b.position.y = b.userData.base.y + st.browLift + Math.sin(t * 0.8) * 0.004;
        b.rotation.z = Math.PI / 2 + -s * (0.04 - st.smile * 0.05);
      }


      renderer.render(scene, camera);
      if (running) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || !visible || document.hidden || !animate) return;
      running = true;
      clock.getDelta();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    // Reduced motion: draw one still frame (smiling, eyes forward) and never loop.
    if (!animate) {
      st.smile = 0.3;
      frame();
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(el);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", remeasure);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose();
      });
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [animate]);

  return <div ref={host} aria-hidden="true" className="absolute inset-0 pointer-events-none" />;
};

export default HeroHead;
