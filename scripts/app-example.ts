import { Subscription } from "rxjs/Subscription";
import * as Rx from "rxjs/Rx";
import { Observer } from "rxjs/Observer";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

export class AppExample {
  constructor(buttonElementId: string, subscribeButtonId: string) {
    const output = document.getElementById("output");
    const output2 = document.getElementById("output2");
    const btn = document.getElementById(buttonElementId) as HTMLButtonElement;

    let stateService = new StateService();

    const source = Rx.Observable.fromEvent(btn, "click");
    source.subscribe({
      next(e: any) {
        stateService.increment();
      }
    });

    const dataSource = stateService.getDataSource();

    const subscription1 = dataSource.subscribe((value: number) => {
      console.info(value);
      output.innerHTML += `<span class='item-pill red'>${value}</span>`;

      if (value % 25 === 0) {
        output.innerHTML += `<br />`;
      }
    });

    const subscription2 = dataSource
      .filter(e => e % 2 == 0)
      .subscribe((value: number) => {
        output2.innerHTML += `<span class='item-pill blue'>${value}</span>`;

        if (value % 10 === 0) {
          output2.innerHTML += `<br />`;
        }
      });
  }
}

class StateService {
  private state: number[] = [];
  private dataSource = new Subject<number>();

  constructor() {}

  increment() {
    const val = this.state.length + 1;
    this.state.push(val);
    this.dataSource.next(val);
  }

  getDataSource(): Observable<number> {
    return this.dataSource.asObservable();
  }

  getData(): number[] {
    return this.state;
  }
}

export class AppExamplePageRunner {
  constructor(elementId: string, subscribeButtonId: string) {
    const runner = new AppExample(elementId, subscribeButtonId);
  }
}

let runner = new AppExamplePageRunner("myButton", "subscribeButton");
