App.Views.UI = Backbone.View.extend({

	initialize: function(options){
		this.el = options.el;
		this.data = options.data;
		this.type = options.type;
		this.pubSub = options.pubSub;

		var source = options.el.replace('#', '');

		this.listenTo(this.pubSub, ('update:labels:' + source), this.updateNextActive);
		this.listenTo(this.pubSub, ('after:query:' + source), this.afterQuery);

		this.render();
	},

	render: function() {
		// populate ui
		var html = this.getUl(this.data, this.type);
		this.$el.find('ul').html(html);

		// store jquery <li> array
		this.$li = this.$el.find('li');

		// update storage
		var wildcard = this.data.find(function(el){return el.id === 0;});
		this.pubSub.trigger('update:next', wildcard, this.sourceEl());

		// update ui
		this.addActiveByData(wildcard);
	},


	/*
	 * Listeners responses
	*/

	afterQuery: function(data, source) {
		var lis = this.filterById(data);
		this.removeAllActive();
		this.addActive($(lis));

		this.removeAllActiveNext();
		this.addActiveNextByData({id: 0});
	},

	updateNextActive: function(data) {
		var lis = this.filterById(data);

		this.removeAllActiveNext();
		this.addActiveNext($(lis));
	},


	/*
	 * Events handling
	*/

	events: {
		'click li': 'updateNext'
	},

	updateNext: function(e) {
		e.stopPropagation();
		this.pubSub.trigger('update:next', $(e.currentTarget).data(), this.sourceEl() );
	},


	/*
	 * Methods for populating the ui
	*/

	getLi: function(type, prev, curr) {
      if( type == 'emotions' ) {
        return prev + '<li data-id="' + curr.id + '" data-label="' + curr.label + '" data-comfort="' + curr.comfort + '" data-energy="' + curr.energy + '"><span>' + curr.label + '</span></li>';
      } else 
      if( type == 'researches' ) {
        return prev + '<li data-id="' + curr.id + '" data-label="' + curr.label + '" data-research-twitter="' + curr.researchTwitter + '" data-research-insta="' + curr.researchInsta + '"><span>' + curr.label + '</span></li>';
      }
      return '';
    },

    getUl: function(data, type){
   	  var self = this;
      var html = data.reduce(function(prev, curr){
        return self.getLi(type, prev, curr);
      }, '');
      return html;
    },


    /*
    * Utilities
    */

    sourceEl: function(){
    	return this.$el.attr('id').replace('#', '');
    },

    addActiveByData: function(data){
    	this.$el.find('li[data-id=' + data.id + ']').addClass('selected');
    },

    removeActiveByData: function(data){
    	this.$el.find('li[data-id=' + data.id + ']').removeClass('selected');
    },

    isActiveByData: function(data){
    	return this.$el.find('li[data-id=' + data.id + ']').hasClass('selected');
    },

    addActive: function($items){
      $items.addClass('selected');
    },

    removeActive: function($items){
      $items.removeClass('selected');
    },

    removeAllActive: function(){
    	this.$li.removeClass('selected');
    },

    isActive: function($item){
      return $item.hasClass('selected');
    },

    addActiveNext: function($items){
    	$items.addClass('selected-next');
    },

    addActiveNextByData: function(data){
    	this.$el.find('li[data-id=' + data.id + ']').addClass('selected-next');
    },

    removeAllActiveNext: function(){
    	this.$li.removeClass('selected-next');
    },

    findLi: function(data){
    	for(var i = 0; i < this.$li.length; i++) {
    		if( this.$li.eq(i).data('id') === data.id ) return this.$li.eq(i);
    	}
    },

    filterById: function(data) {
		var lis = this.$li.filter(function(el){
			var id = $(this).data('id');
			for(var i = 0; i < data.length; i++) {
				if(data[i].id === id) return true;
			}
			return false;
		});
		return lis;
	},

	getData: function(){
		return this.data;
	}

});