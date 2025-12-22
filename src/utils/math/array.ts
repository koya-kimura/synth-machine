/**
 * 配列をランダムにシャッフルして新しい配列を返します
 * (フィッシャー–イェーツのアルゴリズム)
 */
export function shuffle<T>(array: T[]): T[] {
    // 元の配列を変更しないようにコピーを作成
    const newArray = [...array];

    for (let i = newArray.length - 1; i > 0; i--) {
        // 0〜iの範囲でランダムなインデックスを選ぶ
        const j = Math.floor(Math.random() * (i + 1));
        // 要素を交換
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }

    return newArray;
}