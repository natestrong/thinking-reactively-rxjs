"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskProgressService = void 0;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var TaskProgressService = /** @class */ (function () {
    function TaskProgressService() {
        /**
         * Everything below is private
         * @private
         */
        this.taskStarts = new rxjs_1.Subject();
        this.taskCompletions = new rxjs_1.Subject();
        var loadUp = this.taskStarts.pipe(operators_1.mapTo(1));
        var loadDown = this.taskCompletions.pipe(operators_1.mapTo(-1));
        var loadVariations = rxjs_1.merge(loadUp, loadDown);
        // Need to keep a running count of emissions
        var currentLoadCount = loadVariations.pipe(operators_1.startWith(0), operators_1.scan(function (totalCurrent, changeInLoads) {
            return Math.max(totalCurrent + changeInLoads, 0);
        }), operators_1.distinctUntilChanged(), operators_1.shareReplay({ bufferSize: 1, refCount: true }));
        /**
         * When does the loader need to hide?
         * When the count of async tasks goes to 0.
         */
        var shouldHideSpinner = currentLoadCount.pipe(operators_1.filter(function (count) { return count === 0; }));
        /**
         * When does the loader need to show?
         * When the count of async tasks goes from 0 to 1.
         */
        var shouldShowSpinner = currentLoadCount.pipe(
        // pairwise operator emits a tuple of previous value and current value
        operators_1.pairwise(), operators_1.filter(function (_a) {
            var prev = _a[0], current = _a[1];
            return prev === 0 && current === 1;
        }), operators_1.switchMap(function () { return rxjs_1.timer(2000).pipe(operators_1.takeUntil(shouldHideSpinner)); }));
        /**
         * When the spinner needs to show, show it!
         */
        this.showSpinner = rxjs_1.merge(shouldShowSpinner.pipe(operators_1.mapTo(true)), shouldHideSpinner.pipe(operators_1.mapTo(false)));
    }
    TaskProgressService.prototype.newTaskStarted = function () {
        this.taskStarts.next();
    };
    TaskProgressService.prototype.existingTaskCompleted = function () {
        this.taskCompletions.next();
    };
    return TaskProgressService;
}());
exports.TaskProgressService = TaskProgressService;
//# sourceMappingURL=taskProgressService.js.map