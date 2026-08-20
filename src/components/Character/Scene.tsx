import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();

  const [, setChar] = useState<THREE.Object3D | null>(null);

  useEffect(() => {
    if (!canvasDiv.current) return;

    const rect = canvasDiv.current.getBoundingClientRect();

    const container = {
      width: rect.width,
      height: rect.height,
    };

    const aspect = container.width / container.height;
    const scene = sceneRef.current;

    // -----------------------------
    // Renderer
    // -----------------------------
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setSize(container.width, container.height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    canvasDiv.current.appendChild(renderer.domElement);

    // -----------------------------
    // Camera
    // -----------------------------
    const camera = new THREE.PerspectiveCamera(
      14.5,
      aspect,
      0.1,
      1000
    );

    camera.position.set(0, 13.1, 24.7);
    camera.zoom = 1.1;
    camera.updateProjectionMatrix();

    // -----------------------------
    // Character variables
    // -----------------------------
    let headBone: THREE.Object3D | null = null;
    let screenLight: THREE.Object3D | null = null;
    let mixer: THREE.AnimationMixer | undefined;

    // -----------------------------
    // Clock
    // -----------------------------
    const clock = new THREE.Clock();

    // -----------------------------
    // Lighting
    // -----------------------------
    const light = setLighting(scene);

    // -----------------------------
    // Loading progress
    // -----------------------------
    const progress = setProgress((value) => setLoading(value));

    // -----------------------------
    // Character loader
    // -----------------------------
    const { loadCharacter } = setCharacter(
      renderer,
      scene,
      camera
    );

    // -----------------------------
    // Mouse
    // -----------------------------
    let mouse = {
      x: 0,
      y: 0,
    };

    let interpolation = {
      x: 0.1,
      y: 0.2,
    };

    // -----------------------------
    // Mouse movement
    // -----------------------------
    const onMouseMove = (event: MouseEvent) => {
      handleMouseMove(event, (x, y) => {
        mouse = { x, y };
      });
    };

    document.addEventListener("mousemove", onMouseMove);

    // -----------------------------
    // Touch handling
    // -----------------------------
    let debounce: ReturnType<typeof globalThis.setTimeout> | undefined;

    const onTouchMove = (event: TouchEvent) => {
      handleTouchMove(event, (x, y) => {
        mouse = { x, y };
      });
    };

    const onTouchStart = (event: TouchEvent) => {
      const element = event.target as HTMLElement;

      debounce = globalThis.setTimeout(() => {
        element?.addEventListener("touchmove", onTouchMove);
      }, 200);
    };

    const onTouchEnd = () => {
      handleTouchEnd(
        (x, y, interpolationX, interpolationY) => {
          mouse = { x, y };

          interpolation = {
            x: interpolationX,
            y: interpolationY,
          };
        }
      );
    };

    // -----------------------------
    // Landing div
    // -----------------------------
    const landingDiv =
      document.getElementById("landingDiv");

    if (landingDiv) {
      landingDiv.addEventListener(
        "touchstart",
        onTouchStart
      );

      landingDiv.addEventListener(
        "touchend",
        onTouchEnd
      );
    }

    // -----------------------------
    // Resize
    // -----------------------------
    const onResize = () => {
      if (!characterObject) return;

      handleResize(
        renderer,
        camera,
        canvasDiv,
        characterObject
      );
    };

    // Character reference used by resize
    let characterObject: THREE.Object3D | null = null;

    window.addEventListener("resize", onResize);

    // -----------------------------
    // Load character
    // -----------------------------
    loadCharacter().then((gltf) => {
      if (!gltf) return;

      const animations = setAnimations(gltf);

      if (hoverDivRef.current) {
        animations.hover(
          gltf,
          hoverDivRef.current
        );
      }

      mixer = animations.mixer;

      characterObject = gltf.scene;

      setChar(characterObject);

      scene.add(characterObject);

      // Find head bone
      headBone =
        characterObject.getObjectByName(
          "spine006"
        ) || null;

      // Find screen light
      screenLight =
        characterObject.getObjectByName(
          "screenlight"
        ) || null;

      // -----------------------------
      // Loading complete
      // -----------------------------
      progress.loaded().then(() => {
        globalThis.setTimeout(() => {
          light.turnOnLights();
          animations.startIntro();
        }, 2500);
      });
    });

    // -----------------------------
    // Animation loop
    // -----------------------------
    let animationFrameId: number;

    const animate = () => {
      animationFrameId =
        window.requestAnimationFrame(animate);

      if (headBone) {
        handleHeadRotation(
          headBone,
          mouse.x,
          mouse.y,
          interpolation.x,
          interpolation.y,
          THREE.MathUtils.lerp
        );

        light.setPointLight(screenLight);
      }

      const delta = clock.getDelta();

      if (mixer) {
        mixer.update(delta);
      }

      renderer.render(scene, camera);
    };

    animate();

    // -----------------------------
    // Cleanup
    // -----------------------------
    return () => {
      // Cancel animation
      window.cancelAnimationFrame(
        animationFrameId
      );

      // Clear timeout
      if (debounce !== undefined) {
        globalThis.clearTimeout(debounce);
      }

      // Remove mouse listener
      document.removeEventListener(
        "mousemove",
        onMouseMove
      );

      // Remove touch listeners
      if (landingDiv) {
        landingDiv.removeEventListener(
          "touchstart",
          onTouchStart
        );

        landingDiv.removeEventListener(
          "touchend",
          onTouchEnd
        );
      }

      // Remove resize listener
      window.removeEventListener(
        "resize",
        onResize
      );

      // Remove touchmove listener
      if (landingDiv) {
        landingDiv.removeEventListener(
          "touchmove",
          onTouchMove
        );
      }

      // Clear Three.js scene
      scene.clear();

      // Dispose renderer
      renderer.dispose();

      // Remove canvas
      if (
        canvasDiv.current &&
        canvasDiv.current.contains(
          renderer.domElement
        )
      ) {
        canvasDiv.current.removeChild(
          renderer.domElement
        );
      }
    };
  }, [setLoading]);

  return (
    <>
      <div className="character-container">
        <div
          className="character-model"
          ref={canvasDiv}
        >
          <div className="character-rim"></div>

          <div
            className="character-hover"
            ref={hoverDivRef}
          ></div>
        </div>
      </div>
    </>
  );
};

export default Scene;