// main javascript

$(document).ready(function(e) {
	
	/********************************************************
	 *task cost calculator
	 ********************************************************/
	//displays and hides the task category and editing level
	$("#sty").change(function(e) {
		var i = $(this).val(); //get task type as i
		if(!i.length){ //if value is neither editing nor writing
			$("#ec").val(''); //reset value of edit level
			$('#inp').val('');//number of pages
			$("#itc").val('');//total cost
			
			var s = $("#del").css('display'); //hide select element for edit level if shown
			if(s=='block'){
				$("#del").slideUp(1);
			}
		} 
		else {
		  if(i == "Editing"){ //if editing type is selected
		  	  if($("#del").css('display')=='none'){
				$("#ec").val(''); //reset value of  
				$('#inp').val('');
				$("#itc").val('');
			  	$("#del").slideDown(1);
			  }
		  }
		  else { //if writing is chosen
			  	$('#inp').val('');
				$("#itc").val('');  
			  	$("#del").slideUp(1);  
		 }
		}
	});
	//enables or disables adding of pages
	$("#ec").change(function(e) {
		$('#inp').val('');
		$("#itc").val('');
		var d = $(this).val().length;
		var s = $('#inp').attr('disabled');
		if(d){
			if(s =='disabled') 
				$('#inp').removeAttr('disabled');
		}
		else {
			$('#inp').attr('disabled','');
		}
	});

	$("#edit_level").change(function(e) {
        var c = $(this).val();
		if(!c.length) {
			$('#edit_level').slideUp(1);	
		};
    });

	$("#calc input:submit").click(function(e){
	  e.preventDefault();
	  var t = $("#sty").val();//get task type 
	  var l = $("#ec").val(); //get edit level 
	  var cat = $("#wc").val(); //get document type
	  var p = $('#inp').val(); //get number of pages
	  var flag,rpp,cost; 
	  //flag is true if type of task is selected & its category changed, and the page has a number value
	  //rpp corresponding rate per hour
	  if( ((t.length && l.length) || (t.length && cat.length) ) && !isNaN(parseInt(p)) ) {
		  flag = true;
	  }
	  else {
		  flag = false;
	  }
	  //determines the rate per page
	  if (flag) {
	  	$("#itc").val(fs.u.computeCost(t,l,p));//invoke fs.u.computeCost function in mylif to compute for cost
	  }
	  
	}); 
	
	//alert(cost);
	$('#mainnav a').click(function (e) {
		if($(this).hasClass('current')){
			e.preventDefault();
		}
	});
});//document