---
title: "Day 13: Pandas DataFrameとデータ整形"
description: "Pandasを使用して表形式データを検査、クリーンアップ、およびフィルタリングする方法を学びます。欠損値の補完と負の値のフィルタリングを実装します。"
codingExercise: true
initialCode: |
  import pandas as pd

  def clean_and_filter(df):
      # 1. Fill missing values in 'age' and 'salary' columns with the respective column mean
      # 2. Filter out rows where 'salary' is less than 0
      # 3. Return the cleaned DataFrame
      cleaned_df = None
      return cleaned_df
testCode: |
  import pandas as pd
  import numpy as np

  data = {
      'name': ['Alice', 'Bob', 'Charlie', 'David'],
      'age': [25, np.nan, 30, 40],
      'salary': [50000, 60000, -1000, np.nan]
  }
  df = pd.DataFrame(data)
  res = clean_and_filter(df)
  assert res is not None, "モデルの出力が None になっています"
  assert np.isclose(res.loc[res['name'] == 'Bob', 'age'].values[0], 31.66, atol=1e-1), "age 列の欠損値を列の平均値で補完する必要があります"
  assert 'Charlie' not in res['name'].values, "salary が -1000 である Charlie はフィルタリングで除外される必要があります"
  assert np.isclose(res.loc[res['name'] == 'David', 'salary'].values[0], 36333.3, atol=1e-1), "フィルタリングを行う前に、salary 列の欠損値を列の平均値で補完する必要があります"
solutionCode: |
  import pandas as pd

  def clean_and_filter(df):
      df = df.copy()
      df['age'] = df['age'].fillna(df['age'].mean())
      df['salary'] = df['salary'].fillna(df['salary'].mean())
      df = df[df['salary'] >= 0]
      return df
---

# Day 13: Pandas DataFrameとデータ整形

### 🎯 学習目標
- Pandas の Series と DataFrame の違いを説明できる。
- `.loc` および `.iloc` インデックス参照を使用して、行や列を選択できる。
- ブールインデックス参照を使用して、表形式データをフィルタリングできる。
- `.fillna()` を使用して、欠損値（NaN）を検出および補完できる。
- `SettingWithCopyWarning` の問題を回避し、解決できる。

### 🧩 中核概念（なぜ）
現実世界のデータサイエンスや機械学習において、生のデータセットが最初からクリーンであることは滅多にありません。欠損値、無効なレコード、フォーマットの不整合などが含まれているのが普通です。NumPy 配列は同質なデータに対する数値計算には優れていますが、ラベル付きの多様な型が混在する表形式データを簡単に扱うようには設計されていません。

Pandas は、この課題を解決するために 2 つの主要なデータ構造を提供します：
1. **Series**: 任意のデータ型（整数、文字列、浮動小数点数、Python オブジェクトなど）を保持できる 1 次元ラベル付き配列です。テーブルの単一の列を表します。
2. **DataFrame**: 行と列のラベル（軸）を持つ、サイズ変更可能で、異なる型が混在可能な 2 次元の表形式データ構造です。テーブル全体を表します。

データクリーニング（データ整形）とは、レコードセット、テーブル、またはデータベースから、破損したレコードや不正確なレコードを検出して修正するプロセスです。データをクリーンに保つ方法を学ぶことで、訓練する機械学習モデルに高品質な入力データを与えることができ、予測精度の向上に直接つながります。

### 🔁 ロジックと動作
データ整形のプロセスでは、データを読み込み、欠損値や不適切なレコードを特定し、それらを修正した上で、外れ値や無効な行をフィルタリングして除外します。

```mermaid
flowchart TD
    A[生データ (表形式)] --> B{欠損値があるか判定}
    B -- NaN/None を検出 --> C[平均/中央値/最頻値で補完、または削除]
    B -- 欠損なし --> D{無効な値・負の値があるか判定}
    C --> D
    D -- 無効な値を検出 --> E[ブールインデックスで行をフィルタリング]
    D -- 有効 --> F[クリーンな DataFrame (ML用)]
    E --> F
```

