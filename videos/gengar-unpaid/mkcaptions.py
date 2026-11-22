# -*- coding: utf-8 -*-
"""Hand-chunked captions for the Gengar reel, timed from public/gengar/words.json -> src/videos/gengar/captions.ts.
python3 videos/gengar-unpaid/mkcaptions.py"""
import json, os
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
W = json.load(open(os.path.join(R, "public/gengar/words.json"), encoding="utf-8"))
P = """Một lá Gengar|được trả năm trăm|bảy mươi sáu nghìn đô la,|và hôm sau,|nó bị đánh dấu là|chưa thanh toán.|Đúng chất Pokémon hệ ma:|có đó,|rồi biến mất.|Lá Gengar ấy in năm|hai nghìn không trăm lẻ hai,|bộ Legendary Collection,|mặt bóng lấp lánh|như pháo hoa,|được CGC chấm Pristine mười.|Ngày mười một tháng mười,|trên sàn Fanatics Collect,|ba mươi hai lượt trả giá|đẩy nó lên|năm trăm bảy mươi sáu nghìn.|Nếu tiền về,|đó là kỷ lục mới cho Gengar,|vượt xa mức|bốn trăm lẻ tám nghìn|hồi tháng sáu.|Hai tuần sau,|một lá Latios Gold Star,|cũng Pristine mười,|bán năm trăm lẻ bốn nghìn.|Trong hơn|một trăm bảy mươi|lá Latios như thế,|nó là lá đẹp nhất.|Cả thị trường|mở sâm panh.|Khoan đã,|nếu người thắng|chưa trả tiền,|thì sâm panh này|ai trả?|Bạn thấy đấy,|giá đấu giá giống câu|"mai tao trả"|của thằng bạn vay tiền.|Nghe rất to,|rất chắc,|nhưng phải đến khi|tiền thật sự chuyển đi,|lời hứa|mới thành giá thật.|Ngay trên sàn này,|một trang tin|vừa phát hiện|hàng triệu đô|kết quả Pokémon|đã lặng lẽ biến khỏi|lịch sử bán,|vì không nhận được tiền.|Fanatics nói làm vậy|để thông tin thị trường|được chính xác.|Nên bây giờ,|mỗi khi thấy|một con số khổng lồ,|dân sưu tầm|làm thêm một việc|trước khi mở sâm panh:|mở trang lịch sử bán,|và tìm hai chữ,|đã trả.|Còn Gengar,|vẫn đang cười.""".split("|")
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
open(os.path.join(R, "src/videos/gengar/captions.ts"), "w", encoding="utf-8").write(
    "/** Vietnamese captions, hand-chunked phrases timed from the aligned voiceover (public/gengar/words.json): [first frame, end frame, text].\n"
    " *  Written by videos/gengar-unpaid/mkcaptions.py. */\nexport const CAPTIONS: [number, number, string][] = [\n" + "\n".join(rows) + "\n];\n")
print(len(rows), "captions, longest", max(len(p) for p in P))
