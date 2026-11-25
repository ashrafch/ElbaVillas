"""Mediterranean duplexes and their two furnished homes."""

from geometry import MeshBatch, group


def window(mesh, x, y, width, z0=0.22, height=3.22, opening=None):
    panels = 4
    for segment in range(panels):
        if segment != opening:
            mesh.box("glass", x + width * ((segment + 0.5) / panels - 0.5), y,
                     z0 + height / 2, width / panels - 0.035, 0.025, height)
    for edge in (z0, z0 + height):
        mesh.box("bronze", x, y, edge, width, 0.1, 0.07)
    for index in range(5):
        mesh.box("bronze", x + width * (index / 4 - 0.5), y, z0 + height / 2,
                 0.064, 0.1, height)


def stone_wall(mesh, x, y, z, width, depth, height):
    mesh.box("stone", x, y, z + height / 2, width, depth, height)
    for row in range(round(height / 0.34)):
        level = z + 0.16 + row * 0.34
        for i in range(max(1, round(width / 0.82))):
            segment = width / max(1, round(width / 0.82))
            start = x - width / 2 + segment * (i + 0.5)
            mat = ("stone-high", "stone", "stone-low")[(row * 17 + i * 13) % 5 % 3]
            mesh.box(mat, start, y - depth / 2, level, segment - 0.025, 0.045, 0.305)


def courtyard(mesh, x, sign, variant):
    mesh.box("deck", x, -9.98, -0.06, 12.66, 7.6, 0.28, 0.14)
    mesh.box("stone-low", x - sign * 0.48, -12.5, 0.14, 7.88, 1.3, 0.32, 0.18)
    mesh.box("herb", x - sign * 0.48, -12.5, 0.31, 7.69, 1.12, 0.038, 0.15)
    for i in range(2):
        cx = x + sign * (0.9 + i * 1.39)
        mesh.box("wood", cx, -9.18, 0.21, 0.81, 1.91, 0.2, 0.1)
        mesh.box("linen", cx, -9.25, 0.355, 0.75, 1.76, 0.15, 0.18)
        mesh.box("linen", cx, -8.59, 0.48, 0.7, 0.36, 0.18, 0.11)
    cx = x - sign * 2.45
    mesh.between("bronze", (cx, -8.75, 0.06), (cx, -8.75, 2.6), 0.032)
    mesh.ball("parasol", cx, -8.75, 2.56, 1.37, 1.37, 0.21, 10, 4)
    mesh.between("wood", (cx, -8.75, 0.11), (cx, -8.75, 0.49), 0.64, 0.67, 16)
    for i in range(7):
        mesh.ball(("herb", "olive", "sage")[(i + variant) % 3], x - sign * 5.55,
                  -12.8 + i * 0.73, 0.14, 0.33, 0.36, 0.28 + (i % 3) * 0.06)
    for i in range(11):
        mesh.ball(("herb", "olive", "sage")[(i + variant) % 3], x - sign * 3.72 + sign * i * 0.64,
                  -12.52, 0.36, 0.42, 0.36, 0.23 + (i % 3) * 0.10, 8)


def railing(mesh, x, y, width, level):
    mesh.box("rail", x, y, level + 0.99, width, 0.074, 0.061)
    mesh.box("rail", x, y, level + 0.13, width, 0.053, 0.055)
    count = round(width / 0.34)
    for i in range(count + 1):
        mesh.box("rail", x + width * (i / count - 0.5), y, level + 0.56, 0.031, 0.045, 0.906)


def pitched_roof(mesh, x, y, width, depth, eaves, rise, variation):
    hw, hd = width / 2, depth / 2
    ridge = hw * 0.65
    verts = [(x - hw, y - hd, eaves), (x + hw, y - hd, eaves),
             (x + hw, y + hd, eaves), (x - hw, y + hd, eaves),
             (x - ridge, y, eaves + rise), (x + ridge, y, eaves + rise)]
    mesh.add("tile", verts, [(0, 1, 5, 4), (1, 2, 5), (2, 3, 4, 5), (3, 0, 4), (3, 2, 1, 0)])
    mesh.between("tile-light", (x - ridge, y, eaves + rise), (x + ridge, y, eaves + rise), 0.10, sides=8)
    count = round(width / 0.23)
    for i in range(1, count):
        dx = width * (i / count - 0.5)
        reach = 1 - max(0, abs(dx) - ridge) / (hw - ridge)
        if reach < 0.11:
            continue
        mat = ("tile", "tile-light", "tile-dark", "tile", "tile")[(i + variation) % 5]
        for side in (-1, 1):
            mesh.between(mat, (x + dx, y + side * hd, eaves + 0.045),
                         (x + dx, y + side * hd * (1 - reach), eaves + rise * reach + 0.045),
                         0.061, sides=5)
    for side in (-1, 1):
        mesh.box("wood", x, y + side * hd, eaves - 0.046, width, 0.12, 0.13)


