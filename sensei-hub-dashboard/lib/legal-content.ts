// About / Contact / Privacy / Terms の実コンテンツ（3 言語）。
// 段落の配列で持ち、StaticPage が見出し＋本文として描画する。

export type Tri = { en: string; ja: string; vi: string }
export type LegalSection = { heading?: Tri; body: Tri[] }
export type LegalDoc = { title: Tri; updated?: string; email?: string; sections: LegalSection[] }

// 問い合わせ先（GitHub ではなくメール）。
export const CONTACT_EMAIL = "bakaryuu1997@gmail.com"

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
      heading: { en: "Who it's for", ja: "対象となる方", vi: "Dành cho ai" },
      body: [
        {
          en: "Whether you are a student starting out, a self-taught developer, or an engineer preparing for the Japanese IT job market and exams, Sensei Hub gives you a structured path. The same content in three languages also makes it useful for teams that work across English, Japanese, and Vietnamese.",
          ja: "学び始めの学生、独学のエンジニア、日本の IT 業界や試験を目指す方まで、Sensei Hub は体系立った学習の道筋を提供します。同じ内容を 3 言語で提供しているため、英語・日本語・ベトナム語をまたいで働くチームにも役立ちます。",
          vi: "Dù bạn là sinh viên mới bắt đầu, lập trình viên tự học, hay kỹ sư đang chuẩn bị cho thị trường việc làm và kỳ thi IT ở Nhật, Sensei Hub mang đến lộ trình học có hệ thống. Cùng một nội dung ở ba ngôn ngữ cũng hữu ích cho các nhóm làm việc xen kẽ tiếng Anh, Nhật và Việt.",
        },
      ],
    },
    {
      heading: { en: "What's inside", ja: "コンテンツ", vi: "Nội dung" },
      body: [
        {
          en: "Courses from Git and AWS to System Design and the Japanese FE exam, hands-on lessons with diagrams, subject quizzes to test yourself, progress tracking with streaks and XP, a trilingual AI news feed, and an optional AI assistant you can connect to your own Gemini, OpenAI, or local Ollama model.",
          ja: "Git や AWS からシステム設計、基本情報技術者試験まで多数のコース。図解付きの実践レッスン、理解度を試す教科別クイズ、ストリークと XP による進捗管理、3 言語の AI ニュース、そして自分の Gemini・OpenAI・ローカル Ollama に接続できる任意の AI アシスタントを備えています。",
          vi: "Nhiều khóa học từ Git, AWS đến Thiết kế hệ thống và kỳ thi FE của Nhật, bài học thực hành kèm sơ đồ, quiz theo môn để tự kiểm tra, theo dõi tiến độ với streak và XP, bảng tin AI 3 ngôn ngữ, cùng trợ lý AI tùy chọn mà bạn có thể kết nối với Gemini, OpenAI hoặc model Ollama cục bộ của riêng mình.",
        },
      ],
    },
    {
      heading: { en: "How we build it", ja: "開発について", vi: "Cách chúng tôi xây dựng" },
      body: [
        {
          en: "Sensei Hub is built and maintained as an independent project with a focus on staying simple, beautiful, fast, and stable. We add features carefully and keep the three languages in sync. Your feedback directly shapes what we build next.",
          ja: "Sensei Hub は独立したプロジェクトとして開発・運用しており、「シンプル・美しい・速い・安定」を大切にしています。機能は慎重に追加し、3 言語を常に同期させています。皆さまのフィードバックが次の開発を直接形づくります。",
          vi: "Sensei Hub được xây dựng và duy trì như một dự án độc lập, chú trọng giữ sự đơn giản, đẹp, nhanh và ổn định. Chúng tôi thêm tính năng một cách cẩn thận và luôn đồng bộ ba ngôn ngữ. Phản hồi của bạn trực tiếp định hình những gì chúng tôi làm tiếp theo.",
        },
      ],
    },
  ],
}

