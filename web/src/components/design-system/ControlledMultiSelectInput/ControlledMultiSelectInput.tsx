"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Command as CommandPrimitive } from "cmdk";
import { DropdownIndicator } from "@/src/components/design-system/DropdownIndicator/DropdownIndicator";

import { cn } from "@/src/utils/tailwind";
import { useLayerContainer } from "@/src/context/LayerContext/LayerContext";
import { stopScrollPropagation } from "@/src/hooks/stopScrollPropagation";
import { InputControl } from "../internal/InputControl/InputControl";
import { InputDropdown } from "../internal/InputDropdown/InputDropdown";
import { type SelectDropdown } from "../SelectDropdown/SelectDropdown";

type MultiSelectOption<V> = {
  value: V;
  label: string;
  secondaryLabel?: string;
  disabled?: boolean;
};

export type ControlledMultiSelectInputProps<V> = {
  value: V[];
  options: MultiSelectOption<V>[];
  onValueChange: (newValue: V[]) => void;
  placeholder: string;
  selectedLabel: string;
  searchPlaceholder: string;
  emptyMessage: string;
  selectAllLabel?: string;
  /** Pure resolver; the search query is trimmed. */
  getAdditionalOption?: (context: {
    query: string;
  }) => MultiSelectOption<V> | undefined;
  error?: boolean;
  disabled?: boolean;
  openState: React.ComponentProps<typeof SelectDropdown>["openState"];
  searchState: { value: string; onValueChange: (value: string) => void };
} & Pick<
  React.ComponentPropsWithoutRef<"button">,
  "id" | "aria-describedby" | "aria-invalid" | "aria-label"
>;

export function ControlledMultiSelectInput<V extends string>({
  value,
  options,
  onValueChange,
  placeholder,
  selectedLabel,
  searchPlaceholder,
  emptyMessage,
  selectAllLabel,
  getAdditionalOption,
  error,
  disabled,
  openState,
  searchState,
  ref,
  ...triggerProps
}: ControlledMultiSelectInputProps<V> & {
  ref?: React.Ref<HTMLButtonElement>;
}) {
  const container = useLayerContainer("popover");
  const { open } = openState;
  const { value: search, onValueChange: setSearch } = searchState;
  const listId = React.useId();
  const query = search.trim();
  const candidate = getAdditionalOption?.({ query });
  const visibleOptions: MultiSelectOption<V>[] = getAdditionalOption
    ? [
        ...options,
        ...value
          .filter(
            (selected) => !options.some((option) => option.value === selected),
          )
          .map((selected) => ({ value: selected, label: selected })),
      ]
    : options;
  const additionalOption =
    candidate &&
    !visibleOptions.some((option) => option.value === candidate.value)
      ? candidate
      : undefined;
  const allSelected =
    options.length > 0 &&
    options.every((option) => option.disabled || value.includes(option.value));

  return (
    <PopoverPrimitive.Root
      open={!disabled && open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) setSearch("");
        openState.onOpenChange(nextOpen);
      }}
    >
      <InputControl contentLayout="spread" error={error} disabled={disabled}>
        <PopoverPrimitive.Trigger
          ref={ref}
          type="button"
          role="combobox"
          aria-controls={listId}
          aria-expanded={open}
          disabled={disabled}
          {...triggerProps}
        >
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-left",
              value.length === 0 && "text-muted-foreground",
            )}
            title={value.length > 0 ? selectedLabel : undefined}
          >
            {value.length > 0 ? selectedLabel : placeholder}
          </span>
          <DropdownIndicator color={error ? "destructive" : "tertiary"} />
        </PopoverPrimitive.Trigger>
      </InputControl>
      <PopoverPrimitive.Portal container={container}>
        <InputDropdown.Content width="popover-trigger">
          <PopoverPrimitive.Content
            align="start"
            sideOffset={4}
            onWheel={stopScrollPropagation()}
            onTouchMove={stopScrollPropagation()}
          >
            <InputDropdown.Root>
              <CommandPrimitive>
                <InputDropdown.Search>
                  <CommandPrimitive.Input
                    placeholder={searchPlaceholder}
                    value={search}
                    onValueChange={setSearch}
                  />
                </InputDropdown.Search>
                {selectAllLabel &&
                  !search.trim() &&
                  options.some((option) => !option.disabled) && (
                    <InputDropdown.Option
                      highlight="focus"
                      checked={allSelected}
                    >
                      <button
                        type="button"
                        aria-pressed={allSelected}
                        onClick={() =>
                          onValueChange(
                            allSelected
                              ? value.filter((selectedValue) =>
                                  options.every(
                                    (option) =>
                                      option.value !== selectedValue ||
                                      option.disabled,
                                  ),
                                )
                              : [
                                  ...value,
                                  ...options
                                    .filter(
                                      (option) =>
                                        !option.disabled &&
                                        !value.includes(option.value),
                                    )
                                    .map((option) => option.value),
                                ],
                          )
                        }
                      >
                        <InputDropdown.MultiSelectOptionContent
                          label={selectAllLabel}
                          title={selectAllLabel}
                          checked={allSelected}
                        />
                      </button>
                    </InputDropdown.Option>
                  )}
                <InputDropdown.Empty>
                  <CommandPrimitive.Empty>
                    {emptyMessage}
                  </CommandPrimitive.Empty>
                </InputDropdown.Empty>
                <InputDropdown.List>
                  <CommandPrimitive.List id={listId}>
                    <CommandPrimitive.Group className="text-foreground overflow-hidden">
                      {additionalOption && (
                        <InputDropdown.Option highlight="aria-selected">
                          <CommandPrimitive.Item
                            value={additionalOption.value}
                            keywords={[query, additionalOption.label]}
                            disabled={additionalOption.disabled}
                            onSelect={() => {
                              onValueChange([...value, additionalOption.value]);
                              setSearch("");
                            }}
                          >
                            <InputDropdown.MultiSelectOptionContent
                              label={additionalOption.label}
                              title={additionalOption.label}
                              secondaryLabel={additionalOption.secondaryLabel}
                              checked={false}
                            />
                          </CommandPrimitive.Item>
                        </InputDropdown.Option>
                      )}
                      {visibleOptions.map((option) => {
                        const isSelected = value.includes(option.value);

                        return (
                          <InputDropdown.Option
                            key={option.value}
                            highlight="aria-selected"
                            checked={isSelected}
                          >
                            <CommandPrimitive.Item
                              value={option.value}
                              keywords={[option.label]}
                              disabled={option.disabled}
                              aria-checked={isSelected}
                              onSelect={() => {
                                if (isSelected) {
                                  onValueChange(
                                    value.filter(
                                      (selectedValue) =>
                                        selectedValue !== option.value,
                                    ),
                                  );
                                  return;
                                }

                                onValueChange([...value, option.value]);
                              }}
                            >
                              <InputDropdown.MultiSelectOptionContent
                                label={option.label}
                                title={option.label}
                                secondaryLabel={option.secondaryLabel}
                                checked={isSelected}
                              />
                            </CommandPrimitive.Item>
                          </InputDropdown.Option>
                        );
                      })}
                    </CommandPrimitive.Group>
                  </CommandPrimitive.List>
                </InputDropdown.List>
              </CommandPrimitive>
            </InputDropdown.Root>
          </PopoverPrimitive.Content>
        </InputDropdown.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
