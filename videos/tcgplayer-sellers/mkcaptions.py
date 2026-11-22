# -*- coding: utf-8 -*-
"""Hand-chunked captions for the TCGplayer reel, timed from public/tcgplayer/words.json -> src/videos/tcgplayer/captions.ts.
python3 videos/tcgplayer-sellers/mkcaptions.py"""
import json, os
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
W = json.load(open(os.path.join(R, "public/tcgplayer/words.json"), encoding="utf-8"))
P = """Một sàn thẻ bài|vừa kiếm được một tỷ đô,|và người bán trên đó|ăn mừng bằng cách|nhờ chính phủ điều tra nó.|Sàn đó là TCGplayer,|chợ mua bán thẻ|Magic và Pokémon,|con cưng của eBay.|Tháng mười, eBay khoe:|tổng giao dịch|mười hai tháng qua|lần đầu vượt một tỷ đô.|Pháo hoa.|Bánh kem.|Người bán thì|không ai ăn bánh.|Họ kêu phí cao.|Kêu bị hạn chế|công cụ bên thứ ba.|Và kêu một chuyện|nghe như phim hài:|chính TCGplayer|mở gian hàng riêng,|bán đè lên họ.|Tháng năm năm ngoái,|trung tâm kiểm định|ở Syracuse đóng cửa,|hơn hai trăm công nhân|có công đoàn mất việc.|Người bán gửi thư|lên tổng giám đốc,|rồi lên tận|cơ quan liên bang.|TCGplayer bác bỏ|nhiều cáo buộc,|và đã sửa|vài chương trình.|Khoan,|sàn giàu hơn bao giờ hết,|sao người bán|lại cáu hơn bao giờ hết?|Bạn thấy đấy,|cứ hình dung một khu chợ.|Ban quản lý|thu phí sạp của bạn,|cấm bạn mang cân riêng,|rồi tự dựng một sạp y hệt|ngay bên cạnh,|bán đúng món bạn bán.|Tháng mười một,|chợ thay người quản lý.|Rob Bigler rời ghế,|Ron Jaiven về làm|tổng quản lý|và nói điều làm|TCGplayer đặc biệt|là đam mê của cộng đồng.|Lập tức,|chủ một cửa hàng nhỏ|ở South Dakota nhắn:|vậy thì gặp|năm mươi người bán nhỏ đi,|đừng chỉ gặp|mấy tài khoản to nhất.|Một tỷ đô đã về.|Còn cái ghế|cho người bán|thì vẫn đang tìm.""".split("|")
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
open(os.path.join(R, "src/videos/tcgplayer/captions.ts"), "w", encoding="utf-8").write(
    "/** Vietnamese captions, hand-chunked phrases timed from the aligned voiceover (public/tcgplayer/words.json): [first frame, end frame, text].\n"
    " *  Written by videos/tcgplayer-sellers/mkcaptions.py. */\nexport const CAPTIONS: [number, number, string][] = [\n" + "\n".join(rows) + "\n];\n")
print(len(rows), "captions, longest", max(len(p) for p in P))
