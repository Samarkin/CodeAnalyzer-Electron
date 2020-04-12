const Application = require('spectron').Application
require('should');

describe('Application launch', function () {
  this.timeout(10000)

  beforeEach(function () {
    this.app = new Application(this.electronAppOptions);
    return this.app.start()
  })

  afterEach(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  })

  it('shows an initial window', async function () {
    const count = await this.app.client.getWindowCount();
    count.should.equal(1);
    const title = await this.app.client.getTitle();
    title.should.equal("Code Analyzer");
  })
})