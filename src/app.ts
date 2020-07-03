import {merge, Observable} from "rxjs";
import {
    distinctUntilChanged,
    filter,
    mapTo,
    pairwise,
    scan,
    shareReplay,
    startWith,
    switchMap,
    takeUntil
} from "rxjs/operators";

/**
 * How do we count?
 * Start from zero
 * When an async task start, increase the count by 1
 * When a task ends, decrease the count by 1
 */

const taskStarts = new Observable()
const taskCompletions = new Observable()
const showSpinner = new Observable()

const loadUp = taskStarts.pipe(mapTo(1))
const loadDown = taskCompletions.pipe(mapTo(-1))

// ################################################# //
const loadVariations = merge(loadUp, loadDown)

// Need to keep a running count of emissions
const currentLoadCount = loadVariations.pipe(
    startWith(0),
    scan((totalCurrent, changeInLoads) => {
        return Math.max(totalCurrent + changeInLoads, 0)
    }),
    distinctUntilChanged(),
    shareReplay({bufferSize: 1, refCount: true})
)


// ################################################# //
/**
 * When does the loader need to hide?
 * When the count of async tasks goes to 0.
 */

const shouldHideSpinner = currentLoadCount.pipe(
    filter(count => count === 0)
)

/**
 * When does the loader need to show?
 * When the count of async tasks goes from 0 to 1.
 */

const shouldShowSpinner = currentLoadCount.pipe(
    // pairwise operator emits a tuple of previous value and current value
    pairwise(),
    filter(([prev, current]) => prev === 0 && current === 1)
)

// ################################################# //
/**
 * When the spinner needs to show, show it!
 */

shouldShowSpinner.pipe(
    switchMap(() => showSpinner.pipe(takeUntil(shouldHideSpinner)))
).subscribe()

