import { test, expect } from '@playwright/test';

class ArticlesPage {
  constructor(page) {
    this.page = page;
    this.articlesList = page.locator('.article-preview');
    this.baseUrl = "https://realworld.qa.guru/#/";
    this.createArticleButton = page.locator('a.nav-link:has-text("New Article")'); 
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
    await expect(articleLink.first()).toBeVisible({ timeout: 15000 });
    await expect(articleLink).toBeVisible()
    await articleLink.first().click();
  }

  async assertTitleNotExist(updatedTitle, title) {
    this.articleLink = this.page.locator(`.article-preview:has-text("${updatedTitle || title}")`);
    await expect(this.articleLink).toHaveCount(0);
  }

  favoriteButtonForArticle(title) {
    return this.page.locator(`.article-preview:has-text("${title}") button.btn`);
  }

  async isArticleFavorited(title) {
    const button = this.favoriteButtonForArticle(title).first();
    const className = await button.getAttribute('class');
    return className?.includes('active');
  }

async toggleFavorite(title) {
  const favoriteButton = this.favoriteButtonForArticle(title).first();
  const wasActive = (await favoriteButton.getAttribute('class'))?.includes('active');
  await favoriteButton.click();

  if (wasActive) {
    await expect(favoriteButton).not.toHaveClass(/active/, { timeout: 5000 });
  } else {
    await expect(favoriteButton).toHaveClass(/active/, { timeout: 5000 });
  }
}

}

module.exports = ArticlesPage;