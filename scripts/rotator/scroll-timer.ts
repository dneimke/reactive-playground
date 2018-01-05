import { Observable } from "rxjs/Observable";
import { Subject, Subscription } from "rxjs";
import { IRotatorMessage } from ".";

export class ScrollTimer {
  public tick$ = new Subject<number>();
  public complete$ = new Subject<{}>();
  public isPaused: boolean;

  private source: Observable<number>;
  private subscription: Subscription;

  private current: number = 0;

  constructor(private lower: number, private upper: number) {
    this.source = this.createSource(lower, upper);
  }

  private createSource(lower: number, upper: number): Observable<number> {
    let that = this;
    this.lower = lower;
    this.upper = upper;
    this.current = this.lower;
    const count = upper - lower;
    console.info(`[ScrollTimer] Creating source: `, count);

    return Observable.interval(1000).takeWhile(n => {
      console.info("[ScrollTimer] interval", n, count);
      return n < count;
    });
  }

  private createRestartSource(): Observable<number> {
    let that = this;
    this.lower = this.current;
    const count = this.upper - this.lower;
    console.info(`[ScrollTimer] Creating restart source: `, count);

    return Observable.interval(1000).takeWhile(n => {
      console.info("[ScrollTimer] r.interval", n, count);
      return n < count;
    });
  }

  public start(): void {
    let that = this;

    if (this.isPaused) {
      console.info(`[ScrollTimer] restart`);
      this.source = this.createRestartSource();
      this.isPaused = false;
    }

    console.info(
      `[ScrollTimer] create subscription`,
      this.current,
      this.lower,
      this.upper
    );
    this.subscription = this.source.subscribe({
      next(n: number) {
        const currentSeconds = n + 1;
        const v = that.lower + currentSeconds;
        that.current = v;

        console.info(`[ScrollTimer] tick`, currentSeconds, v, that.current);
        that.tick$.next(currentSeconds);
      },
      complete() {
        console.info(`[ScrollTimer] complete`);
        that.complete$.next();
      }
    });
  }

  public pause(): void {
    console.info("[ScrollTimer] pause");
    this.subscription.unsubscribe();
    this.isPaused = true;
  }

  public stop(): void {
    console.info("[ScrollTimer] stop");
    this.subscription.unsubscribe();
    this.isPaused = false;
    this.current = 0;
  }

  public nextMessage(message: IRotatorMessage) {
    this.source = this.createSource(message.start, message.end);
    this.start();
  }
}
