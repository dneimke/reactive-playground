import { Observable } from "rxjs/Observable";
import { Subject, Subscription } from "rxjs";
import { IRotatorMessage } from ".";

export class ScrollTimer {
  public tick$ = new Subject<number>();
  public complete$ = new Subject<{}>();
  public isPaused: boolean;

  private source: Observable<number>;
  private subscription: Subscription;

  private current: number;

  constructor(private lower: number, private upper: number) {
    this.source = this.createSource(lower, upper);
  }

  private createSource(lower: number, upper: number): Observable<number> {
    const count = upper - lower;
    return Observable.interval(1000).takeWhile(n => n <= count);
  }

  private createRestartSource(): Observable<number> {
    const count = this.upper - this.current;
    return Observable.interval(1000).takeWhile(n => n <= count);
  }

  public start(): void {
    let that = this;

    if (this.isPaused) {
      console.info(`[ScrollTimer] restart`);
      this.source = this.createRestartSource();
      this.isPaused = false;
    } else {
      console.info(`[ScrollTimer] start`);
      this.current = this.lower;
    }

    that.tick$.next(this.current);

    this.subscription = this.source.subscribe({
      next(n: number) {
        console.info(`[ScrollTimer] tick`);
        const v = this.lower + n;
        that.current = v;
        that.tick$.next(v);
      },
      complete() {
        console.info(`[ScrollTimer] complete`);
        that.complete$.next();
      }
    });
  }

  public pause(): void {
    this.subscription.unsubscribe();
    this.isPaused = true;
  }

  public stop(): void {
    this.subscription.unsubscribe();
    this.isPaused = false;
    this.current = 0;
  }

  public nextMessage(message: IRotatorMessage) {
    this.source = this.createSource(message.start, message.end);
    this.start();
  }
}
