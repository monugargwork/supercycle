# -*- coding: utf-8 -*-
"""Hand-chunked captions for the Lucas reel, timed from public/lucas/words.json -> src/videos/lucas/captions.ts.
python3 videos/lucas-big-collection/mkcaptions.py"""
import json, os
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
W = json.load(open(os.path.join(R, "public/lucas/words.json"), encoding="utf-8"))
P = """Một người mua đến trễ|bốn mươi lăm phút,|rồi ngồi suốt hai tiếng,|cân từng gói thẻ Pokémon|trên chiếc cân nữ trang|của người khác,|như nhà giả kim|đang thử vàng.|Người đứng nhìn|là Lucas DeRuyter.|Ba thùng nhựa đồ Pokémon|của bà vợ sắp cưới,|trong đó có vài chục gói|thẻ chưa bóc:|Base Set, Jungle,|Fossil, Rocket.|Trị giá khoảng|mười sáu nghìn đô.|Ai cũng bảo,|bán đồ Pokémon cũ|thì dễ như ăn kẹo.|Thế là Lucas xếp hàng|một tiếng rưỡi|ở hội chợ thẻ bài,|nhắn cho cả chục người|làm video.|Ai cũng hứa mua.|Rồi biến mất,|như chưa từng quen.|Mãi đến cuối tháng chín,|mới có một tay buôn thẻ|ở Los Angeles trả lời.|Cân xong,|anh ta chuyển khoản|gần mười bảy nghìn đô.|Thứ Hai tuần sau,|anh ta đòi lại tiền,|vì tưởng mình mua được|bản in hiếm Shadowless.|Khoan,|cân từng gói suốt hai tiếng,|giờ mới nghĩ ra à?|Thế là Lucas lái xe|xuyên Los Angeles,|ôm một phong bì|ba nghìn rưỡi đô tiền mặt,|ra một bãi đỗ xe|như phim buôn lậu,|chỉ để mua lại|chính số thẻ mình vừa bán.|Rồi đem đến một tiệm khác.|Tiệm quét căn cước,|nghi anh đi bán đồ ăn cắp,|rồi viết sai tên anh|trên tấm séc.|Tổng cộng tám tháng.|Bên bữa pizza,|vợ sắp cưới của anh nói:|"Lẽ ra mình không nên|làm chuyện này."|Còn Lucas viết rằng,|chẳng số tiền nào đáng|để trải qua chuyện đó.|Dễ như ăn kẹo.|Kẹo đá.""".split("|")
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
open(os.path.join(R, "src/videos/lucas/captions.ts"), "w", encoding="utf-8").write(
    "/** Vietnamese captions, hand-chunked phrases timed from the aligned voiceover (public/lucas/words.json): [first frame, end frame, text].\n"
    " *  Written by videos/lucas-big-collection/mkcaptions.py. */\nexport const CAPTIONS: [number, number, string][] = [\n" + "\n".join(rows) + "\n];\n")
print(len(rows), "captions")
