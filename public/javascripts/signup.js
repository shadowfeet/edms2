$(document).ready(function(){
   //jquery UI implementation
   $('#register').button({disabled:true, icons: {secondary:"ui-icon-disk"}}).tooltip();
   $('#a_cancel').button({icons: {secondary:"ui-icon-close"}}).tooltip();
   $('input').val('');

   /*page actions------------------------------------------*/

   //inputs
   var t,u;
   $('input').on('keyup',function(e){
    clearTimeout(t);
		var e = $(this);
		var submit = $('#register');
		var inputs = 
		  [{  name:'username',
   			  token:/^\w{8,30}$/,
          errorEmpty:'Type-in any name',
   			  errorLength: 'Key-in a name 8 to 30 character long',
   			  errorInvalid:'Invalid Username, try another',
          errorRequest:'The name is already registered, choose another',
          requestUrl:'/script/verify',
   			  affirmText: 'Username is available',
          maxLength:30,
          minLength:8
   			},

   			{ name:'email',
   			  token:/^[\w\-_\+]+@[\w\-]+(\.\w{2,4})+$/,
          errorEmpty:'Type-in any active email',
   			  errorLength: 'Key-in an email 8 to 60 character long',
   			  errorInvalid:'Invalid E-mail, try another',
          errorRequest:'The email is already registered, choose another',
          requestUrl:'/script/verify',
   			  affirmText: 'Email is good',
          maxLength:60,
          minLength:8,
   			}];
		t = setTimeout(fs.u.ValidateForm,1500,e,inputs,submit,true);
   }).on('keydown',function(e){
          var element = $(this).parent().next(); 
          $(element).attr('src','').css({display:'none'});
   }); //end keyup 

   //redirect to home page
   $('#a_cancel').click(function(e) {
      e.preventDefault();
      location.replace('/');
   });

   //redirect to home page
   $('#register').click(function(e) {
      e.preventDefault();
      var u = $('input[name="username"]').val();
      var e = $('input[name="email"]').val();
      var data = {
        username:u,
        pass:null,
        email:e,
        type:'client',
        status:'inactive'
        };
      $.ajax({
        url: '/scripts/register',
        type:'POST',
        data: data,
        async: false,
        success: function(res) {
          if(res == 'ok'){
            $('#reg_win').replaceWith('<div id="confirmation"><p>Registration of new user succeeded.</p></div>');
            //remove form, show confirmation <p>
          } else {
            $('#reg_win').replaceWith('<div id="confirmation"><p>Could not register at this time, try again later.</p></div>');
            //inform that database if offline
            //redirect
          }         
        }
      });
      setTimeout(function(){
        location.replace('/');
      },5000);
   });

}); 