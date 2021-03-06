
env3d.Env.baseAssetsUrl = "http://css.operatoroverload.com/exercise/";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* Generated from Java with JSweet 1.2.0-SNAPSHOT - http://www.jsweet.org */
var Creature = (function (_super) {
    __extends(Creature, _super);
    /**
     * Constructor for objects of class Creature
     */
    function Creature(x, y, z) {
        _super.call(this);
        this.speed = 0.1;
        this.frame = 0;
        this.changeTime = 0;
        this.setX(x);
        this.setY(y);
        this.setZ(z);
        this.setScale(1);
        this.changeTime = (Math.random() | 0) * 60;
    }
    Creature.prototype.move = function (creatures, dead_creatures) {
        this.moveForward(this.speed);
        if (this.frame++ % 30 === 0) {
            this.setRotateY(Math.random() * 360);
            this.changeTime = (Math.random() | 0) * 60;
        }
        if (this.getX() < this.getScale())
            this.setX(this.getScale());
        if (this.getX() > 50 - this.getScale())
            this.setX(50 - this.getScale());
        if (this.getZ() < this.getScale())
            this.setZ(this.getScale());
        if (this.getZ() > 50 - this.getScale())
            this.setZ(50 - this.getScale());
    };
    Creature.prototype.moveForward = function (speed) {
        this.setX(this.getX() + speed * Math.sin(/* toRadians */ (function (x) { return x * Math.PI / 180; })(this.getRotateY())));
        this.setZ(this.getZ() + speed * Math.cos(/* toRadians */ (function (x) { return x * Math.PI / 180; })(this.getRotateY())));
    };
    Creature.prototype.turnToFace = function (gameObj) {
        this.setRotateY(/* toDegrees */ (function (x) { return x * 180 / Math.PI; })(Math.atan2(gameObj.getX() - this.getX(), gameObj.getZ() - this.getZ())));
    };
    return Creature;
}(env3d.EnvObject));
Creature["__class"] = "Creature";
/* Generated from Java with JSweet 1.2.0-SNAPSHOT - http://www.jsweet.org */
/**
 * A predator and prey simulation. Fox is the predator and Tux is the prey.
 */
