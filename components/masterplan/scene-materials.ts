import {
  BackSide,
  Mesh,
  MeshStandardMaterial,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Texture,
} from "three"

export function addSky(scene: Scene) {
  const geometry = new SphereGeometry(1500, 24, 12)
  const material = new ShaderMaterial({
    side: BackSide,
    depthWrite: false,
    fog: false,
    vertexShader: `
      varying vec3 skyDirection;
      void main() {
        skyDirection = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 skyDirection;
      void main() {
        vec3 direction = normalize(skyDirection);
        float height = smoothstep(-.07, .68, direction.y);
        vec3 color = mix(vec3(.69, .77, .77), vec3(.19, .42, .58), height);
        float sun = pow(max(0.0, dot(direction, normalize(vec3(-.7, .34, .55)))), 14.0);
        color += sun * vec3(.24, .14, .08);
        gl_FragColor = vec4(color, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  })
  const mesh = new Mesh(geometry, material)
  mesh.renderOrder = -1
  scene.add(mesh)
}

export function colorSea(material: MeshStandardMaterial, time: { value: number }, photo: Texture) {
  material.roughness = 0.62
  material.metalness = 0
  material.onBeforeCompile = (shader) => {
    shader.uniforms.waveTime = time
    shader.uniforms.seaPhoto = { value: photo }
    shader.vertexShader = `varying vec3 seaPoint;
      ${shader.vertexShader.replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nseaPoint = (modelMatrix * vec4(position, 1.0)).xyz;",
      )}`
    shader.fragmentShader = `
      uniform float waveTime;
      uniform sampler2D seaPhoto;
      varying vec3 seaPoint;
      ${shader.fragmentShader.replace(
        "#include <color_fragment>",
        `#include <color_fragment>
        float x = seaPoint.x;
        float z = seaPoint.z;
        float time = waveTime;
        float wave = sin(z * 1.7 + sin(x * .42 + time * .45) * 2.6 + time * 1.0);
        wave += .48 * sin(x * 1.16 - z * .78 + time * .82);
        wave += .29 * sin(x * .31 + z * 3.9 - time * 1.5);
        float shore = 83.0 + .11 * x - 6.0 * sin(x / 32.0) - 9.0 * sin(x / 85.0);
        float depth = max(0.0, z - shore - 1.5);
        vec3 water = mix(vec3(.059, .38, .35), vec3(.022, .125, .19), smoothstep(0.0, 69.0, depth));
        float surf = exp(-depth * .24) * smoothstep(.57, 1.48, wave);
        vec3 detail = texture2D(seaPhoto, vec2(x * .006, z * .012 + time * .003)).rgb;
        diffuseColor.rgb = water * (1.0 + wave * .078) + surf * vec3(.15, .25, .22) + detail * .14;
        `,
      )}`
  }
  material.customProgramCacheKey = () => "coastal-sea"
}
