// main javascript

$(document).ready(function(e) {
	
	var to2;
	/********************************************************
	 * portal tool 
	 ********************************************************/
	$("#portal #portlink").click(function(e){ 
		e.preventDefault();
		$('#portaldiv').slideToggle(100);

		$('#div_loginform').slideUp(100);
	});
	//signin link
	$("#portal_menu #signin").click(function(e){ 
		e.preventDefault();
		$(this).attr('disabled','disabled'); 
		$("#portaldiv").slideToggle(100)
		$("#loginform input[name='username']").add("#loginform input[name='password']").val('');
		$('#div_loginform').slideToggle(100);
		$("#div_loginform input[name='username']").focus();
	});
	//signout link
	$("#portal_menu #signout").click(function(e){ 
		e.preventDefault();
		$(this).attr('disabled','disabled'); 
		$.get('scripts/signout',function(res){
			if(res=='ok')
			  location.replace('/');
		});
			
	});
	
	/********************************************************
	 *login form 
	 ********************************************************/
	//disable login button
	$("#loginform input[name='login']").attr('disabled','disabled');
	$("#loginform input[name='username']").add("#loginform input[name='password']").keydown(function(e) {
		$("#loginform input[name='login']").attr('disabled','disabled');	
	});
	//closes the login form if its not the focus
	$(document).mouseup(function (e){
		if ($('#div_loginform').css('display') == 'block')  
			var container = $("#div_loginform");
		else 
			var container = $("#portaldiv");
		 
		if ( !container.is(e.target) && 
			 container.has(e.target).length === 0 ) {
        	$(container).slideUp(100);
	   	}
	});
	//username and password input

	$('input[name="username"').add('input[name="password"').on('keyup',function(e){
    	clearTimeout(to2);
		var e = $(this);
		var submit = $("input[name='login']");
		var inputs = [{ 
			name:'username',
			token:/^\w{8,30}$/,
			maxLength:30,
			minLength:8 }, { 
			name:'password',
   			token:/^\w{8,30}$/,
            maxLength:30,
			minLength:8	}];
		t = setTimeout(fs.u.ValidateForm,2000,e,inputs,submit);
   }).on('keydown',function(e){
  		$("input[name='login']").attr('disabled','disabled');       

   }).val(''); //end keyup ;
	
	//the 'login' submit-type input
	$('input[name="login"]').on('click',function(e){	
		e.preventDefault();
		$(this).attr('disabled','disabled');   
		var u = $('input[name="username"]').val();
  var e = $('input[name="password"]').val();
  var data = {username:u, password:e};
  $.ajax({
	  url: '/scripts/login',
	  type:'GET',
	  data: data,
	  async: false,
	  success: function(res) {
	  				 if(res =='yes'){
	  	    	location.replace('/');
	  	    } else{	
	  	    	$('input[name="username"').add('input[name="password"').val();
	        	$('#div_loginform').slideUp(100);
	        } 	
	     }        
		}); 
	});
		
	//alert(cost);
	$('#mainnav a').click(function (e) {
		
		if($(this).hasClass('current')){
			e.preventDefault();
		}
	});
		
});//document