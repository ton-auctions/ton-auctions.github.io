import { describe, it } from "jsr:@std/testing/bdd";
import { Mutex } from "./mutex.ts";
import { expect } from "jsr:@std/expect";

describe("Mutex test", () => {
  it("Allows to lock", async () => {
    const lock = new Mutex();
    let locked = false;
    setTimeout(() => expect(locked).toBe(true), 10);
    await lock.lock();
    locked = true;
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 11));
  });

  it("Does not allow to lock if locked", async () => {
    const lock = new Mutex();
    await lock.lock();

    let locked = false;
    let cancel: () => void;

    new Promise<void>((resolve) => {
      cancel = resolve;
      lock.lock().then(() => {
        locked = true;
      });
    });

    const assert = new Promise<void>((resolve) =>
      setTimeout(() => {
        expect(locked).toBe(false);
        cancel();
        resolve();
      }, 100)
    );

    await assert;
  });

  it("Does allow to unlock if locked", async () => {
    const lock = new Mutex();
    const unlock = await lock.lock();

    let locked = false;

    const tryLock = new Promise<void>((resolve) => {
      lock.lock().then(() => {
        locked = true;
        resolve();
      });
    });

    const assert = new Promise<void>((resolve) =>
      setTimeout(() => {
        expect(locked).toBe(false);
        unlock();
        resolve();
      }, 100)
    );

    await assert;
    await tryLock;
    expect(locked).toBe(true);
  });
});
