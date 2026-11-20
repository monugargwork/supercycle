# -*- coding: utf-8 -*-
"""Hand-chunked captions for the Monaco auction reel, timed from public/monaco/words.json -> src/videos/monaco/captions.ts.
python3 videos/monaco-auction/mkcaptions.py"""
import json, os
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
W = json.load(open(os.path.join(R, "public/monaco/words.json"), encoding="utf-8"))
P = """Ở Monaco,|nơi người ta đấu giá du thuyền,|kim cương|và những chiếc đồng hồ|đắt hơn cả căn nhà,|có người vừa đặt lên bàn đấu giá|một hộp thẻ Pokémon chưa bóc.|Hôtel des Ventes de Monte-Carlo,|chiều thứ Ba,|mười bảy tháng mười một.|Lần đầu tiên nơi này|mở hẳn một phiên Pokémon,|bảy mươi lô hàng.|Hãy hình dung|những quý ông áo vest|ngồi nghiêm trang,|chuẩn bị giơ bảng vì Pikachu.|Lô chính là|một hộp ba mươi sáu gói thẻ|bộ EX Espèces Delta tiếng Pháp,|năm hai nghìn không trăm lẻ sáu,|còn nguyên màng niêm phong,|nằm trong lồng kính|như vương miện hoàng gia.|Giá ước tính,|một trăm ba mươi|đến một trăm tám mươi nghìn euro.|"Một trăm tám mươi nghìn?|Hồi đó tôi mua hộp này|bằng tiền ăn sáng!"|Bên cạnh là một lá Pikachu|khoác áo poncho Rayquaza,|PSA mười điểm,|mười tám đến hai mươi nghìn euro.|Một chú chuột điện|mặc đồ hóa trang,|đắt hơn chiếc xe máy của bạn|chừng mười lần.|Khoan,|sao một hộp bìa cứng|lại được đối xử|như rượu vang quý?|Hóa ra,|nó chính là rượu vang.|Mỗi chai ngon bị mở|là một chai biến mất mãi mãi.|Hộp thẻ cũng vậy.|Hai mươi năm qua,|cứ mỗi đứa trẻ|không kìm được tay mà xé màng,|thế giới lại mất đi một hộp.|Thứ càng ít,|càng có người muốn giành.|Vậy nên,|nếu hồi bé bạn từng bị mẹ|cấm bóc hộp thẻ|vì sợ bừa nhà,|thì hôm nay,|hãy về nhà|và xin lỗi mẹ.""".split("|")
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
    show = ph if ph.endswith(("?\"", "!\"", "?")) else ph.rstrip(".,:")
    rows.append(f"  [{a}, {b}, {json.dumps(show, ensure_ascii=False)}],")
open(os.path.join(R, "src/videos/monaco/captions.ts"), "w", encoding="utf-8").write(
    "/** Vietnamese captions, hand-chunked phrases timed from the aligned voiceover (public/monaco/words.json): [first frame, end frame, text].\n"
    " *  Written by videos/monaco-auction/mkcaptions.py. */\nexport const CAPTIONS: [number, number, string][] = [\n" + "\n".join(rows) + "\n];\n")
print(len(rows), "captions")
