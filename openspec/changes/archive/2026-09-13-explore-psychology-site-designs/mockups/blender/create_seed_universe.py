"""Exploratory Florecer variant, executed through Blender MCP.
Keeps all original scenes/assets. Creates seed-universe.blend separately.
"""
import bpy
import ast
import math
import random
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
# Reuse modeling helpers only: never execute the original scene creation/saves.
helper_path = ROOT / 'blender/create_scenes.py'
tree = ast.parse(helper_path.read_text())
tree.body = [n for n in tree.body if isinstance(n, (ast.Import, ast.ImportFrom, ast.FunctionDef))]
exec(compile(tree, str(helper_path), 'exec'))

scene = studio('04 Florecer - Seed Universe', (.72,.75,.62),
               camera=(3,-14,8), target=(0,0,2.1), scale=7.7)
scene.render.fps = 24
scene.frame_end = 192
scene.cycles.samples = 40
scene.view_settings.look = 'AgX - Medium High Contrast'
scene.render.resolution_x = 1000
scene.render.resolution_y = 1100

clay = material('Seed | warm terracotta shell',(.44,.16,.08),.52)
inside = material('Seed | luminous porcelain inside',(.82,.64,.36),.37)
ivory = material('Seed | limestone terraces',(.78,.72,.57),.6)
sage = material('Seed | sage leaves',(.23,.39,.15),.48)
deep = material('Seed | forest stems',(.08,.18,.055),.48)
blush = material('Seed | coral blossoms',(.74,.24,.13),.46)
gold = material('Seed | brushed gold',(.65,.40,.10),.28,.45)
lightmat = material('Seed | living light',(.95,.60,.18),.3)
bsdf = lightmat.node_tree.nodes.get('Principled BSDF')
bsdf.inputs['Emission Color'].default_value = (1,.58,.17,1)
bsdf.inputs['Emission Strength'].default_value = 2.8
nodes = clay.node_tree.nodes
noise=nodes.new('ShaderNodeTexNoise'); noise.inputs['Scale'].default_value=90
bump=nodes.new('ShaderNodeBump'); bump.inputs['Strength'].default_value=.12; bump.inputs['Distance'].default_value=.025
clay.node_tree.links.new(noise.outputs['Fac'],bump.inputs['Height'])
clay.node_tree.links.new(bump.outputs['Normal'],nodes.get('Principled BSDF').inputs['Normal'])

cylinder('Seed | floating plinth',(0,0,.22),1.65,.24,ivory)
cylinder('Seed | gold plinth inlay',(0,0,.355),1.4,.025,gold)

def shell(side):
    vertices=[];faces=[];nr=48;nc=64
    for i in range(nr+1):
        theta=.008+(math.pi-.016)*i/nr
        radius=1.36*math.sin(theta)*(1-.18*math.cos(theta))
        z=1.77+1.77*math.cos(theta)
        for j in range(nc+1):
            phi=-math.pi/2+math.pi*j/nc+(math.pi if side<0 else 0)
            vertices.append((radius*math.cos(phi),radius*.83*math.sin(phi),z))
    for i in range(nr):
        for j in range(nc):
            a=i*(nc+1)+j
            faces.append((a,a+nc+1,a+nc+2,a+1))
    mesh=bpy.data.meshes.new('Seed shell surface');mesh.from_pydata(vertices,[],faces);mesh.update()
    obj=bpy.data.objects.new('Seed | '+('left shell' if side<0 else 'right shell'),mesh)
    scene.collection.objects.link(obj);obj.location=(0,0,.53)
    finish(obj,obj.name,clay);obj.data.materials.append(inside)
    solid=obj.modifiers.new('Porcelain lining','SOLIDIFY');solid.thickness=.075;solid.offset=-1;solid.material_offset=1;solid.material_offset_rim=1
    bevel=obj.modifiers.new('Polished seed rim','BEVEL');bevel.width=.025;bevel.segments=3
    for frame,opening in [(1,0),(25,0),(67,1),(121,1),(169,0),(193,0)]:
        obj.rotation_euler.y=side*math.radians(54)*opening
        obj.keyframe_insert(data_path='rotation_euler',frame=frame)
    return obj

shell(-1);shell(1)
bpy.ops.object.empty_add(location=(0,0,1.1))
garden=bpy.context.object;garden.name='Seed | inner universe reveal'
initial=set(scene.objects)

