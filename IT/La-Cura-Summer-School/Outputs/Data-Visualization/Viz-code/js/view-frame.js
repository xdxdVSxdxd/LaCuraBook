App.Views.Frame = Backbone.View.extend({

	initialize: function(options){
		this.el = options.el;
		this.pubSub = options.pubSub;

		this.listenTo(this.pubSub, 'update:mainframe', this.render);
		this.listenTo(this.pubSub, 'set:loader', this.setLoader);
	},

	setLoader: function(){
		this.$el.fadeOut(function(){
			$(this).html('<p class="loader">Loading...</p>').fadeIn();
		});
	},

	render: function(txt, imgs){
		var elems = 
			( txt.results.map(function(el){return '<div>' + el.content + '</div>';}) )
				.concat( imgs.results.map(function(el){return '<div style="background-image:url(' + el.entity + ');"></div>';}) );

		this.$el.fadeOut(function(){
			$(this).html( shuffle(elems) ).fadeIn();
		});
	}

});