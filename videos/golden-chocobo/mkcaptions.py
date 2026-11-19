# -*- coding: utf-8 -*-
"""Hand-chunked captions for the Golden Chocobo reel, timed from public/chocobo/words.json -> src/videos/chocobo/captions.ts.
python3 videos/golden-chocobo/mkcaptions.py"""
import json, os
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
W = json.load(open(os.path.join(R, "public/chocobo/words.json"), encoding="utf-8"))
P = """Có người vừa trả|một triệu bốn trăm nghìn đô la|cho một con gà vàng.|Không phải gà thật.|Là một lá bài Magic|tên Golden Chocobo,|trong bộ Final Fantasy,|mang số seri|bốn mươi bảy trên bảy mươi bảy,|được PSA chấm điểm|mười tuyệt đối.|Ứng dụng theo dõi giá thẻ|Collectr đăng lên Instagram:|một vụ bán riêng,|đã xác nhận.|Người bán là Adam Cai.|Cộng đồng Magic|lập tức nhíu mày.|"Một triệu tư?|Cho con chim này à?"|Bởi vì kỷ lục cũ|của một lá Golden Chocobo|chỉ là|hai trăm năm mươi nghìn đô.|Giá mới nhảy|gần gấp sáu lần,|qua một cái bắt tay riêng tư,|không đấu giá,|không hóa đơn công khai.|Khoan đã,|gấp sáu lần|chỉ sau một vụ bán?|Hóa ra,|có lý do của nó.|Lá kỷ lục cũ|chưa từng được chấm điểm.|Lá này|được PSA cho mười điểm.|Cả thế giới chỉ có|bảy mươi bảy lá Golden Chocobo,|và lá hoàn hảo|thì còn ít hơn nhiều.|Giống như hai chiếc xe cùng đời,|nhưng một chiếc|vẫn còn nguyên|lớp nilon trên ghế.|Một nhà sáng tạo nội dung Magic|kể đã gặp Adam Cai|ở MagicCon Atlanta|và trao đổi về vụ bán.|Bằng chứng đến giờ|nghiêng về phía thật.|Nhưng một vụ bán riêng|thì không có búa,|không có khán phòng,|chỉ có một bài đăng.|Và cả cộng đồng|vẫn đang nhìn chằm chằm|vào con gà vàng,|chờ nó tự chứng minh|mình đáng giá đến thế.""".split("|")
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
    show = ph if ph.endswith("?\"") else ph.rstrip(".,:")
    rows.append(f"  [{a}, {b}, {json.dumps(show, ensure_ascii=False)}],")
open(os.path.join(R, "src/videos/chocobo/captions.ts"), "w", encoding="utf-8").write(
    "/** Vietnamese captions, hand-chunked phrases timed from the aligned voiceover (public/chocobo/words.json): [first frame, end frame, text].\n"
    " *  Written by videos/golden-chocobo/mkcaptions.py. */\nexport const CAPTIONS: [number, number, string][] = [\n" + "\n".join(rows) + "\n];\n")
print(len(rows), "captions")
