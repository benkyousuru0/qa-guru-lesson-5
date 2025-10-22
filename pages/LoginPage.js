import { test, expect } from '@playwright/test';

class LoginPage {
  constructor(page) {
    this.page = page;
    this.url = 'https://realworld.qa.guru/#/login';
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.signInButton = page.locator('button.btn.btn-lg.pull-xs-right.btn-primary');
  }

  async goto() {
    await this.page.goto(this.url);
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }
}

module.exports = LoginPage;
