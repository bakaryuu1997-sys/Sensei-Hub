---
title: "Day 9: Đọc & Ghi File (File I/O)"
description: "Tìm hiểu cách mở, đọc, ghi và đóng tệp tin trong Python một cách an toàn. Thực hành thao tác file trên hệ thống file ảo của Pyodide."
codingExercise: true
initialCode: |
  def reverse_file_lines(filename, text):
      # Ghi nội dung 'text' vào tệp tin có tên là 'filename'
      # Sau đó, đọc tệp tin đó và trả về một danh sách các dòng theo thứ tự ĐẢO NGƯỢC.
      # (Chú ý: Loại bỏ ký tự xuống dòng ở cuối mỗi dòng)
      # Gợi ý: 'with open(filename, "w") as f:'
      result = []
      return result
testCode: |
  text_content = "line1\nline2\nline3"
  lines = reverse_file_lines("test.txt", text_content)
  assert lines == ["line3", "line2", "line1"], "Phải đảo ngược các dòng và loại bỏ dấu xuống dòng"
  import os
  assert os.path.exists("test.txt"), "Tệp tin 'test.txt' phải được tạo thành công"
solutionCode: |
  def reverse_file_lines(filename, text):
      with open(filename, "w") as f:
          f.write(text)
      with open(filename, "r") as f:
          lines = [line.rstrip('\r\n') for line in f.readlines()]
      return lines[::-1]
---

# Day 9: Đọc & Ghi File (File I/O)

Trong lập trình, các biến lưu trữ dữ liệu trong bộ nhớ (RAM), nhưng dữ liệu này sẽ bị mất ngay sau khi chương trình kết thúc. Để duy trì dữ liệu qua các lần chạy hoặc tương tác với các nguồn dữ liệu bên ngoài, chúng ta cần đọc và ghi tệp tin (file) trên ổ đĩa lưu trữ.

### 🎯 Mục tiêu học tập
- Mở, đọc, ghi và ghi nối tiếp (append) vào file bằng hàm tích hợp sẵn `open()`.
- Giải thích vai trò và giới hạn bảo mật của hệ thống file ảo trong bộ nhớ của Pyodide.
- Sử dụng trình quản lý ngữ cảnh (câu lệnh `with`) để đảm bảo tài nguyên được giải phóng tự động và an toàn.
- So sánh các phương thức đọc file (`read()`, `readline()`, và `readlines()`) để tối ưu hóa hiệu năng và bộ nhớ.

### 🧩 Khái niệm cốt lõi (Tại sao)
File cho phép các chương trình lưu trữ lâu dài các bản ghi dữ liệu, cấu hình hoặc kết quả phân tích.

Trong Python, các thao tác với file tuân theo một vòng đời đơn giản: mở file, đọc/ghi, và đóng file. Theo cách truyền thống, việc quên đóng file sau khi mở sẽ tạo ra rò rỉ tài nguyên, khóa file (file lock) hoặc mất mát dữ liệu chưa ghi. Python giải quyết vấn đề này bằng **Trình quản lý ngữ cảnh** (thông qua từ khóa `with`), giúp tự động đóng file khi thoát khỏi khối lệnh—ngay cả khi xảy ra lỗi làm dừng chương trình.

#### ⚠️ Lưu ý về hệ thống file ảo Pyodide
Vì khóa học này chạy trực tiếp trên trình duyệt của bạn thông qua Pyodide (Python được biên dịch sang WebAssembly), Python sẽ không có quyền truy cập trực tiếp vào ổ cứng thực tế của máy tính vì lý do bảo mật. Thay vào đó, Pyodide gắn kết một **hệ thống file ảo (virtual filesystem) trong bộ nhớ tạm thời của trình duyệt (RAM)**. Khi bạn tạo hoặc ghi một file trong trình soạn thảo này, nó sẽ được lưu trên đĩa ảo đó. File này chỉ tồn tại khi trang web còn mở và sẽ bị xóa nếu bạn tải lại trang (refresh) hoặc đóng tab trình duyệt.

### 🔁 Logic và hoạt động
Sơ đồ dưới đây minh họa vòng đời truy cập file. Việc mở file sẽ yêu cầu một trình liên kết (handle) từ hệ điều hành, các thao tác được thực hiện và trình quản lý ngữ cảnh đảm bảo đóng file và làm sạch (flush) bộ đệm khi thoát khỏi khối lệnh.

```mermaid
graph TD
    Start([Bắt đầu]) --> Open[Mở open(filename, mode) trong khối 'with']
    Open --> CheckMode{Chế độ là Ghi hay Đọc?}
    CheckMode -- Đọc ("r") --> ReadOp[Đọc nội dung file: read(), readline(), hoặc readlines()]
    CheckMode -- Ghi ("w" / "a") --> WriteOp[Ghi nội dung file: write()]
    ReadOp --> ExitBlock[Thoát khối 'with']
    WriteOp --> ExitBlock
    ExitBlock --> AutoClose[Tự động đóng file & giải phóng bộ đệm]
    AutoClose --> End([Kết thúc])
```

