"""Build the editable prototype and its browser assets with Blender 5.3."""

import argparse
import json
import sys
from math import cos, radians, sin, tan
from pathlib import Path

import bpy
from mathutils import Vector

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
sys.dont_write_bytecode = True

from coast import landscape
from geometry import material
from villas import villa

ROOT = HERE.parents[1]
WEB = ROOT / "public" / "masterplan"
SOURCE = ROOT / "assets" / "elba-prototype"

# Geometry is conceptual. Positions are in meters in Blender's Z-up space.
PLOTS = [
    (-48, -46, 6.8, -9), (0, -52, 7.3, -1), (47, -48, 7.4, 6),
    (-44, -8, 14.2, -6), (2, -11, 15.2, 1), (47, -5, 15.7, 9),
    (-48, 30, 21.9, -8), (-1, 29, 22.2, 1), (46, 35, 23.6, 10),
]
PALETTE = {
    "plaster": "e4d2b6", "stone": "a89b85", "stone-high": "d4c8b6", "stone-low": "918773",
    "deck": "c9baa0", "wood": "946042", "walnut-dark": "704837", "bronze": "352e27",
    "glass": "b5d1d2", "rail": "665f52", "tile": "ad633f", "tile-light": "c47a50", "tile-dark": "965334",
    "linen": "e9ddc6", "sage-fabric": "879478", "sand-fabric": "c6a98a", "pillow": "ac795e",
    "rug": "b89973", "book": "495449", "vase": "9d674e", "art": "b69277", "light": "ffe1b1",
    "mirror": "99adae", "parasol": "ead5ab", "paving": "9c9078",
    "bark": "64523a", "pine": "526143", "pine-light": "6e7d52", "pine-dark": "3d5138",
    "sage": "86916a", "olive": "6c7c4e", "herb": "677142", "land": "ffffff",
    "coastal-rock": "9f987e", "water": "225d6d",
}


def materials():
    result = {name: material(name, color) for name, color in PALETTE.items()}
    result["bronze"] = material("Brunito", PALETTE["bronze"], 0.35, 0.54)
    result["mirror"] = material("Specchio", PALETTE["mirror"], 0.16, 0.65)
    result["light"] = material("Luce calda", PALETTE["light"], 0.45, emission=1.38)
    glass = material("Vetrate", PALETTE["glass"], 0.22, 0.15)
    glass.node_tree.nodes.get("Principled BSDF").inputs["Alpha"].default_value = 0.16
    glass.surface_render_method = "BLENDED"
    result["glass"] = glass
    return result


def enhance_sea(mat):
    # Cycles uses this material. The browser applies its own lighter wave shader.
    tree = mat.node_tree
    nodes = tree.nodes
    coords = nodes.new("ShaderNodeTexCoord")
    mapping = nodes.new("ShaderNodeVectorMath")
    mapping.operation = "MULTIPLY"
    mapping.inputs[1].default_value = (210, 570, 1)
    noise = nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 2.35
    noise.inputs["Detail"].default_value = 3.2
    bump = nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.15
    bump.inputs["Distance"].default_value = 0.3
    surface = nodes.get("Principled BSDF")
    surface.inputs["Roughness"].default_value = 0.38
    tree.links.new(coords.outputs["Generated"], mapping.inputs[0])
    tree.links.new(mapping.outputs[0], noise.inputs["Vector"])
    tree.links.new(noise.outputs["Fac"], bump.inputs["Height"])
    tree.links.new(bump.outputs[0], surface.inputs["Normal"])
    position = nodes.new("ShaderNodeNewGeometry")
    separate = nodes.new("ShaderNodeSeparateXYZ")
    depth = nodes.new("ShaderNodeMapRange")
    colors = nodes.new("ShaderNodeValToRGB")
    depth.inputs["From Min"].default_value = -167
    depth.inputs["From Max"].default_value = -76
    colors.color_ramp.elements[0].color = (0.015, 0.066, 0.115, 1)
    colors.color_ramp.elements[1].color = (0.051, 0.28, 0.234, 1)
    tree.links.new(position.outputs["Position"], separate.inputs[0])
    tree.links.new(separate.outputs["Y"], depth.inputs["Value"])
    tree.links.new(depth.outputs[0], colors.inputs[0])
    photo = bpy.data.images.load(str(ROOT / "public" / "images" / "wave" / "sea.jpg"), check_existing=True)
    photo.pack()
    texture = nodes.new("ShaderNodeTexImage")
    texture.image = photo
    texture.extension = "REPEAT"
    texture_scale = nodes.new("ShaderNodeVectorMath")
    texture_scale.operation = "MULTIPLY"
    texture_scale.inputs[1].default_value = (109, 151, 1)
    mix = nodes.new("ShaderNodeMixRGB")
    mix.blend_type = "MULTIPLY"
    mix.inputs[0].default_value = 0.26
    tree.links.new(coords.outputs["Generated"], texture_scale.inputs[0])
    tree.links.new(texture_scale.outputs[0], texture.inputs["Vector"])
    tree.links.new(colors.outputs["Color"], mix.inputs[1])
    tree.links.new(texture.outputs["Color"], mix.inputs[2])
    tree.links.new(mix.outputs["Color"], surface.inputs["Base Color"])