var Game = (function () {
    /**
     * Constructor for the Game class. It sets up the foxes and tuxes.
     */
    function Game() {
        this.yaw = 0;
        this.pitch = -35;
        this.dist = 65;
        this.finished = false;
        this.env = new env3d.Env();
        this.env.setCameraXYZ(25, 50, 55);
        this.env.setCameraPitch(this.pitch);
        this.env.setDefaultControl(false);
        this.env.setRoom(new Room());
        this.creatures = (new java.util.ArrayList());
    }
    Game.prototype.setup = function () {
        this.finished = false;
        for (var index320 = this.creatures.iterator(); index320.hasNext();) {
            var c = index320.next();
            {
                this.env.removeObject(c);
            }
        }
        this.creatures.clear();
        for (var i = 0; i < 55; i++) {
            if (i < 5) {
                this.creatures.add(new Fox(((Math.random() * 48) | 0) + 1, 1, ((Math.random() * 48) | 0) + 1));
            }
            else {
                this.creatures.add(new Tux(((Math.random() * 48) | 0) + 1, 1, ((Math.random() * 48) | 0) + 1));
            }
        }
        for (var index321 = this.creatures.iterator(); index321.hasNext();) {
            var c = index321.next();
            {
                this.env.addObject(c);
            }
        }
        this.dead_creatures = (new java.util.ArrayList());
    };
    Game.prototype.loop = function () {
        if (this.env.getKey() === 1) {
            this.finished = true;
        }
        var offX = 25;
        var offZ = 25;
        var offY = 0;
        var camx = offX + this.dist * Math.sin(/* toRadians */ (function (x) { return x * Math.PI / 180; })(this.yaw)) * Math.cos(/* toRadians */ (function (x) { return x * Math.PI / 180; })(-this.pitch));
        var camy = offY + this.dist * Math.sin(/* toRadians */ (function (x) { return x * Math.PI / 180; })(-this.pitch));
        var camz = offZ + this.dist * Math.cos(/* toRadians */ (function (x) { return x * Math.PI / 180; })(this.yaw)) * Math.cos(/* toRadians */ (function (x) { return x * Math.PI / 180; })(-this.pitch));
        this.env.setCameraXYZ(camx, camy, camz);
        this.env.setCameraYaw(this.yaw);
        this.env.setCameraPitch(this.pitch);
        if (this.env.getKeyDown() === org.lwjgl.input.Keyboard.KEY_LEFT) {
            this.yaw += 1;
        }
        if (this.env.getKeyDown() === org.lwjgl.input.Keyboard.KEY_RIGHT) {
            this.yaw -= 1;
        }
        if (this.env.getKeyDown() === org.lwjgl.input.Keyboard.KEY_UP) {
            this.pitch += 1;
        }
        if (this.env.getKeyDown() === org.lwjgl.input.Keyboard.KEY_DOWN) {
            this.pitch -= 1;
        }
        if (this.env.getKeyDown() === org.lwjgl.input.Keyboard.KEY_Z) {
            this.dist += 1;
        }
        if (this.env.getKeyDown() === org.lwjgl.input.Keyboard.KEY_A) {
            this.dist -= 1;
        }
        for (var index322 = this.creatures.iterator(); index322.hasNext();) {
            var c = index322.next();
            {
                c.move(this.creatures, this.dead_creatures);
            }
        }
        for (var index323 = this.dead_creatures.iterator(); index323.hasNext();) {
            var c = index323.next();
            {
                this.env.removeObject(c);
                this.creatures.remove(c);
            }
        }
        this.dead_creatures.clear();
        var hasTux = false;
        for (var index324 = this.creatures.iterator(); index324.hasNext();) {
            var c = index324.next();
            {
                if (c != null && c instanceof Tux) {
                    hasTux = true;
                    break;
                }
            }
        }
        if (!hasTux) {
            this.setup();
        }
    };
    /**
     * Play the game
     */
    Game.prototype.play = function () {
        this.setup();
        while ((!this.finished)) {
            this.loop();
            this.env.advanceOneFrame();
        }
        ;
        this.env.exit();
    };
    /**
     * Main method to launch the program.
     */
    Game.main = function (args) {
        (new Game()).play();
    };
    return Game;
}());
Game["__class"] = "Game";
/* Generated from Java with JSweet 1.2.0-SNAPSHOT - http://www.jsweet.org */
var Room = (function () {
    /**
     * A room with just marble floor and no walls.
     */
    function Room() {
        this.width = 0;
        this.depth = 0;
        this.height = 0;
        this.width = 50;
        this.depth = 50;
        this.height = 50;
        this.textureBottom = "textures/marble.png";
        this.textureWest = null;
        this.textureEast = null;
        this.textureNorth = null;
        this.textureSouth = null;
        this.textureTop = null;
    }
    return Room;
}());
Room["__class"] = "Room";
/* Generated from Java with JSweet 1.2.0-SNAPSHOT - http://www.jsweet.org */
var Fox = (function (_super) {
    __extends(Fox, _super);
    function Fox(x, y, z) {
        _super.call(this, x, y, z);
        this.setTexture("models/fox/fox.png");
        this.setModel("models/fox/fox.obj");
    }
    Fox.prototype.move = function (creatures, dead_creatures) {
        for (var index325 = creatures.iterator(); index325.hasNext();) {
            var c = index325.next();
            {
                if (c.distance(this) < c.getScale() + this.getScale() && (c != null && c instanceof Tux)) {
                    dead_creatures.add(c);
                }
            }
        }
        for (var index326 = creatures.iterator(); index326.hasNext();) {
            var c = index326.next();
            {
                if (c != null && c instanceof Tux) {
                    if (c.distance(this) < 5) {
                        this.turnToFace(c);
                    }
                }
            }
        }
        _super.prototype.move.call(this, creatures, dead_creatures);
    };
    return Fox;
}(Creature));
Fox["__class"] = "Fox";
/* Generated from Java with JSweet 1.2.0-SNAPSHOT - http://www.jsweet.org */
var Tux = (function (_super) {
    __extends(Tux, _super);
    function Tux(x, y, z) {
        _super.call(this, x, y, z);
        this.setTexture("models/tux/tux.png");
        this.setModel("models/tux/tux.obj");
    }
    return Tux;
}(Creature));
Tux["__class"] = "Tux";
//# sourceMappingURL=bundle.js.map
