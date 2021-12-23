import { expect, test } from '@jest/globals';
import ShellPhysicsEngine from '../shellPhysicsEngine.js';
import StaticBody from '../staticBody.js';

test("Can create PhysicsEngine",() => {
    const testEngine = new ShellPhysicsEngine();
    expect(testEngine).toBeInstanceOf(ShellPhysicsEngine);
});

test("Check if two bounding Boxes collide", () => {
    const testPhysicsEngine = new ShellPhysicsEngine();
    
    const bb1 = {x: 0, y: 0, width: 50, height: 50};
    const bb2 = {x: 10, y: 10, width: 10, height: 10};
    const bb3 = {x: 0, y: 30, width: 20, height: 20};

    expect(testPhysicsEngine.collideBB(bb1, bb2)).toBe(true);
    expect(testPhysicsEngine.collideBB(bb1,bb3)).toBe(true);
    expect(testPhysicsEngine.collideBB(bb2, bb3)).toBe(false);
});

test("Check if two staticBody collide", ()=> {
    const testPhysicsEngine = new ShellPhysicsEngine();

    const obj1 = new StaticBody(0, 0, 50, 50);
    const obj2 = new StaticBody(10, 10, 10, 10);
    const obj3 = new StaticBody(0, 30, 20, 20);

    expect(testPhysicsEngine.collide(obj1,obj2)).toBe(true);
    expect(testPhysicsEngine.collide(obj1,obj3)).toBe(true);
    expect(testPhysicsEngine.collide(obj3,obj2)).toBe(false);
})