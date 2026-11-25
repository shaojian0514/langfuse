import { useState, type ComponentProps } from "react";
import { type FilterState } from "@langfuse/shared";
import { PopoverLayerProvider } from "@/src/context/LayerContext/PopoverLayerProvider";
import { ControlledFilterBuilderEditor } from "../ControlledFilterBuilderEditor/ControlledFilterBuilderEditor";

type ControlledEditorProps = ComponentProps<
  typeof ControlledFilterBuilderEditor
>;

export function FilterBuilderEditor({
  initialFilters,
  ...props
}: Pick<
  ControlledEditorProps,
  | "columns"
  | "columnsWithCustomValues"
  | "columnsHiddenUnlessSelected"
  | "operators"
  | "disabled"
  | "onAnalyticsEvent"
  | "getColumnNotice"
> &
  Required<Pick<ControlledEditorProps, "onChange">> & {
    /** Seed for this editing session. Remount to reset an in-progress draft. */
    initialFilters: FilterState;
  }) {
  const [draft, setDraft] = useState<ControlledEditorProps["draft"]>(
    initialFilters.length > 0 ? initialFilters : [{}],
  );
  const [picker, setPicker] = useState<ControlledEditorProps["picker"]>(null);
  const [optionLayer, setOptionLayer] = useState<HTMLDivElement | null>(null);

  return (
    <div className="ph-no-capture contents">
      <PopoverLayerProvider container={optionLayer}>
        <ControlledFilterBuilderEditor
          {...props}
          draft={draft}
          onDraftChange={setDraft}
          picker={picker}
          onPickerChange={setPicker}
        />
      </PopoverLayerProvider>
      <div ref={setOptionLayer} className="contents" />
    </div>
  );
}
