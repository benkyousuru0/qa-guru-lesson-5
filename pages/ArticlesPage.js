import { expect } from '@playwright/test';

class ArticlesPage {
  constructor(page) {
    this.page = page;
    this.articlesList = page.locator('.article-preview');
    this.baseUrl = "https://realworld.qa.guru/#/";
    this.createArticleButton = page.locator('a.nav-link:has-text("New Article")'); 
    this.globalFeedTab = page.locator('.feed-toggle button.nav-link', { hasText: 'Global Feed' });

    this.articleLinkByTitle = (title) => page.locator(`.article-preview >> text=${title}`);
    this.articleLinkByText = (text) => page.locator(`.article-preview:has-text("${text}")`);
    this.favoriteButtonByTitle = (title) => page.locator(`.article-preview:has-text("${title}") button.btn`);
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
    await this.articleLinkByTitle(title).first().click();
  }

  async countArticlesByTitle(title) {
    const locator = this.articleLinkByText(title);
    return await locator.count();
  }
  
  async assertTitleNotExist(updatedTitle, title) {
    const count = await this.countArticlesByTitle(updatedTitle || title);
    expect(count).toBe(0);
  }

  favoriteButtonForArticle(title) {
    return this.favoriteButtonByTitle(title);
  }

  async isArticleFavorited(title) {
    const button = this.favoriteButtonByTitle(title).first();
    const className = await button.getAttribute('class');
    return className?.includes('active');
  }

  async toggleFavorite(title) {
    const favoriteButton = this.favoriteButtonByTitle(title).first();
    const wasActive = (await favoriteButton.getAttribute('class'))?.includes('active');
    await favoriteButton.click();

    if (wasActive) {
      await expect(favoriteButton).not.toHaveClass(/active/);
    } else {
      await expect(favoriteButton).toHaveClass(/active/);
    }
  }
}

module.exports = ArticlesPage;