def stair(mesh, x, sign, level):
    lane = x - sign * 4.75
    count = 20
    for i in range(count):
        y = 0.45 + i * 0.27
        z = (i + 1) * level / count
        mesh.box("wood", lane, y, z - 0.05, 1.57, 0.28, 0.112, 0.018)
        if i % 2 == 0:
            mesh.between("bronze", (lane + sign * 0.73, y, z),
                         (lane + sign * 0.73, y, z + 0.86), 0.025, sides=5)
    for offset in (-0.49, 0.49):
        mesh.between("bronze", (lane + offset, 0.33, 0.08),
                     (lane + offset, 5.79, level - 0.06), 0.096, sides=6)
    mesh.between("wood", (lane + sign * 0.73, 0.38, 1.02),
                 (lane + sign * 0.73, 5.66, level + 0.87), 0.052, sides=6)


def upstairs(upper, roof, x, sign, level, variant):
    facade_depth = 11.49 - 0.12 * ((variant + (sign > 0)) % 3)
    facade_y = 6.04 - facade_depth
    wall_y = (facade_y + 6.04) / 2
    stair_lane = x - sign * 4.75
    # The upper slab wraps a real opening for the stair.
    upper.box("deck", x + sign * 1.305, wall_y, level - 0.125, 10.04, facade_depth, 0.25)
    upper.box("deck", x - sign * 6.00, wall_y, level - 0.125, 0.48, facade_depth, 0.25)
    upper.box("deck", stair_lane, (facade_y + 0.28) / 2, level - 0.125,
              1.95, 0.28 - facade_y, 0.25)
    upper.box("deck", stair_lane, 5.9, level - 0.125, 1.95, 0.56, 0.25)
    upper.box("plaster", x + sign * 6.16, wall_y, level + 1.52, 0.38, facade_depth, 3.04)
    upper.box("stone", x - sign * 6.19, wall_y, level + 1.52, 0.28, facade_depth, 3.04)
    upper.box("plaster", x, 6.17, level + 1.29, 12.5, 0.32, 2.59)
    upper.box("plaster", x, 6.17, level + 3.04, 12.5, 0.32, 0.15)
    upper.box("glass", x, 6.15, level + 2.78, 12.18, 0.04, 0.38)
    for column in (-5.92, -1.9, 1.9, 5.92):
        upper.box("wood", x + column, 6.11, level + 2.78, 0.05, 0.07, 0.43)
    stone_wall(upper, x - sign * 5.84, facade_y, level, 0.62, 0.53, 3.06)
    window(upper, x + sign * 0.06, facade_y, 11.64, level + 0.06, 2.9,
           opening=0 if sign < 0 else 3)
    upper.box("stone-high", x, -6.59, level - 0.1, 12.68, 2.93, 0.25, 0.055)
    railing(upper, x, -8.01, 12.62, level)
    for i in range(13):
        upper.box("wood", x + sign * (i * 0.39 - 1.96), -6.35, level + 2.77,
                  0.11, 2.83, 0.17)
    upper.box("wood", x + sign * 0.4, -7.59, level + 2.65, 5.28, 0.17, 0.2)
    for slot in (-1.97, 2.85):
        upper.box("wood", x + sign * slot, -7.56, level + 1.32, 0.14, 0.15, 2.68)
    upper.box("wood", x - sign * 3.83, -6.74, level + 0.18, 2.51, 0.65, 0.33, 0.09)
    upper.box("linen", x - sign * 3.83, -6.74, level + 0.42, 2.46, 0.63, 0.22, 0.15)
    pitched_roof(roof, x, wall_y, 12.78, facade_depth + 0.56, level + 3.07,
                 0.93 + 0.18 * ((variant + (sign > 0)) % 3), variant)


