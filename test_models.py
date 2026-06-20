import os
from dotenv import load_dotenv  # 👈 BẮT BUỘC PHẢI THÊM DÒNG NÀY ĐỂ HÀM DƯỚI CHẠY ĐƯỢC
from google import genai
from google.genai.errors import APIError

# Nạp file .env vào bộ nhớ hệ thống
load_dotenv()

# Lấy API Key từ file .env
API_KEY = os.environ.get("GEMINI_API_KEY")

# 🔒 ĐOẠN KIỂM TRA BẢO HIỂM: Tránh lỗi rỗng key
if not API_KEY:
    print("❌ LỖI: Không tìm thấy biến 'GEMINI_API_KEY' trong file .env!")
    print("Vui lòng kiểm tra xem file .env có nằm cùng thư mục với file code này không.")
    exit()

try:
    # 2. Khởi tạo Client theo chuẩn thư viện mới
    client = genai.Client(api_key=API_KEY)
    
    print("--- ĐANG QUÉT CÁC MODEL HOẠT ĐỘNG VỚI API KEY CỦA BẠN (CHUẨN MỚI) ---\n")
    
    # 3. Lấy danh sách tất cả các model khả dụng
    available_models = client.models.list()
    
    count = 0
    for model in available_models:
        # Lọc ra các model hỗ trợ tạo nội dung văn bản/hình ảnh (generateContent)
        if model.supported_actions and 'generateContent' in model.supported_actions:
            count += 1
            
            # Tên chính xác dùng trong code (Ví dụ: 'gemini-2.5-flash')
            model_id = model.name
            display_name = model.display_name
            
            print(f"[{count}] 🟩 HOẠT ĐỘNG (HTTP 200)")
            print(f"    - ID nhập vào code: '{model_id}'")
            print(f"    - Tên Model: {display_name}")
            print("-" * 50)
            
    if count == 0:
        print("❌ Không tìm thấy model nào khả dụng cho API Key này.")

except APIError as e:
    # Xử lý khi API Key sai hoặc có lỗi kết nối từ Google
    print("❌ LỖI KẾT NỐI API: API Key không hợp lệ hoặc lỗi hệ thống!")
    print(f"Chi tiết lỗi: {e}")
except Exception as e:
    print(f"❌ Đã xảy ra lỗi không xác định: {e}")