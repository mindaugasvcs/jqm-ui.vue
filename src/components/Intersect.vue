<template>
    <component v-bind:is="tag" style="height: 1px;"></component>
</template>

<script>
    export default {
        props: ["options", "tag"],
        data() {
            return {
                observer: null
            };
        },
        mounted() {
            this.observer = new IntersectionObserver((entries) => {
                if (entries && entries[0].isIntersecting) {
                    this.$emit("intersect");
                }
            }, (this.options || {}));

            this.observer.observe(this.$el);
        },
        beforeDestroy() {
            this.observer.disconnect();
        }
    }
</script>
