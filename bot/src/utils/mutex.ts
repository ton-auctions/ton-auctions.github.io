export class Mutex {
  private _locked: boolean = false;
  private _waitList: (() => void)[] = [];

  async lock(): Promise<() => void> {
    const unlock = () => {
      this._locked = false;
      const unlock = this._waitList.pop();
      if (unlock) unlock();
    };

    if (this._locked) {
      await new Promise<void>((resolve) => {
        this._waitList.push(resolve);
      });
    }

    this._locked = true;
    return unlock;
  }
}
