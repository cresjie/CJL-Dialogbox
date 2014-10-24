// JavaScript Document
$(function(){
	
	function addDemoBtnEvents(){
		$('.demo-btn').click(function(e){e.preventDefault()});
		$('#basic_simple').click(function(e){
			$.cjlDialog({title:title,content:content});	
		});	
		$('#basic_type').click(function(){
			$.cjlDialog({title:title,content:content,overlay:true,type:$('#basic_type_s').val()});
		});
		$('#basic_img').click(function(){
			$.cjlDialog({title:'Image1',content:"<img src='images/1-min.jpg' width=600 height=450>",overlay:true,contentCss:{width:600,height:450}});
		});
		
		$('#basic_video').click(function(){
			$.cjlDialog({title:'Over Again',content:content_video,contentCss:{width:560,height:315},overlay:true})
		});

		$('#advance_position').click(function(){
			this.innerHTML = 'Click Again';
			$.cjlDialog({title:title,content:content,draggable:true,position:function($container){
					var top = Math.random()*(window.innerHeight-$container.outerHeight()),
						left = Math.random()*(window.innerWidth-$container.outerWidth());
						$container.css({top:top,left:left});
			} });	
		});
		$('#advance_buttons').click(function(){
			$.cjlDialog({title:'Buttons',content:'Are you sure you want to delete files?',type:'ask',
			buttons:[
				{text:'Yes',
				attr:{id:'btn1',class:'btn','data-cjlmodal':'close'},
				on:{click:function(){alert('Files deleted')}}
				},
				{text:'Hover Me',
				attr:{id:'btn2',class:'btn'},
				on:{mouseenter:function(){alert('Mouse enter')}}
				}
			]});	
		});
		
		$('#advance_transitions').click(function(){
			$.cjlDialog({title:title,content:content,overlay:true,
				transitionIn:{style:$('#advance_transition_s_transitionIn_style').val(),
							duration:parseInt($('#advance_transition_s_transitionIn_duration').val()) },
				transitionOut:{style:$('#advance_transition_s_transitionOut_style').val(),
								duration:parseInt($('#advance_transition_s_transitionOut_duration').val()) }
			});	
		});
		
		$('#transitions_ui_effect').click(function(){
			var transInDirection = $('#transition_transIn_effect_s').val() == 'clip'?$('#transition_transIn_direction2_s').val():$('#transition_transIn_direction_s').val();
			var transoutDirection = $('#transition_transOut_effect_s').val() == 'clip'?$('#transition_transOut_direction2_s').val():$('#transition_transOut_direction_s').val();
			$.cjlDialog({title:title,content:content,overlay:true,
						transitionIn:{style:$('#transition_transIn_style_s').val(),
							effect:$('#transition_transIn_effect_s').val(),
							direction:transInDirection, //direction2: clip 
												//!direction1,2: explode,fold,higlight,puff,pulsate,scale,size
							
							easing:$('#transition_transIn_easing_s').val(),
							duration:parseInt($('#transition_transIn_duration_s').val())},
				transitionOut:{style:$('#transition_transOut_style_s').val(),
								effect:$('#transition_transOut_effect_s').val(),
								direction:transoutDirection,
								easing:$('#transition_transOut_easing_s').val(),
								duration:parseInt($('#transition_transOut_duration_s').val())}
			});	
		});

		$('#modal_demo').click(function(){myModal.open()});
	}

	function addOnChangeEvents(){
			var patt = /explode|fold|highlight|puff|pulsate|scale|size/;
			$('#transition_transIn_effect_s').on('change',function(){
				if(this.value == 'clip'){
					$('#transition_transIn_direction2_s').show();
					$('#transition_transIn_direction_s').hide();
				}else{
					$('#transition_transIn_direction2_s').hide();
					$('#transition_transIn_direction_s').show();
				}

				if(patt.test(this.value)){
					$('#transition_transIn_direction_prop').hide();
				}else{
					$('#transition_transIn_direction_prop').show();
				}


			});
			$('#transition_transOut_effect_s').on('change',function(){
				if(this.value == 'clip'){
					$('#transition_transOut_direction2_s').show();
					$('#transition_transOut_direction_s').hide();
				}else {
					$('#transition_transOut_direction2_s').hide();
					$('#transition_transOut_direction_s').show();
				}

				if(patt.test(this.value)){
					$('#transition_transOut_direction_prop').hide();
				}else{
					$('#transition_transOut_direction_prop').show();
				}

			});

			$('#transition_transIn_style_s').on('change',function(){
				if(this.value != 'show'){
					$('#transition_transIn_effect_prop').hide();
					$('#transition_transIn_direction_prop').hide();
				}else{
					$('#transition_transIn_effect_prop').show();
					$('#transition_transIn_direction_prop').show();
				}
			});
			$('#transition_transOut_style_s').on('change',function(){
				if(this.value != 'hide'){
					$('#transition_transOut_effect_prop').hide();
					$('#transition_transOut_direction_prop').hide();
				}else{
					$('#transition_transOut_effect_prop').show();
					$('#transition_transOut_direction_prop').show();
				}
			});
	}

	function addMiscClick(){
		$('.header li a,.back-to-top').click(function(e){
			e.preventDefault();
			$('html,body').animate({scrollTop:$('#' + this.href.split('#')[1]).offset().top});
		});
	}
	function addWindowScrollEvent(){
		$(window).on('scroll',function(){
			if(window.scrollY > 300)
				$('a.back-to-top').show();
			else
				$('a.back-to-top').hide();
		})
	}
	addDemoBtnEvents();
	addOnChangeEvents();
	addMiscClick();
	addWindowScrollEvent();
	myModal = $('#myModal').cjlModal({
		transitionIn:{style:'show',effect:'explode'}
	});
	
});
var myModal;
var title = 'myTitle';
var content = ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum rutrum dapibus est, in porta diam condimentum et. Mauris scelerisque lorem turpis, eget '+
	'luctus enim varius sit amet. Nullam auctor nunc nec lacus dictum, et congue ex viverra. In venenatis vehicula placerat. Maecenas non lorem nunc. Donec '+
	'convallis erat ut augue vehicula dictum. In mollis nulla dictum felis ultrices, euismod mattis tellus iaculis. Suspendisse euismod porttitor tempus. Donec'+
	'blandit nisl sed ornare semper. Aliquam semper, massa quis vestibulum pretium, dolor sem tempus orci, eget feugiat arcu mi eu enim. Sed posuere vulputate '+
	'nisi sed commodo. Vestibulum imperdiet ultrices nibh, in efficitur arcu tempor in. Duis at ornare tortor. ';
var content_video = '<iframe width="560" height="315" src="https://www.youtube.com/embed/8cDOzrLpM8A" frameborder="0" allowfullscreen></iframe>';	