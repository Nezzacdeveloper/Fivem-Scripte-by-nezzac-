ESX              = nil
TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)
local grupe = {
    'glavni',
    'direktor',
    'menadzer',
    'vstaffa',
    'vodja',
    'suvlasnik',
    'developer',
    'owner',
    'headadmin',
    'vuleticnele',
}

RegisterCommand('obavestenje', function(source, args)
    local src = source
    local xPlayer  = ESX.GetPlayerFromId(src)
    local grupe = xPlayer.getGroup()
    poruka = table.concat(args, ' ', 1)
    if grupe  == 'user' or grupe  == 'vip' or grupe  == 'headadmin' or grupe  == 'admin' or grupe  == 'superadmin' or grupe  == 'helper' or grupe  == 'rpadmin' or grupe  == 'eventadmin' or grupe  == 'headstaff'  then
        TriggerClientEvent('okokNotify:Alert', source, 'Greska', 'Nemas permisije!', 5000, 'error', playSound)
    else
        TriggerClientEvent("monaco:serverobavjestenje",  -1, poruka, GetPlayerName(source))
    end
end)