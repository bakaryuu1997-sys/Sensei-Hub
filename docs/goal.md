# 🎯 Sensei Hub — Mục tiêu & Lộ trình hoàn thiện

> Cập nhật: 2026-06-17
> Tài liệu này là nguồn duy nhất theo dõi công việc còn lại. Đánh dấu `[x]` khi xong.

## Tầm nhìn

Một nền tảng học tập 3 ngôn ngữ (EN/JA/VI) cho kỹ sư IT: đọc bài học Markdown,
theo dõi tiến độ, đơn giản — đẹp — ổn định, deploy gọn trên 1 EC2.

## Trạng thái hiện tại

- ✅ Đọc bài học Markdown đa ngôn ngữ (server render + DOMPurify + Mermaid)
- ✅ Theo dõi tiến độ (localStorage + đồng bộ SQLite theo Clerk userId)
- ✅ Auth bằng Clerk; deploy Docker trên EC2
- ✅ PWA cài đặt được
- 🚧 Quiz, AI chat: mới có khung (scaffold), chưa có nội dung/logic thật

---

## Phase A — Bảo mật & Deploy EC2 ✅ (đã xong)

- [x] Gỡ `.env` khỏi git, thêm `.gitignore` rule + `.env.example`
- [x] Viết lại `Dockerfile` (build context repo root, `next start`, Clerk build args)
- [x] `docker-entrypoint.sh` chạy `prisma db push` rồi start
- [x] `.gitattributes` ép LF cho shell script (tránh lỗi CRLF trong Alpine)
- [x] Viết lại `docker-compose.yml` (1 service, bỏ Postgres, volume SQLite + lessons)
- [x] Thêm `LICENSE` (MIT), xoá `amplify.yml`
- ⚠️ **Việc của bạn**: rotate lại Clerk key trên dashboard (key cũ còn trong git history)

## Phase B — Sửa lỗi P0/P1 ✅ (đã xong)

- [x] Tách `lib/markdown.ts` dùng chung 2 API route (có unit test)
- [x] Điều hướng mobile: hamburger + Sheet (tái dùng `SidebarContent`)
- [x] Dọn auth thừa: xoá register API, bcrypt, cột `password`, seed admin, root prisma/package.json
- [x] Fix i18n: `level.alllevels` (ja), bỏ text cứng, `<html lang>` động
- [x] Bỏ `next-themes`/`ThemeProvider` không dùng (app dark-only)

## Phase C — Khung Quiz & Chat ✅ (đã xong)

- [x] Nút **Quiz** ở trang môn → route `/subject/[slug]/quiz` (trang "Sắp ra mắt")
- [x] Icon **chat nổi** góc dưới phải (placeholder cho AI chat)

## Phase D — Tính năng mới ✅ (đã xong)

- [x] **Continue learning**: lưu bài gần nhất, nút Hero điều hướng tới đó
- [x] **/settings**: tiến độ tổng + ngôn ngữ mặc định + khung AI provider (Gemini/OpenAI/Ollama)
- [x] **Footer + trang tĩnh** (about/contact/privacy/terms/blog) + LICENSE
- [x] **Search thật** bằng cmdk (⌘K), có unit test cho hàm lọc

## Phase E — Docs ✅ (đã xong)

- [x] Xoá docs thừa, giữ bộ gọn
- [x] Viết lại docs cho khớp code (Clerk/SQLite/EC2)
- [x] Tạo `goal.md` (file này)

---

## 🔮 Backlog tương lai (chia nhỏ — chưa làm)

### F. Quiz thật (ưu tiên cao)
- [ ] Thiết kế nguồn câu hỏi (đề xuất: `lessons/<lang>/<subject>/quiz.json`)
- [ ] Loader đọc quiz theo môn + ngôn ngữ (fallback EN), có cache như lesson
- [ ] UI làm quiz: 1 câu/màn, chọn đáp án, chấm điểm, giải thích
- [ ] Lưu kết quả (tận dụng model `QuizResult`/`QuizAnswer` đã có trong schema)
- [ ] Hiển thị điểm + lịch sử ở trang môn / settings
- Tiêu chí: chọn 1 môn → làm quiz → ra điểm → lưu lại được

### G. AI Chat thật (ưu tiên trung bình)
- [ ] Đọc cấu hình từ `lib/ai-config.ts` (đã có)
- [ ] Tầng gọi model: Gemini, OpenAI, Ollama (`/api/chat` proxy hoặc gọi trực tiếp client)
- [ ] Khung chat trong `FloatingChat` (lịch sử hội thoại, streaming)
- [ ] Bảo mật key: ưu tiên gọi qua server route, không lộ key client
- [ ] Ngữ cảnh: cho AI biết bài học đang xem (RAG nhẹ tuỳ chọn)
- Tiêu chí: nhập key → hỏi → nhận trả lời từ model đã chọn

### H. Hoàn thiện tiến độ & dữ liệu
- [ ] Đồng bộ số đếm lesson trong `subjects.ts` với số file thật (vd BJT 119 vs 120)
- [ ] Trang "Lịch sử học" (danh sách bài đã xem gần đây)
- [ ] Streak/XP **thật** từ `LessonProgress.lastViewed` (hoặc bỏ hẳn khỏi UI nếu không làm)

### I. Chất lượng & vận hành
- [ ] Thêm E2E Playwright cho luồng đọc bài + tick hoàn thành
- [ ] Healthcheck cho container + hướng dẫn backup volume định kỳ (cron)
- [ ] CI: chạy `pnpm lint` + `pnpm test:unit` + `pnpm build` trên PR
- [ ] Cân nhắc giảm tải three.js trên mobile (ảnh tĩnh thay planet 3D)

### J. Nội dung
- [ ] Bổ sung/đồng bộ bản dịch còn thiếu giữa en/ja/vi
- [ ] Quyết định số phận `lessons/vi/AI-Passport` (nối vào dashboard hoặc bỏ)

---

## Nguyên tắc giữ vững
- Đơn giản, đẹp, dễ dùng, ổn định. Không thêm hiệu ứng/feature mới khi deploy chưa ổn.
- Mỗi tính năng mới: thêm i18n đầy đủ 3 ngôn ngữ, không hardcode text.
- Bảo mật: không commit secret; key AI ưu tiên xử lý phía server.
