"use client";

import { useState } from "react";
import {
  ControlledSelectInput,
  type LocalSelectInputProps,
} from "../ControlledSelectInput/ControlledSelectInput";

export function SelectInput<V extends string>({
  search,
  ...props
}: Omit<LocalSelectInputProps<V>, "openState" | "search"> & {
  search?: { placeholder: string };
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  return (
    <ControlledSelectInput
      {...props}
      openState={{ open, onOpenChange: setOpen }}
      search={search && { ...search, value: query, onValueChange: setQuery }}
    />
  );
}
