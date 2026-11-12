# Live graph: watch for file changes, rebuild with graphify, re-merge CSS/config nodes, refresh graph.html.
# Run from repo root with graphify's Python: $(cat graphify-out/.graphify_python) scripts/graphify_live.py
import os, subprocess, sys, threading, time
from watchdog.events import FileSystemEventHandler
from watchdog.observers import Observer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
GRAPHIFY = os.path.expanduser('~/.local/bin/graphify')
SKIP = ('node_modules', '.git', 'graphify-out', 'dist', '.venv', '__pycache__', 'test-results', 'playwright-report', '.vite')
DEBOUNCE = 5.0
lock, timer = threading.Lock(), None

def rebuild():
    with lock:
        for cmd in ([GRAPHIFY, 'update', '.', '--force'],
                    [sys.executable, 'scripts/graphify_supplement.py'],
                    [GRAPHIFY, 'export', 'html']):
            r = subprocess.run(cmd, capture_output=True, text=True)
            if r.returncode:
                print(f'[live] FAILED {cmd[1]}: {r.stderr[-300:]}', flush=True); return
        print(time.strftime('[live] graph rebuilt %H:%M:%S'), flush=True)

class H(FileSystemEventHandler):
    def on_any_event(self, e):
        global timer
        if e.is_directory or any(f'/{d}/' in e.src_path or e.src_path.endswith('/' + d) for d in SKIP): return
        if timer: timer.cancel()
        timer = threading.Timer(DEBOUNCE, rebuild); timer.start()

o = Observer(); o.schedule(H(), ROOT, recursive=True); o.start()
print(f'[live] watching {ROOT}', flush=True)
try:
    while True: time.sleep(3600)
except KeyboardInterrupt:
    o.stop()
o.join()
