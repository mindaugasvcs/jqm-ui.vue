<template>
    <div>
        <template v-if="pickingMode == 'days'">
            <div class="ui-datepicker-header ui-body-inherit">
                <a v-on:click="prevMonth"
                    v-on:keydown.enter="prevMonth"
                    class="ui-datepicker-prev ui-corner-all ui-btn ui-btn-icon-notext ui-btn-inline ui-icon-arrow-l ui-shadow"
                    title="Prev"
                    tabindex="0"></a>
                <div class="ui-datepicker-title">
                    <button v-on:click="changePickingMode" type="button" class="ui-btn ui-btn-inline">{{ months[currentMonth] }} {{ currentYear }}</button>
                </div>
                <a v-on:click="nextMonth"
                    v-on:keydown.enter="nextMonth"
                    class="ui-datepicker-next ui-corner-all ui-btn ui-btn-icon-notext ui-btn-inline ui-icon-arrow-r ui-shadow"
                    title="Next"
                    tabindex="0"></a>
            </div>
            <table ref="table" class="ui-datepicker-calendar" tabindex="-1">
                <thead>
                    <tr>
                        <th v-for="(w, i) in 7" class="ui-bar-inherit"><span v-bind:title="weekDays[i]">{{ weekDays[i] | substr(0, 2) }}</span></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in rows">
                        <template v-if="row === 1">
                            <td v-for="d in blankDaysBefore" class="ui-body-inherit"></td>
                            <td v-for="d in (7 - blankDaysBefore)" class="ui-body-inherit">
                                <a v-on:click="selectDay(d)"
                                    v-on:keydown.enter="selectDay(d)"
                                    class="ui-btn"
                                    v-bind:class="dayClass(d)"
                                    tabindex="0">{{ d }}</a>
                            </td>
                        </template>
                        <template v-else-if="row === rows">
                            <td v-for="d in (7 - blankDaysAfter)" class="ui-body-inherit">
                                <a v-on:click="selectDay(renderDay(d, row))"
                                    v-on:keydown.enter="selectDay(renderDay(d, row))"
                                    class="ui-btn"
                                    v-bind:class="dayClass(renderDay(d, row))"
                                    tabindex="0">{{ renderDay(d, row) }}</a>
                            </td>
                            <td v-for="d in blankDaysAfter" class="ui-body-inherit"></td>
                        </template>
                        <template v-else>
                            <td v-for="d in 7" class="ui-body-inherit">
                                <a v-on:click="selectDay(renderDay(d, row))"
                                    v-on:keydown.enter="selectDay(renderDay(d, row))"
                                    class="ui-btn"
                                    v-bind:class="dayClass(renderDay(d, row))"
                                    tabindex="0">{{ renderDay(d, row) }}</a>
                            </td>
                        </template>
                    </tr>
                </tbody>
            </table>
        </template>

        <template v-else-if="pickingMode == 'months'">
            <div class="ui-datepicker-header ui-body-inherit">
                <a v-on:click="prevYear(1)"
                    v-on:keydown.enter="prevYear(1)"
                    class="ui-datepicker-prev ui-corner-all ui-btn ui-btn-icon-notext ui-btn-inline ui-icon-arrow-l ui-shadow"
                    title="Prev"
                    tabindex="0"></a>
                <div class="ui-datepicker-title">
                    <button v-on:click="changePickingMode" type="button" class="ui-btn ui-btn-inline">{{ currentYear }}</button>
                </div>
                <a v-on:click="nextYear(1)"
                    v-on:keydown.enter="nextYear(1)"
                    class="ui-datepicker-next ui-corner-all ui-btn ui-btn-icon-notext ui-btn-inline ui-icon-arrow-r ui-shadow"
                    title="Next"
                    tabindex="0"></a>
            </div>
            <table ref="table" class="ui-datepicker-calendar" tabindex="-1">
                <tbody>
                    <tr v-for="(r, i) in 4">
                        <td v-for="(n, m) in 3" class="ui-body-inherit">
                            <a v-on:click="selectMonth(m + i * 3)"
                                v-on:keydown.enter="selectMonth(m + i * 3)"
                                class="ui-btn"
                                v-bind:class="monthClass(m + i * 3)"
                                tabindex="0">{{ months[m + i * 3] }}</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </template>

        <template v-else-if="pickingMode == 'years'">
            <div class="ui-datepicker-header ui-body-inherit">
                <a v-on:click="prevYear(10)"
                    v-on:keydown.enter="prevYear(10)"
                    class="ui-datepicker-prev ui-corner-all ui-btn ui-btn-icon-notext ui-btn-inline ui-icon-arrow-l ui-shadow"
                    title="Prev"
                    tabindex="0"></a>
                <div class="ui-datepicker-title">
                    <button v-on:click="changePickingMode" type="button" class="ui-btn ui-btn-inline">{{ startYear }} - {{ startYear + 9 }}</button>
                </div>
                <a v-on:click="nextYear(10)"
                    v-on:keydown.enter="nextYear(10)"
                    class="ui-datepicker-next ui-corner-all ui-btn ui-btn-icon-notext ui-btn-inline ui-icon-arrow-r ui-shadow"
                    title="Next"
                    tabindex="0"></a>
            </div>
            <table ref="table" class="ui-datepicker-calendar" tabindex="-1">
                <tbody>
                    <tr v-for="(r, i) in 4">
                        <td v-for="(n, m) in 3" class="ui-body-inherit">
                            <a v-on:click="selectYear(startYear + m + i * 3)"
                                v-on:keydown.enter="selectYear(startYear + m + i * 3)"
                                class="ui-btn"
                                v-bind:class="yearClass(startYear + m + i * 3)"
                                tabindex="0">{{ startYear + m + i * 3 }}</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </template>
    </div>
