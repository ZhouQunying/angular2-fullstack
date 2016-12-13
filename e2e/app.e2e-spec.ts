import { Angular2FullstackPage } from './app.po';

describe('angular2-fullstack App', function() {
  let page: Angular2FullstackPage;

  beforeEach(() => {
    page = new Angular2FullstackPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