def living(mesh, x, sign, variant):
    cushion = "linen" if sign < 0 else "sage-fabric"
    rug = "rug" if variant % 2 else "sand-fabric"
    mesh.box(rug, x - sign * 1.82, -3.15, 0.15, 4.3, 3.72, 0.05, 0.2)
    sofa_x = x - sign * 2.3
    mesh.box("wood", sofa_x, -2.12, 0.22, 3.8, 1.07, 0.21, 0.14)
    mesh.box(cushion, sofa_x, -1.67, 0.66, 3.86, 0.36, 0.75, 0.18)
    for i in range(3):
        cx = sofa_x + (i - 1) * 1.21
        mesh.box(cushion, cx, -2.18, 0.435, 1.18, 0.89, 0.27, 0.19)
        mesh.box("pillow" if i == 1 else "sand-fabric", cx + 0.11, -1.82, 0.68,
                 0.53, 0.26, 0.49, 0.12, (i - 1) * 0.24)
    for side in (-1, 1):
        mesh.box(cushion, sofa_x + side * 1.87, -2.12, 0.54, 0.28, 1.08, 0.51, 0.12)
    mesh.box("stone-low", sofa_x, -3.64, 0.29, 1.83, 0.86, 0.29, 0.34)
    mesh.box("stone-high", sofa_x, -3.64, 0.464, 1.93, 0.94, 0.09, 0.37)
    mesh.box("book", sofa_x - 0.41, -3.63, 0.53, 0.32, 0.24, 0.035, 0.018, 0.15)
    mesh.ball("vase", sofa_x + 0.38, -3.67, 0.63, 0.11, 0.11, 0.13)
    mesh.box("wood", x + sign * 2.7, -5.8, 0.72, 3.7, 0.71, 1.17, 0.04)
    mesh.box("stone-high", x + sign * 2.7, -5.8, 1.34, 3.8, 0.78, 0.10, 0.03)
    for i in range(5):
        mesh.box("walnut-dark", x + sign * 2.7 + (i - 2) * 0.73, -5.424, 0.75, 0.015, 0.03, 1.05)
    mesh.box("wood", x + sign * 2.35, -4.27, 0.62, 2.43, 0.86, 0.98, 0.09)
    mesh.box("stone-high", x + sign * 2.35, -4.27, 1.15, 2.55, 0.98, 0.12, 0.07)
    mesh.between("bronze", (x + sign * 2.62, -4.22, 1.21), (x + sign * 2.62, -4.22, 1.47), 0.022)
    mesh.between("bronze", (x + sign * 2.62, -4.22, 1.47), (x + sign * 2.62, -4.38, 1.47), 0.022)
    dining_x = x + sign * 2.48
    mesh.between("wood", (dining_x, -1.92, 0.14), (dining_x, -1.92, 0.83), 0.3, 0.29, 12)
    mesh.box("wood", dining_x, -1.92, 0.88, 2.35, 1.12, 0.11, 0.47)
    for i in range(4):
        side = -1 if i < 2 else 1
        cx = dining_x + (i % 2 - 0.5) * 0.93
        cy = -1.92 + side * 0.9
        mesh.box("wood", cx, cy, 0.30, 0.47, 0.47, 0.42, 0.09)
        mesh.box(cushion, cx, cy, 0.54, 0.53, 0.5, 0.13, 0.13)
        mesh.box("wood", cx, cy + side * 0.2, 0.68, 0.5, 0.13, 0.39, 0.07)
    mesh.between("bronze", (dining_x, -1.92, 2.1), (dining_x, -1.92, 3.53), 0.018)
    mesh.ball("light", dining_x, -1.92, 2.13, 0.38, 0.38, 0.19, 16)
    mesh.box("wood", x - sign * 3.04, 1.28, 0.56, 2.4, 0.4, 0.79, 0.04)
    mesh.box("bronze", x - sign * 3.04, 1.73, 1.9, 1.66, 0.08, 1.15)
    mesh.box("art", x - sign * 3.04, 1.676, 1.9, 1.56, 0.035, 1.05)


