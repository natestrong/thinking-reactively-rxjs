import {TaskProgressService} from "./taskProgressService";
import {fromEvent, interval} from "rxjs";
import {delay, tap, timeInterval, timeout} from "rxjs/operators";


window.onload = () => {
    const taskProgressService = new TaskProgressService()
    const spinner = document.getElementById('spinner') as HTMLDivElement

    // buttons
    const slowButton = document.getElementById('slow-task') as HTMLButtonElement
    const verySlowButton = document.getElementById('very-slow-task') as HTMLButtonElement
    const fastButton = document.getElementById('fast-task') as HTMLButtonElement
    const veryFastButton = document.getElementById('very-fast-task') as HTMLButtonElement

    // buttonEvents
    const onSlowButton = fromEvent(slowButton, 'click')
    const onVerySlowButton = fromEvent(verySlowButton, 'click')
    const onFastButton = fromEvent(fastButton, 'click')
    const onVeryFastButton = fromEvent(veryFastButton, 'click')

    // button observables
    onSlowButton.pipe(
        tap(() => taskProgressService.newTaskStarted()),
        delay(6000),
        tap(() => taskProgressService.existingTaskCompleted())
    ).subscribe()

    onVerySlowButton.pipe(
        tap(() => taskProgressService.newTaskStarted()),
        delay(3000),
        tap(() => taskProgressService.existingTaskCompleted())
    ).subscribe()

    onFastButton.pipe(
        tap(() => taskProgressService.newTaskStarted()),
        delay(600),
        tap(() => taskProgressService.existingTaskCompleted())
    ).subscribe()

    onVeryFastButton.pipe(
        tap(() => taskProgressService.newTaskStarted()),
        delay(300),
        tap(() => taskProgressService.existingTaskCompleted())
    ).subscribe()

    taskProgressService.showSpinner.subscribe(toggleSpinner)

    function toggleSpinner(show: boolean): void {
        if (show) {
            console.log('show')
            spinner.style.display = 'block'
        } else {
            console.log('hide')
            spinner.style.display = 'none'
        }
    }
}
