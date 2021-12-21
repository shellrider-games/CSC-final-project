import { expect, test } from '@jest/globals'
import Actor from '../actor';
import ShellriderEngine from '../shellriderEngine'

test("Add actor adds actor to engine actors list", () => {
    const testEngine = new ShellriderEngine(null);
    const testActor = new Actor();
    testEngine.addActor(testActor);
    expect(testEngine.actors).toStrictEqual([testActor]);
});