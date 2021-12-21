import Sprite from "../sprite.js";

test("Can create spirte",() => {
    const testSprite = new Sprite();
    expect(testSprite).toBeInstanceOf(Sprite);
});