describe("TimeFormatter", function() {
  var formatter

  beforeEach(function() {
    formatter = new TimeFormatter()
  })

  it("formats whole minutes", function() {
    expect(formatter.format(60)).toEqual("1:00")
  })

  it("formats half minutes", function() {
    expect(formatter.format(30)).toEqual("0:30")
  })

  it("formats with second padding", function() {
    expect(formatter.format(7)).toEqual("0:07")
  })
})
