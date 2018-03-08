var fs = fs || {};

fs.d = {};
			
fs.u ={
	/*enable submit if all inputs field's value is valid, disables it if otherwise */ 
	ValidateForm:function(e,inputs,submit,display_help)  { 
		var current_input = e;
		if(display_help){
			var f = FormReady(inputs,display_help);
		}else {
			var f = FormReady(inputs);	
		}
		
		if (f) {
			$(submit).button({disabled:false});
		} else {
			$(submit).button({disabled:true});
		}
		//inspect all inputs and return true if form is ready for submission
		function FormReady(inputs,display_help){
			var rem_inputs = [];
		    //check for correct value for the input that generates the keyup event
		    //if true, check the other inputs
		    if(display_help){
		    	var j = CorrectValue(current_input,inputs,true);
		    }else {
		    	var j = CorrectValue(current_input,inputs);	
		    }
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
						$(a).parent().next().attr('src','../images/ajax_loader.gif').css({display:'inline'});
					}	
					var flag;
					$.ajax({
				        url: '/scripts/verify',
				        type: 'GET',
				        data: data,
				        async: false,
				        success: function(response){
				        			if (response == 'yes') {
							        	if(display_help){
							        		$(a).parent().next().attr('src','../images/x.png').css({display:'inline'});
										}
										found = true;
									} else {
										if(display_help){
							        		$(a).parent().next().attr('src','../images/tick.png').css({display:'inline'});
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
	},//end of computeCost	
 //accepts string with spaces,separate them, and add prefix string
 prefixName:	function(name,prefix){
  var newname = prefix;
 	if(name.indexOf(" ")>0){
 	  var ns = name.split(" ");
    for(var i=0;i<ns.length;i++){
					newname += ns[i];
				}
 	}else{
 		newname += name;
 	}
 	return newname;
 },//end of prefixName
 initializeGUI: function (doc) {
		//generate tab menus
		var tab_menu = $('<ul id="tab_menu">');
		$('<li><a class="tab_current" href="#" id="link_Tasks">Tasks</a></li>').appendTo(tab_menu);
		$('<li><a href="#" id="link_AccountSettings">Account Settings</a></li>').appendTo(tab_menu);
		$('<li><a href="#" id="link_Invoices">Invoices</a></li>').appendTo(tab_menu);
		tab_menu.on('click', function(evt){
			//alert($('#taskmenu_div').height());
			var target = $(evt.target);
			var ul_elem =target.parent().parent();
			ul_elem.children().children().filter('.tab_current').removeClass('tab_current');
			target.addClass('tab_current');
		})
	 //--task panel
	 //task menu
	 var task_menu = $('<ul>');
	 $('<li><a class="taskslink_current" href="#" id="link_ForCompletion">For Completion</a></li>').appendTo(task_menu);
	 $('<li><a href="#" id="link_ForSubmission">For Submission</a></li>').appendTo(task_menu);
	 $('<li><a href="#" id="link_ForApproval">For Approval</a></li>').appendTo(task_menu);
	 $('<li><a href="#" id="link_ForPayment">For Payment</a></li>').appendTo(task_menu);
	 $('<li><a href="#" id="link_FrozenTasks">Frozen Tasks</a></li>').appendTo(task_menu);
	 $('<li><a href="#" id="link_ClosedTasks">Closed Tasks</a></li>').appendTo(task_menu);
	 var taskmenu_div =$('<div id="taskmenu_div">');
	 $('<p class="taskmenu_title">').text('All Tasks').appendTo(taskmenu_div);
	 task_menu.appendTo(taskmenu_div);
	 $('<a id="create_task" href="#">Create Task</a>').button ({
				icons : { primary : "ui-icon-plus" }
		}).appendTo(taskmenu_div);
	 //task table
  var table = $('<table width="600">');
  $('<caption align="top">Tasks Lists</caption>').appendTo(table);
  $('<tr><td class="first">Type</td><td class="second">Status</td><td class="third">Days until completion</td></tr>').appendTo(table);
  var table_container = $('<div id="table_container">');
  table.appendTo(table_container);
	 //main_window contains menu div and table	div 	
	 var main_window =  $('<div id="main_window">');
	 taskmenu_div.appendTo(main_window);
	 table_container.appendTo(main_window);
		
		//start of subwindow
  var subwin = $('<div id="subwin">');
  $('<p id="p_operation">---Task Creation---</p>').appendTo(subwin);
  var tasktool1=$('<ul id="tasktool1">');
  $('<li><a href="#">Save</a></li>').appendTo(tasktool1);
  $('<li><a href="#">Submit</a></li>').appendTo(tasktool1);
  var infodiv =$('<div id="infodiv">');
  tasktool1.appendTo(subwin);
  var p_div = $('<div id="p_div">');
  $('<p>T</p>').appendTo(p_div);
  $('<p>a</p>').appendTo(p_div);
  $('<p>s</p>').appendTo(p_div);
  $('<p>k</p>').appendTo(p_div);
  $('<p id="data">D</p>').appendTo(p_div);
  $('<p>a</p>').appendTo(p_div);
  $('<p>t</p>').appendTo(p_div);
  $('<p>a</p>').appendTo(p_div);
  p_div.appendTo(infodiv);
  infodiv.appendTo(subwin);




		//tasks_div contains main window and subwindow
		var tasks_div = $('<div id="tasks_div">');
		main_window.appendTo(tasks_div);
		$('<div class="clearfloat">').appendTo(tasks_div);
		subwin.appendTo(tasks_div);
  //taskpanel contains tasks_div
		var taskpanel =$("<div class='panel' id='panel_Tasks'>"); 
	 tasks_div.appendTo(taskpanel);

  //appending the gui div to the main tag
	 var gui = $("<div id='gui'>");
	 tab_menu.appendTo(gui);
	 $('<div class="clearfloat">').appendTo(gui);
	 taskpanel.appendTo(gui);
	 //settingspanel.appendTo(gui);
	 //invoicespanel.appendTo(gui);
	 gui.appendTo('main');
 }
}; // end of fs.u