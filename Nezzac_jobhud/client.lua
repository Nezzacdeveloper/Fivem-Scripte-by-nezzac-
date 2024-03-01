ESX = nil
local PlayerData = {}
local isAmmoboxShown = false

Citizen.CreateThread(function()
  while ESX == nil do
    TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)
    Citizen.Wait(10)
  end
	PlayerData = ESX.GetPlayerData()
end)

RegisterNetEvent('esx:setJob')
AddEventHandler('esx:setJob', function(job)
	PlayerData.job = job
end)


hudjob = false

RegisterNetEvent('esx:andzipodesijob')
AddEventHandler('esx:andzipodesijob', function()
	if hudjob == false then
	SendNUIMessage({action = 'gasiJob'})
	exports['okokNotify']:Alert("Monaco RP", "Hud je sada ugasen!", 5000, 'error')
	hudjob = true
	else
		SendNUIMessage({action = 'paliJob'})
		exports['okokNotify']:Alert("Monaco RP", "Hud je sada upaljen!", 5000, 'success')
		hudjob = false
	end
end)




Citizen.CreateThread(function()
	while true do
		Citizen.Wait(5000)

		PlayerData = ESX.GetPlayerData()

		if PlayerData.job then

			local jobName

			if PlayerData.job.label == PlayerData.job.grade_label then
				jobName = PlayerData.job.label
			else
				jobName = PlayerData.job.label .. ' - ' .. PlayerData.job.grade_label .. " | ID: " .. GetPlayerServerId(PlayerId()) .. " "
			end

			SendNUIMessage({
				action = 'setJob',
				data = jobName
			})
			
		end
	end
end)

Citizen.CreateThread(function()
 	while true do
		Citizen.Wait(200)
		local playerPed = PlayerPedId()
		local weapon, hash = GetCurrentPedWeapon(playerPed, 1)
			if(weapon) then
				isAmmoboxShown = true
				local _,ammoInClip = GetAmmoInClip(playerPed, hash)
				SendNUIMessage({
						action = 'setAmmo',
						data = ammoInClip..'/'.. GetAmmoInPedWeapon(playerPed, hash) - ammoInClip
				})
			else
				if isAmmoboxShown then
					isAmmoboxShown = false
					SendNUIMessage({
						action = 'hideAmmobox'
					})
				end
			end
			if IsPauseMenuActive() then
				SendNUIMessage({action = 'hideLogo'})
				SendNUIMessage({action = 'gasiJob'})
			elseif not IsPauseMenuActive() then
				SendNUIMessage({action = 'enableLogo'})
			end
			if not IsPauseMenuActive() and hudjob == false then
				SendNUIMessage({action = 'paliJob'})
		end
	end	
end)
