import { formatIsoTimeZoneOffset } from '../datelib/utils'

describe('events as a json feed', function() {

  pushOptions({
    defaultDate: '2014-05-01',
    defaultView: 'month'
  })

  beforeEach(function() {
    XHRMock.setup()
  })

  afterEach(function() {
    XHRMock.teardown()
  })

  it('requests correctly when local timezone', function(done) {
    const START = '2014-04-27T00:00:00'
    const END = '2014-06-08T00:00:00'

    XHRMock.get(/^my-feed\.php/, function(req, res) {
      expect(req.url().query).toEqual({
        start: START + formatIsoTimeZoneOffset(new Date(START)),
        end: END + formatIsoTimeZoneOffset(new Date(END))
      })
      done()
      return res.status(200).header('content-type', 'application/json').body('[]')
    })

    initCalendar({
      events: 'my-feed.php',
      timeZone: 'local'
    })
  })

  it('requests correctly when UTC timezone', function(done) {

    XHRMock.get(/^my-feed\.php/, function(req, res) {
      expect(req.url().query).toEqual({
        start: '2014-04-27T00:00:00Z',
        end: '2014-06-08T00:00:00Z',
        timeZone: 'UTC'
      })
      done()
      return res.status(200).header('content-type', 'application/json').body('[]')
    })

    initCalendar({
      events: 'my-feed.php',
      timeZone: 'UTC'
    })
  })

  it('requests correctly when named timezone', function(done) {

    XHRMock.get(/^my-feed\.php/, function(req, res) {
      expect(req.url().query).toEqual({
        start: '2014-04-27T00:00:00',
        end: '2014-06-08T00:00:00',
        timeZone: 'America/Chicago'
      })
      done()
      return res.status(200).header('content-type', 'application/json').body('[]')
    })

    initCalendar({
      events: 'my-feed.php',
      timeZone: 'America/Chicago'
    })
  })

  it('requests correctly with event source extended form', function(done) {

    XHRMock.get(/^my-feed\.php/, function(req, res) {
      expect(req.url().query).toEqual({
        start: '2014-04-27T00:00:00',
        end: '2014-06-08T00:00:00',
        timeZone: 'America/Chicago'
      })
      return res.status(200).header('content-type', 'application/json').body(
        JSON.stringify([
          {
            title: 'my event',
            start: '2014-05-21'
          }
        ])
      )
    })

    initCalendar({
      eventSources: [ {
        url: 'my-feed.php',
        className: 'customeventclass'
      } ],
      timeZone: 'America/Chicago',
      eventRender: function(arg) {
        expect(arg.el).toHaveClass('customeventclass')
        done()
      }
    })
  })

  it('accepts a data object', function(done) {

    XHRMock.get(/^my-feed\.php/, function(req, res) {
      expect(req.url().query).toEqual({
        timeZone: 'UTC',
        start: '2014-04-27T00:00:00Z',
        end: '2014-06-08T00:00:00Z',
        customParam: 'yes'
      })
      done()
      return res.status(200).header('content-type', 'application/json').body('[]')
    })

    initCalendar({
      eventSources: [ {
        url: 'my-feed.php',
        data: {
          customParam: 'yes'
        }
      } ]
    })
  })

  it('accepts a dynamic data function', function(done) {

    XHRMock.get(/^my-feed\.php/, function(req, res) {
      expect(req.url().query).toEqual({
        timeZone: 'UTC',
        start: '2014-04-27T00:00:00Z',
        end: '2014-06-08T00:00:00Z',
        customParam: 'heckyeah'
      })
      done()
      return res.status(200).header('content-type', 'application/json').body('[]')
    })

    initCalendar({
      eventSources: [ {
        url: 'my-feed.php',
        data: function() {
          return {
            customParam: 'heckyeah'
          }
        }
      } ]
    })
  })

  it('calls loading callback', function(done) {
    var loadingCallArgs = []

    XHRMock.get(/^my-feed\.php/, function(req, res) {
      return res.status(200).header('content-type', 'application/json').body('[]')
    })

    initCalendar({
      events: { url: 'my-feed.php' },
      loading: function(bool) {
        loadingCallArgs.push(bool)
      },
      _eventsPositioned: function() {
        expect(loadingCallArgs).toEqual([ true, false ])
        done()
      }
    })
  })

  it('has and Event Source object with certain props', function() {

    XHRMock.get(/^my-feed\.php/, function(req, res) {
      return res.status(200).header('content-type', 'application/json').body('[]')
    })

    initCalendar({
      events: { url: 'my-feed.php' }
    })
    expect(currentCalendar.getEventSources()[0].url).toBe('my-feed.php')
  })

})
