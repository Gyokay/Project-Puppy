const chai = require('chai');
let expect = chai.expect;
const sinon =  require('sinon');

describe("Test thread data", () => {
  describe("Test get threads", () => {
    let data = require('../../app/data');
    let Thread = require('../../app/models/thread');
    it("Expect to return threads",(done)=>{
      let threads = ["First thread", "Second thread"];

      sinon.stub(Thread, "find", cb =>{
        cb(null, threads);
      });

      data.Thread.getAllThreads()
        .then((resultThreads)=>{
          expect(resultThreads).to.eql(threads);
          done();
        })
    })
  })
});