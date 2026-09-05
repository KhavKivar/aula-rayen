"""Original Rayen design studies. Execute in Blender via Blender MCP.

Creates separate scenes without deleting the user's existing scene.
All geometry is procedural; no stock models or generated AI images.
"""
import bpy
import math
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'assets'
ASSETS.mkdir(parents=True, exist_ok=True)

def material(name, color, roughness=.38, metallic=0):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value = (*color, 1)
    bsdf.inputs['Roughness'].default_value = roughness
    bsdf.inputs['Metallic'].default_value = metallic
    return mat

def finish(obj, name, mat):
    obj.name = name
    obj.data.materials.append(mat)
    if obj.type == 'MESH':
        for face in obj.data.polygons:
            face.use_smooth = True
    return obj

def sphere(name, loc, scale, mat):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=48, ring_count=32, location=loc)
    obj = finish(bpy.context.object, name, mat)
    obj.scale = scale
    return obj

def cylinder(name, loc, radius, depth, mat):
    bpy.ops.mesh.primitive_cylinder_add(vertices=96, radius=radius, depth=depth, location=loc)
    obj = finish(bpy.context.object, name, mat)
    bevel = obj.modifiers.new('Soft ceramic edge', 'BEVEL')
    bevel.width = .10
    bevel.segments = 4
    obj.modifiers.new('Weighted normals', 'WEIGHTED_NORMAL')
    return obj

def tube(name, points, radius, mat):
    curve = bpy.data.curves.new(name, 'CURVE')
    curve.dimensions = '3D'
    curve.resolution_u = 24
    curve.bevel_depth = radius
    curve.bevel_resolution = 6
    spline = curve.splines.new('BEZIER')
    spline.bezier_points.add(len(points)-1)
    for p, co in zip(spline.bezier_points, points):
        p.co = co
        p.handle_left_type = p.handle_right_type = 'AUTO'
    obj = bpy.data.objects.new(name, curve)
    bpy.context.scene.collection.objects.link(obj)
    obj.data.materials.append(mat)
    return obj

def motion(obj, height=.14, tilt=.08, phase=0):
    base = obj.location.copy()
    rot = obj.rotation_euler.copy()
    for f in range(1, 122, 15):
        t = (f-1)/120 * math.tau + phase
        obj.location.z = base.z + math.sin(t)*height
        obj.rotation_euler.y = rot.y + math.sin(t)*tilt
        obj.keyframe_insert(data_path='location', frame=f)
        obj.keyframe_insert(data_path='rotation_euler', frame=f)
    obj.location = base
    obj.rotation_euler = rot

def studio(name, bg, camera=(5,-12,6.5), target=(0,0,2.1), scale=6.6):
    scene = bpy.data.scenes.new(name)
    bpy.context.window.scene = scene
    scene.render.engine = 'CYCLES'
    scene.cycles.samples = 32
    scene.cycles.use_denoising = True
    scene.render.resolution_x = 1000
    scene.render.resolution_y = 1100
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = 'PNG'
    scene.render.fps = 20
    scene.frame_start = 1
    scene.frame_end = 120
    scene.world = bpy.data.worlds.new(name+' world')
    scene.world.use_nodes = True
    scene.world.node_tree.nodes['Background'].inputs[0].default_value = (*bg,1)
    scene.world.node_tree.nodes['Background'].inputs[1].default_value = .45
    scene.view_settings.view_transform = 'AgX'
    ground = material(name+' backdrop', bg, .85)
    bpy.ops.mesh.primitive_plane_add(size=200)
    finish(bpy.context.object, name+' floor', ground)
    bpy.ops.object.camera_add(location=camera)
    cam = bpy.context.object
    cam.rotation_euler = (Vector(target)-cam.location).to_track_quat('-Z','Y').to_euler()
    cam.data.type = 'ORTHO'
    cam.data.ortho_scale = scale
    scene.camera = cam
    for name, loc, energy, size in [('Key',(-3,-4,8),1000,5),('Fill',(5,-2,4),600,4),('Rim',(1,5,7),1100,3)]:
        bpy.ops.object.light_add(type='AREA', location=loc)
        light = bpy.context.object
        light.name = scene.name+' '+name
        light.data.energy = energy
        light.data.shape = 'DISK'
        light.data.size = size
        light.rotation_euler = (Vector(target)-light.location).to_track_quat('-Z','Y').to_euler()
    return scene