def render_environment():
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.use_denoising = True
    scene.cycles.max_bounces = 5
    scene.cycles.diffuse_bounces = 3
    scene.view_settings.view_transform = "AgX"
    scene.view_settings.look = "AgX - Medium High Contrast"
    scene.view_settings.exposure = 0.35
    scene.render.image_settings.file_format = "JPEG"
    scene.render.image_settings.quality = 87
    scene.world = bpy.data.worlds.new("Cielo dell’Elba")
    scene.world.use_nodes = True
    tree = scene.world.node_tree
    sky = tree.nodes.new("ShaderNodeTexSky")
    available = {item.identifier for item in sky.bl_rna.properties["sky_type"].enum_items}
    sky.sky_type = "MULTIPLE_SCATTERING" if "MULTIPLE_SCATTERING" in available else "NISHITA"
    sky.sun_elevation = radians(26)
    sky.sun_rotation = radians(237)
    sky.sun_disc = False
    tree.links.new(sky.outputs["Color"], tree.nodes.get("Background").inputs[0])
    tree.nodes.get("Background").inputs["Strength"].default_value = 0.24
    sun = bpy.data.lights.new("Sole del pomeriggio", "SUN")
    sun.energy = 3.05
    sun.angle = radians(5)
    sun.color = (1.0, 0.79, 0.55)
    lamp = bpy.data.objects.new(sun.name, sun)
    bpy.context.collection.objects.link(lamp)
    lamp.rotation_euler = Vector((0.68, 0.65, -0.72)).to_track_quat("-Z", "Y").to_euler()
    data = bpy.data.cameras.new("Camera architettonica")
    data.clip_start, data.clip_end, data.sensor_fit = 0.03, 2400, "VERTICAL"
    camera = bpy.data.objects.new(data.name, data)
    bpy.context.collection.objects.link(camera)
    scene.camera = camera
    return scene


def view(position, target, fov):
    return {"position": position, "target": target, "fov": fov}


OVERVIEW = view((61, -159, 145), (2, -34, 6), 43)


