// About / Contact / Privacy / Terms の実コンテンツ（3 言語）。
// 段落の配列で持ち、StaticPage が見出し＋本文として描画する。

export type Tri = { en: string; ja: string; vi: string }
export type LegalSection = { heading?: Tri; body: Tri[] }
export type LegalDoc = { title: Tri; updated?: string; sections: LegalSection[] }

const GITHUB = "https://github.com/bakaryuu1997-sys/Sensei-Hub"

export const aboutDoc: LegalDoc = {
  title: { en: "About Sensei Hub", ja: "Sensei Hub について", vi: "Về Sensei Hub" },
  sections: [
    {
      body: [
        {
          en: "Sensei Hub is a trilingual (English, Japanese, Vietnamese) learning platform for IT engineers. Every lesson is available in all three languages so you can learn new concepts in the language you are most comfortable with, while getting used to the Japanese technical terms used in the workplace.",
          ja: "Sensei Hub は、IT エンジニアのための 3 言語（英語・日本語・ベトナム語）学習プラットフォームです。すべてのレッスンが 3 言語で用意されているので、最も得意な言語で新しい概念を学びながら、現場で使われる日本語の技術用語にも慣れることができます。",
          vi: "Sensei Hub là nền tảng học tập 3 ngôn ngữ (Anh, Nhật, Việt) dành cho kỹ sư IT. Mọi bài học đều có đủ ba ngôn ngữ, giúp bạn học khái niệm mới bằng ngôn ngữ quen thuộc nhất, đồng thời làm quen với thuật ngữ kỹ thuật tiếng Nhật dùng trong công việc.",
        },
      ],
    },
    {
      heading: { en: "Our mission", ja: "私たちのミッション", vi: "Sứ mệnh của chúng tôi" },
      body: [
        {
          en: "We want to remove language as a barrier to growth. Many talented engineers — especially Vietnamese and other foreign engineers working in Japan — lose time fighting with English-only or Japanese-only material. Sensei Hub lets you focus on the engineering, not the dictionary.",
          ja: "私たちは「言語の壁」を成長の妨げにしたくありません。優秀なエンジニア、特に日本で働くベトナム人や外国人エンジニアは、英語だけ・日本語だけの教材に時間を奪われがちです。Sensei Hub では辞書ではなくエンジニアリングに集中できます。",
          vi: "Chúng tôi muốn xóa bỏ rào cản ngôn ngữ trên con đường phát triển. Nhiều kỹ sư giỏi — đặc biệt là người Việt và kỹ sư nước ngoài làm việc tại Nhật — mất thời gian vật lộn với tài liệu chỉ có tiếng Anh hoặc tiếng Nhật. Sensei Hub giúp bạn tập trung vào kỹ thuật, không phải từ điển.",
        },
      ],
    },
    {
      heading: { en: "What's inside", ja: "コンテンツ", vi: "Nội dung" },
      body: [
        {
          en: "11 courses from Git and AWS to System Design and the Japanese FE exam, hands-on lessons with diagrams, subject quizzes to test yourself, progress tracking with streaks and XP, and an optional AI assistant you can connect to your own Gemini, OpenAI, or local Ollama model.",
          ja: "Git や AWS からシステム設計、基本情報技術者試験まで 11 コース。図解付きの実践レッスン、理解度を試す教科別クイズ、ストリークと XP による進捗管理、そして自分の Gemini・OpenAI・ローカル Ollama に接続できる任意の AI アシスタントを備えています。",
          vi: "11 khóa học từ Git, AWS đến Thiết kế hệ thống và kỳ thi FE của Nhật, bài học thực hành kèm sơ đồ, quiz theo môn để tự kiểm tra, theo dõi tiến độ với streak và XP, cùng trợ lý AI tùy chọn mà bạn có thể kết nối với Gemini, OpenAI hoặc model Ollama cục bộ của riêng mình.",
        },
      ],
    },
  ],
}

