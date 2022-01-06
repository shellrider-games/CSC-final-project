import Sprite from "../engineSrc/sprite";

test("Can create spirte",() => {
    const testSprite = new Sprite();
    expect(testSprite).toBeInstanceOf(Sprite);
});