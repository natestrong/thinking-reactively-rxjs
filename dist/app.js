"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var taskProgressService_1 = require("./taskProgressService");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
window.onload = function () {
    var taskProgressService = new taskProgressService_1.TaskProgressService();
    var spinner = document.getElementById('spinner');
    // buttons
    var slowButton = document.getElementById('slow-task');
    var verySlowButton = document.getElementById('very-slow-task');
    var fastButton = document.getElementById('fast-task');
    var veryFastButton = document.getElementById('very-fast-task');
    // buttonEvents
    var onSlowButton = rxjs_1.fromEvent(slowButton, 'click');
    var onVerySlowButton = rxjs_1.fromEvent(verySlowButton, 'click');
    var onFastButton = rxjs_1.fromEvent(fastButton, 'click');
    var onVeryFastButton = rxjs_1.fromEvent(veryFastButton, 'click');
    // button observables
    onSlowButton.pipe(operators_1.tap(function () { return taskProgressService.newTaskStarted(); }), operators_1.delay(6000), operators_1.tap(function () { return taskProgressService.existingTaskCompleted(); })).subscribe();
    onVerySlowButton.pipe(operators_1.tap(function () { return taskProgressService.newTaskStarted(); }), operators_1.delay(3000), operators_1.tap(function () { return taskProgressService.existingTaskCompleted(); })).subscribe();
    onFastButton.pipe(operators_1.tap(function () { return taskProgressService.newTaskStarted(); }), operators_1.delay(600), operators_1.tap(function () { return taskProgressService.existingTaskCompleted(); })).subscribe();
    onVeryFastButton.pipe(operators_1.tap(function () { return taskProgressService.newTaskStarted(); }), operators_1.delay(300), operators_1.tap(function () { return taskProgressService.existingTaskCompleted(); })).subscribe();
    taskProgressService.showSpinner.subscribe(toggleSpinner);
    function toggleSpinner(show) {
        if (show) {
            console.log('show');
            spinner.style.display = 'block';
        }
        else {
            console.log('hide');
            spinner.style.display = 'none';
        }
    }
};
//# sourceMappingURL=app.js.map