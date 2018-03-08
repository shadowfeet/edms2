var fs = fs || {};

fs.d = {};
			
fs.u ={
	/*enable submit if all inputs field's value is valid, disables it if otherwise */ 
	ValidateForm:function(e,inputs,submit)  { 
		var current_input = e;
		var f = FormReady(inputs);
		if (f) {
			$(submit).button({disabled:false});
		} else {
			$(submit).button({disabled:true});
		}
		//inspect all inputs and return true if form is ready for submission
		function FormReady(inputs){
			var rem_inputs = [];
		    //check for correct value for the input that generates the keyup event
		    //if true, check the other inputs
		    var j = CorrectValue(current_input,inputs,true);
			if (j) {
				//remove the input obj that refers to this current input
				for (var i=0;i<inputs.length;i++){
					if (inputs[i].name != $(current_input).attr('name')){
						rem_inputs.push(inputs[i]);		
					}
				}
				for (var i=0; i<rem_inputs.length; i++) {
					html_input = $('input[name="' + rem_inputs[i].name + '"]');
					//if input value needs server validation
					var h = CorrectValue(html_input,rem_inputs);
					if(!h) {
						return false;
					}
				}
				return true;
			} else {
				return false;
			}
			/***function declarion of CorrectValue***/
			function CorrectValue(current_input,inputs,display_help){
				var a = current_input, b = inputs,c,d, e = {};
				var f = $(a).val();

				 //get corresponding object of current input 
			    for(var i=0;i<b.length;i++){
					if ($(a).attr('name')==b[i].name){
						c = b[i];
						break;
					}
				}
			    
			    //check for empty
				if ( f.length != 0) {
					e.has_value = true;
				}

				if( f.length >= c.minLength && 
					f.length <= c.maxLength ) {
					e.good_length = true; 
				}
				
			    //check for right value   
			    if ( c.token.test($(a).val()) ) {
					e.valid_value = true;
				}

				if (e.valid_value && c.requestUrl){
					if(display_help) {
						var x = Found_Record(c.requestUrl,{name:c.name, value:f},true);
					} else {
						var x = Found_Record(c.requestUrl,{name:c.name, value:f});
					}
					
					if(x){
				       	e.found_record = true;
				    }else{
				      	e.found_record = false;
				    }
				}

				//form condition base on input's requestURL value
				if (c.requestUrl){
					var string_condition ='e.has_value && e.good_length && e.valid_value && e.found_record == false';
				} else {
					var string_condition ='e.has_value && e.good_length && e.valid_value';
				}

				//displaying of help text
			    if (display_help){
			    	//if current input require a request to be sent to server
			    	if(eval(string_condition)) {
			    		$(a).parent().next().next().next().replaceWith("<p class='helptext'>*" + c.affirmText + "<p>");
			    	} else {
			    		if (!e.has_value){
			    			$(a).parent().next().next().next().replaceWith("<p class='error'>*" + c.errorEmpty + "<p>");
			    		}else{
			    			if (!e.good_length){
			    				$(a).parent().next().next().next().replaceWith("<p class='error'>*" + c.errorLength + "<p>");
			    			}else{
			    				if(!e.valid_value) {
			    					$(a).parent().next().next().next().replaceWith("<p class='error'>*" + c.errorInvalid + "<p>");	
			    				} else {
			    					$(a).parent().next().next().next().replaceWith("<p class='error'>*" + c.errorRequest + "<p>");
			    				}
			    			}
			    		}
			    	}
			    }

			    if (eval(string_condition)){
			    	return true;
			    }else{
			    	return false;
			    }
			    
				/**function declaration of FoundRecord**/
				function Found_Record (url,data,display_help){ 
					var a = current_input;
					var found;
					if(display_help){
						$(a).parent().next().attr('src','/images/ajax_loader.gif').css({display:'inline'});
					}	
					var flag;
					$.ajax({
				        url: '/verify',
				        type: 'GET',
				        data: data,
				        async: false,
				        success: function(response){
				        			if (response == 'yes') {
							        	if(display_help){
							        		$(a).parent().next().attr('src','/images/x.png').css({display:'inline'});
										}
										found = true;
									} else {
										if(display_help){
							        		$(a).parent().next().attr('src','/images/tick.png').css({display:'inline'});
										}
								    }
								 }
				    });
				    return found;
				}				
				/**end of FoundRecord declaration**/
			}
			/***end of CorrectValue***/
			
		}//end of FormReady
	}, //end of ValidateForm	
	computeCost:function (ty,l,p){
		var rpp,cost;
		if(ty == "Editing") {
			switch(l) {
			  case "Low":
				  rpp = 35;
				  break;
			  case "Medium":
				  rpp = 50;
				  break;
			  case "Heavy":
				  rpp = 70;
				  break;
			}
		}
		else {
			rpp = 200;
		}
		return rpp * p;	
	}//end of computeCost	
}; // end of fs.u