class ArticleViewPage {
  constructor(page) {
    this.page = page;
    this.articlePage = "https://realworld.qa.guru/#/article/"
    this.title = page.locator('.article-page .banner h1');
    this.body = page.locator('.article-content'); 
    this.deleteButton = page.locator('button:has-text("Delete Article")').first(); 
    this.editButton = page.locator('button:has-text("Edit Article")').first();   
  }

  async clickEdit() {
  
  await this.editButton.waitFor({ state: 'visible' });
  await this.editButton.click();
  }

  async clickDelete() {
    await this.page.once('dialog', dialog => dialog.accept());
    await this.deleteButton.click();
    await this.page.waitForURL(/#\/$/);
  }
}

module.exports = ArticleViewPage;