### 📝 Ví dụ minh họa có chú thích

Dưới đây là cách bạn ghi và đọc file trong Python:

```python
# --- Ghi dữ liệu ---
# Mở 'user_logs.txt' ở chế độ ghi ('w'). Lệnh này tạo file mới hoặc ghi đè nếu file đã tồn tại.
with open("user_logs.txt", "w") as file:
    file.write("User: Alice, Status: Active\n")  # Ghi một chuỗi ký tự. Lưu ý phải thêm ký tự xuống dòng '\n' thủ công.
    file.write("User: Bob, Status: Inactive\n")  # Ghi dòng thứ hai.

# --- Đọc dữ liệu (Đọc toàn bộ một lần) ---
# Mở 'user_logs.txt' ở chế độ đọc ('r'). Đây là chế độ mặc định nếu bạn bỏ qua tham số mode.
with open("user_logs.txt", "r") as file:
    content = file.read()  # Đọc toàn bộ nội dung file thành một chuỗi duy nhất.
    print("--- Toàn bộ File ---")
    print(content)

# --- Đọc dữ liệu từng dòng (Tiết kiệm bộ nhớ) ---
# Lặp qua đối tượng file giúp đọc từng dòng động mà không cần tải toàn bộ file vào RAM cùng lúc.
with open("user_logs.txt", "r") as file:
    print("--- Đọc từng dòng ---")
    for line in file:
        # Mỗi dòng sẽ bao gồm ký tự xuống dòng '\n' từ file.
        # Chúng ta dùng rstrip() để loại bỏ các khoảng trắng và ký tự xuống dòng ở phía bên phải chuỗi.
        print(f"Logged: {line.rstrip()}")

# --- Ghi nối tiếp dữ liệu (Append) ---
# Mở 'user_logs.txt' ở chế độ ghi tiếp ('a') để thêm nội dung vào cuối file mà không xóa dữ liệu cũ.
with open("user_logs.txt", "a") as file:
    file.write("User: Charlie, Status: Active\n")
```

### ❌ Các lỗi thường gặp

**Mistake 1: Thao tác trên một file đã đóng**
```python
with open("note.txt", "w") as f:
    f.write("Hello")
f.write(" World")
```
```text
ValueError: I/O operation on closed file.
```
```python
with open("note.txt", "w") as f:
    f.write("Hello")
    f.write(" World")
```
> Câu lệnh `with` tự động đóng file ngay sau khi luồng xử lý thoát khỏi khối lệnh thụt lề. Mọi thao tác đọc hoặc ghi tiếp theo trên đối tượng file đó sẽ gây ra lỗi `ValueError`.

**Mistake 2: Cố gắng ghi vào một file chỉ đọc**
```python
with open("data.txt", "r") as f:
    f.write("Hello")
```
```text
UnsupportedOperation: not writable
```
```python
with open("data.txt", "w") as f:
    f.write("Hello")
```
> Chế độ mặc định khi mở file là `"r"` (chỉ đọc). Nếu muốn ghi dữ liệu, bạn phải chỉ định rõ ràng chế độ `"w"` (ghi đè) hoặc `"a"` (ghi nối tiếp).

**Mistake 3: Mở một file không tồn tại để đọc**
```python
with open("non_existent.txt", "r") as f:
    content = f.read()
```
```text
FileNotFoundError: [Errno 2] No such file or directory: 'non_existent.txt'
```
```python
import os
if os.path.exists("non_existent.txt"):
    with open("non_existent.txt", "r") as f:
        content = f.read()
else:
    content = ""
```
> Đọc một file không tồn tại sẽ gây ra lỗi `FileNotFoundError`. Hãy sử dụng `os.path.exists()` hoặc xử lý ngoại lệ (`try-except`) để xử lý các trường hợp file chưa sẵn sàng.

### 💡 Mẹo & Cách viết tối ưu
- **Sử dụng `rstrip('\r\n')`**: Việc gọi `.strip()` thông thường sẽ xóa cả khoảng trắng và tab thụt lề ở đầu dòng, điều này có thể làm hỏng dữ liệu được định dạng cấu trúc. Để chỉ loại bỏ ký tự xuống dòng, hãy sử dụng `.rstrip('\r\n')`.
- **Duyệt từng dòng giúp tối ưu bộ nhớ**: Không bao giờ sử dụng `read()` hoặc `readlines()` đối với các file log cực kỳ lớn (ví dụ: các file log hàng Gigabyte). Thay vào đó, hãy dùng `for line in file:` để chỉ nạp một dòng tại một thời điểm vào RAM.
- **Tham số mã hóa encoding**: Khi xử lý các file văn bản chứa ký tự không thuộc bảng mã ASCII (như tiếng Việt có dấu hoặc tiếng Nhật), hãy chỉ định rõ tham số mã hóa UTF-8: `open("file.txt", "r", encoding="utf-8")`.

