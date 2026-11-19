# -*- coding: utf-8 -*-
"""Hand-chunked captions for the Fanatics reel, timed from public/fanatics/words.json -> src/videos/fanatics/captions.ts.
python3 videos/fanatics-unpaid-pikachu/mkcaptions.py"""
import json, os
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
W = json.load(open(os.path.join(R, "public/fanatics/words.json"), encoding="utf-8"))
P = """Một lá Pikachu mặc áo mưa|được bán với giá|tám triệu tư đô la|rồi biến mất|khỏi danh sách đã bán|Tháng chín|trên sàn Fanatics Collect|sáu mươi tư lượt trả giá|búa gõ ở bảy triệu|cộng phí thành|tám triệu bốn trăm nghìn|Báo chí khắp nơi đưa tin|lá Pokémon đắt thứ hai|lịch sử|Cuối tháng mười|hồ sơ ghi rõ|đã thanh toán|Rồi giữa tháng mười một|trang của nó biến mất|Rồi hiện lại|Lần này|dữ liệu ẩn bên trong trang|ghi đúng một chữ|đã hủy|Khoan|vậy rốt cuộc|có ai trả tiền không?|Mà đâu chỉ riêng Pikachu|Trang tin GempireCards|ngồi so từng kết quả đấu giá cũ|với lịch sử bán hiện tại|của Fanatics|và thấy hàng triệu đô|doanh số Pokémon|đã lặng lẽ bốc hơi|Những lá từng chốt giá|một trăm linh tám nghìn|ba trăm ba mươi sáu nghìn đô|giờ như chưa từng được bán|Fanatics giải thích|không nhận được tiền|thì giao dịch bị xóa|khỏi lịch sử|để thông tin thị trường|được chính xác|Nhưng bạn thấy đấy|giá thẻ bài|cũng giống giá nhà|Một căn được báo bán đắt|cả khu phố|lập tức nâng giá theo|Đến lúc con số bị xóa|cả thị trường đã kịp chạy theo|một mức giá|có khi chưa từng được trả|Có thể chỉ là lỗi dữ liệu|Fanatics chưa giải thích|Và lá Pikachu áo mưa|vẫn được gọi là|lá đắt thứ hai thế giới|kèm một chữ nhỏ|không ai đọc|đã hủy""".split("|")
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
    rows.append(f"  [{a}, {b}, {json.dumps(ph, ensure_ascii=False)}],")
open(os.path.join(R, "src/videos/fanatics/captions.ts"), "w", encoding="utf-8").write(
    "/** Vietnamese captions, hand-chunked phrases timed from the aligned voiceover (public/fanatics/words.json): [first frame, end frame, text].\n"
    " *  Written by videos/fanatics-unpaid-pikachu/mkcaptions.py. */\nexport const CAPTIONS: [number, number, string][] = [\n" + "\n".join(rows) + "\n];\n")
print(len(rows), "captions")
