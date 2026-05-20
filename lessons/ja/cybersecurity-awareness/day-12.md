---
title: "Day 12: エンタープライズ認可アーキテクチャ（RBAC ＆ ABAC）"
description: "システム認可アーキテクチャの設計をマスター。RBAC（ロールベースアクセス制御）用のリレーショナルデータベーススキーマ設計、および属性情報を基にした動的なABACセキュリティポリシーの実装方法を習得します。"
---

# Day 12: エンタープライズ認可アーキテクチャ（RBAC ＆ ABAC）

昨日は、JWTとOAuth 2.0を使用してアクセスユーザーが「誰であるか」を検証する方法（認証）を学びました。本日は、アーキテクチャのレベルをさらに一段階引き上げ、**認加（Authorization - AuthZ）**、すなわち「認証されたユーザーに対して、システム内で具体的にどのようなアクションを許可するか」を決定するエンタープライズ向けの権限設計パターンを学びます。

現在、あらゆる大規模システムで広く採用されている2つの最も強力で代表的なアクセス制御モデル、**RBAC（Role-Based Access Control / ロールベースアクセス制御）** と **ABAC（Attribute-Based Access Control / 属性ベースアクセス制御）** について詳しく研究します。

---

## 1. ロールベースアクセス制御（RBAC）

**RBAC** は、シンプルで直感的な分かりやすさと管理のしやすさから、現代で最も広く採用されている認可モデルです。このモデルでは、システム内の各権限を個々のユーザーに対して直接付与することはありません。代わりに、各権限は特定の **ロール（役割）** に割り当てられ、ユーザーはそのロールにマッピングされることで権限を獲得します。

```text
エンタープライズ標準のRBAC認可モデルの構造：

[ ユーザー ] ───(ロールの割り当て)───> [ ロール (Role) ]
                                            │
                                     (割り当てられた権限)
                                            │
                                            ▼
[ リソース ] <───(アクション)─── [ 権限 (Permission) ]
 (商品、請求書)                    (create, read, update, delete)
```

### RBACシステム用のリレーショナルデータベース設計（DBスキーマ）：
アプリケーションコードを変更することなく、必要に応じてロールの権限内容をその場で柔軟に変更できる強固なRBACシステムを構築するには、以下の5つの基本テーブルでスキーマを構成するのが標準的です：

```text
1. users (id, username, email)
2. roles (id, name, description) - 例: "admin", "editor", "viewer"
3. permissions (id, name, description) - 例: "invoice:create", "invoice:delete"
4. user_roles (user_id, role_id) - ユーザーとロールを紐付ける多対多の中間テーブル
5. role_permissions (role_id, permission_id) - ロールと権限を紐付ける多対多の中間テーブル
```

### RBACのメリット：
*   概念が明快で、設計・実装およびメンテナンスが非常に容易。
*   新規メンバーが参画した際、該当するロール（例：`Editor`）を割り当てるだけで、業務に必要なすべての権限を即座に付与可能。

### RBACのデメリット：「ロールの爆発（Role Explosion）」
ビジネスルールが複雑化し、より細かな権限制御が求められるようになると、純粋なRBACモデルは限界を迎えます。例えば、「*東京支社に所属する社員だけが、東京支社の請求書を更新できる*」というルールを実装したいとします。
*   純粋なRBACでは、これを実現するために `Editor_Tokyo`, `Editor_Osaka`, `Editor_Nagoya` といった支社ごとのロールを個別に作成せざるを得ません。その結果、システム内のロール数が爆発的に増加し（ロールの爆発）、管理が困難になります。この限界を解決するために開発されたのが、より高度な **ABAC** モデルです。

---

## 2. 属性ベースアクセス制御（ABAC）

**ABAC** は、柔軟性と表現力に優れた次世代のアクセス制御モデルです。ユーザーのロール名という単一の文字列をハードコードして検証する（`req.user.role === 'Admin'`）のではなく、リクエスト発生時に以下の4つの次元の属性（Attributes）をリアルタイムに評価して、アクセスの可否を動的に判断します：

```text
文脈を考慮するスマートなABAC認可システム：

  [ サブジェクト属性（ユーザー情報） ]   ───┐
  [ リソース属性（アクセス対象） ]     ───┼───> [ ABAC ポリシー評価エンジン ] ───> [ 許可 / 拒否 ]
  [ アクション属性（操作内容） ]       ───┼───>
  [ 環境属性（リクエストのコンテキスト） ] ───┘
```

1.  **サブジェクト属性（Subject Attributes）：** アクセスを要求しているユーザーの属性（例：年齢、部署、所属支社、IPアドレス、ロール、セキュリティクリアランス）。
2.  **リソース属性（Resource Attributes）：** アクセス対象オブジェクトの属性（例：所有者ID、作成日時、ドキュメントの秘密度レベル、所属部署）。
3.  **アクション属性（Action Attributes）：** 実行しようとしている操作内容（例：`Read`、`Write`、`Approve`、`Delete`）。
4.  **環境属性（Environment Attributes）：** リクエスト送信元のコンテキスト情報（例：現在時刻、接続場所の国・地域、利用ネットワークの種類 - 社内VPN接続か公衆Wi-Fiか）。

