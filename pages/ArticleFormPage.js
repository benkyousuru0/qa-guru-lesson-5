class ArticleFormPage {
  constructor(page) {
    this.page = page;
    this.editorPageURL = "https://realworld.qa.guru/#/editor";
    this.titleInput = page.locator('input[name="title"]');
    this.descriptionInput = page.locator('input[name="description"]');
    this.bodyTextarea = page.locator('textarea[name="body"]');
    this.tagsInput = page.locator('input[name="tags"]');
    this.publishButton = page.locator('button.btn.btn-lg.pull-xs-right.btn-primary[type="submit"]');
  }

  async fillArticle({ title, description, body, tags }) {
    await this.titleInput.fill(title);
    await this.descriptionInput.fill(description);
    await this.bodyTextarea.fill(body);
    await this.tagsInput.fill(tags);
    await this.publishButton.click();
  }

  async goto() {
    await this.page.goto(this.editorPageURL);
  }
}

module.exports = ArticleFormPage;