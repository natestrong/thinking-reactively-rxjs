import {merge, Observable, Subject, timer} from "rxjs";
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

export class TaskProgressService {
    public showSpinner: Observable<boolean>

    public newTaskStarted() {
        this.taskStarts.next()
    }

    public existingTaskCompleted() {
        this.taskCompletions.next()
    }

    /**
     * Everything below is private
     * @private
     */
    private taskStarts = new Subject()
    private taskCompletions = new Subject()

    constructor() {
        const loadUp = this.taskStarts.pipe(mapTo(1))
        const loadDown = this.taskCompletions.pipe(mapTo(-1))
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
            filter(([prev, current]) => prev === 0 && current === 1),
            switchMap(() => timer(2000).pipe(takeUntil(shouldHideSpinner)))
        )

        /**
         * When the spinner needs to show, show it!!
         */
        this.showSpinner = merge(
            shouldShowSpinner.pipe(mapTo(true)),
            shouldHideSpinner.pipe(mapTo(false))
        )
    }
}
