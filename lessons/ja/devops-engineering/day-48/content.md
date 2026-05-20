---
title: "StatefulApps & Operators：データベースをプロフェッショナルにクラウドへ載せる \U0001F3DB️"
description: Day 48へようこそ！
day: 48
chapter: DEVOPS MASTER
category: DEVOPS-MASTER
---
# StatefulApps & Operators：データベースをプロフェッショナルにクラウドへ載せる 🏛️

Day 48へようこそ！ 

「Kubernetes 上でデータベースを動かすな」という言葉をよく耳にします。それは……5 年前の古いアドバイスです。**StatefulSets** (#(StatefulSet))、そして特に **Operator** 技術の登場により、現在では「状態を持つ（Stateful）」アプリケーションを K8s 上で運用することは、かつてないほど安全で強力なものとなっています。

今日は、システムの最も重要な「魂」である「データ」の管理方法を学びます。

---

## 🪝 THE HOOK：データベースの「アイデンティティ喪失」というエラー

標準的な **Deployment** を使って、3 ノード（1 Master, 2 Read-replicas）のデータベースクラスターを運用していると想像してください。
- Master ノードの名前は `db-xyz-123` です。2 台の Slave はこの名前に接続します。
- 突然、Master がダウンしました。Kubernetes は自動的に Master を復活させますが、新しい名前 `db-abc-789` を割り当てます。
- 2 台の Slave とウェブアプリは、新しい Master がどこにいるか分からず、「接続断」の状態に陥ります。
- さらに悪いことに、古い Master のディスクが新しい Master に自動的にマウントされず、データの消失やバージョンの競合が発生します。

データベースはウェブフロントエンドではありません。固定の名前、変わらない住所、そして生涯を共にするストレージが必要です。それが、StatefulSet が必要な理由です。

---

## 🎭 ANALOGY：名もなき作業員と名前を持つ士官たち

### 1. Deployment：作業員（Stateless）
100 人の建設作業員を考えてみましょう。彼らは同じ制服を着ており、お互いの名前も知りません。一人が体調を崩せば、すぐに別の人が交代します。仕事（リクエスト処理）さえ完了すれば、誰が誰であっても構いません。これが **Deployment** によるウェブアプリの管理方法です。

### 2. StatefulSet：艦隊の士官たち（Stateful）
艦隊を考えてみましょう：空母 1 番艦、駆逐艦 2 番艦、潜水艦 3 番艦。 
- 彼らは **「順序インデックス（Ordinal Index）」** (#(Ordinal Index)) を持つ唯一無二の存在です。 
- 1 番艦は常に旗艦であり、2 番艦は常にその後ろを守ります。 
- もし 1 番艦が故障して交代が必要になった場合、新しい艦は **必ず** 「1 番」という番号を引き継ぎ、以前と同じ任務と、以前と同じ兵器庫（データ）を受け継がなければなりません。

---

## ⚙️ UNDER THE HOOD：StatefulSet の特性を深掘りする

StatefulSet は、各 Pod に不変の 3 つの「超能力」を授けます：

### 1. Stable Network Identity（安定したネットワーク識別子）
Deployment では、Pod 名は `webapp-6688c8-ghz12` のようにランダムです。StatefulSet では、Pod 名は `mysql-0`, `mysql-1` と固定されます。
これに **Headless Service** (#(Headless Service)) を組み合わせることで、`mysql-0.db-service` という DNS レコードが生成されます。Pod が死んで別の物理ノードで復活しても、このアドレスは変わりません。DB の Slave は常に Master の居場所を正確に把握できます。

### 2. Stable Persistent Storage（安定した永続ストレージ）
これが `volumeClaimTemplates` という構造です。K8s は Pod とディスクの間に、強固な「親子関係」を築きます：
- `mysql-0` は `pvc-data-mysql-0` を所有します。
- `mysql-0` が削除されても、その `pvc` は残り続けます。 
- `mysql-0` が戻ってくると、自分の名前がついた `pvc` を自動的に探し出して接続します。`mysql-0` のデータが `mysql-1` に紛れ込むことは決してありません。

### 3. Ordered Placement（順序付けられた配置）
データベースには規律が必要です。 
- **起動（Startup）**: 0 -> 1 -> 2 の順で起動します。これにより、Slave が同期先を探し始める前に、Master が安定して起動する時間を確保できます。
- **停止（Shutdown）**: 2 -> 1 -> 0 の順で停止します。これは「スプリットブレイン（Split Brain）」や、予期せぬシャットダウン時のデータ消失を防ぐために極めて重要です。

---

## 🌐 KUBERNETES OPERATORS：「自動化システム」の脳

StatefulSet が骨組みだとすれば、**Operator** (#(Operator)) は「仮想の運用エンジニア」です。 
これはクラスターのバックグラウンドで動作するアプリケーションで、**Control Loop（制御ループ）** を使用します：
1. **Observe（観察）**: データベースの状態を監視します（例：「Redis クラスターに 3 つのノードがあり、1 つが Master、2 つが Slave である」）。
2. **Analyze（分析）**: 理想の状態と比較します（例：「突然 Master がダウンし、Slave が 2 つだけになった」）。
3. **Act（実行）**: 修正アクションを実行します（例：「Slave 1 を新しい Master に昇格させ、Slave 2 を再設定し、空いた枠に新しい Pod を起動する」）。

これまで DevOps エンジニアが夜更かししてコマンドを打ち込んでいた作業を、Operator は……わずか 1 秒で完了させます。

---

## 💻 DEVOPS IN PRACTICE：Operator を使った高可用性 Postgres のデプロイ

StatefulSet のために何百行もの YAML を書いたり、レプリケーション設定に苦労したりする必要はありません。**Zalando Postgres Operator** や **CloudNativePG** を使えば、これだけで済みます：

```yaml
apiVersion: postgresql.cnpg.io/v1
kind: Cluster
metadata:
  name: production-db
spec:
  instances: 3
  imageName: ghcr.io/cloudnative-pg/postgresql:15
  storage:
    size: 20Gi
  monitoring:
    enablePodMonitor: true # Prometheus に自動統合されます！
  backup:
    barmanObjectStore: # 毎日 S3 へ自動バックアップ
      destinationPath: s3://my-db-backups/
```

### なぜ Operator が未来なのか？
- **自己修復（Self-healing）**: Pod を再起動するだけでなく、アプリ内部のロジックまで再設定します。
- **自動バックアップ**: 外部の cronjob を設定する必要がなくなります。
- **自動スケーリング**: 負荷が高い場合、Operator が自動的にリードレプリカを追加できます。

---

## 🛡️ MASTER THINKING：「複雑さという重荷（The Complexity Burden）」

K8s が強力にサポートしているとはいえ、DevOps マスターは理解しておかなければなりません。**「K8s 上でデータベースを運用することは、Stateless アプリを運用するより 10 倍難しい」** ということを。
- **I/O パフォーマンス**: ネットワークドライブ（EBS/AzureDisk など）は、物理マシンのローカルドライブより遅延が大きくなります。
- **リスク管理**: K8s クラスターの `etcd` や `control plane` が故障した場合、データベースの制御権まで失う可能性があります。
**Master Tip**: AWS や GCP を使っているなら、まずは **RDS** や **Cloud SQL** の使用を優先してください。DB を K8s に載せるのは、次のような場合に限ります： 
1. 劇的なコスト削減が必要な場合。
2. マルチクラウドを目指し、特定のベンダー（AWS など）へのロックインを避けたい場合。
3. 自社のデータセンター（オンプレミス）で運用する場合。

---

## 💻 INTERVIEW QUESTION：プリンシパル・エンジニアレベル

**質問：StatefulSet において、通常の Volume ではなく volumeClaimTemplates が必要なのはなぜですか？**

**回答（マスターレベル）:**
Deployment において Volume を 1 つ宣言すると、10 個の Pod すべてがその 1 つのハードドライブ（PVC）に「同時になだれ込み」ます。データベースにとって、これは大惨事です。10 個のアプリが同時に 1 つのデータファイルを書き換えれば、瞬時にファイルが壊れてしまうからです。
StatefulSet において、`volumeClaimTemplates` は「PVC 製造工場」の役割を果たします。新しい Pod が生成されるたびに、StatefulSet はその Pod 専用の **「完全に新しく」「唯一無二の」** PVC を作成するようシステムに要求します。これにより、データベースクラスター内の各ノード間での絶対的なデータ隔離が保証されるのです。

---

## 📝 QUICK QUIZ：データ管理エンジニアへの挑戦

1. **StatefulSet 内の Pod が、物理ノードが変わっても固定の DNS アドレスを維持できるのは、どのコンポーネントのおかげですか？**
    - A. Ingress
    - B. Headless Service
    - C. ConfigMap

2. **K8s Operator は、StatefulSet よりも何において柔軟ですか？**
    - A. Pod の起動と停止のみを行う。
    - B. 各アプリ固有のロジック（DB バックアップ、リーダー選挙、フェイルオーバーなど）を自動化できる。
    - C. DB の動作を速くする。

3. **StatefulSet の起動順序（0 -> 1 -> 2）は何に役立ちますか？**
    - A. 行列を綺麗に見せるため。
    - B. 二次ノード（Slave）が接続してくる前に、重要なノード（Master）が準備を整える時間を確保するため。
    - C. CPU を節約するため。

---

## 📊 文字数: ~4500文字

**まとめ**: あなたはシステムの「記憶」を堅牢に保つ方法を学びました。明日（Day 49）はシステムの「保険」について——**Disaster Recovery（災害復旧）** (#(DisasterRecovery)) です。もし AWS のリージョン全体がダウンしても、15 分でクラスター全体を復活させるには？ **Velero** を探求しましょう！