</template>

<script>
    export default {
        props: {
            value: String,
            language: {
                type: String,
                default: "en"
            }
        },
        data() {
            return {
                selectedYear: null,
                selectedMonth: null,
                selectedDay: null,
                currentYear: null,
                currentMonth: null,
                pickingMode: 'days',
                weekDaysTranslations: {
                    en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                    es: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
                    fr: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
                    ru: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
                    pt: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
                    de: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
                    it: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
                    lt: ['Sekmadienis', 'Pirmadienis', 'Antradienis', 'Trečiadienis', 'Ketvirtadienis', 'Penktadienis', 'Šeštadienis']
                },
                monthsTranslations: {
                    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                    es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                    fr: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
                    ru: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                    pt: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
                    de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
                    it: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
                    lt: ['Sausis', 'Vasaris', 'Kovas', 'Balandis', 'Gegužė', 'Birželis', 'Liepa', 'Rugpjūtis', 'Rugsėjis', 'Spalis', 'Lapkritis', 'Gruodis']
                }
            };
        },
        computed: {
            blankDaysBefore() {
                return (new Date(this.currentYear, this.currentMonth, 1)).getDay();
            },
            blankDaysAfter() {
                return 6 - (new Date(this.currentYear, this.currentMonth, this.daysInMonth(this.currentYear, this.currentMonth))).getDay();
            },
            rows() {
                return (this.blankDaysBefore + this.daysInMonth(this.currentYear, this.currentMonth) + this.blankDaysAfter) / 7;
            },
            startYear() {
                return Math.floor(this.currentYear / 10) * 10;
            },
            computedValue() {
                var result = (this.selectedYear ? this.selectedYear : "____") + "-";
                result += (this.selectedMonth !== null ? (this.selectedMonth < 9 ? "0" : "") + (this.selectedMonth + 1) : "__") + "-";
                result += (this.selectedDay !== null ? (this.selectedDay < 10 ? "0" : "") + this.selectedDay : "__");
                return result;
            },
            weekDays() {
                return this.weekDaysTranslations[this.language];
            },
            months() {
                return this.monthsTranslations[this.language];
            }
        },
        methods: {
            daysInMonth (year, month) {
                var numberOfDays;

                if (month === 3 || month === 5 || month === 8 || month === 10) {
                    numberOfDays = 30;
                } else if (month === 1) {
                    if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) { // isLeapYear
                        numberOfDays = 29;
                    } else {
                        numberOfDays = 28;
                    }
                } else {
                    numberOfDays = 31;
                }

                return numberOfDays;
            },
            dayClass(day) {
                return {
                    'ui-btn-active': this.currentYear === this.selectedYear && this.currentMonth === this.selectedMonth && day === this.selectedDay
                };
            },
            monthClass(month) {
                return {
                    'ui-btn-active': this.currentYear === this.selectedYear && month === this.selectedMonth
                };
            },
            yearClass(year) {
                return {
                    'ui-btn-active': year === this.selectedYear
                };
            },
            renderDay(d, row) {
                return (7 - this.blankDaysBefore) + d + (7 * (row - 2));
            },
            selectDay(day) {
                this.selectedYear = this.currentYear;
                this.selectedMonth = this.currentMonth;
                this.selectedDay = day;
                this.$emit('input', this.computedValue);
                this.$emit('complete');
            },
            selectMonth(month) {
                this.selectedYear = this.currentYear;
                this.selectedMonth = month;
                this.currentMonth = month;
                this.selectedDay = null;
                this.$refs.table.focus();
                this.pickingMode = 'days';
                this.$emit('input', this.computedValue);
            },
            selectYear(year) {
                this.selectedYear = year;
                this.currentYear = year;
                this.selectedDay = null;
                this.$refs.table.focus();
                this.pickingMode = 'months';
                this.$emit('input', this.computedValue);
            },
            prevMonth() {
                var d = new Date(this.currentYear, --this.currentMonth);
                this.currentYear = d.getFullYear();
                this.currentMonth = d.getMonth();
            },
            nextMonth() {
                var d = new Date(this.currentYear, ++this.currentMonth);
                this.currentYear = d.getFullYear();
                this.currentMonth = d.getMonth();
            },
            prevYear(value) {
                this.currentYear -= value;
            },
            nextYear(value) {
                this.currentYear += value;
            },
            changePickingMode() {
                if (this.pickingMode == 'days') {
                    this.pickingMode = 'months';
                } else if (this.pickingMode == 'months') {
                    this.pickingMode = 'years';
                }
            },
            parseDateString(str) {
                if (!str) return null;
                var result = str.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);

                if (result) {
                    result[1] = parseInt(result[1], 10);
                    result[2] = parseInt(result[2], 10) - 1;
                    result[3] = parseInt(result[3], 10);

                    if (!result[1] || result[2] === NaN || !result[3] || result[2] > 11 || result[3] > this.daysInMonth(result[1], result[2])) {
                        result = null;
                    }
                }

                return result;
            }
        },
        filters: {
            substr(str, indexStart, indexEnd) {
                if (!str) return '';
                return str.substring(indexStart, indexEnd);
            }
        },
        created() {
            var date;

            if (date = this.parseDateString(this.value)) {
                this.currentYear = date[1];
                this.currentMonth = date[2];
                this.selectDay(date[3]);
            } else {
                var now = new Date();
                this.currentYear = now.getFullYear();
                this.currentMonth = now.getMonth();
            }
        }
    }
</script>
