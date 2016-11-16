App.Views.Next = Backbone.View.extend({
	
	initialize: function(options){
		this.pubSub = options.pubSub;
		this.el = options.el;
		this.storage = {
			top: new Storage(),
			left: new Storage(),
			right: new Storage()
		};

		this.listenTo(this.pubSub, 'update:next', this.update);
	},

	update: function(data, source){
		if( this.isActive() ) {
			// check if is in storage
			var isInStorage = this.storage[source].check(data);
			
			// test if left and right together have at least one item
			var isLast =
				source !== 'top' && ( this.storage['left'].get().length + this.storage['right'].get().length ) == 1;

			// update storage
			var wildcard = this.storage[source].update(isInStorage, data, isLast);

			// update labels in the ui
			this.pubSub.trigger(('update:labels:' + source), this.storage[source].get(), wildcard);
		}
	},


	/*
	 * Events
	*/

	events: {
		'click #research-prepare-toggle': 'toggleSwitch',
		'click #research-submit-toggle': 'launch'
	},


	/*
	 * Launch new search
	*/

	launch: function(e) {
		if(e) e.preventDefault();

		var isDataTop = !this.storage.top.isEmpty();
		var isDataLeft = !this.storage.left.isEmpty();
		var isDataRight = !this.storage.right.isEmpty();

		if( isDataTop && ( isDataLeft || isDataRight ) ) {
			// put loader
			this.pubSub.trigger('set:loader');

			// query
			this.query({
				top: this.storage.top.get(), 
				left: this.storage.left.get(), 
				right: this.storage.right.get()
			});
		} 
	},


	/*
	 * Query 
	*/

	query: function( storages ) {
		var root = '/HEv3/api/';
		var urls = this.getQueryPath( storages );
		var self = this;

		getJSON(root + urls['img'], function(data){
        	var imgs = data;

        	getJSON(root + urls['txt'], function(data){
        		var txt = data;

        		self.triggerUIUpdate(storages);
        		self.resetStorages();
        		self.toggleSwitch();
        		self.triggerMainFrameUpdate(txt, imgs);
        	});

        });
	},

	getQueryPath: function( storages ) {
		var imgPath = 'getImages?researches=';
		var textPath = 'getContentByComfortEnergy?researches=';

		var imgResearches = 
			(storages.left.map(function(el){ return el.researchInsta; }))
				.concat( (storages.right.map(function(el){ return el.researchInsta; })) );

		imgPath+= imgResearches.join();

		var textResearches = 
			(storages.left.map(function(el){ return el.researchTwitter; }))
				.concat( (storages.right.map(function(el){ return el.researchTwitter; })) );

		textPath+= textResearches.join();

		var isTopAll = (storages.top.length === 1 && storages.top[0].id === 0);

		if(!isTopAll) {

			var comfort = storages.top.map(function(el){ return el.comfort; });
			var energy = storages.top.map(function(el){ return el.energy; });

			textPath += '&comfort=' + comfort.join() + '&energy=' + energy.join() + '&delta=100';
			imgPath += '&comfort=' + comfort.join() + '&energy=' + energy.join() + '&delta=100';

		}
		return {txt: textPath, img: imgPath};
	},


	/*
  	 * Triggers
	*/

	triggerUIUpdate: function(storages) {
		for(key in storages) {
			this.pubSub.trigger( ('after:query:' + key), storages[key], key);
		}
	},

	triggerMainFrameUpdate: function(txt, imgs) {
		this.pubSub.trigger('update:mainframe', txt, imgs);
	},


	/*
	 * Utilities
	*/

	isActive: function(){
		return this.$el.find('#research-prepare-toggle').hasClass('active');
	},

	toggleSwitch: function(e){
		if(e) e.preventDefault();
		var $researchToggle = $('#research-prepare-toggle');
		$researchToggle.toggleClass('active');
		$('body').toggleClass('new-search-active');

		var html = ( $researchToggle.hasClass('active') ) ? 'Collapse new research' : 'Prepare new research';
		$researchToggle.html(html);
	},

	resetStorages: function(){
		this.storage.top.clearStorage();
		this.storage.left.clearStorage();
		this.storage.right.clearStorage();

		var defaultTop = topView.getData().find(function(el){ return el.id === 0; });
		var defaultLeft = leftView.getData().find(function(el){ return el.id === 0; });
		var defaultRight = rightView.getData().find(function(el){ return el.id === 0; });

		this.storage.top.store(defaultTop);
		this.storage.left.store(defaultLeft);
		this.storage.right.store(defaultRight);
	}

});