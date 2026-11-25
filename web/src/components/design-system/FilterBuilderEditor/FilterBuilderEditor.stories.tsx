import { fn } from "storybook/test";
import { type ComponentProps } from "react";
import preview from "@/.storybook/preview";
import { FilterBuilderEditor } from "./FilterBuilderEditor";

const defaultArgs = {
  columns: [
    { id: "name", name: "Name", type: "string", internal: "name" },
    {
      id: "tags",
      name: "Tags",
      type: "arrayOptions",
      internal: "tags",
      options: [{ value: "production" }, { value: "staging" }],
    },
  ],
  columnsWithCustomValues: ["tags"],
  initialFilters: [],
  onChange: fn(),
} satisfies ComponentProps<typeof FilterBuilderEditor>;

const meta = preview.meta({ component: FilterBuilderEditor });

export const Default = meta.story({ args: defaultArgs });
