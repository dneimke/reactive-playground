import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs";
import { ScrollTimer } from "./scroll-timer";
import { IRotatorMessage } from "./rotator-message";

export class RotatorComponent {
  private _isPlaying = false;
  private selectedIndex = 0;
  private timer: ScrollTimer;

  public selectedMessage$ = new Subject<IRotatorMessage>();

  constructor(private list: IRotatorMessage[]) {
    if (!list || list.length == 0) {
      throw Error("Invalid list");
    }
  }

  public get isPlaying() {
    return this._isPlaying;
  }

  public canMoveForward = () => this.selectedIndex < this.list.length - 1;
  public canMoveBack = () => this.selectedIndex > 0 || this.isPlaying;

  start(): void {
    console.info(`[RotatorComponent] start`);
    const message = this.list[this.selectedIndex];
    this.selectedMessage$.next(message);

    this.timer = new ScrollTimer(message.start, message.end);
    this.timer.complete$.subscribe(() => {
      this.selectedIndex++;
      if (this.selectedIndex < this.list.length) {
        const message = this.list[this.selectedIndex];
        this.selectedMessage$.next(message);
        this.timer.nextMessage(message);
      }
    });

    this.timer.start();
    this._isPlaying = true;
  }

  pause(): void {
    this.timer.pause();
    this._isPlaying = false;
  }

  stop(): void {
    this.timer.stop();
    this.selectedIndex = 0;
    this._isPlaying = false;
  }

  back(): void {
    if (this.canMoveBack) {
      this.selectedIndex = this.isPlaying
        ? this.selectedIndex
        : this.selectedIndex - 1;
    }
    this.timer.stop();
    this.start();
  }

  next(): void {
    this.selectedIndex++;
    this.timer.stop();
    this.start();
  }

  moveTo(index: number): void {
    if (index < 0 || index > this.list.length - 1) {
      throw new Error(
        `Index ${index} was outside of the range 0 - ${this.list.length - 1}`
      );
    }

    this.selectedIndex = index;
    this.timer.stop();
    this.start();
  }
}
