import ArticlesPage from '../pages/ArticlesPage';
import ArticleFormPage from '../pages/ArticleFormPage';
import ArticleViewPage from '../pages/ArticleViewPage';
import LoginPage from '../pages/LoginPage';
import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

test.describe.serial('Работа со статьями', () => {
  let articlesPage, articleFormPage, articleViewPage;
  let loginPage;
  let title, description, body, tags;
  let updatedTitle, updatedBody;
  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();

    title = `Статья ${Math.floor(Math.random() * 10000)}`;
    description = 'Описание статьи';
    body = 'Текст статьи';
    tags = 'test,automation';
    updatedTitle = `${title} (обновлено)`;
    updatedBody = 'Обновленный текст статьи';

    articlesPage = new ArticlesPage(page);
    articleFormPage = new ArticleFormPage(page);
    articleViewPage = new ArticleViewPage(page);

    loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
  });

  test('Создание новой статьи', async () => {
    await articlesPage.goto();
    await articlesPage.clickCreateArticle();

    await expect(page).toHaveURL(articleFormPage.editorPageURL);

    await articleFormPage.fillArticle({ title, description, body, tags });

    await expect(articleViewPage.title).toBeVisible();
  });

  test('Проверка появления статьи в списке и просмотр', async () => {
    await articlesPage.goto();
    await articlesPage.clickGlobalFeedTab();

    await articlesPage.openArticleByTitle(title);

    await expect(articleViewPage.title).toHaveText(title);
    await expect(articleViewPage.body).toContainText(body);
  });

  test('Добавление статьи в избранное со списка статей', async () => {
    await articlesPage.goto();
    await articlesPage.clickGlobalFeedTab();

    await articlesPage.toggleFavorite(title);

    expect(await articlesPage.isArticleFavorited(title)).toBe(true);
  });

  test('Удаление статьи из избранного со списка статей', async () => {
    await articlesPage.goto();
    await articlesPage.clickGlobalFeedTab();

    expect(await articlesPage.isArticleFavorited(title)).toBe(true);

    await articlesPage.toggleFavorite(title);

    expect(await articlesPage.isArticleFavorited(title)).toBe(false);
  });

  test('Редактирование заголовка и содержимого статьи', async () => {
    await articlesPage.goto();
    await articlesPage.clickGlobalFeedTab();

    await articlesPage.openArticleByTitle(title);
    await articleViewPage.clickEdit();

    await articleFormPage.fillArticle({ title: updatedTitle, description, body: updatedBody, tags });

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

    await articlesPage.assertTitleNotExist(updatedTitle, title);
  
    await page.close();
  });
});
