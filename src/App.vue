<template>
    <div id="app" style="width: 100%; height: 90vh">
        <h2>{{ title }}</h2>
        <sequence-diagram :data-list="dataList" @line-click="onClick" />
    </div>
</template>

<script>
import SequenceDiagram from "./lib/SequenceDiagram";
var run_query_monitor = [
    {
        label: "100ms",
        from: "Monitored Object Viewer",
        to: "Monitored Object",
        note: "setState()",
        isDash: 0,
    },
    {
        label: "",
        name: "Monitored Object",
        note: "notify()",
        isDash: 0,
    },
    {
        label: "",
        from: "Monitored Object",
        to: "Monitored Object Viewer",
        note: "update()",
        isDash: 0,
    },
    {
        label: "",
        from: "Monitored Object Viewer",
        to: "Monitored Object",
        note: "getState()",
        isDash: 0,
    }
];

export default {
    name: "app",
    data() {
        return {
            dataList: run_query_monitor, ////////////////// put your data here //////////////////
            title: "run_query_monitor",
        };
    },
    components: {
        SequenceDiagram,
    },
    methods: {
        onClick(index, data) {
            alert("You clicked: " + (index + 1) + "个");
        },
    },
};
</script>

<style></style>