def plot_views(origin, rotation):
    def world(point):
        x, y, z = point
        ox, oy, oz = origin
        return (x * cos(rotation) - y * sin(rotation) + ox,
                x * sin(rotation) + y * cos(rotation) + oy, z + oz)

    def at(position, target, fov):
        return view(world(position), world(target), fov)

    def home(sign):
        x = sign * 6.46
        lane = x - sign * 4.75
        return {
            "plan": at((x + sign * 8, -11, 24.2), (x, -0.9, 3.35), 54),
            "living": at((x + sign * 4.86, -0.23, 1.79), (x - sign * 1.2, -4.65, 1.43), 56),
            "stairs": at((lane, 1.83, 2.77), (lane, 4.83, 3.91), 54),
            "suite": at((x - sign * 3.45, 2.46, 5.44), (x - sign * 1.95, 4.6, 5.05), 60),
            "bath": at((x + sign * 1.73, 3.13, 5.39), (x + sign * 3.24, 5.4, 4.91), 61),
            "terrace": at((x + sign * 5.0, -6.61, 5.39), (x - sign * 2.55, -24.8, 4.65), 53),
            "path": {
                "living": [
                    at((x + sign * 5.04, -17.4, 3.72), (x + sign * 2.4, -6.6, 2.45), 49),
                    at((x + sign * 4.72, -8.25, 1.9), (x + sign * 4.7, -3.7, 1.67), 51),
                    at((x + sign * 4.72, -5.45, 1.76), (x + sign * 3.9, -0.7, 1.72), 54),
                ],
                "stairs": [
                    at((x + sign * 3.7, 0.22, 1.77), (lane, 0.5, 1.88), 53),
                    at((x - sign * 1.52, 0.15, 1.79), (lane, 1.66, 2.26), 55),
                    at((lane, 0.5, 1.86), (lane, 3.1, 3.52), 56),
                ],
                "suite": [
                    at((lane, 3.75, 4.06), (lane, 5.8, 5.34), 55),
                    at((lane, 5.79, 5.44), (x - sign * 2.5, 5.01, 5.03), 57),
                    at((x - sign * 3.77, 5.56, 5.44), (x - sign * 1.66, 3.94, 5.01), 59),
                ],
                "bath": [
                    at((x - sign * 2, 2.49, 5.41), (x + sign * 1.9, 3.66, 5.13), 59),
                    at((x + sign * 0.55, 3.35, 5.4), (x + sign * 3.7, 4.82, 4.98), 60),
                ],
                "terrace": [
                    at((x + sign * 1.52, 1.3, 5.39), (x + sign * 4.6, -3.3, 5.15), 56),
                    at((x + sign * 4.7, -1.1, 5.4), (x + sign * 4.68, -8.12, 5.19), 56),
                    at((x + sign * 4.69, -5.75, 5.39), (x + sign * 2.8, -21, 5.35), 55),
                ],
            },
        }

    return {
        "marker": world((0, -0.9, 8.6)),
        "fly": at((31, -67, 36), (0, -3.2, 4.2), 43),
        "facade": at((17, -34, 11.4), (0, -3.35, 3.4), 41),
        "A": home(-1), "B": home(1),
    }


def web_vector(point):
    return [round(point[0], 4), round(point[2], 4), round(-point[1], 4)]


def web_view(cam):
    return {**cam, "position": web_vector(cam["position"]), "target": web_vector(cam["target"])}


def web_home(home):
    return {key: web_view(cam) for key, cam in home.items() if key != "path"} | {
        "path": {step: [web_view(cam) for cam in route] for step, route in home["path"].items()}
    }


def export_glb():
    # Keep Blender's lights and procedural sea setup in the editable source.
    mat = bpy.data.materials["water"]
    surface = mat.node_tree.nodes.get("Principled BSDF")
    links = [(link.from_socket, link.to_socket) for link in mat.node_tree.links
             if link.to_socket in (surface.inputs["Normal"], surface.inputs["Base Color"])]
    for source, target in links:
        mat.node_tree.links.remove(next(link for link in target.links if link.from_socket == source))
    bpy.ops.export_scene.gltf(
        filepath=str(WEB / "elba-coast.glb"), export_format="GLB",
        export_meshopt_compression_enable=True, export_meshopt_extension="EXT_meshopt_compression",
        export_animations=False, export_cameras=False, export_lights=False,
    )
    for source, target in links:
        mat.node_tree.links.new(source, target)


