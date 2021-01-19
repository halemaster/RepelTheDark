const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');

describe('Colyseus Load', function() {
    let consolePrev;
    beforeEach(function() {
        consolePrev = console;
    });
    afterEach(function() {
        console = consolePrev;
    })
    it('join works', function() {
        console = {
            log: sinon.fake()
        };
        const main = proxyquire('../../../src/index.js', {
            'colyseus.js': {
              Client: sinon.fake.returns({
                  joinOrCreate: sinon.fake.returns({
                      then: function (func) {
                          func({
                              sessionId: 'I',
                              name: 'my_room'
                          });
                          return {
                              catch: sinon.fake()
                          };
                      }
                  })
              })
            }
        });
        sinon.assert.calledOnce(console.log);
        sinon.assert.calledWith(console.log, 'I', 'joined', 'my_room');
    });
    it('join fails', function() {
        const failureError = new Error('Failure to join!');
        console = {
            log: sinon.fake()
        };
        const main = proxyquire('../../../src/index.js', {
            'colyseus.js': {
              Client: sinon.fake.returns({
                  joinOrCreate: sinon.fake.returns({
                      then: function () {
                          return {
                              catch: function(func) {
                                  func(failureError);
                              }
                          };
                      }
                  })
              })
            }
        });
        sinon.assert.calledOnce(console.log);
        sinon.assert.calledWith(console.log, 'JOIN ERROR', failureError);
    });
});