- **補完 (Imputation)**: 欠損値（`NaN`）を統計的に妥当な代替値（その列の平均値など）で埋めることで、後続のアルゴリズムがエラーでクラッシュするのを防ぎます。
- **ブールマスク (Boolean Masking)**: 各行が条件を満たしているかどうかに応じて `True` / `False` の値を格納した Series を作成し、それを利用して一致する行のみを選択します。

### 📝 注釈付きサンプル
実際に DataFrame を作成し、特定の値を参照し、欠損値を補完し、無効な行をフィルタリングしてみましょう。

```python
import pandas as pd
import numpy as np

# 1. Series と DataFrame の作成
names = pd.Series(["Alice", "Bob", "Charlie"], name="Name")
data = {
    "name": ["Alice", "Bob", "Charlie", "David"],
    "age": [25.0, np.nan, 30.0, 40.0],
    "salary": [50000.0, 60000.0, -1000.0, np.nan]
}
df = pd.DataFrame(data)
print(df)
# 出力結果:
#       name   age   salary
# 0    Alice  25.0  50000.0
# 1      Bob   NaN  60000.0
# 2  Charlie  30.0  -1000.0
# 3    David  40.0      NaN

# 2. .loc (ラベルベース) と .iloc (整数位置ベース) を使用したデータ選択
# 行ラベル 1、列ラベル 'name' の値を選択
print(df.loc[1, "name"])  # 出力結果: 'Bob'

# 行位置 1、列位置 0 の値を選択
print(df.iloc[1, 0])      # 出力結果: 'Bob'

# 3. 欠損値の検査
print(df.isna())          # 欠損値を示すブール値の DataFrame を返す

# 4. 欠損値を列の平均値で補完する
age_mean = df["age"].mean()       # (25 + 30 + 40) / 3 = 31.666...
df["age"] = df["age"].fillna(age_mean)

salary_mean = df["salary"].mean() # (50000 + 60000 - 1000) / 3 = 36333.333...
df["salary"] = df["salary"].fillna(salary_mean)

# 5. salary が 0 未満の行をフィルタリングして除外する
cleaned_df = df[df["salary"] >= 0]
print(cleaned_df)
# 出力結果:
#     name        age        salary
# 0  Alice  25.000000  50000.000000
# 1    Bob  31.666667  60000.000000
# 3  David  40.000000  36333.333333
```

### ❌ よくある間違い

**間違い 1: 連鎖インデックス参照（Chained Indexing）による SettingWithCopyWarning**
```python
df = pd.DataFrame({'age': [20, 30, 40]})
df[df['age'] > 25]['age'] = 25
```
```text
SettingWithCopyWarning: 
A value is trying to be set on a copy of a slice from a DataFrame.
Try using .loc[row_indexer,col_indexer] = value instead
```
```python
df = pd.DataFrame({'age': [20, 30, 40]})
df.loc[df['age'] > 25, 'age'] = 25
```
> 連鎖インデックス参照は DataFrame の一時的なコピーを返すため、代入を行っても元のデータは変更されません。元の DataFrame に直接書き込むには、`.loc` を使用してください。

**間違い 2: 等価演算子 `== np.nan` を使用した欠損値のチェック**
```python
df = pd.DataFrame({'age': [20, np.nan, 40]})
missing = df[df['age'] == np.nan]
print(missing)
```
```text
Empty DataFrame
Columns: [age]
Index: []
```
```python
df = pd.DataFrame({'age': [20, np.nan, 40]})
missing = df[df['age'].isna()]
print(missing)
```
> 浮動小数点の NaN は自分自身と等しくありません（`np.nan == np.nan` は False になります）。欠損値の検出には必ず `.isna()` または `.isnull()` メソッドを使用してください。

**間違い 3: インデックスに対するラベル選択で、行の整数位置にアクセスしようとする**
```python
df = pd.DataFrame({'age': [20, 30]}, index=['a', 'b'])
row = df.loc[0]
```
```text
KeyError: 0
```
```python
df = pd.DataFrame({'age': [20, 30]}, index=['a', 'b'])
row = df.iloc[0]
```
> `.loc` はカスタムラベル名（この場合は `'a'` または `'b'`）で行を選択します。数値の位置によって行を選択するには、`.iloc` を使用してください。

