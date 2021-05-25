<template>
    <div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset ui-input-has-clear" v-bind:class="classObject">
        <input ref="input" type="file"
            v-bind:id="id"
            v-bind:name="name"
            v-bind:accept="accept"
            v-on:change="onChange($event.target)"
            v-on:focus="focused=true"
            v-on:blur="focused=false">
        <label v-bind:for="id">{{ labelText }}</label>
        <a class="ui-input-clear ui-btn ui-btn-icon-notext ui-icon-delete ui-corner-all" tabindex="-1" title="Reset"
            v-bind:class="{'ui-input-clear-hidden': !fileName}"
            v-on:click="reset"></a>
    </div>
</template>

<script>
    export default {
        props: {
            id: String,
            name: String,
            accept: String, // "image/jpeg" or "image/*"
            maxSize: {
                type: Number,
                default: 67108864 // 64MB
            },
            mini: Boolean,
            language: {
                type: String,
                default: "en"
            }
        },            
        data() {
            return {
                fileName: "",
                focused: false,
                errors: [],
                labelTranslations: {
                    en: 'Browse...',
                    es: 'Examinar...',
                    fr: 'Parcourir...',
                    ru: 'Обзор...',
                    pt: 'Procurar...',
                    de: 'Durchsuchen...',
                    it: 'Sfoglia...',
                    lt: 'Naršyti...'
                },
                errorsTranslations: {
                    emptyFile: {
                        en: 'Empty file selected.',
                        es: 'Archivo vacío seleccionado.',
                        fr: 'Fichier vide sélectionné.',
                        ru: 'Пустой файл выбран.',
                        pt: 'Arquivo vazio selecionado.',
                        de: 'Leere Datei ausgewählt.',
                        it: 'File vuoto selezionato.',
                        lt: 'Pasirinktas tuščias failas.'
                    },
                    unknownType: {
                        en: 'Unknown file type.',
                        es: 'Tipo de archivo desconocido.',
                        fr: 'Type de fichier inconnu.',
                        ru: 'Неизвестный тип файла.',
                        pt: 'Tipo de ficheiro desconhecido.',
                        de: 'Unbekannter Dateityp.',
                        it: 'Tipo di file sconosciuto.',
                        lt: 'Nežinomas failo tipas.'
                    },
                    sizeTooLarge: {
                        en: 'File size is too large. Up to {size} allowed.',
                        es: 'El tamaño del archivo es demasiado grande. Hasta {size} permitidos.',
                        fr: "La taille du fichier est trop grande. Jusqu'à {size} autorisés.",
                        ru: 'Размер файла слишком велик. Допускается до {size}.',
                        pt: 'O tamanho do arquivo é muito grande. Até {size} permitidos.',
                        de: 'Die Dateigröße ist zu groß. Bis zu {size} erlaubt.',
                        it: 'La dimensione del file è troppo grande. Sono ammessi fino a {size}.',
                        lt: 'Failo dydis per didelis. Leidžiama iki {size}.'
                    }
                }
            };
        },
        computed: {
            classObject() {
                return {
                    'ui-mini': this.mini,
                    'ui-focus': this.focused
                };
            },
            labelText() {
                if (this.fileName) {
                    return this.fileName;
                } else {
                    return this.labelTranslations[this.language];
                }
            }
        },
        methods: {
            extractFilename(path) {
                var u = path.lastIndexOf('/');
                var w = path.lastIndexOf('\\');
                if (path.substr(0, 12) == "C:\\fakepath\\") {
                    path = path.substr(12); // modern browser
                } else if (u >= 0) { // Unix-based path
                    path = path.substr(u + 1);
                } else if (w >= 0) { // Windows-based path
                    path = path.substr(w + 1);
                }
                return path;
            },
            prettifyFileSize(bytes) {
                let result = bytes + " B";
                const suffixes = ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
                for (let multiple = 0; bytes >= 1; bytes /= 1024, multiple++) {
                    result = bytes.toFixed(0) + " " + suffixes[multiple];
                }
                return result;
            },
            validateFile(file) {
                if (file.size == 0) {
                    this.errors.push(this.errorsTranslations.emptyFile[this.language]);
                } else if (file.size > this.maxSize) {
                    this.errors.push(this.errorsTranslations.sizeTooLarge[this.language].replace("{size}", this.prettifyFileSize(this.maxSize)));
                }
                if (!file.type) {
                    this.errors.push(this.errorsTranslations.unknownType[this.language]);
                }
                return this.errors.length === 0;
            },
            onChange(element) {
                if (element.value) this.change(element);                
            },
            change(element) {
                this.fileName = this.extractFilename(element.value);
                this.errors = [];
                if (element.files.length) {
                    if (this.validateFile(element.files[0])) {
                        this.$emit('change', element.files[0]);
                    } else {
                        this.$emit('change', null);
                    }
                } else {
                    this.$emit('change', null);
                }
                this.$emit('error', this.errors);
            },
            reset() {
                this.$refs.input.value = null;
                this.change(this.$refs.input);
            }
        }
    }
</script>

<style>
.ui-input-text [type="file"] {
    position: absolute !important;
    height: 1px !important;
    width: 1px !important;
    overflow: hidden !important;
    clip: rect(1px, 1px, 1px, 1px) !important;
}
.ui-input-text label {
    margin: 0;
    padding: .4em;
    line-height: 1.4em;
    cursor: pointer;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.ui-input-text.ui-mini label {
    font-size: 14px;
}
</style>