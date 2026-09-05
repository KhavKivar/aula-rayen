"""Export the seed study only; no original flower assets are changed."""
import bpy
import subprocess
import tempfile
from pathlib import Path

root=Path(__file__).resolve().parents[1]
scene=bpy.data.scenes['04 Florecer - Seed Universe']
bpy.context.window.scene=scene
scene.render.resolution_x=640
scene.render.resolution_y=704
scene.render.resolution_percentage=100
scene.cycles.samples=16
with tempfile.TemporaryDirectory(prefix='rayen-seed-') as folder:
    # 192 frames at 24 fps: eight seconds, closed pose matches across the loop.
    for frame in range(1,193):
        scene.frame_set(frame)
        scene.render.filepath=str(Path(folder)/f'{frame:04d}.png')
        bpy.ops.render.render(write_still=True)
    subprocess.run(['ffmpeg','-y','-loglevel','error','-framerate','24','-i',str(Path(folder)/'%04d.png'),'-c:v','libopenh264','-b:v','1800k','-pix_fmt','yuv420p','-movflags','+faststart',str(root/'assets/seed-universe.mp4')],check=True)
print('SEED_RENDER_COMPLETE',flush=True)
