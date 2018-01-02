import { Subscription } from "rxjs/Subscription";
import * as Rx from "rxjs/Rx";

export class IntervalOperator {
  subscription: Subscription;

  constructor(buttonElementId: string, subscribeButtonId: string) {
    const output = document.getElementById("output");
    const btn = document.getElementById(buttonElementId) as HTMLButtonElement;

    let that = this;

    const source = Rx.Observable.fromEvent(btn, "click");
    this.subscription = source.subscribe({
      next(e: any) {
        that.runDemo(output);
      }
    });
  }

  _runnerSource: Subscription;
  runDemo(output: HTMLElement) {
    if (this._runnerSource && !this._runnerSource.closed) {
      this._runnerSource.unsubscribe();
    }

    output.innerHTML = "";
    const source = Rx.Observable.interval(50)
      .take(100)
      .map(e => e + 1);

    this._runnerSource = source.subscribe((value: number) => {
      output.innerHTML += `<span class='digit-pill'>${value}</span>`;

      if (value % 25 === 0) {
        output.innerHTML += `<br />`;
      }
    });

    // this.subscription.unsubscribe();
  }
}

export class IntervalOperatorPageRunner {
  constructor(elementId: string, subscribeButtonId: string) {
    const runner = new IntervalOperator(elementId, subscribeButtonId);
  }
}

let runner = new IntervalOperatorPageRunner("myButton", "subscribeButton");
