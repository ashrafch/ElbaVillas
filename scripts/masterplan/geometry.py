"""Small mesh batches keep the Blender scene editable and the GLB lightweight."""

from collections import defaultdict
from math import cos, pi, sin

import bpy
from mathutils import Vector


def material(name, hex_color, roughness=0.72, metallic=0, emission=0):
    def linear(channel):
        value = int(channel, 16) / 255
        return value / 12.92 if value < 0.04045 else ((value + 0.055) / 1.055) ** 2.4

    color = tuple(linear(hex_color[i:i + 2]) for i in (0, 2, 4)) + (1,)
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = color
    mat.use_nodes = True
    surface = mat.node_tree.nodes.get("Principled BSDF")
    surface.inputs["Base Color"].default_value = color
    surface.inputs["Roughness"].default_value = roughness
    surface.inputs["Metallic"].default_value = metallic
    if emission:
        surface.inputs["Emission Color"].default_value = color
        surface.inputs["Emission Strength"].default_value = emission
    return mat


def group(name, origin=(0, 0, 0), parent=None):
    obj = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(obj)
    obj.parent = parent
    obj.location = origin
    return obj


class MeshBatch:
    def __init__(self, name, materials, parent=None):
        self.name = name
        self.materials = materials
        self.parent = parent
        self.parts = defaultdict(lambda: ([], [], []))

    def add(self, mat, vertices, faces, smooth=False):
        points, polygons, smoothing = self.parts[mat]
        first = len(points)
        points.extend(vertices)
        polygons.extend(tuple(first + index for index in face) for face in faces)
        smoothing.extend([smooth] * len(faces))

    def slab(self, mat, points, bottom, top):
        count = len(points)
        vertices = [(x, y, z) for z in (bottom, top) for x, y in points]
        faces = [tuple(reversed(range(count))), tuple(range(count, count * 2))]
        faces += [(i, (i + 1) % count, (i + 1) % count + count, i + count) for i in range(count)]
        self.add(mat, vertices, faces)

    def box(self, mat, x, y, z, width, depth, height, radius=0, angle=0):
        hw, hd = width / 2, depth / 2
        if radius:
            radius = min(radius, hw, hd)
            points = []
            for i, (cx, cy) in enumerate(((hw - radius, hd - radius), (-hw + radius, hd - radius),
                                         (-hw + radius, -hd + radius), (hw - radius, -hd + radius))):
                for step in range(4):
                    a = (i + step / 3) * pi / 2
                    points.append((cx + radius * cos(a), cy + radius * sin(a)))
        else:
            points = [(-hw, -hd), (hw, -hd), (hw, hd), (-hw, hd)]
        ca, sa = cos(angle), sin(angle)
        points = [(x + px * ca - py * sa, y + px * sa + py * ca) for px, py in points]
        self.slab(mat, points, z - height / 2, z + height / 2)

    def between(self, mat, start, end, radius, tip=None, sides=8):
        a, b = Vector(start), Vector(end)
        axis = (b - a).normalized()
        tangent = axis.cross(Vector((0, 1, 0))).normalized()
        if tangent.length < 0.1:
            tangent = axis.cross(Vector((1, 0, 0))).normalized()
        bitangent = axis.cross(tangent)
        vertices = []
        for center, size in ((a, radius), (b, tip if tip is not None else radius)):
            vertices += [tuple(center + size * (cos(i * 2 * pi / sides) * tangent
                                                 + sin(i * 2 * pi / sides) * bitangent))
                         for i in range(sides)]
        faces = [tuple(reversed(range(sides))), tuple(range(sides, sides * 2))]
        faces += [(i, (i + 1) % sides, (i + 1) % sides + sides, i + sides) for i in range(sides)]
        self.add(mat, vertices, faces)

    def ball(self, mat, x, y, z, width, depth, height, sides=10, rings=5):
        vertices = [(x, y, z - height)]
        for j in range(1, rings):
            latitude = pi * j / rings
            for i in range(sides):
                a = i * 2 * pi / sides
                vertices.append((x + width * sin(latitude) * cos(a),
                                 y + depth * sin(latitude) * sin(a), z - height * cos(latitude)))
        vertices.append((x, y, z + height))
        faces = [(0, 1 + (i + 1) % sides, 1 + i) for i in range(sides)]
        for j in range(rings - 2):
            base = 1 + sides * j
            faces += [(base + i, base + (i + 1) % sides, base + (i + 1) % sides + sides,
                       base + i + sides) for i in range(sides)]
        base = len(vertices) - 1 - sides
        faces += [(base + i, base + (i + 1) % sides, len(vertices) - 1) for i in range(sides)]
        self.add(mat, vertices, faces, smooth=True)

    def create(self):
        if not self.parts:
            return
        vertices, faces, smoothing, indices = [], [], [], []
        mesh = bpy.data.meshes.new(self.name)
        for i, (mat, (points, polygons, smooth)) in enumerate(self.parts.items()):
            faces += [tuple(index + len(vertices) for index in face) for face in polygons]
            vertices += points
            indices += [i] * len(polygons)
            smoothing += smooth
            mesh.materials.append(self.materials[mat])
        mesh.from_pydata(vertices, [], faces)
        mesh.polygons.foreach_set("material_index", indices)
        mesh.polygons.foreach_set("use_smooth", smoothing)
        mesh.update()
        obj = bpy.data.objects.new(self.name, mesh)
        bpy.context.collection.objects.link(obj)
        obj.parent = self.parent
        return obj
