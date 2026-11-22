# -*- coding: utf-8 -*-
"""Hand-chunked captions for the Jirachi reel, timed from public/jirachi/words.json -> src/videos/jirachi/captions.ts.
python3 videos/avery-jirachi-scalpers/mkcaptions.py"""
import json, os
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
W = json.load(open(os.path.join(R, "public/jirachi/words.json"), encoding="utf-8"))
P = """Một người bán trên eBay|rao một lá Jirachi|giá hai mươi nghìn đô la,|và gắn nó với tên|một cậu bé vừa qua đời.|Cậu bé đó là Avery Garcia,|mười hai tuổi,|cộng đồng gọi là|Avery the Poke Kid.|Avery quay video|bóc thẻ Pokémon|trong suốt hành trình|chữa bệnh.|Trong video cuối cùng,|Avery bóc được|một lá Jirachi minh họa hiếm|từ bộ kỷ niệm ba mươi năm.|Ngày mười tám tháng chín,|Avery qua đời|vì ung thư tuyến tụy.|Chỉ trong tuần sau đó,|các tin rao|bắt đầu xuất hiện.|Một gian hàng hứa quyên|chín mươi phần trăm|cho từ thiện,|nhưng tin rao ban đầu|chỉ ghi mười phần trăm|cho một quỹ ung thư trẻ em.|Trong khi những lá Jirachi|cùng loại|chỉ bán vài chục|đến vài trăm đô.|Khoan đã,|họ đang bán một lá bài,|hay đang bán|nỗi đau của một gia đình?|Bố mẹ Avery|lên tiếng trên Instagram.|Gia đình không liên quan,|cũng không nhận được gì|từ bất kỳ lá bài nào|bán dưới tên hay hình ảnh|của Avery.|Họ xin người bán|gỡ tin xuống.|Họ viết,|điều này không tôn vinh|trái tim hào phóng|của Avery.|Họ đang để tang con trai,|và chỉ xin được yên.|Gian hàng kia sau đó|gỡ các tin rao từ thiện.|Còn họa sĩ vẽ lá Jirachi,|Akira Egawa,|chỉ nói rằng mình muốn|tranh vẽ mang lại hạnh phúc|cho mọi người.|Người bán đặt giá|hai mươi nghìn đô.|Còn Avery,|chỉ cần được mở nó ra.""".split("|")
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
open(os.path.join(R, "src/videos/jirachi/captions.ts"), "w", encoding="utf-8").write(
    "/** Vietnamese captions, hand-chunked phrases timed from the aligned voiceover (public/jirachi/words.json): [first frame, end frame, text].\n"
    " *  Written by videos/avery-jirachi-scalpers/mkcaptions.py. */\nexport const CAPTIONS: [number, number, string][] = [\n" + "\n".join(rows) + "\n];\n")
print(len(rows), "captions")
