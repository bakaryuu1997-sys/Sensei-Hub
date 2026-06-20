import time
from google import genai
from google.genai.errors import APIError

# 1. Điền API Key miễn phí của bạn vào đây
API_KEY = [GEMINI_API_KEY]

try:
    # Khởi tạo Client theo chuẩn thư viện mới
    client = genai.Client(api_key=API_KEY)
    
    print("--- 🚀 BẮT ĐẦU THỬ NGHIỆM GỌI PHẢN HỒI TỪ TẤT CẢ CÁC MODEL ---")
    print("Mỗi model sẽ cách nhau 4 giây để tránh bị nghẽn băng thông bản Free.\n")
    
    # Lấy danh sách tất cả các model khả dụng
    available_models = client.models.list()
    
    count = 0
    for model in available_models:
        # Chỉ chọn các model hỗ trợ tạo nội dung văn bản
        if model.supported_actions and 'generateContent' in model.supported_actions:
            count += 1
            model_id = model.name
            display_name = model.display_name
            
            print(f"[{count}] 🔄 Đang gọi Model: {display_name} ({model_id})...")
            
            try:
                # Gửi câu hỏi thử nghiệm siêu ngắn để test phản hồi
                response = client.models.generate_content(
                    model=model_id,
                    contents="Say 'Hi from AI' in 1 word." # Câu hỏi ngắn để AI trả lời nhanh nhất
                )
                
                # Nếu thành công, in ra câu trả lời của AI
                print(f"    🟩 AI PHẢN HỒI: \"{response.text.strip()}\"")
                
            except APIError as api_err:
                # Trường hợp model đó bị quá tải hoặc bị hạn chế riêng với gói Free
                print(f"    🟨 Lỗi API (Có thể do giới hạn gói Free): {api_err.message}")
            except Exception as e:
                print(f"    ❌ Lỗi hệ thống khi gọi model này: {e}")
                
            print("-" * 60)
            
            # Tạm dừng 4 giây trước khi gọi model tiếp theo để không bị block Rate Limit
            time.sleep(4)
            
    print(f"\n✅ ĐÃ HOÀN THÀNH QUÉT XONG TẤT CẢ {count} MODEL!")

except Exception as e:
    print(f"❌ Lỗi khởi tạo hệ thống: {e}")