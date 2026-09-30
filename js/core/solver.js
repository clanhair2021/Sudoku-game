/**
 * js/core/solver.js
 * ナンプレの解法・矛盾チェック・技（テクニック）判定・問題自動生成を行うコアエンジン[span_4](start_span)[span_4](end_span)
 */

export class Solver {
  /**
   * 盤面に重複（矛盾）があるか検証する
   * @param {Array} grid - 81要素の数値配列 (0〜9)
   * @returns {Object} { isValid: boolean, errorIndices: Array<number> }
   */
  static checkValidity(grid) {
    const errorIndices = new Set();

    // 行・列・3x3ブロックのチェック
    for (let i = 0; i < 9; i++) {
      const rowMap = {}, colMap = {}, boxMap = {};

      for (let j = 0; j < 9; j++) {
        // 行のインデックス
        const rIdx = i * 9 + j;
        const rVal = grid[rIdx];
        if (rVal !== 0) {
          if (rowMap[rVal] !== undefined) {
            errorIndices.add(rIdx);
            errorIndices.add(rowMap[rVal]);
          } else {
            rowMap[rVal] = rIdx;
          }
        }

        // 列のインデックス
        const cIdx = j * 9 + i;
        const cVal = grid[cIdx];
        if (cVal !== 0) {
          if (colMap[cVal] !== undefined) {
            errorIndices.add(cIdx);
            errorIndices.add(colMap[cVal]);
          } else {
            colMap[cVal] = cIdx;
          }
        }

        // 3x3ブロックのインデックス
        const bRow = Math.floor(i / 3) * 3 + Math.floor(j / 3);
        const bCol = (i % 3) * 3 + (j % 3);
        const bIdx = bRow * 9 + bCol;
        const bVal = grid[bIdx];
        if (bVal !== 0) {
          if (boxMap[bVal] !== undefined) {
            errorIndices.add(bIdx);
            errorIndices.add(boxMap[bVal]);
          } else {
            boxMap[bVal] = bIdx;
          }
        }
      }
    }

    return {
      isValid: errorIndices.size === 0,
      errorIndices: Array.from(errorIndices)
    };
  }

  /**
   * マス入力時に発動した「技（テクニック）」を判定してTPを算出する[span_5](start_span)[span_5](end_span)
   * @param {Array} grid - 現在の盤面データ
   * @param {number} targetIndex - 直前に入力・操作されたマス
   * @returns {Object|null} 検出された技と獲得TPの情報
   */
  static detectTechnique(grid, targetIndex) {
    // 簡易技判定（基本の消去法・Naked Singleなど）
    // 将来的に X-Wing や Naked/Hidden Pairs などの複雑な判定を追加拡張[span_6](start_span)[span_6](end_span)
    
    // 仮実装: 技検出ロジックの判定例
    const dummyPoint = 50; 
    return {
      name: '消去法 (Naked Single)',
      tp: dummyPoint
    };
  }

  /**
   * 指定したヒント数（初期数字数）のナンプレ盤面を自動生成する[span_7](start_span)[span_7](end_span)[span_8](start_span)[span_8](end_span)
   * @param {number} hintCount - 初期数字の数（例: 36マス[span_9](start_span)[span_9](end_span)[span_10](start_span)[span_10](end_span)）
   * @returns {Array<number>} 81要素の数値配列
   */
  static generatePuzzle(hintCount = 36) {
    // 完全に解かれた完全盤面（ベース）を生成
    const solvedBoard = Array(81).fill(0);
    this.solve(solvedBoard);

    // ヒント数に応じてランダムに穴をあける
    const puzzle = [...solvedBoard];
    let removed = 81 - hintCount;
    
    while (removed > 0) {
      const randIdx = Math.floor(Math.random() * 81);
      if (puzzle[randIdx] !== 0) {
        puzzle[randIdx] = 0;
        removed--;
      }
    }

    return puzzle;
  }

  /**
   * バックトラッキング法による盤面解法（完成判定・自動生成用）
   * @param {Array<number>} grid 
   * @returns {boolean} 解が存在するかどうか
   */
  static solve(grid) {
    for (let i = 0; i < 81; i++) {
      if (grid[i] === 0) {
        // 1〜9の数字をランダムな順序で試行
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
        for (const num of nums) {
          grid[i] = num;
          const { isValid } = this.checkValidity(grid);
          if (isValid && this.solve(grid)) {
            return true;
          }
          grid[i] = 0;
        }
        return false;
      }
    }
    return true;
  }
}
