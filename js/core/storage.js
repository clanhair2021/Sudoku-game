/**
 * js/core/storage.js
 * ローカルストレージへのセーブデータ保存・読み込み管理[span_12](start_span)[span_12](end_span)
 */

export class Storage {
  static SAVE_KEY = 'sudoku_game_save_data';

  /**
   * データを保存
   */
  static save(data) {
    try {
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('保存に失敗しました:', e);
      return false;
    }
  }

  /**
   * データを読み込み
   */
  static load() {
    try {
      const data = localStorage.getItem(this.SAVE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('読み込みに失敗しました:', e);
      return null;
    }
  }
}