### 🧠 Đi sâu phân tích (Cơ chế bên dưới)
<details>
<summary>Bộ đệm ghi file & Cơ chế đĩa ảo của Pyodide</summary>

#### Bộ đệm file (File Buffering)
Khi bạn thực thi `file.write()`, dữ liệu không được ghi ngay lập tức vào các sector của ổ cứng vật lý. Hệ điều hành lưu trữ tạm thời các thao tác ghi file vào bộ nhớ RAM hệ thống (bộ đệm - buffer) nhằm giảm số lần yêu cầu ghi đĩa vốn có tốc độ chậm. Dữ liệu chỉ được xả (flush) xuống thiết bị lưu trữ vật lý khi bộ đệm đầy, khi gọi hàm `flush()` một cách chủ động, hoặc khi file được đóng. Việc bỏ quên không đóng file có thể khiến dữ liệu trong bộ đệm bị mất hoàn toàn nếu chương trình bị dừng đột ngột.

#### Gắn kết đĩa ảo trong Pyodide
Trong Python tiêu chuẩn, hàm `open()` tương tác trực tiếp với các API hệ thống của hệ điều hành cục bộ. Tuy nhiên dưới môi trường Pyodide, các lệnh gọi API này được chuyển hướng qua hệ thống file ảo (MEMFS) của Emscripten. MEMFS ánh xạ các thao tác file POSIX tiêu chuẩn vào các cấu trúc bộ nhớ WebAssembly. Về bản chất, việc ghi một file sẽ tạo ra một mảng byte động bên trong không gian bộ nhớ WebAssembly được phân bổ của trình duyệt. Điều này cho phép mã nguồn Python sử dụng `open()` chạy mượt mà không cần sửa đổi, nhưng dữ liệu này chỉ mang tính tạm thời và sẽ biến mất khi môi trường chạy WebAssembly bị giải phóng (ví dụ khi tải lại trang).
</details>

### 🏋️ Bài tập thực hành
Hãy hoàn thành hàm `reverse_file_lines(filename, text)` để thực hiện:
1. Ghi chuỗi văn bản `text` vào file có tên là `filename`.
2. Đọc ngược lại nội dung file đó.
3. Loại bỏ ký tự xuống dòng ở cuối mỗi dòng và trả về một danh sách chứa tất cả các dòng theo **thứ tự đảo ngược**.

Tham khảo khung code ban đầu ở khung bên phải để viết giải pháp của bạn.

### ✅ Tự kiểm tra
<details>
<summary>1. Điều gì xảy ra khi bạn mở một file đã tồn tại bằng chế độ ghi "w"?</summary>
Mở file ở chế độ ghi ("w") sẽ ngay lập tức cắt bớt (xóa sạch hoàn toàn) nội dung hiện có của file đó về 0 byte. Nếu bạn muốn giữ lại dữ liệu cũ và ghi thêm các dòng mới ở cuối, hãy mở file ở chế độ ghi tiếp ("a").
</details>

<details>
<summary>2. Tại sao câu lệnh "with" ngăn chặn được hiện tượng rò rỉ bộ nhớ và tài nguyên?</summary>
Câu lệnh "with" triển khai giao thức Trình quản lý ngữ cảnh (Context Manager) của Python. Khi thoát khỏi khối lệnh, Python đảm bảo rằng phương thức `__exit__` của đối tượng file sẽ được gọi. Điều này tự động đóng trình liên kết file (file descriptor) của hệ điều hành và giải phóng các bộ đệm chưa ghi, ngay cả khi mã bên trong khối lệnh gặp lỗi và crash chương trình.
</details>

### 📌 Tóm tắt
- Luôn sử dụng cú pháp `with open(filename, mode) as file:` để đảm bảo đóng file đúng cách.
- **Các chế độ**: `"r"` để đọc (mặc định), `"w"` để ghi đè (xóa nội dung cũ), `"a"` để ghi tiếp (thêm vào cuối file).
- **Lưu trữ ảo**: Trong Pyodide, file được lưu trong bộ nhớ tạm thời của trình duyệt và sẽ bị xóa khi tải lại trang web.
- **Tiết kiệm bộ nhớ**: Duyệt qua đối tượng file theo từng dòng (`for line in file`) để xử lý các file dung lượng lớn một cách hiệu quả.
