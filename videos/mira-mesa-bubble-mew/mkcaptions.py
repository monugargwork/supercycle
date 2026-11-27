# -*- coding: utf-8 -*-
"""Hand-chunked captions for the Mira Mesa reel, timed from public/mesa/words.json -> src/videos/mesa/captions.ts.
python3 videos/mira-mesa-bubble-mew/mkcaptions.py"""
import json, os
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
W = json.load(open(os.path.join(R, "public/mesa/words.json"), encoding="utf-8"))
P = """Một người đàn ông|cầm lá bài hơn ba nghìn đô|trên tay,|rồi chạy mất,|ngay trong buổi bán thẻ|đầu tiên của hai cha con.|Cô bé mười hai tuổi,|ở San Diego,|lần đầu bày sạp|ở một hội thẻ|tại trường trung học Mira Mesa.|Hôm ấy sạp có|một lá Bubble Mew hiếm,|một trong những lá|đắt nhất trong gian hàng.|Người cha đưa lá bài|cho một người lạ xem.|Và nó biến mất|khỏi tay ông.|Ông kể:|"Tôi tưởng anh ta đùa.|Tôi tưởng anh ta|chạy hai bước|rồi quay lại."|Anh ta không quay lại.|Ông đuổi theo,|nhưng gót chân đang đau,|và còn đau thêm.|Khoan,|sao chỉ vì một lá bài|mà phải chạy?|Bạn thấy đấy,|ở hội thẻ,|đưa bài cho người khác xem|là chuyện bình thường|nhất trần đời.|Giống đưa điện thoại|nhờ người lạ|chụp giúp tấm ảnh:|ai cũng nhìn vào máy,|chẳng ai nhìn người cầm.|Niềm tin ở đó rẻ,|nên mất cũng nhanh.|Cảnh sát San Diego|vào cuộc,|công bố hình|chiếc xe sedan đen|mà họ nghi là|của nghi phạm.|Chưa ai bị bắt.|Ban tổ chức thêm bảo vệ|và siết quy định|cho người bán.|Có người tặng hai cha con|một bản sao lá bài,|và một quỹ gây tiền|được mở|để bù một phần.|Cô bé nói:|"Con chỉ muốn chắc rằng|chuyện này không xảy ra|với ai khác."|Kẻ trộm chạy rất nhanh.|Nhưng người nhìn xa hơn,|lại là cô bé.""".split("|")
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
open(os.path.join(R, "src/videos/mesa/captions.ts"), "w", encoding="utf-8").write(
    "/** Vietnamese captions, hand-chunked phrases timed from the aligned voiceover (public/mesa/words.json): [first frame, end frame, text].\n"
    " *  Written by videos/mira-mesa-bubble-mew/mkcaptions.py. */\nexport const CAPTIONS: [number, number, string][] = [\n" + "\n".join(rows) + "\n];\n")
print(len(rows), "captions, longest", max(len(p) for p in P))
