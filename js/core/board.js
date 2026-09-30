/**
 * js/core/board.js
 * 9×9ナンプレ盤面の描画、マス選択、数字入力・メモ・仮置き（IF）の状態管理を担当[span_2](start_span)[span_2](end_span)
 */

export class Board {
  constructor(containerId = 'board-container') {
    this.container = document.getElementById(containerId);
    this.cells = []; // 81個のDOM要素を格納
    this.selectedCellIndex = null; // 現在選択中のマスインデックス (0〜80)
    
    // モード設定
    this.isMemoMode = false;
    this.isIfMode = false; // 仮置き（IF）モード

    // 盤面データ構造 (81要素の配列)
    // 各要素: { value: 0, initial: false, memo: Array(9), isIf: false }
    this.gridData = Array.from({ length: 81 }, () => ({
      value: 0,
      initial: false,
      memo: [],
      isIf: false
    }));

    this.initUI();
  }

  /**
   * 81マスのDOM生成とイベント設定[span_3](start_span)[span_3](end_span)
   */
  initUI() {
    if (!this.container) return;
    this.container.innerHTML = '';
    this.cells = [];

    for (let i = 0; i < 81; i++) {
      const row = Math.floor(i / 9);
      const col = i % 9;

      const cellEl = document.createElement('div');
      cellEl.classList.add('cell');
      cellEl.dataset.index = i;
      cellEl.dataset.row = row;
      cellEl.dataset.col = col;

      // クリックでマス選択
      cellEl.addEventListener('click', () => this.selectCell(i));

      this.container.appendChild(cellEl);
      this.cells.push(cellEl);
    }

    this.setupControlButtons();
    this.render();
  }

  /**
   * 操作パネル（テンキー・メモボタン等）のイベントリスナー設定
   */
  setupControlButtons() {
    // テンキー (1〜9)
    const numButtons = document.querySelectorAll('.num-btn');
    numButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const val = parseInt(e.target.dataset.value, 10);
        this.inputNumber(val);
      });
    });

    // 消去ボタン
    const btnErase = document.getElementById('btn-erase');
    if (btnErase) {
      btnErase.addEventListener('click', () => this.clearCell());
    }

    // メモ切り替えボタン
    const btnMemo = document.getElementById('btn-memo');
    if (btnMemo) {
      btnMemo.addEventListener('click', () => {
        this.isMemoMode = !this.isMemoMode;
        btnMemo.textContent = `メモ [${this.isMemoMode ? 'ON' : 'OFF'}]`;
        btnMemo.classList.toggle('active', this.isMemoMode);
      });
    }

    // 仮置き(IF)切り替えボタン[span_4](start_span)[span_4](end_span)
    const btnIfMode = document.getElementById('btn-if-mode');
    if (btnIfMode) {
      btnIfMode.addEventListener('click', () => {
        this.isIfMode = !this.isIfMode;
        btnIfMode.classList.toggle('active', this.isIfMode);
      });
    }
  }

  /**
   * 特定のマスを選択
   */
  selectCell(index) {
    this.selectedCellIndex = index;
    this.cells.forEach((cell, idx) => {
      cell.classList.toggle('selected', idx === index);
    });
  }

  /**
   * 選択中のマスへ数字を入力／メモの追加・削除
   */
  inputNumber(num) {
    if (this.selectedCellIndex === null) return;
    const cellData = this.gridData[this.selectedCellIndex];

    // 初期数値（問題として用意された固定数字）は変更不可
    if (cellData.initial) return;

    if (this.isMemoMode) {
      // メモモード時
      const memoIdx = cellData.memo.indexOf(num);
      if (memoIdx > -1) {
        cellData.memo.splice(memoIdx, 1);
      } else {
        cellData.memo.push(num);
        cellData.memo.sort((a, b) => a - b);
      }
    } else {
      // 通常入力または仮置き（IF）入力
      cellData.value = cellData.value === num ? 0 : num;
      cellData.isIf = this.isIfMode; // IFモード中なら仮置きフラグを立てる[span_5](start_span)[span_5](end_span)
      cellData.memo = []; // 数字を決定したらメモをクリア
    }

    this.render();
  }

  /**
   * 選択中のマスの入力内容をクリア
   */
  clearCell() {
    if (this.selectedCellIndex === null) return;
    const cellData = this.gridData[this.selectedCellIndex];
    if (cellData.initial) return;

    cellData.value = 0;
    cellData.memo = [];
    cellData.isIf = false;
    this.render();
  }

  /**
   * 問題データ（81要素の数値配列）をセット
   */
  loadBoard(puzzleArray) {
    for (let i = 0; i < 81; i++) {
      const val = puzzleArray[i] || 0;
      this.gridData[i] = {
        value: val,
        initial: val !== 0,
        memo: [],
        isIf: false
      };
    }
    this.selectedCellIndex = null;
    this.render();
  }

  /**
   * 盤面の再描画
   */
  render() {
    this.cells.forEach((cellEl, i) => {
      const data = this.gridData[i];
      cellEl.className = 'cell'; // 一度クラスをリセット

      if (i === this.selectedCellIndex) cellEl.classList.add('selected');
      if (data.initial) cellEl.classList.add('initial');
      if (data.isIf) cellEl.classList.add('if-mode'); // 仮置き数字用スタイル

      if (data.value !== 0) {
        cellEl.textContent = data.value;
      } else if (data.memo.length > 0) {
        // メモ描画 (簡易表示)
        cellEl.textContent = data.memo.join('');
        cellEl.classList.add('memo-text');
      } else {
        cellEl.textContent = '';
      }
    });
  }
}