### ABACポリシーの記述例：
> *「**経理部**に所属する**ユーザー**は、ドキュメントのステータスが**下書き**であり、現在時刻が**勤務時間内**であり、かつ接続元が**社内VPNネットワーク**である場合に限り、そのドキュメントに対して**書き込み（編集）**アクションを実行することを許可する」*

---

## 3. 実践的な実装：動的な権限チェックの書き方

現代のNode.js/TypeScript開発において、RBACとABACをハイブリッドに組み合わせた安全な権限管理システムを実装するデファクトスタンダードが **CASL** ライブラリです。

以下は、CASLライブラリを使用してユーザーの権限マトリックス（Abilities）を定義し、リソースの属性に基づいて動的な権限チェックを実行する具体的なコード例です：

```typescript
import { AbilityBuilder, createMongoAbility } from '@casl/ability';

// ユーザーの属性に基づいてセキュリティ権限マトリックスを定義する
function defineAbilitiesFor(user: { id: string, role: string, department: string }) {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

  if (user.role === 'admin') {
    // 管理者（admin）はすべてのリソースに対して完全な操作権限を持つ
    can('manage', 'all'); 
  } else if (user.role === 'manager') {
    // マネージャーは自身の所属部署のドキュメントに限り、すべての操作権限を持つ
    can('manage', 'Document', { department: user.department });
  } else {
    // 一般ユーザーの権限ルール：
    // 1. 公開設定されている（isPublic: true）ドキュメントのみ読み取り可能
    can('read', 'Document', { isPublic: true });
    
    // 2. 自分が所有者である（ドキュメントのuser_idが自身のユーザーIDと一致する）場合のみ更新・削除が可能
    can('update', 'Document', { user_id: user.id });
    can('delete', 'Document', { user_id: user.id });
  }

  return build();
}

// 実行時のテストシミュレーション：
const loggedInUser = { id: 'user_99', role: 'member', department: 'IT' };
const docToBeEdited = { id: 'doc_1', title: '社外秘レポート', user_id: 'user_99', isPublic: false };

const ability = defineAbilitiesFor(loggedInUser);

// 現在ログイン中のユーザーが、対象ドキュメントを更新する権限を持っているかをリアルタイム検証：
if (ability.can('update', 'Document', docToBeEdited)) {
  console.log("-> アクセス許可：編集を実行します。");
} else {
  console.log("-> アクセス拒否：必要な権限がありません！");
}
```

---

## 4. Express API 用の権限検証ミドルウェアの構築

ExpressのAPIエンドポイントを安全に保護するために、以下のような権限ベースの再利用可能な共通ミドルウェアを実装します：

```javascript
// ログイン中のユーザーが必要な権限を保持しているかをチェックするミドルウェア
function hasPermission(requiredPermission) {
    return (req, res, next) => {
        // req.user はDay 11で学んだJWT検証ミドルウェアによって挿入されます
        // req.user.permissions にユーザーの全保有権限（例: ['invoice:create', 'invoice:read']）が格納されていると仮定します
        const userPermissions = req.user.permissions || [];

        if (userPermissions.includes(requiredPermission) || userPermissions.includes('admin:all')) {
            return next(); // 権限確認成功、次のAPI処理へ進む
        }

        // 権限不足エラー
        res.status(403).json({ error: "アクセス拒否：このアクションを実行する十分な権限がありません！" });
    };
}

// APIエンドポイントへの適用例
app.post('/api/invoices', verifyAccessToken, hasPermission('invoice:create'), (req, res) => {
    res.json({ message: "新しい請求書が正常に作成されました！" });
});
```

---

## 📝 本日のミニ課題：高度な認可システム設計

あなたが **セキュリティアーキテクト（Security Architect）** となり、学校のプロジェクト管理システム（**Sensei Hub Project Management**）の認可アーキテクチャを設計してください。

システム内のユーザー種別は `教師 (Teacher)`、`生徒 (Student)`、`監査官 (Inspector)` の3つです。
保護対象となるリソースは `プロジェクト (Project)` であり、属性として `id`、`name`、`score`（点数）、`student_id`（作成した生徒ID）、`advisor_teacher_id`（指導担当の教師ID）を持ちます。

### 課題：
1.  **認可マトリックス of ABAC：** ABACの考え方に基づいて、各ユーザーがプロジェクトに対してどのような操作を行えるか、動的な認可ルールを日本語で記述してください。（例：生徒は自分のプロジェクトに対して何ができるか？ 指導担当の教師は何ができるか？ 担当外の教師は？ 監査官は？）。
2.  **認可ロジックの実装：** プロジェクトに対する「採点（`gradeProject`）」アクションを実行する際の論理条件を検証する疑似コード（Pseudocode）を記述してください。このアクションを実行するには、ロールが `Teacher` であること、かつその教師のユーザーIDがプロジェクトの `advisor_teacher_id` と完全に一致している必要があります！