def pilot_lighting():
    root = bpy.data.objects["villa-02"]
    for sign in (-1, 1):
        for y, z, energy, width in ((-2.35, 3.38, 360, 4.2), (4.35, 6.49, 168, 1.8)):
            light = bpy.data.lights.new("Luce interna diffusa", "AREA")
            light.energy = energy
            light.color = (1.0, 0.83, 0.63)
            light.shape = "DISK"
            light.size = width
            obj = bpy.data.objects.new(light.name, light)
            bpy.context.collection.objects.link(obj)
            obj.parent = root
            obj.location = (sign * 6.46, y, z)


def set_camera(camera, pose):
    camera.location = pose["position"]
    camera.rotation_euler = (Vector(pose["target"]) - camera.location).to_track_quat("-Z", "Y").to_euler()
    camera.data.lens = camera.data.sensor_height / (2 * tan(radians(pose["fov"]) / 2))


def render(scene, name, pose, width, height, quick=False):
    set_camera(scene.camera, pose)
    scene.render.resolution_x = width
    scene.render.resolution_y = height
    scene.render.resolution_percentage = 54 if quick else 100
    scene.cycles.samples = 6 if quick else (10 if name.startswith("facade-") else 18)
    scene.render.filepath = str(WEB / f"{name}.jpg")
    print(f"Rendering {name}", flush=True)
    bpy.ops.render.render(write_still=True)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--render-only", action="store_true")
    parser.add_argument("--model-only", action="store_true")
    parser.add_argument("--quick", action="store_true")
    parser.add_argument("--view", nargs="+")
    args = parser.parse_args(sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else [])
    WEB.mkdir(parents=True, exist_ok=True)
    SOURCE.mkdir(parents=True, exist_ok=True)
    views = [plot_views(plot[:3], radians(plot[3])) for plot in PLOTS]
    if args.render_only:
        bpy.ops.wm.open_mainfile(filepath=str(SOURCE / "elba-luce.blend"))
        scene = bpy.context.scene
    else:
        bpy.ops.wm.read_factory_settings(use_empty=True)
        bpy.context.preferences.filepaths.save_version = 0
        mats = materials()
        enhance_sea(mats["water"])
        landscape(mats, PLOTS)
        for i, plot in enumerate(PLOTS):
            villa(mats, i, plot[:3], radians(plot[3]))
        scene = render_environment()
        pilot_lighting()
        set_camera(scene.camera, OVERVIEW)
        scene.render.resolution_x, scene.render.resolution_y = 1600, 900
        for screen in bpy.data.screens:
            for area in screen.areas:
                if area.type == "VIEW_3D":
                    area.spaces.active.region_3d.view_perspective = "CAMERA"
        bpy.ops.wm.save_as_mainfile(filepath=str(SOURCE / "elba-luce.blend"), compress=True)
        export_glb()
        manifest = {"overview": web_view(OVERVIEW), "plots": [
            {"marker": web_vector(item["marker"]), "facade": web_view(item["facade"]),
             "fly": web_view(item["fly"]), "A": web_home(item["A"]), "B": web_home(item["B"])}
            for item in views
        ]}
        (ROOT / "lib" / "masterplan-views.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf8")
    if args.model_only:
        return
    pilot = views[1]
    shots = {
        "overview": (OVERVIEW, 1600, 900),
        "overview-mobile": ({**OVERVIEW, "fov": 66}, 620, 820),
        **{f"facade-{i+1:02}": (item["facade"], 1050, 630) for i, item in enumerate(views)},
        **{f"{room}-{unit.lower()}": (pose, 1150, 700)
           for unit in ("A", "B") for room, pose in pilot[unit].items() if room != "path"},
    }
    for name in args.view or shots:
        pose, width, height = shots[name]
        roof = bpy.data.objects["roof-02"]
        for obj in roof.children:
            obj.hide_render = name.startswith("plan-")
        render(scene, name, pose, width, height, args.quick)


if __name__ == "__main__":
    main()
