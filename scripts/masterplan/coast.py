"""Terrain, coastal planting, driveways and the Mediterranean bay."""

from math import cos, hypot, sin
from random import Random

from geometry import MeshBatch


def shore(x):
    return -83 - 0.11 * x + 6 * sin(x / 32) + 9 * sin(x / 85)


def ease(value):
    value = min(1, max(0, value))
    return value * value * (3 - 2 * value)


def ground(x, y, plots):
    coast = y - shore(x)
    hill = (21 * sin(0.011 * x + 0.37) ** 2 + 25 * cos(0.008 * x - 0.51) ** 2)
    z = -0.13 + 0.17 * coast
    z += 2.1 * sin(x * 0.063 + y * 0.037) * ease(coast / 29)
    z += 1.15 * cos(y * 0.14 - x * 0.062) * ease(coast / 20)
    z += hill * ease((coast - 109) / 165)
    for px, py, pz, _ in plots:
        margin = max(abs(px - x) - 14.35, abs(py - 3 - y) - 13.2)
        if margin < 7:
            influence = 1 - ease(margin / 7)
            z += (pz - 0.18 - z) * influence
    return z


def earth(mesh, plots):
    cols = list(range(-500, -123, 13)) + list(range(-120, 122, 2)) + list(range(126, 520, 13))
    rows = [-3, 0, 1.2, 2.8, 4.6] + list(range(6, 170, 2)) + list(range(172, 630, 9))
    vertices = [(x, shore(x) + delta, ground(x, shore(x) + delta, plots)) for delta in rows for x in cols]
    faces = []
    stride = len(cols)
    for row in range(len(rows) - 1):
        for col in range(stride - 1):
            first = row * stride + col
            faces.append((first, first + 1, first + 1 + stride, first + stride))
    mesh.add("land", vertices, faces, smooth=True)
    obj = mesh.create()
    colors = obj.data.color_attributes.new(name="Paesaggio", type="BYTE_COLOR", domain="POINT")
    for i, (x, y, _) in enumerate(vertices):
        coast = y - shore(x)
        shade = 0.018 * sin(x / 4.2 + y / 8.4) + 0.025 * cos(y / 9.8 - x / 12.4)
        shade += 0.032 * sin((x - y) / 23.4) + 0.012 * cos(x * 1.03 + y * 0.87)
        shore_color = (0.72, 0.65, 0.51)
        grass_color = (0.40 + shade, 0.44 + shade, 0.269 + shade * 0.7)
        blend = ease((coast - 1.45) / 6.2)
        colors.data[i].color_srgb = tuple(a + (b - a) * blend for a, b in zip(shore_color, grass_color)) + (1,)
    obj.data.color_attributes.active_color = colors
    mat = mesh.materials["land"]
    attribute = mat.node_tree.nodes.new("ShaderNodeVertexColor")
    attribute.layer_name = colors.name
    mat.node_tree.links.new(attribute.outputs["Color"], mat.node_tree.nodes.get("Principled BSDF").inputs["Base Color"])


def road(mesh, plots, center, width, mat):
    left, right = [], []
    for i, (x, y) in enumerate(center):
        ax, ay = center[max(0, i - 1)]
        bx, by = center[min(len(center) - 1, i + 1)]
        magnitude = hypot(bx - ax, by - ay)
        dx, dy = (by - ay) / magnitude * width / 2, (ax - bx) / magnitude * width / 2
        for points, sign in ((left, 1), (right, -1)):
            nx, ny = x + sign * dx, y + sign * dy
            points.append((nx, ny, ground(nx, ny, plots) + 0.165))
    count = len(center)
    mesh.add(mat, left + right, [(i, i + 1, i + count + 1, i + count) for i in range(count - 1)], True)


