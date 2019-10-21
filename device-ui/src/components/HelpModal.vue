<template lang="pug">
.row
  .col-12
    h5 Описание
    p Аппаратоно технлогический комплекс Умные полки создан для оптимизации сортировки почтовых писем и отпарвлений 
    h5 Что нужно перед началом
    p В компрелкт полки идет 
      ul
        li 24 LED индиккатора
        li Модуль управления, блокпитание
        li USB хаб для подключения туда весов и принтера
        li Thor
        li Весы
        li Принтер
    h5 Подключение
    p Необходимо все подключить по следующей схеме
    h5 Подготовка и Тестирование
    p Штрихкода для пользователей должны начинатся с <b>u</b> и далее логин например <b>utest</b> и далее нужно передать Enter
    p Штрихкода для полок должны начинатся с <b>p</b> и далее номер/индекс полки например <b>p505000</b> или <b>p#1</b> и далее нужно передать Enter
    p Штрихкода посылок должны иметь 13значенное число например <b>KZ123456789EZ</b>

    h3 Настройка программного обеспечения
    h5 Установка ПО и Настройка
    p Заходите на сайт, устанавливаете технологический индекс, подгружаете сортплан, 
    h5 Процесс Сортировки
    p Авторизируйтесь бейджиком под своим логином в ПУС, и далее начинаете сканировать РПО,
    h5 Edge-case
    p Если РПО ненайдено, либо индекс ненайден в сортплане, если произошла актовка, необходимо все кинуть в отстойник

    h3 Настройка оборудования
    h5 Thor
    p Установить ярлык на pls.post.kz/polki/
    p Отредактивароть CORS в Браузере
    p Настроено 2 айпиадреса
    p Экран необходимо откалибровать для корректной работы
    h5 Штрихкод сканер
    p У штрихкод сканера должна быть выставлен режим переноса строки ( Enter ) после каждого сканирования
    h5 Весы
    p Весы должны поддерживать ввод с клавиатуры
    h5 Принтер
    p Принтер ярлыков должен поддерживать EPL скриптовый язык, Утилита для настройки принтера 
      a(href="https://support.honeywellaidc.com/servlet/fileField?entityId=ka02K000000DjwLQAS&amp;field=File_1__Body__s") скачать, В притере выставить режим Generic/Text
    h5 WiFI сеть
    p Сеть желательно должна называться sortrack ее можно создать на Thorе
    h5 Доступ к серверу ПУС
    p Сеть желательно должна называться sortrack ее можно создать на Thorе
    h5 Модуль
    p Прошивку можно 
      a(href="static/firware/sortrack.fmw") скачать тут 

</template>

<script>

import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import Encoder from 'code-128-encoder'
var code128= new Encoder()

export default {
  name: 'Users',
  data () {
    return {
      // maxLeds: 24,
      deviceip:null,
      apiUrl:null
    }
  },
  computed:{
    ...mapGetters({
        settings: 'getSettingsSelected',
    })
  },
  methods:{
    ...mapActions([
      'settingsUpdate',
    ]),
    saveSettings(){    
      console.log('settgins updated');
      this.settingsUpdate(this.settings)
    },
    encode(val){
      return code128.encode(val)
    },
  }
}
</script>

<style scoped lang="stylus">

 .barcode
    font-family 'code128' !important
    font-size 22px  !important

</style>
