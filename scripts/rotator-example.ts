import { Observable } from "rxjs/Observable";
import { RotatorComponent, IRotatorMessage } from "./rotator";

export class RotatorExample {
  isComplete: boolean;

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
      { content: "Clip 1", start: 0, end: 5, duration: 5 },
      { content: "Clip 2", start: 20, end: 23, duration: 3 },
      { content: "Clip 3", start: 31, end: 35, duration: 4 },
      { content: "Clip 4", start: 47, end: 55, duration: 8 },
      { content: "Clip 5", start: 59, end: 61, duration: 2 }
    ];

    const component = new RotatorComponent(items);

    component.selectedMessage$.subscribe((args: any) => {
      messageOutput.innerHTML = `
            <em>${args.message.content}</em>
        `;

      let selectedIndex = args.selectedIndex + 1;
      console.info("[RotatorExample] selectedMessage$ ", args);
      for (let i = 1; i <= 5; i++) {
        const txt = selectedIndex === i ? "*" : "";
        let el = document.getElementById(`msg${i}`);
        el.innerText = txt;
        console.info(el);
      }

      // <p>Start: ${message.start}; End: ${message.end}</p>

      timingOutput.innerHTML = `<em>${0}</em>`;
    });

    component.completed$.subscribe(() => (this.isComplete = true));

    component.tick$.subscribe((seconds: number) => {
      timingOutput.innerHTML = `<em>${seconds}</em>`;
    });

    Observable.fromEvent(btnStart, "click").subscribe(e => {
      console.info(`[Page] start`);

      if (this.isComplete) {
        messageOutput.innerHTML = "";
        timingOutput.innerHTML = "";
        this.isComplete = false;
      }

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