def pine(mesh, rng, x, y, z, size):
    height = rng.uniform(2.8, 3.9) * size
    lean = rng.uniform(-0.36, 0.36) * size
    mesh.between("bark", (x, y, z), (x + lean, y + 0.22 * size, z + height * 0.92), 0.13 * size, 0.07 * size, 6)
    for i in range(4):
        lx, ly = rng.uniform(-1.03, 1.03) * size, rng.uniform(-0.9, 0.9) * size
        top = z + height + rng.uniform(-0.44, 0.38) * size
        mesh.between("bark", (x + lean / 2, y, z + height * 0.62), (x + lx, y + ly, top), 0.065 * size, 0.021 * size, 5)
        mesh.ball(("pine", "pine-light", "pine-dark", "pine")[i], x + lx, y + ly, top,
                  1.24 * size, 1.06 * size, 0.67 * size, 8, 4)


def cypress(mesh, x, y, z, height):
    mesh.between("bark", (x, y, z), (x, y, z + height * 0.42), height * 0.018, sides=6)
    mesh.ball("pine-dark", x, y, z + height * 0.55, height * 0.123, height * 0.116, height * 0.51, 8, 5)
    mesh.ball("pine", x - height * 0.04, y - height * 0.035, z + height * 0.51,
              height * 0.097, height * 0.094, height * 0.4, 8, 4)


def landscape(materials, plots):
    terrain = MeshBatch("Costa e pendii", materials)
    earth(terrain, plots)

    routes = MeshBatch("Accessi in ghiaia", materials)
    for row_y in (-48, -8, 32):
        center = [(x, row_y + 11.5 + 1.3 * sin((x + row_y) / 22)) for x in range(-69, 73, 2)]
        road(routes, plots, center, 3.45, "paving")
    center = [(67 + 3 * sin(y / 11), y) for y in range(-37, 88, 2)]
    road(routes, plots, center, 3.5, "paving")
    routes.create()

    plants = MeshBatch("Macchia mediterranea", materials)
    rng = Random(410)
    for px, py, _, _ in plots:
        for dx, dy in ((-15.6, -10), (-15.3, 7), (15.7, -9), (15.4, 7)):
            x, y = px + dx, py + dy
            z = ground(x, y, plots)
            cypress(plants, x, y, z, rng.uniform(2.6, 4.7))
        for i in range(12):
            x = px + rng.uniform(-14.1, 14.1)
            y = py - rng.uniform(14.9, 16.1)
            z = ground(x, y, plots)
            plants.ball(rng.choice(("herb", "sage", "olive")), x, y, z + 0.13,
                        rng.uniform(0.35, 0.63), 0.51, rng.uniform(0.29, 0.42), 7, 4)

    for _ in range(735):
        x, y = rng.uniform(-169, 184), rng.uniform(-83, 170)
        if y - shore(x) < 6 or any(abs(x - px) < 16.5 and abs(y - py + 1.1) < 17.2 for px, py, *_ in plots):
            continue
        if (-70 < x < 73 and min(abs(y - py - 11.5) for py in (-48, -8, 32)) < 2.9
                or 63 < x < 74 and -38 < y < 87):
            continue
        z = ground(x, y, plots)
        if rng.random() > 0.38:
            pine(plants, rng, x, y, z, rng.uniform(0.66, 1.65))
        else:
            s = rng.uniform(0.5, 1.6)
            plants.ball(rng.choice(("herb", "sage", "olive", "pine-light")), x, y, z + s * 0.29,
                        s, s * 0.77, s * 0.63, 8, 4)

    for _ in range(152):
        x = rng.uniform(-152, 166)
        y = shore(x) + rng.uniform(0.1, 7.2)
        z = ground(x, y, plots)
        r = rng.uniform(0.26, 1.4)
        plants.ball(rng.choice(("coastal-rock", "stone", "stone-low")), x, y, z,
                    r, r * rng.uniform(0.55, 0.83), r * 0.53, 7, 3)
    plants.create()

    sea = MeshBatch("Mediterraneo", materials)
    sea.add("water", [(-1650, -1650, 0), (1650, -1650, 0), (1650, 1650, 0), (-1650, 1650, 0)], [(0, 1, 2, 3)])
    sea.create()
