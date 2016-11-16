App.Routers = Backbone.Router.extend({
	
    routes: {
		'': 'viz'
	},

	viz: function(){

		// create bottom view
		bottomView = new App.Views.Next({
			el: '#bottom',
			pubSub: pubSub
		});
		
        // create top view
		getJSON('/viz/assets/emotions.json', function(data){
        	var emotions = data;
        	topView = new App.Views.UI({
    			data: data,
    			el: '#top',
    			type: 'emotions',
    			pubSub: pubSub
    		});
            
            // create left view
		    getJSON('/viz/assets/terms_left.json', function(data){
        		var inhabit = data;
        		leftView = new App.Views.UI({
            		data: data,
            		el: '#left',
            		type: 'researches',
            		pubSub: pubSub
            	});
            
                // create right view
          		getJSON('/viz/assets/terms_right.json', function(data){
            		var uninhabit = data;
            		rightView = new App.Views.UI({
            			data: data,
            			el: '#right',
            			type: 'researches',
            			pubSub: pubSub
            		});

                    // create main frame
                    mainFrameView = new App.Views.Frame({
                        pubSub: pubSub,
                        el: '#data-frame'
                    });

                    // start data rendering
                    bottomView.launch(); 

          		});

	    	});

      	});

	}
});


setTimeout(function(){
    $('#intro-wrapper, #show-intro').removeClass('active');
    $('#show-intro').on('click', function(e){
        e.preventDefault();
        $('#intro-wrapper').scrollTop(0);
        $('#intro-wrapper, #show-intro').toggleClass('active');
    });  
}, 3000);

var router = new App.Routers();
Backbone.history.start();