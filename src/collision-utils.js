import Game from './game';

export function isColliding(entity1, entity2) {
    let x1 = entity1.x;
    let y1 = entity1.y;
    let w1 = entity1.w;
    let h1 = entity1.h;
    let x2 = entity2.x;
    let y2 = entity2.y;
    let w2 = entity2.w;
    let h2 = entity2.h;
    return (x1 < x2 + w2 && x1 + w1 > x2 &&
        y1 < y2 + h2 && h1 + y1 > y2);
}

export function willCollideY(entity1, div1VY, entity2) {
    let signOfVelocity = div1VY ? div1VY < 0 ? -1 : 1 : 0;
    let x1 = entity1.x;
    let moveUpForNegativeMovement = 0;
    if (signOfVelocity === -1) {
        moveUpForNegativeMovement = div1VY;
    }
    let y1 = entity1.y + moveUpForNegativeMovement;
    let w1 = entity1.w;
    let h1 = entity1.h + (div1VY * signOfVelocity);
    let x2 = entity2.x;
    let y2 = entity2.y;
    let w2 = entity2.w;
    let h2 = entity2.h;
    return (x1 < x2 + w2 && x1 + w1 > x2 &&
        y1 < y2 + h2 && h1 + y1 > y2);
}

export function willCollideXY(entity1, entity1VX, entity1VY, entity2) {
    let signOfVelocityX = entity1VX ? entity1VX < 0 ? -1 : 1 : 0;
    let signOfVelocityY = entity1VY ? entity1VY < 0 ? -1 : 1 : 0;
    let moveUpForNegativeMovementX = 0;
    if (signOfVelocityX === -1) {
        moveUpForNegativeMovementX = entity1VX;
    }
    let moveUpForNegativeMovementY = 0;
    if (signOfVelocityY === -1) {
        moveUpForNegativeMovementY = entity1VY;
    }
    
    let x1 = entity1.x + moveUpForNegativeMovementX;
    let y1 = entity1.y + moveUpForNegativeMovementY;
    let w1 = entity1.w + (entity1VX * signOfVelocityX);
    let h1 = entity1.h + (entity1VY * signOfVelocityY);
    let x2 = entity2.x;
    let y2 = entity2.y;
    let w2 = entity2.w;
    let h2 = entity2.h;

    return (x1 < x2 + w2 && x1 + w1 > x2 &&
        y1 < y2 + h2 && h1 + y1 > y2);
}

export function willCollideWithAnything(entity, div1VX, div1VY, entitiesToTest) {
    let entities = entitiesToTest; //enemies.concat(obstacles, ron);
    let collidedEntities = [];
    let numberOfEntities = entities.length;
    for (let i = 0; i < numberOfEntities; i++) {
        if (entities[i] !== entity) {
            if (willCollideXY(entity, div1VX, div1VY, entities[i])) {
                collidedEntities.push(entities[i]);
            }
        }
    }
    return collidedEntities;
}

export function handleCollisionsEntity(entity) {
    let div1VX = entity.vx;
    let div1VY = entity.vy;

    let signOfVelocityX = div1VX ? div1VX < 0 ? -1 : 1 : 0;
    let signOfVelocityY = div1VY ? div1VY < 0 ? -1 : 1 : 0;
    let maxMoveX = 0;
    let moveXX = 0;
    let moveXY = 0;

    let collidedEntities = willCollideWithAnything(entity, div1VX, div1VY, Game.visibleObstacles);

    if (collidedEntities.length > 0) {
        for (let x = div1VX; x !== 0; x -= signOfVelocityX) {
            let y = div1VY;
            do {
                if (willCollideWithAnything(entity, x, y, collidedEntities).length === 0) {
                    let moved = Math.abs(x) + Math.abs(y);
                    if (moved > maxMoveX) {
                        maxMoveX = moved;
                        moveXX = x;
                        moveXY = y;
                    }
                }
                y -= signOfVelocityY;
            } while (y !== -signOfVelocityY);
        }

        let maxMoveY = 0;
        let moveYX = 0;
        let moveYY = 0;
        for (let y = div1VY; y !== 0; y -= signOfVelocityY) {
            let x = div1VX;
            do {
                if (willCollideWithAnything(entity, x, y, collidedEntities).length === 0) {
                    let moved = Math.abs(x) + Math.abs(y);
                    if (moved > maxMoveY) {
                        maxMoveY = moved;
                        moveYX = x;
                        moveYY = y;
                    }
                }
                x -= signOfVelocityX;
            } while (x !== -signOfVelocityX);
        }

        if (maxMoveX > maxMoveY) {
            entity.vx = moveXX;
            entity.vy = moveXY;
        } else {
            entity.vx = moveYX;
            entity.vy = moveYY;
        }
    }
}