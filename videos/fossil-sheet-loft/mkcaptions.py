# -*- coding: utf-8 -*-
"""Hand-chunked captions for the Fossil sheet reel, timed from public/fossil/words.json -> src/videos/fossil/captions.ts.
python3 videos/fossil-sheet-loft/mkcaptions.py"""
import json, os
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
W = json.load(open(os.path.join(R, "public/fossil/words.json"), encoding="utf-8"))
P = """Có người cuộn|một tờ thẻ Pokémon chưa cắt,|nhét lên gác mái,|rồi bỏ quên nó|lâu hơn tuổi đời|của nhiều người|đang xem video này.|Hai mươi bảy năm.|Nó sống chung với bụi,|với nhện,|và với cái quạt hỏng|mà không ai dám vứt.|Không ai cắt.|Không ai đóng khung.|Không ai nhớ nó tồn tại.|Rồi nhà dọn kho.|Có người kéo nó ra,|mở cuộn,|và nhìn:|trầy xước,|dính keo,|nhăn nhúm,|mặt sau còn rách một mảng.|"Giấy dán tường hả?|Vứt đi cho rộng chỗ."|May thay,|người chủ để ý thấy|cả thế giới đang phát điên|vì thẻ Pokémon,|nên ôm nó đi hỏi,|chắc là với vẻ mặt|của người vừa dò vé số.|Khoan đã,|ai lại có nguyên|một tờ thẻ chưa cắt|nằm trong nhà?|Hóa ra,|một người thân từng làm|cho chuỗi đồ chơi KB Toys|suốt những năm chín mươi.|Và đây không phải|giấy dán tường.|Đây là tờ thẻ hologram|bộ Fossil,|y như lúc vừa ra khỏi máy in,|trước khi bị chặt thành từng lá.|Những tờ như thế|từng được in riêng|cho một đợt khuyến mãi|của KB Toys.|Giờ thì tờ giấy suýt bị vứt ấy|được chụp cận từng vết xước|như minh tinh,|kèm hẳn biên bản tình trạng.|Nhà đấu giá Cullens of Surrey|định giá từ sáu|đến mười nghìn bảng Anh.|Chủ nhật,|hai mươi chín tháng mười một,|búa sẽ gõ.|Còn cái quạt hỏng|thì vẫn nằm trên gác.|Biết đâu đấy.""".split("|")
clean = lambda x: x.strip(",.:?!\"").lower()
i, spans = 0, []
for ph in P:
    n = len(ph.split()); ws = W[i:i + n]
    assert [clean(w["w"]) for w in ws] == [clean(x) for x in ph.split()], (ph, [w["w"] for w in ws])
    spans.append((ws[0]["s"], ws[-1]["e"], ph)); i += n
assert i == len(W)
rows = []
for j, (s, e, ph) in enumerate(spans):
    a = round(s * 30); b = round(e * 30) + 6
    if j + 1 < len(spans): b = min(b, round(spans[j + 1][0] * 30))
    show = ph if ph.endswith(("?\"", "!\"", "?", ".\"")) else ph.rstrip(".,:")
    rows.append(f"  [{a}, {b}, {json.dumps(show, ensure_ascii=False)}],")
open(os.path.join(R, "src/videos/fossil/captions.ts"), "w", encoding="utf-8").write(
    "/** Vietnamese captions, hand-chunked phrases timed from the aligned voiceover (public/fossil/words.json): [first frame, end frame, text].\n"
    " *  Written by videos/fossil-sheet-loft/mkcaptions.py. */\nexport const CAPTIONS: [number, number, string][] = [\n" + "\n".join(rows) + "\n];\n")
print(len(rows), "captions")
