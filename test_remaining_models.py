import os
import time
from dotenv import load_dotenv
from google import genai
from google.genai.errors import APIError

# 1. Nạp biến môi trường từ file .env
load_dotenv()
API_KEY = os.environ.get("GEMINI_API_KEY")

if not API_KEY:
    print("❌ LỖI: Không tìm thấy biến 'GEMINI_API_KEY' trong file .env!")
    exit()

# 2. Danh sách các model CẦN CHẠY LẠI (Đã lọc bỏ các model thành công và model không hỗ trợ văn bản)
TARGET_MODELS = [
    {"id": "gemini-pro-latest", "name": "Gemini Pro Latest"},
    {"id": "gemini-3-pro-preview", "name": "Gemini 3 Pro Preview"},
    {"id": "gemini-3-flash-preview", "name": "Gemini 3 Flash Preview"},
    {"id": "gemini-3.1-pro-preview", "name": "Gemini 3.1 Pro Preview"},
]

try:
    client = genai.Client(api_key=API_KEY)
    
    print(f"--- 🔄 BẮT ĐẦU CHẠY LẠI {len(TARGET_MODELS)} MODEL CHƯA PHẢN HỒI ---")
    print("Khoảng cách mỗi lần gọi là 5 giây để tối ưu hồi phục Quota.\n")
    
    for count, model in enumerate(TARGET_MODELS, 1):
        print(f"[{count}/{len(TARGET_MODELS)}] 🔄 Đang gọi lại: {model['name']} ({model['id']})...")
        
        try:
            # Gửi yêu cầu kiểm tra
            response = client.models.generate_content(
                model=model['id'],
                contents="Say 'Ok' in 1 word."
            )
            print(f"    🟩 AI PHẢN HỒI: \"{response.text.strip()}\"")
            
        except APIError as api_err:
            print(f"    🟨 Vẫn lỗi API: {api_err.message}")
        except Exception as e:
            print(f"    ❌ Lỗi hệ thống: {e}")
            
        print("-" * 60)
        
        # Tăng thời gian nghỉ lên 5 giây để tăng tỷ lệ thành công khi vượt qua bộ lọc khóa của Google
        time.sleep(5)
        
    print("\n✅ QUÁ TRÌNH CHẠY LẠI HOÀN TẤT!")

except Exception as e:
    print(f"❌ Lỗi khởi tạo: {e}")