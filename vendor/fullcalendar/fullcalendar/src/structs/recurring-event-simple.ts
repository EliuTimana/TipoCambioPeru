import { startOfDay, addDays, DateMarker } from '../datelib/marker'
import { Duration, createDuration, subtractDurations } from '../datelib/duration'
import { arrayToHash } from '../util/object'
import { refineProps } from '../util/misc'
import { registerRecurringType, ParsedRecurring } from './recurring-event'
import { EventInput, EventDef } from './event'
import { DateRange, intersectRanges } from '../datelib/date-range'
import { DateEnv } from '../datelib/env'

/*
An implementation of recurring events that only supports every-day or weekly recurrences.
*/

interface SimpleRecurringData {
  daysOfWeek: number[] | null
  startTime: Duration | null
  endTime: Duration | null
  startRecur: DateMarker | null
  endRecur: DateMarker | null
}

interface SimpleParsedRecurring extends ParsedRecurring {
  typeData: SimpleRecurringData // the whole point is to make this more specific
}

registerRecurringType({

  parse(rawEvent: EventInput, allDayDefault: boolean | null, leftoverProps: any, dateEnv: DateEnv): SimpleParsedRecurring | null {
    let createMarker = dateEnv.createMarker.bind(dateEnv)
    let processors = {
      daysOfWeek: null,
      startTime: createDuration,
      endTime: createDuration,
      startRecur: createMarker,
      endRecur: createMarker
    }

    let props = refineProps(rawEvent, processors, {}, leftoverProps) as SimpleRecurringData
    let anyValid = false

    for (let propName in props) {
      if (props[propName] != null) {
        anyValid = true
        break
      }
    }

    let allDay

    if (props.startTime || props.endTime) {
      allDay = false
    } else if (allDayDefault != null) {
      allDay = allDayDefault
    } else {
      allDay = true
    }

    if (anyValid) {
      return {
        allDay,
        duration: (props.startTime && props.endTime) ?
          subtractDurations(props.endTime, props.startTime) :
          null,
        typeData: props // doesn't need endTime anymore but oh well
      }
    }

    return null
  },

  expand(typeData: SimpleRecurringData, eventDef: EventDef, framingRange: DateRange, dateEnv: DateEnv): DateMarker[] {
    let clippedFramingRange = intersectRanges(
      framingRange,
      { start: typeData.startRecur, end: typeData.endRecur }
    )

    if (clippedFramingRange) {
      return expandRanges(
        typeData.daysOfWeek,
        typeData.startTime,
        clippedFramingRange,
        dateEnv
      )
    } else {
      return []
    }
  }

})

function expandRanges(
  daysOfWeek: number[] | null,
  startTime: Duration | null,
  framingRange: DateRange,
  dateEnv: DateEnv
): DateMarker[] {
  let dowHash: { [num: string]: true } | null = daysOfWeek ? arrayToHash(daysOfWeek) : null
  let dayMarker = startOfDay(framingRange.start)
  let endMarker = framingRange.end
  let instanceStarts: DateMarker[] = []

  while (dayMarker < endMarker) {
    let instanceStart

    // if everyday, or this particular day-of-week
    if (!dowHash || dowHash[dayMarker.getUTCDay()]) {

      if (startTime) {
        instanceStart = dateEnv.add(dayMarker, startTime)
      } else {
        instanceStart = dayMarker
      }

      instanceStarts.push(instanceStart)
    }

    dayMarker = addDays(dayMarker, 1)
  }

  return instanceStarts
}
