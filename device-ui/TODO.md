TODO 
+ bug:utest
+ ui:demoPrintModal
+ ui:techindex setup 
+ ui:aboutModal
+ ui:helpModal
+ ui:badgeModal
+ ui:wallpaper
+ ui:second scan logout
+ ui:weight by keyboard
+ ui:autofocus weight by default
+ ui:mock weight
+ autoprint toggle
+ ui:polish print templates

+ ui:multiled setup
+ bug:calibrate 0 wrong
+ ui:calibrate with bind index also
+ settings base url



TODO Kenmat
+ bug:user.login putToBag
+ Keyboard keyCode for "."
+ Keyboard keyCode for "."
+ modal sortplan button bottom
+ fetchRPO error simulate
+ bug:close modal dialog not working

+ wrong login error shake
+ thor tab different color ( цвет активного таба тора должен быть примечательным )
+ bug: sortplan length
+ closeBag button grey
+ Design yarlik print template for Label Printer
+ last closeBag respone save, and show button
? weight format, without .
+ bug:calibrate blink timeout too quick
+ sortplan подгружает старый индекс если без refresh
+ led connect error show
+ manuaL:calbrate screen 
+ manuaL:spd link, GenericText
+ manual: be carefull cors
+ manual: link for firmware
+ bug:afterscantimeout close modal null error
+ close modal fix height if multiple also


+ Ограничение веса 15 кг - Тима
+ Обязательное поле пломба - Тима
- Не корректно указывается вес - Тима
+ в ярлыке отображать вид заделки и техиндекс, ПУС эти поля передает
+ LedOn on error network only ( not 404 )
- Аварийная ячейка
- multiled configure 48, or splitted

--- multithor websocket support 8080

- calibrate ui issue: при калибровке вводит заблуждение красная рамка на ячейках которая перемещается, иногда она показывает не в тему. Предлагаю убрать. А откалиброванные ячейки отмечать зеленным.

- test all templates
- test whole process

--- yarlik native print try
- calibrate without login
- bug:reinint clears led settings
- led:search blink not working
- ui: polish ui design of closeModal tabs or list
- ui: animate weight and make sound
- last bag led if 2-3modules
- toogle DEMO refresh issue
- silent print

TODO 4.0
- overcome https issue for LEDs
- overcome https CORS for PUS Server
- ui:sortplan editable
+ refactor:localStorage to idb
- print native EPL codes
- ui:logo swipe
- ui:fullscreen icon
- led lenght and multitor ranges
- autofocus weight input
- apply mock without refresh
- move all to settings


HARDWARE TODO
1) установка IP адреса статичного через WIFI Manager
2) автоподключение к сорттак вафай сети
3) добавить логику 2 выходов
4) повозможности сделать прошивку обновляемую через OTA
5) добавить Websocket сервер или MQTT Broker
6) использовать второе ядро
7) прокси печать