def florecer():
    scene = studio('01 Florecer', (.74,.77,.62), camera=(3,-13,7), target=(0,0,2.2), scale=6.6)
    peach = material('Florecer • pétalos de arcilla', (.87,.40,.25),.46)
    gold = material('Florecer • centro miel', (.90,.58,.12),.37)
    sage = material('Florecer • tallo salvia', (.18,.32,.15),.5)
    cream = material('Florecer • pedestal', (.88,.82,.65),.6)
    cylinder('Terrace', (0,0,.19),1.55,.38,cream)
    tube('Stem', [(0,0,.4),(.1,0,1.1),(0,0,2.3)],.10,sage)
    leaf = sphere('Leaf left',(-.43,0,1.1),(.64,.13,.24),sage)
    leaf.rotation_euler.y = -.4
    leaf = sphere('Leaf right',(.44,.05,1.53),(.60,.13,.22),sage)
    leaf.rotation_euler.y = .6
    bpy.ops.object.empty_add(location=(0,0,2.9))
    flower = bpy.context.object
    flower.name = 'Flower breath • six second loop'
    for i in range(8):
        a = i*math.tau/8
        petal = sphere('Clay petal '+str(i+1),(math.sin(a)*.78,0,math.cos(a)*.78),(.41,.27,.70),peach)
        petal.rotation_euler.y = a
        petal.parent = flower
    center = sphere('Honey center',(0,-.30,0),(.49,.29,.49),gold)
    center.parent = flower
    motion(flower,.06,.065)
    stone = sphere('Seed',(-1.3,-.3,.36),(.30,.24,.16),peach)
    return scene

def ritmo():
    scene = studio('02 A tu ritmo', (.72,.68,.91), camera=(3,-13,6.5), target=(0,0,2.4), scale=7)
    blue = material('Ritmo • azul tinta', (.045,.055,.58),.24)
    lime = material('Ritmo • lima', (.64,.83,.08),.3)
    coral = material('Ritmo • coral', (.96,.24,.11),.3)
    yellow = material('Ritmo • mantequilla', (.96,.74,.17),.32)
    # A tactile assembly of inflated, independent forms.
    bpy.ops.mesh.primitive_torus_add(major_radius=1.02,minor_radius=.31,major_segments=96,minor_segments=24,location=(-.18,.1,1.52),rotation=(math.pi/2,.28,-.2))
    ring = finish(bpy.context.object,'Blue orbit',blue)
    motion(ring,.18,.14)
    ball = sphere('Lime companion',(1.1,-.1,3.25),(.72,.68,.75),lime)
    motion(ball,.19,.06,1.8)
    tube_obj = tube('Coral wave',[(-1.6,0,3.0),(-1.25,0,3.8),(-.5,0,4.25),(.15,0,4.03),(.3,0,3.5)],.28,coral)
    motion(tube_obj,.16,.06,3.0)
    small = sphere('Butter pebble',(1.6,-.15,.80),(.48,.45,.5),yellow)
    motion(small,.12,.08,4)
    dot = sphere('Little coral',(-1.5,-.2,.55),(.24,.24,.24),coral)
    motion(dot,.07,.03,2)
    return scene

def espacio():
    scene = studio('03 Espacio', (.80,.76,.67),camera=(5,-13,7),target=(0,0,2.05),scale=6.7)
    clay = material('Espacio • terracota',(.37,.13,.065),.61)
    sand = material('Espacio • piedra',(.77,.69,.55),.7)
    gold = material('Espacio • luz',(.71,.43,.13),.25,.3)
    dark = material('Espacio • oliva',(.20,.23,.12),.5)
    cylinder('Lower step',(0,0,.12),1.90,.24,sand)
    cylinder('Upper step',(0,.15,.37),1.48,.26,sand)
    points=[(-1.20,.40,.55),(-1.20,.40,2.7)]
    for i in range(1,13):
        a=math.pi - i*math.pi/12
        points.append((math.cos(a)*1.2,.40,2.7+math.sin(a)*1.2))
    points.append((1.2,.40,.55))
    tube('The open arch',points,.25,clay)
    orb=sphere('Quiet center',(0,-.05,1.9),(.66,.66,.66),gold)
    motion(orb,.13,.03)
    sphere('River stone',(-.67,-.5,.68),(.63,.44,.21),dark)
    sphere('Warm stone',(.65,-.6,.61),(.45,.30,.13),clay)
    return scene

SCENES = [florecer(), ritmo(), espacio()]
bpy.context.window.scene = SCENES[0]
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'blender'/'rayen-design-studies.blend'))
print('Created three Rayen scenes, 120-frame loops at 20 fps. Original scene preserved.')
