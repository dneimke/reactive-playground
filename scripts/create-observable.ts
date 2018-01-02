import { fromEvent } from "rxjs/observable/fromEvent";
import { range } from "rxjs/observable/range";
import { Subscription } from "rxjs/Subscription";
import { Observer } from "rxjs/Observer";

export class CreateObserver {
  subscription: Subscription;

  constructor(buttonElementId: string, subscribeButtonId: string) {
    const output = document.getElementById("output");
    const btn = document.getElementById(buttonElementId) as HTMLButtonElement;

    let that = this;

    const source = fromEvent(btn, "click");
    this.subscription = source.subscribe({
      next(e: any) {
        that.runDemo(output);
      }
    });
  }

  runDemo(output: HTMLElement) {
    const source = range(1, 100);

    source.subscribe({
      next(value: number) {
        output.innerText += value === 100 ? value : `${value},`;

        if (value % 25 === 0) {
          output.innerHTML += `<br />`;
        }
      }
    });

    this.subscription.unsubscribe();
  }
}

export class CreateObserverPageRunner {
  constructor(elementId: string, subscribeButtonId: string) {
    const runner = new CreateObserver(elementId, subscribeButtonId);
  }
}

let runner = new CreateObserverPageRunner("myButton", "subscribeButton");
