import { expect, test } from '@jest/globals';
import { async } from 'regenerator-runtime';
import ShellAudioSystem from '../shellAudioSystem.js'

test("Can create AudioSystem",() => {
    const testSystem = new ShellAudioSystem();
    expect(testSystem).toBeInstanceOf(ShellAudioSystem);
});