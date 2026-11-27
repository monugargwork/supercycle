# -*- coding: utf-8 -*-
"""Hand-chunked captions for the Retford reel, timed from public/retford/words.json -> src/videos/retford/captions.ts.
python3 videos/retford-wall-heist/mkcaptions.py"""
import json, os
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
W = json.load(open(os.path.join(R, "public/retford/words.json"), encoding="utf-8"))
P = """Họ khoan xuyên một bức tường|lúc một giờ sáng|để khuân đi|hai mươi sáu hộp thẻ Pokémon,|và chuông báo động réo thẳng|về đồn cảnh sát.|Đó là một kho hàng|ở thị trấn Retford, nước Anh,|rạng sáng cuối tháng mười hai|năm ngoái.|Theo cảnh sát,|cả nhóm đã nhắm vào nơi này|suốt nhiều ngày.|Khoan,|chuẩn bị nhiều ngày|mà vẫn bị chuông báo động|bắt quả tang?|Hóa ra,|chuông chưa phải rắc rối lớn nhất.|Camera mới là rắc rối lớn.|Chiếc xe tải chở hộp thẻ|mang biển số nhái,|chạy về phía nam Yorkshire|rồi vòng sang Manchester.|Bạn thấy đấy,|biển số nhái giống như|đổi tên trên bìa vở:|bìa đổi rồi,|nhưng chữ viết bên trong|vẫn là của bạn.|Camera vẫn thấy|chiếc xe rẽ ở đâu,|qua những con đường nào.|Cảnh sát chặn nó|ở một bãi chứa đồ|tại Manchester.|Hai người bị bắt|ngay lúc đang bốc hộp xuống,|cùng một cây búa tạ trong xe.|Thám tử phụ trách nói,|chỉ trong vài giờ,|họ đã bắt hai nghi phạm|và lấy lại số hàng bị mất.|Mười một tháng sau,|sáu người đàn ông|bị buộc tội âm mưu trộm cắp|ra tòa ở Mansfield.|Hai người bị tạm giam.|Bốn người được tại ngoại,|với điều kiện|không liên lạc với nhau,|và không được bén mảng|tới một cửa hàng thẻ bài|ở Retford.|Tất cả mới bị cáo buộc,|chưa ai bị kết án.|Họ khoan xuyên được bức tường.|Nhưng giờ,|cánh cửa của cái tiệm ấy,|họ không được phép đến gần.""".split("|")
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
open(os.path.join(R, "src/videos/retford/captions.ts"), "w", encoding="utf-8").write(
    "/** Vietnamese captions, hand-chunked phrases timed from the aligned voiceover (public/retford/words.json): [first frame, end frame, text].\n"
    " *  Written by videos/retford-wall-heist/mkcaptions.py. */\nexport const CAPTIONS: [number, number, string][] = [\n" + "\n".join(rows) + "\n];\n")
print(len(rows), "captions, longest", max(len(p) for p in P))
