---
title: "Day 8: Webセキュリティ（その1）- OWASP Top 10 ＆ SQLインジェクション"
description: "Webセキュリティの実践的な世界へ。OWASP Top 10の全体像を学び、歴史上で最も古典的かつ致命的なデータベース脆弱性である「SQLインジェクション」の本質、攻撃手法、および安全な防衛コードの実装方法を習得します。"
---

# Day 8: Webセキュリティ（その1）- OWASP Top 10 ＆ SQLインジェクション

**パート 2：開発者のための実戦的技術セキュリティ** へようこそ。今日から、あなたはデジタル世界を単なる一般ユーザーの視点で見つめることはありません。ハッカーがどのようにシステムを破壊するか（攻撃者の思考）を学び、それに基づき「絶対に突破されない堅牢なコード」を書く方法を身につけていきます。

最初の技術テーマは、毎日何百万回もの攻撃が繰り広げられている最もホットな戦場、**Webアプリケーションセキュリティ（Web Security）** です。まずはハッカーの「宝の地図」とも呼ばれる **OWASP Top 10** から始め、最も古典的で深刻なデータベース脆弱性である **SQLインジェクション（SQL Injection）** の深部へと潜入します。

---

## 1. OWASP Top 10 とは何か？

**OWASP**（Open Web Application Security Project）は、Webアプリケーションの安全性を向上させることを目的とした、世界で最も権威のある国際非営利団体です。数年ごとに世界中の何万もの企業や専門家からデータを収集・分析し、現代のWebアプリケーションを脅かしている最も普及し、かつ危険性の高い上位10件のセキュリティ脆弱性をまとめた **OWASP Top 10** というレポートを公表しています。

```text
OWASP Top 10 の分類（現代のセキュリティトレンド）：

┌────────────────────────────────────────────────────────┐
│                   OWASP TOP 10                         │
├────────────────────────────────────────────────────────┤
│  [A01] Broken Access Control（アクセス制御の不備）       │
│  [A02] Cryptographic Failures（暗号化の失敗）           │
│  [A03] Injection（インジェクション - SQLi, コマンド等）  │
│  [A04] Insecure Design（安全でない設計）                │
│  [A05] Security Misconfiguration（設定の不備）         │
│  ...                                                   │
└────────────────────────────────────────────────────────┘
```

歴史的に見て、**インジェクション（Injection）**（特にSQLインジェクション）は常にこのランキングの最上位に君臨し続けてきました。現在では多くのフレームワークやライブラリに標準で防衛手段が組み込まれているものの、開発者の不注意や安易なコーディング習慣によって、今なお多くの実務プロジェクトで頻繁に発見される脆弱性です。

---

## 2. SQLインジェクション（SQLi）の本質

**SQLインジェクション（SQLi）** は、アプリケーションがユーザーからの入力値（User Input）を、適切な検証やフィルタリング（サニタイズ/バリデーション）を行うことなく、データベースへのSQLクエリの文字列に**直接結合（文字列連結）**してしまうことで発生します。

これにより、ハッカーはSQLの文法上の特別な意味を持つ文字（シングルクォート `'`、ダブルハイフン `--`、`OR`、`UNION` など）を入力値に混ぜて送信し、開発者が想定していた元々のSQLクエリの論理構造を意図的にねじ曲げることができます。その結果、データベースエンジンは開発者の意図しないハッカーの命令を「正しいSQLコマンド」として忠実に実行してしまいます。

### SQLインジェクションがもたらす致命的な結果：
*   **認証のバイパス（Bypass Authentication）：** パスワードを知らなくても、管理者（Admin）を含むあらゆるアカウントに不正ログインできます。
*   **機密データの漏洩（Data Leakage）：** データベース内のすべての個人情報、クレジットカード情報、企業秘密を盗み出すことができます。
*   **データの破壊・改ざん（Data Destruction）：** テーブルをまるごと削除（`DROP TABLE`）したり、データを意図通りに書き換えたりできます。
*   **リモートコード実行（RCE）：** データベースやOSの設定が不適切な場合、ハッカーはサーバーのファイルシステムに悪意あるスクリプトを書き込み、サーバーマシンそのものの制御権を完全に奪取することが可能です。

---

## 3. 脆弱性のあるコード（Vulnerable Code）の解剖

Node.jsのExpressフレームワークとPostgreSQL接続ライブラリ（`pg`）を使用した、SQLインジェクションに対して非常に脆弱なログインAPIのコードを分析してみましょう：

```javascript
// 警告：このコードには深刻なセキュリティ脆弱性があります！
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    // 致命的な欠陥：ユーザー入力をSQLクエリ文字列に直接結合している
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    
    try {
        const result = await db.query(query);
        if (result.rows.length > 0) {
            res.json({ success: true, message: "ログイン成功！", user: result.rows[0] });
        } else {
            res.status(401).json({ success: false, message: "アカウント名またはパスワードが違います！" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
```

### ハッカーはどのように攻撃するか？（ログインバイパスの仕組み）

ハッカーは通常のユーザー名を入力する代わりに、以下のような入力値を送信します：
*   `username`: `admin' --`
*   `password`: (適当な適当な文字列)

バックエンドでこの入力値が結合された結果、実際にデータベースで実行されるSQL文は以下のようになります：

