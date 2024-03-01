let isShowed = false
let ammoDisabled = false



$(function () {
	window.addEventListener('message', function (event) {
		switch (event.data.action) {
			case 'setJob':
				$('.job-name').text(event.data.data)
				break
			case 'gasiJob':
				$('.job-name').fadeOut()
				break
			case 'paliJob':
				$('.job-name').fadeIn()
				break
			case 'setAmmo':
				//$('#ammoBox').show()
				$('.ammo-div').fadeIn()
				$('.sarzer').text(event.data.data)
				break
			case 'hideAmmobox':
				$('.ammo-div').fadeOut()
				break
			case 'enableLogo':
				$('#logo_img').show()
				break
			case 'hideLogo':
				$('#logo_img').hide()
			break
		}
	})
})