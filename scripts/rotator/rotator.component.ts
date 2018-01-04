import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs";

export class RotatorComponent {
  _isPlaying = false;
  selectedIndex = 0;

  public selectedMessage$ = new Subject<IMessage>();

  public get isPlaying() {
    return this._isPlaying;
  }

  public canMoveForward = () => this.selectedIndex < this.list.length - 1;
  public canMoveBack = () => this.selectedIndex > 0 || this.isPlaying;

  constructor(private list: IMessage[]) {
    if (!list || list.length == 0) {
      throw Error("Invalid list");
    }
  }

  start(): void {
    const message = this.list[this.selectedIndex];
    this.selectedMessage$.next(message);
  }

  pause(): void {}

  back(): void {}

  next(): void {}

  moveTo(index: number): void {
    if (index < 0 || index > this.list.length - 1) {
    }

    this.selectedIndex = index;
    // this.currentMessage = this.list[index];
  }
}

export interface IMessage {
  content: string;
  duration: number; // duration in seconds
}
