window.addEventListener('message', function(event) {
	let data = event.data
	novac = parseInt(data.novac)
	banka = parseInt(data.banka)
	brzina = parseInt(data.brzina)
	gorivo = parseInt(data.gorivo)
	mjenjac = parseInt(data.mjenjac)
	motor = parseInt(data.motor)
	svijetla = parseInt(data.svijetla)
	blinkeri = parseInt(data.blinkeri)
	obrtaji = parseInt(data.obrtaji)
	$("#novac").html(novac)
	$("#banka").html(banka)

	$("#brzina_broj").html(brzina)
	$("#motor").html(motor+"%")
	$("#gorivo").html(gorivo+"%")
	$(".gorivo_bar").css("height",obrtaji+"%")
	if (blinkeri == 0){
		try{
			$("#b_right").removeClass("blinker")
			$("#b_left").removeClass("blinker")
		}catch{}
	}
	if (blinkeri == 2){
		$("#b_left").addClass("blinker")
		try{$("#b_right").removeClass("blinker")}catch{}
	}
	if (blinkeri == 1){
		$("#b_right").addClass("blinker")
		try{$("#b_left").removeClass("blinker")}catch{}
	}
	if (blinkeri == 3){
		$("#b_right").addClass("blinker")
		$("#b_left").addClass("blinker")
	}




	if (svijetla == 1){
		$("#svijetla").attr("style","fill:#fff9ba")
	}
	else if (svijetla == 2){
		$("#svijetla").attr("style","fill:#ffea00;filter:drop-shadow(0px 0px 20px #ffea0070)")
	}
	else{
		$("#svijetla").attr("style","")
	}

	if (data.auto == true){
		$(".brzinomjer").show("fast")
	}
	else{
		$(".brzinomjer").hide("fast")
	}
});