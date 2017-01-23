import { SparkMePage } from './app.po';

describe('sparkme App', function() {
  let page: SparkMePage;

  beforeEach(() => {
    page = new SparkMePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
