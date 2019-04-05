import { createInitialStateFactory } from './entity_state'
import { Comparer, EntityAdapter, EntityDefinition, IdSelector } from './models'
import { createSortedStateAdapter } from './sorted_state_adapter'
import { createSelectorsFactory } from './state_selectors'
import { createUnsortedStateAdapter } from './unsorted_state_adapter'

export function createEntityAdapter<T>(
  options: {
    selectId?: IdSelector<T>
    sortComparer?: false | Comparer<T>
  } = {},
): EntityAdapter<T> {
  const { selectId, sortComparer }: EntityDefinition<T> = {
    sortComparer: false,
    selectId: (instance: any) => instance.id,
    ...options,
  }

  const stateFactory = createInitialStateFactory<T>()
  const selectorsFactory = createSelectorsFactory<T>()
  const stateAdapter = sortComparer
    ? createSortedStateAdapter(selectId, sortComparer)
    : createUnsortedStateAdapter(selectId)

  return {
    selectId,
    sortComparer,
    ...stateFactory,
    ...selectorsFactory,
    ...stateAdapter,
  }
}
