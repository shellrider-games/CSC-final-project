import Actor from '../actor.js';
import StaticBody from '../staticBody.js';

test("Can create StaticBody", () => {
    const testStaticBody = new StaticBody();

    expect(testStaticBody).toBeInstanceOf(Actor);
    expect(testStaticBody).toBeInstanceOf(StaticBody);
});

test("StaticBody has position (x,y) and dimensions (width, height)", () => {
    const testStaticBody = new StaticBody();
    expect(testStaticBody.position).toEqual({
        x:0,
        y:0,
    });
    expect(testStaticBody.dimensions).toEqual({
        width:10,
        height:10,
    });
});