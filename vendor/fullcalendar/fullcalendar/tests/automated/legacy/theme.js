describe('theme', function() {

  pushOptions({
    defaultView: 'agendaWeek'
  })

  it('can be changed dynamically', function() {
    initCalendar()

    expect($('.fc')).toHaveClass('fc-unthemed')
    expect($('.fc')).not.toHaveClass('ui-widget')
    expect($('.fc-toolbar button .fc-icon').length).toBeGreaterThan(0)
    expect($('.fc-toolbar button .ui-icon').length).toBe(0)
    expect($('.ui-widget-header').length).toBe(0)

    $('.fc-scroller').scrollTop(99999) // scroll all the way down
    var scrollTop = $('.fc-scroller').scrollTop()

    // change option!
    currentCalendar.setOption('theme', true)

    expect($('.fc')).toHaveClass('ui-widget')
    expect($('.fc')).not.toHaveClass('fc-unthemed')
    expect($('.fc-toolbar button .fc-icon').length).toBe(0)
    expect($('.fc-toolbar button .ui-icon').length).toBeGreaterThan(0)
    expect($('.ui-widget-header').length).toBeGreaterThan(0)

    // similar scroll state after the change
    expect(Math.abs(scrollTop - $('.fc-scroller').scrollTop())).toBeLessThan(5)
  })


  // this tests the options setter with a single hash argument.
  // TODO: not best place for this.
  it('can be change with other options', function() {
    initCalendar()

    expect($('.fc')).toHaveClass('fc-unthemed')
    expect($('.fc')).not.toHaveClass('ui-widget')
    expect($('.fc-nonbusiness').length).toBe(0)

    // change option!
    currentCalendar.batchRendering(function() {
      currentCalendar.setOption('theme', true)
      currentCalendar.setOption('businessHours', true)
    })

    expect($('.fc')).toHaveClass('ui-widget')
    expect($('.fc')).not.toHaveClass('fc-unthemed')
    expect($('.fc-nonbusiness').length).toBeGreaterThan(0)
  })

})
