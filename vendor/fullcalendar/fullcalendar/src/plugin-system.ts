import { reducerFunc } from './reducers/types'
import { eventDefParserFunc } from './structs/event'
import { eventDragMutationMassager, EventDropTransformers } from './interactions/EventDragging'
import { eventDefMutationApplier } from './structs/event-mutation'
import Calendar, { DatePointTransform, DateSpanTransform } from './Calendar'
import { dateSelectionJoinTransformer } from './interactions/DateSelecting'
import { ViewConfigInputHash } from './structs/view-config'
import { ViewSpecTransformer, ViewSpec } from './structs/view-spec'
import View, { ViewProps } from './View'
import { CalendarComponentProps } from './CalendarComponent'
import { isPropsValidTester } from './validation'
import { ExternalDefTransform } from './interactions-external/ExternalElementDragging'
import { EventResizeJoinTransforms } from './interactions/EventResizing'

// TODO: easier way to add new hooks? need to update a million things

export interface PluginDefInput {
  deps?: PluginDef[]
  reducers?: reducerFunc[]
  eventDefParsers?: eventDefParserFunc[]
  eventDragMutationMassagers?: eventDragMutationMassager[]
  eventDefMutationAppliers?: eventDefMutationApplier[]
  dateSelectionTransformers?: dateSelectionJoinTransformer[]
  datePointTransforms?: DatePointTransform[]
  dateSpanTransforms?: DateSpanTransform[]
  viewConfigs?: ViewConfigInputHash
  viewSpecTransformers?: ViewSpecTransformer[]
  viewPropsTransformers?: ViewPropsTransformerClass[]
  isPropsValid?: isPropsValidTester
  externalDefTransforms?: ExternalDefTransform[]
  eventResizeJoinTransforms?: EventResizeJoinTransforms[]
  viewContainerModifiers?: ViewContainerModifier[]
  eventDropTransformers?: EventDropTransformers[]
}

export interface PluginHooks {
  reducers: reducerFunc[]
  eventDefParsers: eventDefParserFunc[]
  eventDragMutationMassagers: eventDragMutationMassager[]
  eventDefMutationAppliers: eventDefMutationApplier[]
  dateSelectionTransformers: dateSelectionJoinTransformer[]
  datePointTransforms: DatePointTransform[]
  dateSpanTransforms: DateSpanTransform[]
  viewConfigs: ViewConfigInputHash // TODO: parse before gets to this step?
  viewSpecTransformers: ViewSpecTransformer[]
  viewPropsTransformers: ViewPropsTransformerClass[]
  isPropsValid: isPropsValidTester | null
  externalDefTransforms: ExternalDefTransform[]
  eventResizeJoinTransforms: EventResizeJoinTransforms[]
  viewContainerModifiers: ViewContainerModifier[]
  eventDropTransformers: EventDropTransformers[]
}

export interface PluginDef extends PluginHooks {
  id: string
  deps: PluginDef[]
}

export type ViewPropsTransformerClass = new() => ViewPropsTransformer

export interface ViewPropsTransformer {
  transform(viewProps: ViewProps, viewSpec: ViewSpec, calendarProps: CalendarComponentProps, view: View): any
}

export type ViewContainerModifier = (contentEl: HTMLElement, calendar: Calendar) => void


let uid = 0

export function createPlugin(input: PluginDefInput): PluginDef {
  return {
    id: String(uid++),
    deps: input.deps || [],
    reducers: input.reducers || [],
    eventDefParsers: input.eventDefParsers || [],
    eventDragMutationMassagers: input.eventDragMutationMassagers || [],
    eventDefMutationAppliers: input.eventDefMutationAppliers || [],
    dateSelectionTransformers: input.dateSelectionTransformers || [],
    datePointTransforms: input.datePointTransforms || [],
    dateSpanTransforms: input.dateSpanTransforms || [],
    viewConfigs: input.viewConfigs || {},
    viewSpecTransformers: input.viewSpecTransformers || [],
    viewPropsTransformers: input.viewPropsTransformers || [],
    isPropsValid: input.isPropsValid || null,
    externalDefTransforms: input.externalDefTransforms || [],
    eventResizeJoinTransforms: input.eventResizeJoinTransforms || [],
    viewContainerModifiers: input.viewContainerModifiers || [],
    eventDropTransformers: input.eventDropTransformers || []
  }
}

export class PluginSystem {

  hooks: PluginHooks
  addedHash: { [pluginId: string]: true }

  constructor() {
    this.hooks = {
      reducers: [],
      eventDefParsers: [],
      eventDragMutationMassagers: [],
      eventDefMutationAppliers: [],
      dateSelectionTransformers: [],
      datePointTransforms: [],
      dateSpanTransforms: [],
      viewConfigs: {},
      viewSpecTransformers: [],
      viewPropsTransformers: [],
      isPropsValid: null,
      externalDefTransforms: [],
      eventResizeJoinTransforms: [],
      viewContainerModifiers: [],
      eventDropTransformers: []
    }
    this.addedHash = {}
  }

  add(plugin: PluginDef) {
    if (!this.addedHash[plugin.id]) {
      this.addedHash[plugin.id] = true

      for (let dep of plugin.deps) {
        this.add(dep)
      }

      this.hooks = combineHooks(this.hooks, plugin)
    }
  }

}

function combineHooks(hooks0: PluginHooks, hooks1: PluginHooks): PluginHooks {
  return {
    reducers: hooks0.reducers.concat(hooks1.reducers),
    eventDefParsers: hooks0.eventDefParsers.concat(hooks1.eventDefParsers),
    eventDragMutationMassagers: hooks0.eventDragMutationMassagers.concat(hooks1.eventDragMutationMassagers),
    eventDefMutationAppliers: hooks0.eventDefMutationAppliers.concat(hooks1.eventDefMutationAppliers),
    dateSelectionTransformers: hooks0.dateSelectionTransformers.concat(hooks1.dateSelectionTransformers),
    datePointTransforms: hooks0.datePointTransforms.concat(hooks1.datePointTransforms),
    dateSpanTransforms: hooks0.dateSpanTransforms.concat(hooks1.dateSpanTransforms),
    viewConfigs: { ...hooks0.viewConfigs, ...hooks1.viewConfigs },
    viewSpecTransformers: hooks0.viewSpecTransformers.concat(hooks1.viewSpecTransformers),
    viewPropsTransformers: hooks0.viewPropsTransformers.concat(hooks1.viewPropsTransformers),
    isPropsValid: hooks1.isPropsValid || hooks0.isPropsValid,
    externalDefTransforms: hooks0.externalDefTransforms.concat(hooks1.externalDefTransforms),
    eventResizeJoinTransforms: hooks0.eventResizeJoinTransforms.concat(hooks1.eventResizeJoinTransforms),
    viewContainerModifiers: hooks0.viewContainerModifiers.concat(hooks1.viewContainerModifiers),
    eventDropTransformers: hooks0.eventDropTransformers.concat(hooks1.eventDropTransformers)
  }
}
