print = function(str) {console.log(str)}
let notif_timeout;

var annound = new Audio('announce.wav');
annound.volume = 1
setInterval(function(){
	$("#time").html(moment().format("HH:mm"))
	$("#date").html(moment().format("ddd DD"))
}, 1000)

function per(num, amount){
	return (num*amount/100) - num;
}

window.addEventListener('message', (event) => {
	var data = event.data

	if (data.action == "tick_notif") {
		if (notif_timeout) clearTimeout(notif_timeout);

		$(".tick-notif").fadeIn(200).css("display", "flex")
		$(".tick-notif").html(data.message)

		notif_timeout = setTimeout(()=>{
			$(".tick-notif").fadeOut(200)
		}, data.timeout + 50)
	}

	if (data.action == "map_update") {
		/*$(".navigation").css("width", data.width + "vw")
		$(".navigation").css("margin-left", (data.x /4.5) + "px")*/
		$(".tick-notif").css("width", (data.width/1.1) + "vw")
	}

	if (data.action == "inVeh") {
		if (data.value) {
			$(".speedo").fadeIn(100)
		};

		if (!data.value) {
			$(".speedo").fadeOut(100)
		}
	}

	if (data.action == "veh_update") {
		$(".carhp").stop().animate({"stroke-dashoffset": per(120.863, data.hp/10)}, 5)
		if (data.hp < 250) {
			$(".carhp").css("stroke", "red")
			$(".wrench").css("color", "red")
		} else {
			$(".carhp").css("stroke", "white")
			$(".wrench").css("color", "white")
		}

		$(".carfuel").stop().animate({"stroke-dashoffset": per(120.871, data.fuel)}, 5)
		if (data.fuel < 30) {
			$(".carfuel").css("stroke", "red")
			$(".pumpa").css("color", "red")
		} else {
			$(".carfuel").css("stroke", "white")
			$(".pumpa").css("color", "white")
		}


		$(".speedo").find(".speed-digit").html(data.speed)
		if (data.onoff != false) {
			$(".brzino").stop().animate({'stroke-dashoffset': per(358.726, data.rpm*100)}, 5)
		}
		else{
			$(".brzino").stop().animate({'stroke-dashoffset': per(358.726, 0)}, 5)
		}

	}

	if (data.action == "update-talk") {
		if (data.value) {
			$(".mic_notif").css("color", "green")
		} else {
			$(".mic_notif").css("color", "white")
		}

	}

	if (data.action == "update-ammo") {
		if (data.isArmed) {
			$("#ammo_count").html(`
				${data.ammo}/${data.max_ammo}
			`)
			$(".ammo").fadeIn(250)
		} else {
			$(".ammo").fadeOut(250)
		}
	}

	if (data.action == "update-bars") {
		
		if (data.location) {
			$(".street").find("span").html(data.location.street)
		}

		if (data.voice) {
			$("#mic_volume").html(`<i class="fal fa-signal-${data.voice}"></i>`)
			if (data.voice == 1) {
				$("#voicehud2").stop().animate({'stroke-dashoffset': per(258.544, 33)}, 5)
				$("#voicehud3").stop().animate({'stroke-dashoffset': per(258.544, 33)}, 5)
			}
			if (data.voice == 2) {
				$("#voicehud2").stop().animate({'stroke-dashoffset': per(258.544, 66)}, 5)
				$("#voicehud3").stop().animate({'stroke-dashoffset': per(258.544, 66)}, 5)
			}
			if (data.voice == 3) {
				$("#voicehud2").stop().animate({'stroke-dashoffset': per(258.544, 100)}, 5)
				$("#voicehud3").stop().animate({'stroke-dashoffset': per(258.544, 100)}, 5)
			}

		}

		if (data.is_radion) {
			$("#mic_notif_icon").attr("class", "fas fa-walkie-talkie mic_notif")
		} else {
			$("#mic_notif_icon").attr("class", "fas fa-microphone mic_notif")
		}

		if (data.safe_job) {
			$(".safe_job").fadeIn(500)
			$(".safe_job2").fadeIn(500)
		} else {
			$(".safe_job").fadeOut(500)
			$(".safe_job2").fadeOut(500)
		}
		
		if (data.oxygen) {
			var current_oxygen = per(258.544, data.oxygen)
			if (data.oxygen == 100 || data.oxygen <= 0) {
				$(".air2").fadeOut(500)
				$(".hud2-air").fadeOut(500)
			}
			 else {
				$(".air2").fadeIn(500)
				$(".hud2-air").fadeIn(500)
				$(".air").stop().animate({'stroke-dashoffset': current_oxygen}, 5)
			}
		}
		
		if (data.health) {

            if (data.health > 0) {
                $(".hp").fadeIn(100)
                $(".hp").stop().animate({'stroke-dashoffset': per(258.544, data.health)}, 5)
            }
        }

		if (data.armour != undefined) {
			$(".arm").stop().animate({'stroke-dashoffset': per(259.558, data.armour)}, 5)
		}

		if (data.hunger) {
			$(".hrana").stop().animate({'stroke-dashoffset': per(260.576, data.hunger)}, 5)
		}

		if (data.thirst) {
			$(".voda").stop().animate({'stroke-dashoffset': per(259.56, data.thirst)}, 5)
		}
	}

	if (data.action == "Hide_Hud") {
		if (data.value) {
			$(".hud").fadeOut(300)
			/*$(".navigation").fadeOut(500)*/
		};
		if (!data.value) {
			$(".hud").fadeIn(300)
			/*$(".navigation").fadeIn(500)*/
		};
	}


	if (data.action == "add_notification") {
		let duration = data.duration
		let type = data.type || "primary"

		let new_notif = $(`
			<div class="notifikacija">
			    <div class="ikonica-notif"><i id="icon" class="${
			    	(type == "primary" && "fal fa-info-square") || (type == "error" && "fal fa-exclamation-square") ||
			    	(type == "done" && "fal fa-check-square") || "fal fa-info-square"
			    }"></i></div>
			    <div class="divider"></div>
			    <div class="tekst-notif">${data.content}</div>
			    <div class="loading"><div class="loading-inner"></div></div>
			</div>
		`).css("right", -500).css("--color", 
			(type == "primary" && "#ff5c00") || (type == "error" && "#ff0000") ||
			(type == "done" && "#10c400") || "#ff5c00"
		)

		new_notif.animate({right:'10px'}, 1500).promise().done(function(){
		    new_notif.find(".loading-inner").animate({width: '100%'}, duration).promise().done(function(){
		    	new_notif.animate({right: '-1000px'}, 500).promise().done(function(){
		    		new_notif.remove()
		    	})
		    })
		});

		$(".notif-holder").append(new_notif)
	}

	if (data.action == "add_announce") {
		var tekst = data.content
		var duzina = tekst.length
			if (duzina > 30) {
				$(".tekst-announce").css({"font-size": "1.8vh"});
			}
			if (duzina > 60) {
				$(".tekst-announce").css({"font-size": "1.5vh"});
			}
			else {
				$(".tekst-announce").css({"font-size": "2.5vh"});
			}
		$(".tekst-announce").html(data.content)
		$(".sender-name").html(data.sender)
		$(".announce").animate({top:'0'},500).promise().done(()=>{
			$(".announce-loading-inner").animate({width: '100%'}, data.duration).promise().done(()=>{
				$(".announce").animate({top: '-1000px'},500).promise().done(()=>{ 
					$(".announce-loading-inner").css({width: '0%'})
				})
			})
		});
		//annound.play();
	}
	if (data.action == "minimalistic") {
		if (data.value) {
			$(".sat").hide()
			$(".ekran").css({"background-color" : "#050505",
							"width": "150px",
							"height": "150px",
							'border-radius': '500px',
							"position": "absolute",
							'bottom': '-55px',
							'right': '80px',
							})
			$(".smartwatch").css({
							'position': 'relative',
							'margin-bottom': '0vh',
							'height': '16.2vh',
							'width': '200px',
							'scale': '0.6',
							'float': 'left',
							})
		};
		if (!data.value) {
			$(".sat").show()
			$(".ekran").css({
							'background-color': '#050505',
							'border-radius': '500px',
							'width': '150px',
							'height': '150px',
							'position': 'absolute',
							'bottom': '10px',
							'right': '46px',
							})
			$(".smartwatch").css({
							'position': 'relative',
							'margin-bottom': '0vh',
							'height': '16.2vh',
							'width': '200px',
							'scale': '0.8',
							'float': 'left',
							})
		};
	}
	if (data.action == "smanji") {
		if (data.value) {
			$(".smartwatch").css({"scale" : "0.5",
								"bottom" : "-6vh",
								})
		};
		if (!data.value) {
			$(".smartwatch").css({"scale" : "0.8",
								"bottom" : "-2vh",
								})
		};
	}
	if (data.action == "job") {
		if (data.value) {
			$(".job-holder").fadeIn(500)
		};
		if (!data.value) {
			$(".job-holder").fadeOut(500)
		};
	}

	if (data.action == "update_job_info") {
		//console.log(data.job)
		$(".job").html(`
			${data.job_label} - ${data.job_grade_label}
		`)
	}

	if (data.action == "hud1") {
			$(".hud3").fadeOut(200)
			$(".hud2").fadeOut(200)
			$(".smartwatch").fadeIn(200)
	}

	if (data.action == "hud2") {
			$(".smartwatch").fadeOut(200)
			$(".hud3").fadeOut(200)
			$(".hud2").fadeIn(200)
	}

	if (data.action == "hud3") {
		$(".smartwatch").fadeOut(200)
		$(".hud2").fadeOut(200)
		$(".hud3").fadeIn(200)
}
})