export const contactDoc: LegalDoc = {
  title: { en: "Contact", ja: "お問い合わせ", vi: "Liên hệ" },
  email: CONTACT_EMAIL,
  sections: [
    {
      body: [
        {
          en: "Questions, bug reports, or ideas are always welcome. The best way to reach us is by email — write to us anytime and we'll do our best to reply.",
          ja: "ご質問・不具合報告・ご提案はいつでも歓迎します。連絡方法はメールが確実です。いつでもご連絡いただければ、できる限り返信します。",
          vi: "Chúng tôi luôn hoan nghênh câu hỏi, báo lỗi hay ý tưởng. Cách liên hệ tốt nhất là qua email — hãy viết cho chúng tôi bất cứ lúc nào, chúng tôi sẽ cố gắng phản hồi.",
        },
      ],
    },
    {
      heading: { en: "How to reach us", ja: "連絡先", vi: "Liên hệ với chúng tôi" },
      body: [
        {
          en: `Email: ${CONTACT_EMAIL}`,
          ja: `メール: ${CONTACT_EMAIL}`,
          vi: `Email: ${CONTACT_EMAIL}`,
        },
        {
          en: "You can write in English, Japanese, or Vietnamese — whichever is easiest for you.",
          ja: "英語・日本語・ベトナム語のいずれでも構いません。一番書きやすい言語でお送りください。",
          vi: "Bạn có thể viết bằng tiếng Anh, Nhật hoặc Việt — ngôn ngữ nào thuận tiện nhất cho bạn.",
        },
      ],
    },
    {
      heading: { en: "Help us help you", ja: "スムーズな対応のために", vi: "Giúp chúng tôi hỗ trợ bạn" },
      body: [
        {
          en: "For a bug report, it helps a lot to include: which page or feature, what you expected to happen, what actually happened, your device and browser, and a screenshot if possible.",
          ja: "不具合のご報告では、次の情報があると助かります: 対象のページや機能、期待した動作、実際の動作、ご利用の端末とブラウザ、可能であればスクリーンショット。",
          vi: "Khi báo lỗi, sẽ rất hữu ích nếu bạn cho biết: trang hoặc tính năng nào, bạn mong đợi điều gì, thực tế xảy ra ra sao, thiết bị và trình duyệt của bạn, và ảnh chụp màn hình nếu có thể.",
        },
        {
          en: "This is an independent project, so replies may take a few days — thank you for your patience.",
          ja: "本プロジェクトは個人運営のため、返信に数日いただく場合があります。ご理解いただけると幸いです。",
          vi: "Đây là dự án độc lập nên việc phản hồi có thể mất vài ngày — cảm ơn bạn đã kiên nhẫn.",
        },
      ],
    },
  ],
}

