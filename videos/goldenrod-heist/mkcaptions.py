# -*- coding: utf-8 -*-
"""Hand-chunked captions for the Goldenrod heist reel, timed from public/goldenrod/words.json -> src/videos/goldenrod/captions.ts.
python3 videos/goldenrod-heist/mkcaptions.py"""
import json, os
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
W = json.load(open(os.path.join(R, "public/goldenrod/words.json"), encoding="utf-8"))
P = """Hai giờ sáng,|bốn người đeo mặt nạ|đập vỡ cửa kính|một tiệm thẻ Pokémon,|mang theo kìm cộng lực,|và một chiếc xe đi thuê.|Tiệm Goldenrod City Collectibles,|thị trấn Twin Lakes,|bang Wisconsin.|Bốn tủ kính vỡ tan.|Thẻ Pokémon,|thẻ đã chấm điểm,|đồ sưu tầm,|tiền mặt,|xong còn tranh thủ|vét luôn chiếc xe moóc|sau tiệm,|như khách buffet quay lại|lấy đĩa thứ hai.|Hơn ba trăm mười nghìn đô|biến mất|trước khi gà gáy.|Kế hoạch hoàn hảo:|mặt nạ kín mít,|ra tay giữa đêm,|không ai thấy mặt.|Chỉ có một vấn đề nhỏ.|Họ đi bằng|một chiếc Chrysler Pacifica|màu trắng.|Xe thuê.|Có hồ sơ thuê hẳn hoi.|Khoan đã,|đi ăn trộm|mà thuê xe|có giấy tờ đàng hoàng?|Bạn thấy đấy,|mặt nạ che được khuôn mặt,|nhưng chiếc xe thuê|nhớ từng con đường|nó đi qua,|còn chiếc điện thoại|trong túi|nhớ từng cột sóng|nó chạm vào.|Đeo mặt nạ|mà mang điện thoại,|khác gì chơi trốn tìm|mà cầm loa.|Cảnh sát gom camera,|hồ sơ thuê xe,|dữ liệu định vị,|lịch sử điện thoại,|cả dấu vân tay,|rồi lần thẳng|đến một ngôi nhà|ở thị trấn Justice,|bang Illinois.|Vâng,|thị trấn tên là Công Lý.|Bên trong là hàng Pokémon|của chính tiệm Goldenrod.|Năm người đàn ông|bị buộc tội.|Hai người đã bị bắt.|Ba người|vẫn đang bị truy nã,|và lần này|chắc họ sẽ đi bộ.|Đập kính|chỉ mất vài giây.|Còn hồ sơ thuê xe|thì lưu lại rất lâu.""".split("|")
clean = lambda x: x.strip(",.:?!\"").lower()
i, spans = 0, []
for ph in P:
    n = len(ph.split()); ws = W[i:i + n]
    assert [clean(w["w"]) for w in ws] == [clean(x) for x in ph.split()], (ph, [w["w"] for w in ws])
    spans.append((ws[0]["s"], ws[-1]["e"], ph)); i += n
assert i == len(W), (i, len(W))
rows = []
for j, (s, e, ph) in enumerate(spans):
    a = round(s * 30); b = round(e * 30) + 6
    if j + 1 < len(spans): b = min(b, round(spans[j + 1][0] * 30))
    show = ph if ph.endswith(("?\"", "!\"", "?")) else ph.rstrip(".,:")
    rows.append(f"  [{a}, {b}, {json.dumps(show, ensure_ascii=False)}],")
open(os.path.join(R, "src/videos/goldenrod/captions.ts"), "w", encoding="utf-8").write(
    "/** Vietnamese captions, hand-chunked phrases timed from the aligned voiceover (public/goldenrod/words.json): [first frame, end frame, text].\n"
    " *  Written by videos/goldenrod-heist/mkcaptions.py. */\nexport const CAPTIONS: [number, number, string][] = [\n" + "\n".join(rows) + "\n];\n")
print(len(rows), "captions, longest", max(len(p) for p in P))
