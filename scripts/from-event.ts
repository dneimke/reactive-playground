import { fromEvent } from "rxjs/observable/fromEvent";
import { map } from "rxjs/operators/map";

export class FromEvent {
  constructor(buttonElementId: string) {
    const btn = document.getElementById("myButton") as HTMLButtonElement;
    const source = fromEvent(btn, "click");
    const example = source.subscribe(e => console.log("Clicked: ", e));
  }
}

export class FromEventPageRunner {
  constructor(elementId: string) {
    const runner = new FromEvent(elementId);
  }
}

let runner = new FromEventPageRunner("myButton");
