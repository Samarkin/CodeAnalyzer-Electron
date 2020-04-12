import 'should';
import {CodeFolder} from "./CodeFolder";

describe("CodeFolder", function() {
  it('can initialize', function() {
    var c = new CodeFolder({
      path: '/',
      totalFiles: 10,
      filesByExt: {}
    });
    c.path.should.equal('/');
  })
});