cylinder('Universe | lower island',(0,0,1.38),1.00,.20,ivory)
cylinder('Universe | glowing island seam',(0,0,1.49),.92,.028,lightmat)
sphere('Universe | moss landscape',(0,.10,1.57),(.92,.75,.22),sage)
sphere('Universe | still turquoise pool',(.3,-.33,1.72),(.44,.31,.045),material('Seed | pool',(.20,.44,.36),.12,.35))
for i in range(5):
    sphere('Universe | stepping stone '+str(i),(-.5+i*.14,-.4+math.sin(i*.5)*.14,1.77),(.11,.075,.035),ivory)

# One sculptural tree with gently curved branches and tactile almond leaves.
tube('Universe | tree trunk',[(-.20,.27,1.65),(-.29,.28,2.08),(-.06,.28,2.58),(-.14,.26,3.14)],.046,deep)
for i in range(9):
    side=-1 if i%2==0 else 1
    z=1.93+i*.13
    x=-.15+side*(.34 if i<6 else .24)
    tube('Universe | branch '+str(i),[(-.15,.27,z-.16),(x*.75,.25,z-.03),(x,.24,z+.08)],.025,deep)
    leaf=sphere('Universe | leaf '+str(i),(x+side*.10,.24,z+.19),(.17,.075,.33),sage if i%3 else deep)
    leaf.rotation_euler.y=side*.80
    leaf.rotation_euler.z=side*.18
sphere('Universe | tree crown',(-.15,.26,3.28),(.13,.075,.28),sage)

# Tiny botanical blooms, each on its own stem.
for k,(x,y,z) in enumerate([(-.66,-.05,2.0),(.55,.04,2.17),(.18,.40,2.03)]):
    tube('Universe | flower stem '+str(k),[(x,y,1.66),(x+.03,y,z)],.019,deep)
    for i in range(5):
        a=i*math.tau/5
        leaf=sphere('Universe | flower petal',(x+math.sin(a)*.10,y-.035,z+math.cos(a)*.10),(.08,.045,.13),blush)
        leaf.rotation_euler.y=a
    sphere('Universe | golden pollen',(x,y-.095,z),(.065,.045,.065),lightmat)

# A miniature celestial orbit behind the living garden.
pts=[]
for i in range(65):
    a=i*math.tau/64
    pts.append((math.cos(a)*.86,.50+math.sin(a)*.10,2.55+math.sin(a)*.86))
tube('Universe | fine celestial orbit',pts,.012,gold)
sphere('Universe | little sun',(.55,.44,3.18),(.18,.18,.18),lightmat)
random.seed(17)
for i in range(23):
    x=random.uniform(-1.1,1.1); y=random.uniform(-.1,.6); z=random.uniform(1.9,3.6)
    dust=sphere('Universe | firefly '+str(i),(x,y,z),(.022,)*3,lightmat)
    for frame in (1,49,97,145,193):
        a=(frame-1)/192*math.tau+i
        dust.location=(x+math.sin(a)*.07,y,z+math.cos(a)*.08)
        dust.keyframe_insert(data_path='location',frame=frame)

for obj in set(scene.objects)-initial:
    obj.parent=garden
    obj.matrix_parent_inverse=garden.matrix_world.inverted()
for frame,amount in [(1,.001),(25,.001),(67,1),(121,1),(169,.001),(193,.001)]:
    garden.scale=(amount,)*3
    garden.keyframe_insert(data_path='scale',frame=frame)

bpy.ops.object.light_add(type='POINT',location=(0,-.15,2.05))
lamp=bpy.context.object;lamp.name='Seed | inner amber glow';lamp.data.color=(1,.60,.25);lamp.data.shadow_soft_size=.9
for frame,power in [(1,0),(25,0),(67,32),(121,32),(169,0),(193,0)]:
    lamp.data.energy=power;lamp.data.keyframe_insert(data_path='energy',frame=frame)

scene.use_nodes=True
nt=scene.node_tree;nt.nodes.clear()
render=nt.nodes.new('CompositorNodeRLayers')
glow=nt.nodes.new('CompositorNodeGlare');glow.glare_type='FOG_GLOW';glow.quality='MEDIUM';glow.threshold=1.4
out=nt.nodes.new('CompositorNodeComposite')
nt.links.new(render.outputs['Image'],glow.inputs['Image']);nt.links.new(glow.outputs['Image'],out.inputs['Image'])
scene.frame_set(85)
scene.render.filepath=str(ROOT/'assets/seed-universe.png')
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'blender/seed-universe.blend'))
bpy.ops.render.render(write_still=True)
print('Seed universe saved separately. Original flower files unchanged.')
