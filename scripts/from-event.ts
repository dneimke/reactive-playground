import { fromEvent } from "rxjs/observable/fromEvent";
import "rxjs/add/operator/map";
import { Subscription } from "rxjs/Subscription";

export class FromEvent {
  isSubscribed = true;
  subscription: Subscription;
  output: HTMLElement;

  constructor(buttonElementId: string, subscribeButtonId: string) {
    this.output = document.getElementById("output");

    const btn = document.getElementById(buttonElementId) as HTMLButtonElement;
    this.subscribe(btn);

    const subscribeButton = document.getElementById(
      subscribeButtonId
    ) as HTMLButtonElement;

    fromEvent(subscribeButton, "click").subscribe(e => {
      if (this.isSubscribed) {
        this.unsubscribe();
        subscribeButton.innerText = "Subscribe";
      } else {
        this.subscribe(btn);
        subscribeButton.innerText = "Unsubscribe";
      }
      this.isSubscribed = !this.isSubscribed;
    });
  }

  subscribe(btn: HTMLButtonElement) {
    let that = this;
    const source = fromEvent(btn, "click").map(
      (event: Event) => `Event time: ${event.timeStamp}`
    );
    this.subscription = source.subscribe(
      value => (that.output.innerHTML += `Clicked: ${value}<br />`)
    );
  }

  unsubscribe() {
    this.subscription.unsubscribe();
  }
}

export class FromEventPageRunner {
  constructor(elementId: string, subscribeButtonId: string) {
    const runner = new FromEvent(elementId, subscribeButtonId);
  }
}

let runner = new FromEventPageRunner("myButton", "subscribeButton");
