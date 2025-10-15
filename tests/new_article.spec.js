const { test, expect } = require('@playwright/test');
require('dotenv').config();

const ArticlesPage = require('../pages/ArticlesPage');
const ArticleFormPage = require('../pages/ArticleFormPage');
const ArticleViewPage = require('../pages/ArticleViewPage');
const LoginPage = require('../pages/LoginPage');

test.describe('Работа со статьями', () => {
  let articlesPage, articleFormPage, articleViewPage;
  let title, description, body, tags;
  let updatedTitle, updatedBody;
  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await loginPage.verifyLoginSuccess();

    articlesPage = new ArticlesPage(page);
    articleFormPage = new ArticleFormPage(page);
    articleViewPage = new ArticleViewPage(page);
  });

  test('Создание новой статьи', async () => {
    title = `Статья ${Math.floor(Math.random() * 10000)}`;
    description = 'Описание статьи';
    body = 'Текст статьи';
    tags = 'test,automation';

    await articlesPage.goto();
    await articlesPage.clickCreateArticle();

    await expect(page).toHaveURL(articleFormPage.editorPageURL);

    await articleFormPage.fillArticle({ title, description, body, tags });
    await articleFormPage.submit();

    await expect(articleViewPage.title).toBeVisible();
  });

  test('Проверка появления статьи в списке и просмотр', async () => {
    await articlesPage.goto();
    await articlesPage.clickGlobalFeedTab();

    const articleLocator = page.locator(`.article-preview:has-text("${title}")`);
    await expect(articleLocator).toBeVisible();

    await articlesPage.openArticleByTitle(title);

    await expect(articleViewPage.title).toHaveText(title);
    await expect(articleViewPage.body).toContainText(body);
  });

  test('Добавление статьи в избранное со списка статей', async () => {
    await articlesPage.goto();
    await articlesPage.clickGlobalFeedTab();
    await articlesPage.favoriteArticle(title);

    const favoriteButton = articlesPage.favoriteButtonForArticle(title);
    await expect(favoriteButton.first()).toHaveClass(/active/);
  });

  test('Удаление статьи из избранного со списка статей', async () => {
    await articlesPage.goto();
    await articlesPage.clickGlobalFeedTab();

    const favoriteButton = articlesPage.favoriteButtonForArticle(title);
    await expect(favoriteButton.first()).toHaveClass(/active/);

    await articlesPage.favoriteArticle(title);
    await expect(favoriteButton.first()).not.toHaveClass(/active/);
});


  test('Редактирование заголовка и содержимого статьи', async () => {
    await articlesPage.goto();
    await articlesPage.clickGlobalFeedTab();

    const articleLocator = page.locator(`.article-preview:has-text("${title}")`);
    await expect(articleLocator).toBeVisible();

    await articlesPage.openArticleByTitle(title);
    await articleViewPage.clickEdit();

    updatedTitle = `${title} (обновлено)`;
    updatedBody = 'Обновленный текст статьи';

    await articleFormPage.fillArticle({ title: updatedTitle, body: updatedBody });
    await articleFormPage.submit();

    await expect(articleViewPage.title).toHaveText(updatedTitle);
    await expect(articleViewPage.body).toContainText(updatedBody);
  });

  test.afterAll(async () => {
    const currentUrl = page.url();
    if (!currentUrl.includes('/article/')) {
      await articlesPage.goto();
      await articlesPage.openArticleByTitle(updatedTitle || title);
    }

    await articleViewPage.clickDelete();
    await page.waitForURL(/#\/$/); 
    await expect(page).toHaveURL(/#\/$/);


    const articleLink = page.locator(`.article-preview:has-text("${updatedTitle || title}")`);
    await expect(articleLink).toHaveCount(0);

    await page.close();
  });
});
