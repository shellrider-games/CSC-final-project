import Actor from '../engineSrc/actor';
import StaticBody from '../engineSrc/staticBody.js';

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

test("StaticBody returns an axis aligned Bounding Box that per default is at (x,y) with dimensions (width,height)", () => {
    const testStaticBody = new StaticBody(100,100,50,50);
    expect(testStaticBody.getBoundingBox()).toEqual({
        x:100,
        y:100,
        width: 50,
        height: 50,
    });
})