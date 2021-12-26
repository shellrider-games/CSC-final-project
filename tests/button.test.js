import ShellriderButton from '../shellriderUIKit/button.js';
import { expect, test } from '@jest/globals';

test("Can create Button",() => {
    const testButton = new ShellriderButton();
    expect(testButton).toBeInstanceOf(ShellriderButton);
});
