import { useState, type ComponentProps } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import preview from "@/.storybook/preview";
import { ControlledFilterBuilderEditor } from "./ControlledFilterBuilderEditor";

const defaultArgs = {
  columns: [{ id: "name", name: "Name", type: "string", internal: "name" }],
  draft: [{}],
  onDraftChange: fn(),
  picker: null,
  onPickerChange: fn(),
  onChange: fn(),
} satisfies ComponentProps<typeof ControlledFilterBuilderEditor>;

const meta = preview.meta({ component: ControlledFilterBuilderEditor });

export const ExternalDraft = meta.story({
  args: defaultArgs,
  render: function Render(args) {
    const [draft, setDraft] = useState<
      ComponentProps<typeof ControlledFilterBuilderEditor>["draft"]
    >(args.draft);
    const [picker, setPicker] = useState<
      ComponentProps<typeof ControlledFilterBuilderEditor>["picker"]
    >(args.picker);

    return (
      <>
        <ControlledFilterBuilderEditor
          {...args}
          draft={draft}
          picker={picker}
          onPickerChange={(next) => {
            setPicker(next);
            args.onPickerChange(next);
          }}
          onDraftChange={(next) => {
            setDraft(next);
            args.onDraftChange(next);
          }}
        />
        <button
          type="button"
          onClick={() => {
            setPicker(null);
            setDraft([{}]);
          }}
        >
          Reset draft
        </button>
      </>
    );
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByLabelText("Column"));
    await expect(args.onPickerChange).toHaveBeenCalledWith({
      rowIndex: 0,
      field: "column",
      search: "",
    });
    await userEvent.click(await page.findByRole("option", { name: "Name" }));

    await expect(canvas.getByRole("textbox", { name: "Value" })).toBeVisible();
    await expect(args.onDraftChange).toHaveBeenCalledWith([
      expect.objectContaining({ column: "Name", operator: "=" }),
    ]);
    await expect(args.onChange).toHaveBeenCalledWith([]);

    await userEvent.click(canvas.getByRole("button", { name: "Reset draft" }));
    await expect(
      canvas.queryByRole("textbox", { name: "Value" }),
    ).not.toBeInTheDocument();
  },
});
