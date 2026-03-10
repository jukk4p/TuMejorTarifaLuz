'use client';

import { useRef, useEffect } from 'react';
import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';

const vertex = `#version 300 es
  in vec2 uv;
  in vec2 position;
  out vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0, 1);
  }
`;

const fragment = `#version 300 es
  precision highp float;
  uniform float uTime;
  uniform vec3 uColor;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uAmplitude;
  uniform float uSpeed;
  in vec2 vUv;
  out vec4 fragColor;

  void main() {
    float mr = min(uResolution.x, uResolution.y);
    vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;
    uv += (uMouse - vec2(0.5)) * uAmplitude;
    float d = -uTime * 0.5 * uSpeed;
    float a = 0.0;
    for (float i = 0.0; i < 8.0; ++i) {
      a += cos(i - d - a * uv.x);
      d += sin(uv.y * i + a);
    }
    d += uTime * 0.5 * uSpeed;
    vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
    col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5) * uColor;
    fragColor = vec4(col, 1.0);
  }
`;

interface IridescenceProps {
    color?: [number, number, number];
    speed?: number;
    amplitude?: number;
    mouseReact?: boolean;
}

export default function Iridescence({
    color = [1, 1, 1],
    speed = 1.0,
    amplitude = 0.1,
    mouseReact = true,
}: IridescenceProps) {
    const ctnDom = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ctnDom.current) return;
        const ctn = ctnDom.current;
        const renderer = new Renderer({ alpha: true, premultipliedAlpha: false });
        const gl = renderer.gl;
        const canvas = gl.canvas;
        ctn.appendChild(canvas);

        const geometry = new Triangle(gl);
        const program = new Program(gl, {
            vertex,
            fragment,
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: new Color(...color) },
                uSpeed: { value: speed },
                uAmplitude: { value: amplitude },
                uMouse: { value: [0.5, 0.5] },
                uResolution: { value: [0, 0] },
            },
        });

        const mesh = new Mesh(gl, { geometry, program });

        function resize() {
            const { width, height } = ctn.getBoundingClientRect();
            renderer.setSize(width, height);
            program.uniforms.uResolution.value = [width, height];
        }
        window.addEventListener('resize', resize);
        resize();

        let animateId: number;
        function update(t: number) {
            animateId = requestAnimationFrame(update);
            program.uniforms.uTime.value = t * 0.001;
            renderer.render({ scene: mesh });
        }
        animateId = requestAnimationFrame(update);

        function handleMouseMove(e: MouseEvent) {
            const rect = ctn.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = 1.0 - (e.clientY - rect.top) / rect.height;
            program.uniforms.uMouse.value[0] = x;
            program.uniforms.uMouse.value[1] = y;
        }

        if (mouseReact) {
            window.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            cancelAnimationFrame(animateId);
            window.removeEventListener('resize', resize);
            if (mouseReact) {
                window.removeEventListener('mousemove', handleMouseMove);
            }
            if (ctn.contains(canvas)) {
                ctn.removeChild(canvas);
            }
            gl.getExtension('WEBGL_lose_context')?.loseContext();
        };
    }, [color, speed, amplitude, mouseReact]);

    return <div ref={ctnDom} className="w-full h-full" />;
}
