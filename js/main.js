/**
 * main.js
 * ゲーム全体の画面遷移・イベントを統括するメインコントローラー[span_2](start_span)[span_2](end_span)
 */

// 今後作成する各モジュールを呼び出す準備（初期段階ではコメントアウトまたは空実装）
// import { Board } from './core/board.js';[span_3](start_span)[span_3](end_span)
// import { TowerMode } from './modes/tower.js';[span_4](start_span)[span_4](end_span)

class App {
  constructor() {
    this.screens = {};
    this.currentScreen = null;
    this.init();
  }

  /**
   * 初期化処理
   */
  init() {
    // 1. 各画面エレメントを取得して管理[span_5](start_span)[span_5](end_span)
    this.screens = {
      menu: document.getElementById('screen-menu'),
      game: document.getElementById('screen-game'),
      dictionary: document.getElementById('screen-dictionary')
    };

    // 2. イベントリスナー（ボタン操作）の登録
    this.setupEventListeners();

    // 3. 初期画面（メインメニュー）を表示[span_6](start_span)[span_6](end_span)
    this.switchScreen('menu');

    console.log('ゲーム基盤が正常に初期化されました。');
  }

  /**
   * 画面切り替えメソッド
   * @param {string} screenName - 切り替え先の画面キー ('menu' | 'game' | 'dictionary')
   */
  switchScreen(screenName) {
    if (!this.screens[screenName]) {
      console.error(`指定された画面が見つかりません: ${screenName}`);
      return;
    }

    // 全画面から active クラスを削除して非表示にする[span_7](start_span)[span_7](end_span)
    Object.values(this.screens).forEach(screen => {
      if (screen) screen.classList.remove('active');
    });

    // 指定された画面に active クラスを付与して表示[span_8](start_span)[span_8](end_span)
    this.screens[screenName].classList.add('active');
    this.currentScreen = screenName;

    console.log(`画面切り替え: ${screenName}`);
  }

  /**
   * ボタンのクリックイベントなどを一括設定
   */
  setupEventListeners() {
    // --- メインメニューの各モードボタン ---[span_9](start_span)[span_9](end_span)
    const btnTower = document.getElementById('btn-tower');
    const btnNormal = document.getElementById('btn-normal');
    const btnCustom = document.getElementById('btn-custom');
    const btnDictionary = document.getElementById('btn-dictionary');
    const btnShop = document.getElementById('btn-shop');

    // タワーモード起動[span_10](start_span)[span_10](end_span)
    if (btnTower) {
      btnTower.addEventListener('click', () => {
        this.switchScreen('game');
        document.getElementById('mode-title').textContent = '🏰 タワーモード - 1階';
        // TODO: tower.js の初期化・開始処理を呼び出す[span_11](start_span)[span_11](end_span)
      });
    }

    // 通常モード起動[span_12](start_span)[span_12](end_span)
    if (btnNormal) {
      btnNormal.addEventListener('click', () => {
        this.switchScreen('game');
        document.getElementById('mode-title').textContent = '🎮 通常モード (EASY)';
        // TODO: normal.js の初期化・開始処理を呼び出す[span_13](start_span)[span_13](end_span)
      });
    }

    // 保存モード起動[span_14](start_span)[span_14](end_span)
    if (btnCustom) {
      btnCustom.addEventListener('click', () => {
        alert('保存モードは今後実装予定です。');
      });
    }

    // 技図鑑起動[span_15](start_span)[span_15](end_span)
    if (btnDictionary) {
      btnDictionary.addEventListener('click', () => {
        this.switchScreen('dictionary');
      });
    }

    // ショップ起動[span_16](start_span)[span_16](end_span)
    if (btnShop) {
      btnShop.addEventListener('click', () => {
        alert('ショップは今後実装予定です。');
      });
    }

    // --- ゲーム画面内の共通ボタン ---
    const btnBackMenu = document.getElementById('btn-back-menu');
    if (btnBackMenu) {
      btnBackMenu.addEventListener('click', () => {
        this.switchScreen('menu');
      });
    }

    // 技図鑑画面の「戻る」ボタン
    const dictBackBtns = document.querySelectorAll('#screen-dictionary .btn-back');
    dictBackBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchScreen('menu');
      });
    });
  }
}

// ページ読み込み完了時にアプリを読み込む
window.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
