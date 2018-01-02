import { fromEvent } from "rxjs/observable/fromEvent";
import "rxjs/add/operator/map";
import { Subscription } from "rxjs/Subscription";
import { Observer } from "rxjs/Observer";

export class CustomObserver {
  isSubscribed = true;
  subscription: Subscription;
  subscription2: Subscription;
  output: HTMLElement;
  output2: HTMLElement;

  constructor(buttonElementId: string, subscribeButtonId: string) {
    this.output = document.getElementById("output");
    this.output2 = document.getElementById("output2");

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
    const source = fromEvent(btn, "click").map(
      (event: Event) => `Event time: ${event.timeStamp}`
    );
    this.subscription = source.subscribe(new OutputObserver(this.output));
    this.subscription2 = source.subscribe(
      new ColoredOutputObserver(this.output2)
    );
  }

  unsubscribe() {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }
}

class OutputObserver implements Observer<string> {
  constructor(private output: HTMLElement) {}
  next(value: string) {
    this.output.innerHTML += `Clicked: ${value}<br />`;
  }
  error(err: any) {}
  complete() {}
}

class ColoredOutputObserver implements Observer<string> {
  constructor(private output: HTMLElement, private color: string = "#496ddb") {
    console.log("ctor:", output);
  }
  next(value: string) {
    this.output.innerHTML += `<span style='padding: 5px; border-radius: 20px; color: #fff; background: ${
      this.color
    }'>Clicked: ${value}</span><br />`;
  }
  error(err: any) {}
  complete() {}
}

export class FromObserverPageRunner {
  constructor(elementId: string, subscribeButtonId: string) {
    const runner = new CustomObserver(elementId, subscribeButtonId);
  }
}

let runner = new FromObserverPageRunner("myButton", "subscribeButton");
