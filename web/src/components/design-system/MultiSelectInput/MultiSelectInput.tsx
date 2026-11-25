"use client";

import { useState, type Ref } from "react";
import {
  ControlledMultiSelectInput,
  type ControlledMultiSelectInputProps,
} from "../ControlledMultiSelectInput/ControlledMultiSelectInput";

export function MultiSelectInput<V extends string>(
  props: Omit<
    ControlledMultiSelectInputProps<V>,
    "openState" | "searchState"
  > & {
    ref?: Ref<HTMLButtonElement>;
  },
) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  return (
    <ControlledMultiSelectInput
      {...props}
      openState={{ open, onOpenChange: setOpen }}
      searchState={{ value: search, onValueChange: setSearch }}
    />
  );
}