export const contactDoc: LegalDoc = {
  title: { en: "Contact", ja: "お問い合わせ", vi: "Liên hệ" },
  sections: [
    {
      body: [
        {
          en: "Questions, bug reports, or ideas are always welcome. The fastest way to reach us is through the project's GitHub repository — open an issue or a discussion and we'll get back to you.",
          ja: "ご質問・不具合報告・ご提案はいつでも歓迎します。最も早い連絡方法はプロジェクトの GitHub リポジトリです。Issue か Discussion を作成いただければ返信します。",
          vi: "Chúng tôi luôn hoan nghênh câu hỏi, báo lỗi hay ý tưởng. Cách liên hệ nhanh nhất là qua kho mã nguồn GitHub của dự án — hãy tạo issue hoặc discussion, chúng tôi sẽ phản hồi.",
        },
      ],
    },
    {
      heading: { en: "Links", ja: "リンク", vi: "Liên kết" },
      body: [
        { en: `GitHub: ${GITHUB}`, ja: `GitHub: ${GITHUB}`, vi: `GitHub: ${GITHUB}` },
      ],
    },
  ],
}

export const privacyDoc: LegalDoc = {
  title: { en: "Privacy Policy", ja: "プライバシーポリシー", vi: "Chính sách bảo mật" },
  updated: "2026-06-18",
  sections: [
    {
      heading: { en: "What we collect", ja: "取得する情報", vi: "Thông tin chúng tôi thu thập" },
      body: [
        {
          en: "Account information through our authentication provider Clerk (such as your email and name), and your learning progress (which lessons you complete and your quiz scores), which is stored in our database and linked to your account. Some preferences — your language, AI settings, and recent-lesson history — are kept only in your browser's local storage.",
          ja: "認証プロバイダー Clerk を通じたアカウント情報（メールアドレスや氏名など）と、学習進捗（完了したレッスンやクイズのスコア）を取得し、アカウントに紐づけてデータベースに保存します。言語設定・AI 設定・最近のレッスン履歴などの一部の設定は、ブラウザのローカルストレージにのみ保存されます。",
          vi: "Thông tin tài khoản qua nhà cung cấp xác thực Clerk (như email và tên), và tiến độ học tập của bạn (các bài đã hoàn thành và điểm quiz), được lưu trong cơ sở dữ liệu của chúng tôi và gắn với tài khoản. Một số tùy chọn — ngôn ngữ, cài đặt AI và lịch sử bài học gần đây — chỉ được lưu trong local storage của trình duyệt.",
        },
      ],
    },
    {
      heading: { en: "How we use it", ja: "情報の利用", vi: "Cách chúng tôi sử dụng" },
      body: [
        {
          en: "We use your data only to provide the learning experience and to show your progress back to you. We do not sell your personal data or share it for advertising.",
          ja: "取得した情報は、学習体験の提供とあなた自身への進捗表示のためにのみ利用します。個人データを販売したり、広告目的で共有したりすることはありません。",
          vi: "Chúng tôi chỉ dùng dữ liệu để cung cấp trải nghiệm học tập và hiển thị tiến độ cho bạn. Chúng tôi không bán dữ liệu cá nhân hay chia sẻ cho mục đích quảng cáo.",
        },
      ],
    },
    {
      heading: { en: "AI provider keys", ja: "AI プロバイダーのキー", vi: "Khóa nhà cung cấp AI" },
      body: [
        {
          en: "If you configure an AI assistant, your API key is stored only in your browser. For cloud providers (Gemini, OpenAI) the key is sent through our server only to forward your message to that provider; we do not log or store it. For Ollama, requests go directly from your browser to your own machine.",
          ja: "AI アシスタントを設定した場合、API キーはブラウザ内にのみ保存されます。クラウド（Gemini・OpenAI）の場合、キーはあなたのメッセージをそのプロバイダーへ転送するためだけにサーバーを経由し、ログや保存はしません。Ollama の場合、リクエストはブラウザからあなたの端末へ直接送られます。",
          vi: "Nếu bạn cấu hình trợ lý AI, khóa API chỉ được lưu trong trình duyệt. Với nhà cung cấp đám mây (Gemini, OpenAI), khóa chỉ đi qua máy chủ của chúng tôi để chuyển tiếp tin nhắn tới nhà cung cấp đó; chúng tôi không ghi log hay lưu lại. Với Ollama, yêu cầu đi thẳng từ trình duyệt tới máy của bạn.",
        },
      ],
    },
    {
      heading: { en: "Your choices", ja: "あなたの選択", vi: "Lựa chọn của bạn" },
      body: [
        {
          en: "You can clear your browser's local storage at any time to remove local preferences and history. To delete the account data stored on our server, contact us through GitHub.",
          ja: "ブラウザのローカルストレージはいつでも消去でき、ローカルの設定や履歴を削除できます。サーバー上のアカウントデータの削除をご希望の場合は、GitHub からご連絡ください。",
          vi: "Bạn có thể xóa local storage của trình duyệt bất cứ lúc nào để gỡ tùy chọn và lịch sử cục bộ. Để xóa dữ liệu tài khoản lưu trên máy chủ, hãy liên hệ với chúng tôi qua GitHub.",
        },
      ],
    },
  ],
}

