# -*- coding: utf-8 -*-
"""Hand-chunked captions for the Chicago reel, timed from public/chicago/words.json -> src/videos/chicago/captions.ts.
python3 videos/chicago-mew-theft/mkcaptions.py"""
import json, os
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
W = json.load(open(os.path.join(R, "public/chicago/words.json"), encoding="utf-8"))
P = """Một người đàn ông|bán thẻ Pokémon cho chủ tiệm,|nhận ba trăm đô,|rồi đứng ngay đó,|lấy trộm của chính cái tiệm|vừa trả tiền cho mình.|Tiệm Old Skool TCG|của Nick Bruni ở Chicago|mới mở cửa được hai tháng.|Chiều thứ Tư,|tiệm đông khách.|Người đàn ông gọi điện trước,|hẹn mang hàng tới bán.|Cạnh quầy thu ngân|là một hộp hàng mới về.|Tay anh ta thò vào.|Một lá biến mất.|Rồi anh ta bán hàng cho Bruni,|cầm tiền.|Xong quay lại cái hộp,|thêm ba lá nữa.|Một lá Mew|kỷ niệm ba mươi năm|giá bốn nghìn đô,|một lá Psyduck chấm điểm|giá một nghìn tám,|thêm Mew và Charizard.|Tổng cộng|sáu nghìn bảy trăm đô.|Chủ tiệm đứng|cách đó vài bước.|Camera treo ngay đó,|ai nhìn cũng thấy.|Khoan,|ai lại đi trộm|trước mặt chủ,|dưới ống kính,|sau khi vừa gọi điện|hẹn hẳn hoi?|Bạn thấy đấy,|chủ tiệm canh hàng,|chứ không canh người|vừa bán hàng cho mình.|Người đó giống như|khách đến chơi nhà|mang theo quà.|Chẳng ai đi theo khách|để đếm thìa.|Chính Bruni cũng nhận:|bình thường,|anh không bao giờ để|một hộp thẻ giá trị|như thế nằm ngoài.|Nhưng niềm tin|có một nhược điểm:|nó không có camera.|Tiệm thì có.|Bruni báo cảnh sát ngay,|đưa luôn số điện thoại|người đàn ông đã gọi tới.|Hắn ra về với bốn lá bài|và ba trăm đô.|Và để lại gương mặt|trên camera,|cùng số điện thoại|của chính mình.""".split("|")
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
open(os.path.join(R, "src/videos/chicago/captions.ts"), "w", encoding="utf-8").write(
    "/** Vietnamese captions, hand-chunked phrases timed from the aligned voiceover (public/chicago/words.json): [first frame, end frame, text].\n"
    " *  Written by videos/chicago-mew-theft/mkcaptions.py. */\nexport const CAPTIONS: [number, number, string][] = [\n" + "\n".join(rows) + "\n];\n")
print(len(rows), "captions, longest", max(len(p) for p in P))
