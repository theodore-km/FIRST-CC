// input.js — 键盘输入处理

class InputHandler {
  /**
   * @param {Function} onHit        单字母模式下输入匹配时回调
   * @param {Function} onCharInput  单词模式下每输入一个字符时回调
   * @param {Function} onTypo       输入错误时回调
   * @param {Function} onBackspace  退格时回调
   */
  constructor(onHit, onCharInput, onTypo, onBackspace) {
    this._onHit = onHit;
    this._onCharInput = onCharInput;
    this._onTypo = onTypo;
    this._onBackspace = onBackspace;

    this.mode = 'letter';     // 'letter' | 'word'
    this.typed = '';           // 当前已输入字符
    this.lockedTarget = null;  // 单词模式锁定的目标
    this.totalKeystrokes = 0;
    this.correctKeystrokes = 0;

    this._bound = this._handleKey.bind(this);
  }

  activate() {
    window.addEventListener('keydown', this._bound);
  }

  deactivate() {
    window.removeEventListener('keydown', this._bound);
  }

  reset() {
    this.typed = '';
    this.lockedTarget = null;
    this.totalKeystrokes = 0;
    this.correctKeystrokes = 0;
  }

  clearInput() {
    this.typed = '';
    this.lockedTarget = null;
  }

  _handleKey(e) {
    // 忽略修饰键和功能键
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    if (e.key.length !== 1 && e.key !== 'Backspace') return;

    e.preventDefault();

    if (this.mode === 'letter') {
      this._handleLetterMode(e.key);
    } else {
      this._handleWordMode(e.key);
    }
  }

  _handleLetterMode(key) {
    if (key === 'Backspace') return;

    const ch = key.toUpperCase();
    if (ch >= 'A' && ch <= 'Z') {
      this.totalKeystrokes++;
      this._onHit(ch);
    }
  }

  _handleWordMode(key) {
    if (key === 'Backspace') {
      if (this.typed.length > 0) {
        this.typed = this.typed.slice(0, -1);
        this._onBackspace();
        if (this.typed.length === 0) {
          if (this.lockedTarget) {
            this.lockedTarget.locked = false;
            this.lockedTarget.matched = 0;
          }
          this.lockedTarget = null;
        } else if (this.lockedTarget) {
          this.lockedTarget.matched = this.typed.length;
        }
      }
      return;
    }

    const ch = key.toLowerCase();
    if (ch >= 'a' && ch <= 'z') {
      this.totalKeystrokes++;
      this._onCharInput(ch);
    }
  }

  get accuracy() {
    if (this.totalKeystrokes === 0) return 100;
    return Math.round((this.correctKeystrokes / this.totalKeystrokes) * 100);
  }
}
