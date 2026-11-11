"""Shared maths for plan_check.py / plan_view.py / plan_md.py: the camera of a scene at frame f, exactly as the build's story.ts runs it."""
import json, math, sys
def load(path): return json.load(open(path, encoding="utf-8"))
def glide(u):
    x = max(0.0, min(1.0, u)); return x * x * x * (x * (6 * x - 15) + 10)
def push_k(f, f0, rate, punch=None):
    x = max(0, f - f0); s = rate * x
    if punch and punch[0] > rate:
        p, n = punch
        for i in range(int(min(x, n))): s += (p - rate) * max(0, min(1, (i + 0.5) / 8, (n - i - 0.5) / 8))
    return math.exp(-s)
def key_cam(k, f):
    kk = push_k(f, k["f"], k.get("push", 0), k.get("punch"))
    pos = [k["look"][i] + (k["pos"][i] - k["look"][i]) * kk for i in range(3)]
    return dict(pos=pos, look=list(k["look"]), fov=k["fov"], roll=k.get("roll", 0))
def cam_at(scene, f):
    ks = scene["cams"]; cur = key_cam(ks[0], f)
    for k in ks[1:]:
        if f < k["f"]: break
        c = key_cam(k, f)
        if k.get("cut"): cur = c
        else:
            u = glide((f - k["f"]) / k.get("glide", 24))
            cur = dict(pos=[a + (b - a) * u for a, b in zip(cur["pos"], c["pos"])], look=[a + (b - a) * u for a, b in zip(cur["look"], c["look"])],
                       fov=cur["fov"] + (c["fov"] - cur["fov"]) * u, roll=0)
    return cur
def sub(a, b): return [a[i] - b[i] for i in range(3)]
def dot(a, b): return sum(a[i] * b[i] for i in range(3))
def cross(a, b): return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]]
def norm(a):
    l = math.sqrt(dot(a, a)) or 1; return [x / l for x in a]
def project(cam, p, aspect=9/16):
    """-> (x%, y%) of the frame (0,0 = top left), depth in metres (<=0: behind the lens)"""
    fw = norm(sub(cam["look"], cam["pos"])); r = norm(cross(fw, [0, 1, 0])); u = cross(r, fw); d = sub(p, cam["pos"]); z = dot(d, fw)
    if z <= 1e-6: return None, None, z
    t = math.tan(math.radians(cam["fov"]) / 2)
    return 50 + 50 * dot(d, r) / (z * t * aspect), 50 - 50 * dot(d, u) / (z * t), z
def title_up(plan, f): return any(t["f"] <= f < t["out"] for t in plan.get("titles", []))
