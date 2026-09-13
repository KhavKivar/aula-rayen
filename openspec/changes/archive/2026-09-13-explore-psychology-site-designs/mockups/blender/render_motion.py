"""Render small 6-second studies from the scenes created through Blender MCP.

blender -b rayen-design-studies.blend --python render_motion.py
Requires ffmpeg on PATH. Temporary frames are outside the repository.
"""
import bpy
import tempfile
import subprocess
from pathlib import Path

assets = Path(__file__).resolve().parents[1] / 'assets'
for name, slug in [('01 Florecer','florecer'),('02 A tu ritmo','ritmo'),('03 Espacio','espacio')]:
    scene = bpy.data.scenes[name]
    bpy.context.window.scene = scene
    scene.render.resolution_x = 560
    scene.render.resolution_y = 616
    scene.cycles.samples = 12
    scene.render.image_settings.file_format = 'PNG'
    with tempfile.TemporaryDirectory(prefix='rayen-frames-') as tmp:
        for index, frame in enumerate(range(1, 121, 2)):
            scene.frame_set(frame)
            scene.render.filepath = str(Path(tmp) / f'{index:04d}.png')
            bpy.ops.render.render(write_still=True)
        subprocess.run(['ffmpeg','-y','-loglevel','error','-framerate','10','-i',str(Path(tmp)/'%04d.png'),'-c:v','libopenh264','-b:v','1200k','-pix_fmt','yuv420p','-movflags','+faststart',str(assets/f'{slug}.mp4')],check=True)
    print(f'FINISHED {slug}', flush=True)