export const privacyDoc: LegalDoc = {
  title: { en: "Privacy Policy", ja: "プライバシーポリシー", vi: "Chính sách bảo mật" },
  updated: "2026-06-21",
  email: CONTACT_EMAIL,
  sections: [
    {
      body: [
        {
          en: "This policy explains what information Sensei Hub collects, how it is used, and the choices you have. We try to collect as little as possible and to be clear about it.",
          ja: "本ポリシーは、Sensei Hub が取得する情報、その利用方法、そしてあなたが選べる選択肢を説明します。私たちは取得する情報を最小限にとどめ、明確にお伝えすることを心がけています。",
          vi: "Chính sách này giải thích Sensei Hub thu thập thông tin gì, dùng ra sao, và bạn có những lựa chọn nào. Chúng tôi cố gắng thu thập càng ít càng tốt và minh bạch về điều đó.",
        },
      ],
    },
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
      heading: { en: "Authentication & third parties", ja: "認証と第三者サービス", vi: "Xác thực & bên thứ ba" },
      body: [
        {
          en: "Sign-in is handled by Clerk, which processes your login credentials and basic profile on our behalf; their handling of that data is governed by Clerk's own privacy policy. News headlines are fetched from Google News. We do not use advertising or analytics trackers.",
          ja: "ログインは Clerk が処理し、ログイン情報と基本プロフィールを当方に代わって取り扱います。これらのデータの取り扱いは Clerk 自身のプライバシーポリシーに従います。ニュースの見出しは Google ニュースから取得します。広告・解析トラッカーは使用していません。",
          vi: "Việc đăng nhập do Clerk xử lý, thay chúng tôi xử lý thông tin đăng nhập và hồ sơ cơ bản; việc xử lý đó tuân theo chính sách bảo mật của chính Clerk. Tiêu đề tin tức được lấy từ Google News. Chúng tôi không dùng trình theo dõi quảng cáo hay phân tích.",
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
      heading: { en: "Cookies & local storage", ja: "Cookie とローカルストレージ", vi: "Cookie & local storage" },
      body: [
        {
          en: "We use the cookies required by Clerk to keep you signed in. We use your browser's local storage to remember preferences such as language, AI settings, recent lessons, and saved chats. We do not use tracking or advertising cookies.",
          ja: "ログイン状態の維持に必要な Clerk の Cookie を使用します。言語・AI 設定・最近のレッスン・保存したチャットなどの設定を記憶するため、ブラウザのローカルストレージを使用します。トラッキングや広告目的の Cookie は使用しません。",
          vi: "Chúng tôi dùng cookie cần thiết của Clerk để giữ bạn đăng nhập. Chúng tôi dùng local storage của trình duyệt để ghi nhớ tùy chọn như ngôn ngữ, cài đặt AI, bài học gần đây và đoạn chat đã lưu. Chúng tôi không dùng cookie theo dõi hay quảng cáo.",
        },
      ],
    },
    {
      heading: { en: "Data retention", ja: "データの保持", vi: "Lưu giữ dữ liệu" },
      body: [
        {
          en: "We keep your account and progress data while your account exists so we can show your learning history. Data kept in your browser stays until you clear it.",
          ja: "学習履歴を表示するため、アカウントが存在する間はアカウント情報と進捗データを保持します。ブラウザに保存されたデータは、あなたが消去するまで保持されます。",
          vi: "Chúng tôi giữ dữ liệu tài khoản và tiến độ trong khi tài khoản còn tồn tại để hiển thị lịch sử học tập. Dữ liệu lưu trong trình duyệt sẽ còn cho tới khi bạn xóa.",
        },
      ],
    },
    {
      heading: { en: "Your choices", ja: "あなたの選択", vi: "Lựa chọn của bạn" },
      body: [
        {
          en: `You can clear your browser's local storage at any time to remove local preferences and history. To access or delete the account data stored on our server, contact us by email at ${CONTACT_EMAIL}.`,
          ja: `ブラウザのローカルストレージはいつでも消去でき、ローカルの設定や履歴を削除できます。サーバー上のアカウントデータの確認・削除をご希望の場合は、メール（${CONTACT_EMAIL}）までご連絡ください。`,
          vi: `Bạn có thể xóa local storage của trình duyệt bất cứ lúc nào để gỡ tùy chọn và lịch sử cục bộ. Để truy cập hoặc xóa dữ liệu tài khoản lưu trên máy chủ, hãy liên hệ qua email ${CONTACT_EMAIL}.`,
        },
      ],
    },
    {
      heading: { en: "Children", ja: "お子さまについて", vi: "Trẻ em" },
      body: [
        {
          en: "Sensei Hub is intended for users old enough to hold an account under the rules of their country. It is not directed at young children.",
          ja: "Sensei Hub は、各国の規定でアカウントを保有できる年齢の方を対象としています。低年齢のお子さまを対象としたサービスではありません。",
          vi: "Sensei Hub hướng đến người dùng đủ tuổi lập tài khoản theo quy định ở quốc gia của họ. Dịch vụ không nhắm tới trẻ nhỏ.",
        },
      ],
    },
    {
      heading: { en: "Changes to this policy", ja: "本ポリシーの変更", vi: "Thay đổi chính sách" },
      body: [
        {
          en: "We may update this policy as the product evolves. The date at the top shows the latest revision; significant changes will be reflected here.",
          ja: "プロダクトの進化に合わせて本ポリシーを更新する場合があります。上部の日付が最新の改訂を示し、重要な変更はここに反映されます。",
          vi: "Chúng tôi có thể cập nhật chính sách này khi sản phẩm phát triển. Ngày ở đầu trang cho biết bản sửa đổi mới nhất; những thay đổi quan trọng sẽ được phản ánh tại đây.",
        },
      ],
    },
  ],
}

export const termsDoc: LegalDoc = {
  title: { en: "Terms of Service", ja: "利用規約", vi: "Điều khoản dịch vụ" },
  updated: "2026-06-21",
  email: CONTACT_EMAIL,
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
      heading: { en: "Your account", ja: "アカウント", vi: "Tài khoản của bạn" },
      body: [
        {
          en: "You are responsible for keeping your account secure and for activity under it. Sign-in is handled by Clerk; please also follow their terms. Let us know promptly if you believe your account has been accessed without permission.",
          ja: "アカウントの安全管理と、その下での活動については利用者ご自身の責任となります。ログインは Clerk が処理するため、Clerk の規約にも従ってください。不正アクセスの疑いがある場合は速やかにご連絡ください。",
          vi: "Bạn chịu trách nhiệm giữ an toàn cho tài khoản và cho hoạt động dưới tài khoản đó. Việc đăng nhập do Clerk xử lý; vui lòng tuân theo điều khoản của họ. Hãy báo cho chúng tôi ngay nếu bạn nghi ngờ tài khoản bị truy cập trái phép.",
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
      heading: { en: "Content & intellectual property", ja: "コンテンツと知的財産", vi: "Nội dung & sở hữu trí tuệ" },
      body: [
        {
          en: "The source code is available under the MIT License. Course content is provided for your personal study; please don't redistribute it as your own. Trademarks and news headlines belong to their respective owners.",
          ja: "ソースコードは MIT ライセンスで公開されています。コース内容は個人の学習用に提供されるもので、ご自身の作成物として再配布しないでください。商標やニュースの見出しは、それぞれの権利者に帰属します。",
          vi: "Mã nguồn được cung cấp theo Giấy phép MIT. Nội dung khóa học dành cho việc học cá nhân của bạn; vui lòng không phân phối lại như của riêng mình. Thương hiệu và tiêu đề tin tức thuộc về các chủ sở hữu tương ứng.",
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
    {
      heading: { en: "Changes & contact", ja: "変更とお問い合わせ", vi: "Thay đổi & liên hệ" },
      body: [
        {
          en: `We may update these terms as the service evolves; the date above shows the latest revision. Continuing to use Sensei Hub after a change means you accept the updated terms. Questions? Email ${CONTACT_EMAIL}.`,
          ja: `サービスの進化に合わせて本規約を更新する場合があります。上部の日付が最新の改訂を示します。変更後も Sensei Hub を継続して利用された場合、更新後の規約に同意したものとみなします。ご不明点はメール（${CONTACT_EMAIL}）までどうぞ。`,
          vi: `Chúng tôi có thể cập nhật điều khoản khi dịch vụ phát triển; ngày ở trên cho biết bản sửa đổi mới nhất. Việc tiếp tục dùng Sensei Hub sau khi có thay đổi nghĩa là bạn chấp nhận điều khoản mới. Có thắc mắc? Email ${CONTACT_EMAIL}.`,
        },
      ],
    },
  ],
}
