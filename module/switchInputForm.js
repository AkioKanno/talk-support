$(function() {
	var params = (new URL(document.location)).searchParams;
	var input_mode = params.get("mode");
	if(input_mode == "chat") {
		$(".chat-form").show();
		$(".voice-form").hide();
	} else if(input_mode == "voice") {
		$(".chat-form").hide();
		$(".voice-form").show();
	} else {
        $(".chat-form").show();
		$(".voice-form").hide();
    }
});