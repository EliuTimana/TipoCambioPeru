import ElementDragging from '../dnd/ElementDragging'
import HitDragging, { Hit } from '../interactions/HitDragging'
import browserContext from '../common/browser-context'
import { PointerDragEvent } from '../dnd/PointerDragging'
import { parseEventDef, createEventInstance, EventTuple } from '../structs/event'
import { createEmptyEventStore, eventTupleToStore } from '../structs/event-store'
import * as externalHooks from '../exports'
import { DateSpan, DatePointApi } from '../structs/date-span'
import Calendar from '../Calendar'
import { EventInteractionState } from '../interactions/event-interaction-state'
import { DragMetaInput, DragMeta, parseDragMeta } from '../structs/drag-meta'
import EventApi from '../api/EventApi'
import { elementMatches } from '../util/dom-manip'
import { enableCursor, disableCursor } from '../util/misc'
import { isInteractionValid } from '../validation'
import View from '../View'
import { __assign } from 'tslib'

export type DragMetaGenerator = DragMetaInput | ((el: HTMLElement) => DragMetaInput)

export interface ExternalDropApi extends DatePointApi {
  draggedEl: HTMLElement
  jsEvent: UIEvent
  view: View
}


/*
Given an already instantiated draggable object for one-or-more elements,
Interprets any dragging as an attempt to drag an events that lives outside
of a calendar onto a calendar.
*/
export default class ExternalElementDragging {

  hitDragging: HitDragging
  receivingCalendar: Calendar | null = null
  droppableEvent: EventTuple | null = null // will exist for all drags, even if create:false
  suppliedDragMeta: DragMetaGenerator | null = null
  dragMeta: DragMeta | null = null

  constructor(dragging: ElementDragging, suppliedDragMeta?: DragMetaGenerator) {

    let hitDragging = this.hitDragging = new HitDragging(dragging, browserContext.componentHash)
    hitDragging.requireInitial = false // will start outside of a component
    hitDragging.emitter.on('dragstart', this.handleDragStart)
    hitDragging.emitter.on('hitupdate', this.handleHitUpdate)
    hitDragging.emitter.on('dragend', this.handleDragEnd)

    this.suppliedDragMeta = suppliedDragMeta
  }

  handleDragStart = (ev: PointerDragEvent) => {
    this.dragMeta = this.buildDragMeta(ev.subjectEl as HTMLElement)
  }

  buildDragMeta(subjectEl: HTMLElement) {
    if (typeof this.suppliedDragMeta === 'object') {
      return parseDragMeta(this.suppliedDragMeta)
    } else if (typeof this.suppliedDragMeta === 'function') {
      return parseDragMeta(this.suppliedDragMeta(subjectEl))
    } else {
      return getDragMetaFromEl(subjectEl)
    }
  }

  handleHitUpdate = (hit: Hit | null, isFinal: boolean, ev: PointerDragEvent) => {
    let { dragging } = this.hitDragging
    let receivingCalendar: Calendar | null = null
    let droppableEvent: EventTuple | null = null
    let isInvalid = false
    let interaction: EventInteractionState = {
      affectedEvents: createEmptyEventStore(),
      mutatedEvents: createEmptyEventStore(),
      isEvent: this.dragMeta!.create,
      origSeg: null
    }

    if (hit) {
      receivingCalendar = hit.component.calendar

      if (this.canDropElOnCalendar(ev.subjectEl as HTMLElement, receivingCalendar)) {

        droppableEvent = computeEventForDateSpan(
          hit.dateSpan,
          this.dragMeta!,
          receivingCalendar
        )

        interaction.mutatedEvents = eventTupleToStore(droppableEvent)
        isInvalid = !isInteractionValid(interaction, receivingCalendar)

        if (isInvalid) {
          interaction.mutatedEvents = createEmptyEventStore()
          droppableEvent = null
        }
      }
    }

    this.displayDrag(receivingCalendar, interaction)

    // show mirror if no already-rendered mirror element OR if we are shutting down the mirror (?)
    // TODO: wish we could somehow wait for dispatch to guarantee render
    dragging.setMirrorIsVisible(
      isFinal || !droppableEvent || !document.querySelector('.fc-mirror')
    )

    if (!isInvalid) {
      enableCursor()
    } else {
      disableCursor()
    }

    if (!isFinal) {
      dragging.setMirrorNeedsRevert(!droppableEvent)

      this.receivingCalendar = receivingCalendar
      this.droppableEvent = droppableEvent
    }
  }

