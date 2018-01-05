import { Observable } from "rxjs/Observable";
import { RotatorComponent, IRotatorMessage } from "./rotator";

export class RotatorExample {
  constructor() {
    const messageOutput = document.getElementById("messageOutput");
    const timingOutput = document.getElementById("timingOutput");

    const btnStart = document.getElementById("btnStart") as HTMLButtonElement;
    const btnPause = document.getElementById("btnPause") as HTMLButtonElement;
    const btnStop = document.getElementById("btnStop") as HTMLButtonElement;
    const btnPrevious = document.getElementById(
      "btnPrevious"
    ) as HTMLButtonElement;
    const btnNext = document.getElementById("btnNext") as HTMLButtonElement;

    const items: IRotatorMessage[] = [
      { content: "Message 1", start: 0, end: 5, duration: 5 },
      { content: "Message 2", start: 20, end: 23, duration: 3 },
      { content: "Message 3", start: 31, end: 35, duration: 4 },
      { content: "Message 4", start: 47, end: 55, duration: 8 },
      { content: "Message 5", start: 59, end: 61, duration: 2 }
    ];

    const component = new RotatorComponent(items);

    component.selectedMessage$.subscribe((message: IRotatorMessage) => {
      messageOutput.innerHTML = `
            <em>${message.content}</em>
            <p>Start: ${message.start}; End: ${message.end}</p>
        `;

      timingOutput.innerHTML = `<em>${0}</em>`;
    });

    component.tick$.subscribe((seconds: number) => {
      timingOutput.innerHTML = `<em>${seconds}</em>`;
    });

    Observable.fromEvent(btnStart, "click").subscribe(e => {
      console.info(`[Page] start`);
      component.start();
    });
    Observable.fromEvent(btnPause, "click").subscribe(e => {
      console.info(`[Page] pause`);
      component.pause();
    });
    Observable.fromEvent(btnStop, "click").subscribe(e => {
      console.info(`[Page] stop`);
      component.stop();
    });
    Observable.fromEvent(btnPrevious, "click").subscribe(e => {
      console.info(`[Page] back`);
      component.back();
    });
    Observable.fromEvent(btnNext, "click").subscribe(e => {
      console.info(`[Page] next`);
      component.next();
    });
  }
}

export class RotatorExamplePageRunner {
  constructor() {
    const runner = new RotatorExample();
  }
}

let runner = new RotatorExamplePageRunner();
