var PTM_RATIO = 10;
Z_ORDER = [0,1,2,3]
var MyThirdApp = cc.Layer.extend({   
    world:null,
    playerBody:null,
    flyingVelocity:0,
    _groundManager:null,
    _velocity:-0.8,

    ctor:function(){
        this.setKeyboardEnabled(true);
    },
    init:function(){
	   
        this._super();    


        flyingVelocity = 0;

        var b2Vec2 = Box2D.Common.Math.b2Vec2
        , b2BodyDef = Box2D.Dynamics.b2BodyDef
        , b2Body = Box2D.Dynamics.b2Body
        , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
        , b2World = Box2D.Dynamics.b2World
        , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
        , b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

        var screenSize = cc.Director.getInstance().getWinSize();
        //UXLog(L"Screen width %0.2f screen height %0.2f",screenSize.width,screenSize.height);



        // Construct a world object, which will hold and simulate the rigid bodies.
        this.world = new b2World(new b2Vec2(0, -20), true);
        this.world.SetContinuousPhysics(true);

        var fixDef = new b2FixtureDef;
        fixDef.density = 1.0;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.2;

        var bodyDef = new b2BodyDef;

        //create ground
        bodyDef.type = b2Body.b2_staticBody;
        fixDef.shape = new b2PolygonShape;
        fixDef.shape.SetAsBox(20, 2);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);



        //Criando Player
        var jetSprite = new JetSprite();
        this.addChild(jetSprite);
        playerBody = Box2DHelper.CreateBody(this.world, jetSprite);
        playerBody.SetPosition(cc.p(20,25));

        //Criando Luzes
        this.lightingOverlay = new LightingOverlay();
        this.addChild(this.lightingOverlay);

        //Gorund Manager
        this._groundManager = new GroundManager(this.world,this);

        //Listerner
        var b2Listener = Box2D.Dynamics.b2ContactListener;

        //Add listeners for contact
        var listener = new b2Listener;

        var self = this;

        listener.BeginContact = function(contact) {

            var sprA = contact.GetFixtureA().GetBody().GetUserData();
            var sprB = contact.GetFixtureB().GetBody().GetUserData();

            if( (sprA && sprA.getTag() == "Ground") || (sprB && sprB.getTag() == "Ground")){
                self.onDeath();
            }
                
        }

        listener.EndContact = function(contact) {
            // console.log(contact.GetFixtureA().GetBody().GetUserData());
        }

        listener.PostSolve = function(contact, impulse) {

        }

        listener.PreSolve = function(contact, oldManifold) {
            // PreSolve
        }

        this.world.SetContactListener(listener);

        this.scheduleUpdate();

    
    },
    onEnter:function(){
        this._super();
    },
    onKeyDown:function(e){
	    flyingVelocity = 50;
    },
    onKeyUp:function(e){
	   flyingVelocity = 0;
    },
    onDeath:function(e){
        this._velocity = 0;
        playerBody = null;
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(0.6,new GameOverScene()));
    },
    startLevel:function(e){
        this.scheduleUpdate();
    },
    update:function (dt) {

        this._groundManager.update(this._velocity);
        //It is recommended that a fixed time step is used with Box2D for stability
        //of the simulation, however, we are using a variable time step here.
        //You need to make an informed choice, the following URL is useful
        //http://gafferongames.com/game-physics/fix-your-timestep/

        var velocityIterations = 8;
        var positionIterations = 1;

        // Instruct the world to perform a single step of simulation. It is
        // generally best to keep the time step and iterations fixed.
        this.world.Step(dt, velocityIterations, positionIterations);

        if(playerBody){
            var bodyPosition = cc.pMult(playerBody.GetPosition(),PTM_RATIO);
            
            playerBody.GetUserData().setPosition(bodyPosition);
            
            this.lightingOverlay.position = bodyPosition;

            playerBody.ApplyImpulse(cc.p(0,flyingVelocity),playerBody.GetPosition());    

        }


    }
});



MyThirdAppScene = cc.Scene.extend({
	onEnter:function(){
		this._super();
		var layer = new MyThirdApp();
		layer.init();
		this.addChild(layer);
	}
})

