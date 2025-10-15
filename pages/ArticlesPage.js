class ArticlesPage {
  constructor(page) {
    this.page = page;
    this.baseUrl = "https://realworld.qa.guru/#/";
    this.createArticleButton = page.locator('a.nav-link:has-text("New Article")'); 
    this.articlesList = page.locator('.article-preview');
    this.globalFeedTab = page.locator('.feed-toggle button.nav-link', { hasText: 'Global Feed' });
  }

  async goto() {
    await this.page.goto(this.baseUrl);
  }

  async clickCreateArticle() {
    await this.createArticleButton.click();
  }

  async clickGlobalFeedTab() {
    await this.globalFeedTab.click();
  }

  async openArticleByTitle(title) {
    const articleLink = this.page.locator(`.article-preview >> text=${title}`);
    await articleLink.first().click();
  }

  favoriteButtonForArticle(title) {
    return this.page.locator(`.article-preview:has-text("${title}") button.btn`);
  }

  async favoriteArticle(title) {
    const favoriteButton = this.favoriteButtonForArticle(title);
    await favoriteButton.first().click(); 
  }
}

module.exports = ArticlesPage;