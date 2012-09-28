var GroundSprite = cc.Sprite.extend({
    vertices: null,
    ctor:function(){
	this.setPosition(new cc.Point(150,150));
    },
    setVertices:function(p_vertices){
	vertices = p_vertices
    },
    draw:function(){
	this._super();
	
	cc.renderContext.fillStyle = "rgba(0,0,0,1)";
        cc.renderContext.strokeStyle = "rgba(255,255,255,1)";
        cc.drawingUtil.drawPoly(vertices, 3, true, true)
    }
});