export class BasePage {
  constructor(page, url) {
    this._page = page;
    this._url = url;
  }

  async open() {
    if (this._url !== undefined) await this._page.goto(this._url);
  }
}
