import { expect, test } from '@jest/globals';
import Actor from '../engineSrc/actor';
import ShellriderEngine from '../engineSrc/shellriderEngine';

beforeAll(() => {
    jest.spyOn(global.console, 'error').mockImplementation(() => {});
  });
  afterAll(() => {
    global.console.error.mockRestore();
  });

test("Add actor adds actor to engine actors list", () => {
    const testEngine = new ShellriderEngine(null);
    const testActor = new Actor();
    testEngine.addActor(testActor);
    expect(testEngine.actors).toStrictEqual([testActor]);
});

test("Adding anything but an actor does not add to actor list but logs error", () => {
    const testEngine = new ShellriderEngine(null);
    testEngine.addActor(2);
    testEngine.addActor({});
    testEngine.addActor("hello");
    expect(console.error).toHaveBeenCalledTimes(3);
    expect(testEngine.actors).toStrictEqual([]);
});