def bedroom_and_bath(mesh, x, sign):
    bed = x - sign * 2.38
    mesh.box("rug", bed, 3.85, 0.151, 3.23, 3.6, 0.035, 0.16)
    mesh.box("wood", bed, 4.16, 0.28, 2.39, 2.46, 0.24, 0.07)
    mesh.box("linen", bed, 4.16, 0.5, 2.3, 2.35, 0.38, 0.22)
    mesh.box("sand-fabric", bed, 3.75, 0.68, 2.32, 1.38, 0.15, 0.18)
    mesh.box("pillow", bed, 5.47, 0.78, 2.82, 0.24, 1.23, 0.12)
    for side in (-1, 1):
        mesh.box("linen", bed + side * 0.57, 4.92, 0.76, 0.87, 0.53, 0.21, 0.15, side * 0.06)
        mesh.box("wood", bed + side * 1.57, 5.15, 0.36, 0.49, 0.52, 0.45, 0.13)
        mesh.between("bronze", (bed + side * 1.57, 5.15, 0.6), (bed + side * 1.57, 5.15, 0.92), 0.028)
        mesh.ball("light", bed + side * 1.57, 5.15, 0.96, 0.17, 0.17, 0.14)
    bath_x = x + sign * 3.09
    mesh.box("stone-high", bath_x, 4.55, 0.145, 4.78, 3.54, 0.034)
    mesh.box("walnut-dark", bath_x, 5.61, 0.52, 2.03, 0.62, 0.72, 0.05)
    mesh.box("stone", bath_x, 5.61, 0.91, 2.08, 0.65, 0.09, 0.05)
    mesh.ball("linen", bath_x - sign * 0.42, 5.62, 0.99, 0.27, 0.2, 0.08)
    mesh.box("bronze", bath_x, 5.97, 1.71, 1.7, 0.06, 0.9, 0.025)
    mesh.box("mirror", bath_x, 5.928, 1.71, 1.61, 0.03, 0.82, 0.02)
    tub_x = bath_x + sign * 1.43
    mesh.box("linen", tub_x, 3.87, 0.39, 0.89, 1.76, 0.52, 0.37)
    mesh.box("stone-low", tub_x, 3.87, 0.655, 0.69, 1.55, 0.025, 0.28)
    mesh.between("bronze", (tub_x, 4.7, 0.62), (tub_x, 4.7, 0.92), 0.026)
    mesh.box("wood", x + sign * 1.04, -2.11, 0.36, 3.52, 0.84, 0.37, 0.14)
    mesh.box("sage-fabric", x + sign * 1.04, -2.11, 0.6, 3.43, 0.8, 0.22, 0.16)
    mesh.box("linen", x + sign * 1.04, -1.74, 0.86, 3.46, 0.25, 0.64, 0.10)
    mesh.box("stone-high", x + sign * 1.27, -3.48, 0.32, 1.56, 0.78, 0.31, 0.35)
    mesh.ball("vase", x + sign * 1.28, -3.45, 0.61, 0.14, 0.13, 0.18)
    mesh.box("bronze", bed, 5.91, 2.22, 1.34, 0.062, 0.89)
    mesh.box("art", bed, 5.864, 2.22, 1.26, 0.03, 0.81)


def villa(materials, index, origin, rotation):
    root = group(f"villa-{index + 1:02}", origin)
    root.rotation_euler.z = rotation
    facade = MeshBatch("Facciata e terrazze", materials, root)
    roof = MeshBatch("Coppi e colmi", materials, group(f"roof-{index + 1:02}", parent=root))
    interior = MeshBatch("Piano terra e scala", materials, root)
    level = 3.72
    upper = MeshBatch("Primo piano e logge", materials, root)
    rooms = MeshBatch("Suite arredate A e B", materials, group("Arredi al primo piano", (0, 0, level), root))
    facade.box("stone", 0, -3.2, -0.74, 26.8, 23.2, 1.54, 0.11)
    facade.box("stone-high", 0, 0, 0.03, 26.45, 12.75, 0.3)
    stone_wall(facade, 0, -14.49, -1.06, 26.56, 0.42, 1.05)
    for x in (-12.86, 0, 12.86):
        stone_wall(facade, x, -6.14, 0.14, 0.66 if x else 0.58, 0.82, 3.39)
        facade.box("stone", x, -0.01, 1.86, 0.35 if x else 0.39, 12.12, 3.45)
    facade.box("plaster", 0, 6.19, 1.86, 26.05, 0.32, 3.45)
    facade.box("stone-low", 0, -6.79, 3.68, 26.7, 0.18, 0.18)
    facade.box("plaster", 0, -6.12, 3.68, 26.7, 1.5, 0.26)
    for side in (-1, 1):
        x = side * 6.46
        facade.box("paving", x + side * 4.0, 8.24, -0.028, 2.4, 4.0, 0.16)
        facade.box("walnut-dark", x + side * 4.0, 6.016, 1.26, 1.53, 0.12, 2.32)
        facade.box("deck", x, 0, 0.132, 12.54, 12.18, 0.087)
        window(facade, x, -6.39, 11.88, opening=0 if side < 0 else 3)
        for i in range(13):
            facade.box("wood", x - side * 4.9 + side * i * 0.26, -6.97, 3.41,
                       0.08, 1.8, 0.1)
        interior.box("walnut-dark", x + side * 3.2, 5.83, 1.18, 4.5, 0.51, 2.3, 0.055)
        interior.box("art", x - side * 2.9, 6.011, 2.1, 1.7, 0.035, 1)
        stair(interior, x, side, level)
        rooms.box("plaster", x - side * 1.4, 1.79, 1.51, 4.45, 0.19, 3.02)
        rooms.box("plaster", x + side * 3.99, 2.72, 1.51, 2.81, 0.19, 3.02)
        rooms.box("plaster", x + side * 0.62, 5.04, 1.51, 0.18, 2.48, 3.02)
        courtyard(facade, x, side, index)
        upstairs(upper, roof, x, side, level, index)
        living(interior, x, side, index)
        bedroom_and_bath(rooms, x, side)
    stone_wall(facade, 0, -10.5, 0.01, 0.29, 6.9, 1.12)
    facade.create()
    roof.create()
    interior.create()
    upper.create()
    rooms.create()
    return root