export const termsDoc: LegalDoc = {
  title: { en: "Terms of Service", ja: "利用規約", vi: "Điều khoản dịch vụ" },
  updated: "2026-06-18",
  sections: [
    {
      heading: { en: "Educational use", ja: "教育目的の利用", vi: "Mục đích học tập" },
      body: [
        {
          en: "Sensei Hub is provided for learning and educational purposes under the MIT License, on an \"as is\" basis and without any warranty. Course content is meant as study material and may contain simplifications.",
          ja: "Sensei Hub は MIT ライセンスのもと、学習・教育目的で「現状のまま」無保証で提供されます。コース内容は学習教材であり、簡略化を含む場合があります。",
          vi: "Sensei Hub được cung cấp cho mục đích học tập theo Giấy phép MIT, theo nguyên trạng và không có bảo hành. Nội dung khóa học là tài liệu học tập và có thể chứa những điểm được đơn giản hóa.",
        },
      ],
    },
    {
      heading: { en: "Acceptable use", ja: "禁止事項", vi: "Sử dụng hợp lệ" },
      body: [
        {
          en: "Please do not abuse the service, attempt to bypass security or rate limits, or use it to harm others. We may limit or suspend access that threatens the stability or security of the platform.",
          ja: "サービスの濫用、セキュリティやレート制限の回避、他者への加害を目的とした利用はおやめください。プラットフォームの安定性や安全性を脅かすアクセスは制限・停止する場合があります。",
          vi: "Vui lòng không lạm dụng dịch vụ, không cố vượt qua bảo mật hay giới hạn tốc độ, và không dùng để gây hại cho người khác. Chúng tôi có thể hạn chế hoặc tạm ngưng quyền truy cập đe dọa sự ổn định hoặc an toàn của nền tảng.",
        },
      ],
    },
    {
      heading: { en: "AI features", ja: "AI 機能", vi: "Tính năng AI" },
      body: [
        {
          en: "Answers from the AI assistant may be inaccurate or incomplete — always verify important information. You are responsible for your own API keys and any usage costs charged by your chosen provider.",
          ja: "AI アシスタントの回答は不正確・不完全な場合があります。重要な情報は必ずご自身で確認してください。API キーおよび選択したプロバイダーから課金される利用料金は、利用者ご自身の責任となります。",
          vi: "Câu trả lời của trợ lý AI có thể thiếu chính xác hoặc chưa đầy đủ — hãy luôn kiểm chứng thông tin quan trọng. Bạn tự chịu trách nhiệm về khóa API của mình và mọi chi phí sử dụng do nhà cung cấp bạn chọn tính.",
        },
      ],
    },
    {
      heading: { en: "Liability", ja: "免責", vi: "Trách nhiệm pháp lý" },
      body: [
        {
          en: "To the maximum extent permitted by law, Sensei Hub and its authors are not liable for any damages arising from the use of the platform.",
          ja: "法律で認められる最大限の範囲で、Sensei Hub およびその作者は、本プラットフォームの利用から生じるいかなる損害についても責任を負いません。",
          vi: "Trong phạm vi tối đa pháp luật cho phép, Sensei Hub và các tác giả không chịu trách nhiệm cho bất kỳ thiệt hại nào phát sinh từ việc sử dụng nền tảng.",
        },
      ],
    },
  ],
}
