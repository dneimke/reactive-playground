import { Observable } from "rxjs/Observable";
import { Subject, Subscription } from "rxjs";
import { ScrollTimer } from "./scroll-timer";
import { IRotatorMessage } from "./rotator-message";

export class RotatorComponent {
  private _isPlaying = false;
  private selectedIndex = 0;
  private timer: ScrollTimer;

  public selectedMessage$ = new Subject<any>(); // {IRotatorMessage, number}
  public tick$ = new Subject<number>();
  public completed$ = new Subject<{}>();

  private timerComplete$: Subscription;
  private timerTick$: Subscription;

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
    this.selectedMessage$.next({ message, selectedIndex: this.selectedIndex });

    if (!this.timer) {
      console.info(
        "[RotatorComponent] creating new ScrollTimer",
        message.start,
        message.end
      );

      this.timer = new ScrollTimer(message.start, message.end);
    }

    this.timerComplete$ = this.timer.complete$.subscribe(() => {
      this.selectedIndex++;
      console.info("[RotatorComponent] handle complete", this.selectedIndex);
      if (this.selectedIndex < this.list.length) {
        const message = this.list[this.selectedIndex];
        this.selectedMessage$.next({
          message,
          selectedIndex: this.selectedIndex
        });
        this.timer.nextMessage(message);
      } else {
        this.selectedIndex = 0;
        this.completed$.next();
      }
    });

    this.timerTick$ = this.timer.tick$.subscribe(n => {
      this.tick$.next(n);
    });

    this.timer.start();
    this._isPlaying = true;
  }

  pause(): void {
    this.timerComplete$.unsubscribe();
    this.timerTick$.unsubscribe();
    this.timer.pause();
    this._isPlaying = false;
  }

  stop(): void {
    this.timer.stop();
    this.selectedIndex = 0;
    this._isPlaying = false;
    this.timerComplete$.unsubscribe();
    this.timerTick$.unsubscribe();
    this.timer = undefined;
    this.completed$.next();
  }

  back(): void {
    if (this.canMoveBack) {
      this.selectedIndex = this.isPlaying
        ? this.selectedIndex
        : this.selectedIndex - 1;
    }
    this.timer.stop();
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