```sql
-- 開発者が想定していた通常のクエリ：
SELECT * FROM users WHERE username = 'admin' AND password = 'xyz'

-- ハッカーのペイロード注入後に実際に実行されるクエリ：
SELECT * FROM users WHERE username = 'admin' --' AND password = 'xyz'
```

**技術的メカニズムの分析：**
*   ハッカーが入力した最初のシングルクォート `'` によって、`username` フィールドの文字列リテラルがそこで閉じられます。
*   SQLにおけるダブルハイフン `--` は**インラインコメント**を意味します。この記号以降に続く同じ行の文字列は、SQLインタプリタによって完全に無視（コメントアウト）されます。
*   結果として、パスワードの検証部分（`AND password = ...`）が完全に無効化されます。データベースエンジンは単に `SELECT * FROM users WHERE username = 'admin'` だけを実行します。システムはパスワードの有無に関わらず、即座に `admin` のアカウント情報を返し、ハッカーはログインに成功してしまいます！

---

## 4. 高度な情報奪取手法：UNIONベースSQLi

ハッカーの狙いはログインの回避に留まりません。彼らはSQLの `UNION` 演算子を利用して、アプリケーションが実行する元のクエリの結果と、ハッカーが独自に構築した別のSELECT文の結果を合体させることができます。

例えば、製品の検索機能があるアプリケーションのコードが以下のようになっていたとします：
```javascript
// SQLiの脆弱性がある商品検索コード
const query = `SELECT id, name, price, description FROM products WHERE name LIKE '%${req.query.search}%'`;
```

ハッカーは検索キーワードとして次の値を入力します： `xyz' UNION SELECT 1, username, password, email FROM users --`

構築されるSQLは以下の通りです：
```sql
SELECT id, name, price, description FROM products WHERE name LIKE '%xyz' UNION SELECT 1, username, password, email FROM users --%'
```

**技術的分析：**
データベースは、「`xyz`」という商品名の存在しない検索結果（空の結果）と、`users` テーブルから取得した**すべてのユーザー名、パスワード、メールアドレス**のリストを結合します。そして、アプリケーションはこれらをそのまま商品の検索結果画面に出力し、ハッカーに全機密データを引き渡してしまいます！

---

## 5. 安全なコーディング（Secure Coding）による防衛

SQLインジェクションの脅威を100%排除するための鉄則は、**「ユーザー入力を決して信用しないこと」**、そして**「SQL文の組み立てに文字列結合を決して使用しないこと」**です。

### 解決策 1：パラメータ化クエリ（Parameterized Queries / Prepared Statements）の導入
パラメータ化クエリ（静的プレパードステートメントとも呼ばれます）を使用すると、データベースエンジンはあらかじめSQLの「骨組み（構造）」だけを先にコンパイルして確定させます。その後、ユーザーからの入力値は「**データ値（パラメータ）**」としてのみ個別にデータベースに送信されます。
これにより、入力値の中にシングルクォートや `--`、`UNION` などのSQLコマンドが含まれていても、それらは単なる「無害な文字列データ」として扱われ、SQL文の論理構造に影響を与えることは一切なくなります。

先ほどのログインAPIを完全に安全な形式に書き換えてみましょう：

```javascript
// 安全なセキュアコードのバージョン
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    // 文字列結合の代わりに、プレースホルダ（$1, $2）を使用する
    const query = 'SELECT * FROM users WHERE username = $1 AND password = $2';
    
    try {
        // パラメータを配列に入れて個別にdb.queryへ渡す
        const result = await db.query(query, [username, password]);
        
        if (result.rows.length > 0) {
            res.json({ success: true, message: "安全なログインに成功しました！" });
        } else {
            res.status(401).json({ success: false, message: "アカウント名またはパスワードが正しくありません。" });
        }
    } catch (err) {
        res.status(500).json({ error: "システムエラーが発生しました。" });
    }
});
```

### 解決策 2：現代的なORM（Object-Relational Mapping）の採用
Node.js/TypeScript環境で広く使用されている **Prisma** や **Sequelize**、あるいはJavaの **Hibernate** などのORMは、標準的なメソッド呼び出しの裏側で自動的にパラメータ化クエリを生成します。そのため、これらを使用することでSQLインジェクションの脆弱性を自然に回避することができます。

```typescript
// Prisma ORMを使用 - デフォルトでSQLインジェクションに対して安全
const user = await prisma.user.findFirst({
  where: {
    username: username, // Prismaが自動的にこの入力値をパラメータ化します
    password: password,
  },
});
```

---

## 📝 本日のミニ課題：コードデバッグ

以下は、顧客の銀行口座の残高を更新するためのNode.jsバックエンドの処理です。このコードに潜むSQLインジェクションの脆弱性を指摘し、悪意あるユーザーがこれを利用して自身の口座残高を無限に増やす方法を説明した上で、安全なコードへ書き換えてください。

```javascript
// 脆弱性のある残高更新処理
app.post('/api/transfer', async (req, res) => {
    const { userId, amount } = req.body;
    
    // 残高を更新する動的SQLクエリ
    const query = `UPDATE accounts SET balance = balance + ${amount} WHERE user_id = '${userId}'`;
    
    await db.query(query);
    res.json({ success: true, message: "送金処理が完了しました！" });
});
```

*ヒント：* `amount` と `userId` という2つの変数がどのようにクエリ内に結合されているか、そして数値と文字列の双方において最も安全な処理方法は何かを考えてみましょう！
