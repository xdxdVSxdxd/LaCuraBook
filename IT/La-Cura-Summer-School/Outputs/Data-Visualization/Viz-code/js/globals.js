var App = {
	Routers: {},
	Views: { 
		UI: {}, 
		Next: {},
		Frame: {}
	}
};

var pubSub = _.extend({},Backbone.Events);

var topView, leftView, rightView, mainFrameView, bottomView;