### 💡 コツ・イディオム
- **`.copy()` の使用**: 後から変更を加える予定の DataFrame のサブセットを選択する場合は、末尾に `.copy()` を追加して元の DataFrame から独立させ、変更が意図せず波及するのを防ぎます。
- **外れ値の処理**: パーセンタイル間で値を丸めるには、`df['column'].clip(lower=min_val, upper=max_val)` を使用できます。
- **文字列操作**: テキストデータを処理する際は、`.str` アクセサ（例：`df['name'].str.strip()`）を介して、ベクトル化された文字列メソッドを使用します。

### 🧠 深掘り（内部の仕組み）
<details><summary>BlockManager と参照（View） vs コピー（Copy）のセマンティクス（クリックで展開）</summary>

Pandas は、内部的において `BlockManager` と呼ばれるオブジェクトを使用して表形式データを管理しています。データを行ごとではなく、同じデータ型（float64, int64, object など）の列ごとにまとめて、メモリ上で連続する 2 次元 NumPy 配列（「ブロック」と呼ばれる）に格納します。

```
DataFrame
 ├── 列ラベル: ['name', 'age', 'salary']
 └── BlockManager
      ├── FloatBlock: 列 ['age', 'salary'] (2次元 float64 NumPy 配列)
      └── ObjectBlock: 列 ['name'] (1次元 object NumPy 配列)
```

#### なぜ `SettingWithCopyWarning` が発生するのか
Python で DataFrame にインデックス参照を行う際、Pandas は「参照（ビュー：メモリ内の既存ブロックへのポインタ）」を返すか、「コピー（新規に割り当てられたメモリブロック）」を返すかを決定します。

インデックスでスライスされたデータが「ビュー」である場合、それを変更すると元の DataFrame も変更されます。「コピー」である場合、それを変更しても元の DataFrame は変更されません。`df[df['age'] > 25]['age'] = 25` のような連鎖インデックス参照では、以下の処理が行われます：
1. まず `df[df['age'] > 25]` が実行され、Pandas は一時的な DataFrame を作成します。インデックス参照の複雑さにより、これがコピーかビューかは不確定になります。
2. 次に、この一時的な DataFrame に対して `['age'] = 25` が実行されます。
3. 一時的な DataFrame が「コピー」である場合、代入された値は破棄され、元の `df` には一切反映されません。この潜在的なバグを防ぐために、Pandas は警告を出します。

`.loc[row_indexer, col_indexer]` を使用すると、選択と代入が `BlockManager` に単一の命令として送信され、Pandas は基礎となるブロックを直接メモリ上で更新できます。
</details>

### 🏋️ 演習
`clean_and_filter(df)` 関数を完成させて、以下の処理を実装してください：
1. `'age'` 列の欠損値を、その列の平均値で補完する。
2. `'salary'` 列の欠損値を、その列の平均値で補完する。
3. `'salary'` が `0` 未満の行をフィルタリングして除外する。
4. クリーニング後の DataFrame を返す。

```python
import pandas as pd

def clean_and_filter(df):
    # 1. Fill missing values in 'age' and 'salary' columns with the respective column mean
    # 2. Filter out rows where 'salary' is less than 0
    # 3. Return the cleaned DataFrame
    cleaned_df = None
    return cleaned_df
```

### ✅ 自己チェック
1. `.loc` と `.iloc` の違いは何ですか？
2. 警告を発生させることなく、`df` の `'price'` 列にある欠損値を安全に `0` で埋めるにはどうすればよいですか？
<details><summary>解答</summary>

1. `.loc` は行と列の「ラベル（名前）」を使用してデータを選択し、`.iloc` は行と列の「整数位置（0 から始まるインデックス）」を使用してデータを選択します。
2. `.loc` を使用して直接代入するか、`.fillna()` を使用して代入します：
   ```python
   df['price'] = df['price'].fillna(0)
   ```
</details>

### 📌 まとめ
- **Series** は単一の列を表し、**DataFrame** は 2 次元の表を表します。
- ラベルによる選択には `.loc` を、位置による選択には `.iloc` を使用します。
- `NaN` の検出には `.isna()` を、欠損値の補完には `.fillna()` を使用します。
- `df[cond]['col'] = val` のような連鎖インデックスによる代入は避け、常に `df.loc[cond, 'col'] = val` を使用してください。
