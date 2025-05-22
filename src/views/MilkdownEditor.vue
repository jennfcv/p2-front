<!-- MilkdownEditor.vue -->
<template>
    <Milkdown />
  </template>
  
  <script>
    import { Editor, rootCtx, defaultValueCtx } from "@milkdown/kit/core";
    import { commonmark } from "@milkdown/kit/preset/commonmark";
    import { nord } from "@milkdown/theme-nord";
    import { Milkdown, useEditor } from "@milkdown/vue";
    import { defineComponent } from "vue";
  
    export default defineComponent({
      name: "MilkdownEditor",
      components: {
        Milkdown,
      },
      setup: () => {
        useEditor((root) =>
          Editor.make()
            .config((ctx) => {
              ctx.set(rootCtx, root);
            })
            .config(nord)
            .use(commonmark),
        );
      },
    });
  </script>