  handleDragEnd = (pev: PointerDragEvent) => {
    let { receivingCalendar, droppableEvent } = this

    this.clearDrag()

    if (receivingCalendar && droppableEvent) {
      let finalHit = this.hitDragging.finalHit!
      let finalView = finalHit.component.view
      let dragMeta = this.dragMeta!
      let arg = receivingCalendar.buildDatePointApi(finalHit.dateSpan) as ExternalDropApi

      arg.draggedEl = pev.subjectEl as HTMLElement
      arg.jsEvent = pev.origEvent
      arg.view = finalView

      receivingCalendar.publiclyTrigger('drop', [ arg ])

      if (dragMeta.create) {
        receivingCalendar.dispatch({
          type: 'MERGE_EVENTS',
          eventStore: eventTupleToStore(droppableEvent)
        })

        if (pev.isTouch) {
          receivingCalendar.dispatch({
            type: 'SELECT_EVENT',
            eventInstanceId: droppableEvent.instance.instanceId
          })
        }

        // signal that an external event landed
        receivingCalendar.publiclyTrigger('eventReceive', [
          {
            draggedEl: pev.subjectEl,
            event: new EventApi(
              receivingCalendar,
              droppableEvent.def,
              droppableEvent.instance
            ),
            view: finalView
          }
        ])
      }
    }

    this.receivingCalendar = null
    this.droppableEvent = null
  }

  displayDrag(nextCalendar: Calendar | null, state: EventInteractionState) {
    let prevCalendar = this.receivingCalendar

    if (prevCalendar && prevCalendar !== nextCalendar) {
      prevCalendar.dispatch({ type: 'UNSET_EVENT_DRAG' })
    }

    if (nextCalendar) {
      nextCalendar.dispatch({ type: 'SET_EVENT_DRAG', state })
    }
  }

  clearDrag() {
    if (this.receivingCalendar) {
      this.receivingCalendar.dispatch({ type: 'UNSET_EVENT_DRAG' })
    }
  }

  canDropElOnCalendar(el: HTMLElement, receivingCalendar: Calendar): boolean {
    let dropAccept = receivingCalendar.opt('dropAccept')

    if (typeof dropAccept === 'function') {
      return dropAccept(el)
    } else if (typeof dropAccept === 'string' && dropAccept) {
      return Boolean(elementMatches(el, dropAccept))
    }

    return true
  }

}

// Utils for computing event store from the DragMeta
// ----------------------------------------------------------------------------------------------------

export type ExternalDefTransform = (dateSpan: DateSpan, dragMeta: DragMeta) => any

function computeEventForDateSpan(dateSpan: DateSpan, dragMeta: DragMeta, calendar: Calendar): EventTuple {
  let defProps = { ...dragMeta.leftoverProps }

  for (let transform of calendar.pluginSystem.hooks.externalDefTransforms) {
    __assign(defProps, transform(dateSpan, dragMeta))
  }

  let def = parseEventDef(
    defProps,
    dragMeta.sourceId,
    dateSpan.allDay,
    Boolean(dragMeta.duration), // hasEnd
    calendar
  )

  let start = dateSpan.range.start

  // only rely on time info if drop zone is all-day,
  // otherwise, we already know the time
  if (dateSpan.allDay && dragMeta.startTime) {
    start = calendar.dateEnv.add(start, dragMeta.startTime)
  }

  let end = dragMeta.duration ?
    calendar.dateEnv.add(start, dragMeta.duration) :
    calendar.getDefaultEventEnd(dateSpan.allDay, start)

  let instance = createEventInstance(def.defId, { start, end })

  return { def, instance }
}

// Utils for extracting data from element
// ----------------------------------------------------------------------------------------------------

function getDragMetaFromEl(el: HTMLElement): DragMeta {
  let str = getEmbeddedElData(el, 'event')
  let obj = str ?
    JSON.parse(str) :
    { create: false } // if no embedded data, assume no event creation

  return parseDragMeta(obj)
}

(externalHooks as any).dataAttrPrefix = ''

function getEmbeddedElData(el: HTMLElement, name: string): string {
  let prefix = (externalHooks as any).dataAttrPrefix
  let prefixedName = (prefix ? prefix + '-' : '') + name

  return el.getAttribute('data-' + prefixedName) || ''
}
