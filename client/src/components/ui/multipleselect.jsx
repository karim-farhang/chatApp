import React, {useEffect, useRef, useState, useImperativeHandle, useCallback} from 'react';
import {Command, CommandItem, CommandList, CommandGroup} from './command.jsx';
import {Command as CommandPrimitive} from 'cmdk';
import {Badge} from './badge.jsx';
import classNames from 'classnames';
import {MdClose} from 'react-icons/md';

// Utility function to debounce a value
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

// Utility function to transform options into grouped options
function transToGroupOption(options, groupBy) {
    if (!options.length) return {};

    if (!groupBy) {
        return {'': options};
    }

    return options.reduce((groupedOptions, option) => {
        const groupKey = option[groupBy] || '';
        if (!groupedOptions[groupKey]) groupedOptions[groupKey] = [];
        groupedOptions[groupKey].push(option);
        return groupedOptions;
    }, {});
}

// Utility function to check if options exist
function isOptionsExist(groupOptions, targetOptions) {
    return Object.values(groupOptions).some(options =>
        options.some(option => targetOptions.some(target => target.value === option.value))
    );
}

const MultipleSelector = React.forwardRef(
    (
        {
            value,
            onChange,
            placeholder,
            defaultOptions: arrayDefaultOptions = [],
            options: arrayOptions = [],
            delay = 500,
            onSearch,
            loadingIndicator,
            emptyIndicator,
            maxSelected = Number.MAX_SAFE_INTEGER,
            onMaxSelected,
            hidePlaceholderWhenSelected,
            disabled,
            groupBy,
            className,
            badgeClassName,
            selectFirstItem = true,
            creatable = false,
            triggerSearchOnFocus = false,
            commandProps,
            inputProps,
            hideClearAllButton = false,
        },
        ref
    ) => {
        const inputRef = useRef(null);
        const [open, setOpen] = useState(false);
        const [isLoading, setIsLoading] = useState(false);
        const [selected, setSelected] = useState(value || []);
        const [options, setOptions] = useState(transToGroupOption(arrayDefaultOptions, groupBy));
        const [inputValue, setInputValue] = useState("");
        const debouncedSearchTerm = useDebounce(inputValue, delay);

        const safeSelected = selected || [];

        useImperativeHandle(ref, () => ({
            selectedValue: [...safeSelected],
            input: inputRef.current,
            focus: () => inputRef.current?.focus(),
        }), [safeSelected]);

        const handleUnselect = useCallback(
            (option) => {
                const newOptions = safeSelected.filter((s) => s.value !== option.value);
                setSelected(newOptions);
                onChange?.(newOptions);
            },
            [onChange, safeSelected]
        );

        const handleKeyDown = useCallback(
            (e) => {
                const input = inputRef.current;
                if (input) {
                    if ((e.key === "Delete" || e.key === "Backspace") && input.value === "" && safeSelected.length > 0) {
                        const lastSelectOption = safeSelected[safeSelected.length - 1];
                        if (!lastSelectOption.fixed) {
                            handleUnselect(lastSelectOption);
                        }
                    }
                    if (e.key === "Escape") {
                        input.blur();
                    }
                }
            },
            [handleUnselect, safeSelected]
        );

        useEffect(() => {
            if (value) {
                setSelected(value);
            }
        }, [value]);

        useEffect(() => {
            if (!arrayOptions || onSearch) return;
            const newOption = transToGroupOption(arrayOptions, groupBy);
            setOptions(newOption);
        }, [arrayOptions, groupBy, onSearch]);

        useEffect(() => {
            const doSearch = async () => {
                setIsLoading(true);
                const res = await onSearch?.(debouncedSearchTerm);
                setOptions(transToGroupOption(res || [], groupBy));
                setIsLoading(false);
            };

            if (onSearch && open && debouncedSearchTerm) {
                doSearch();
            }
        }, [debouncedSearchTerm, groupBy, open, onSearch]);

        const CreatableItem = () => {
            if (!creatable || !inputValue || isOptionsExist(options, [{
                value: inputValue,
                label: inputValue
            }])) return null;

            return (
                <CommandItem
                    value={inputValue}
                    onMouseDown={(e) => e.preventDefault()}
                    onSelect={(value) => {
                        if (safeSelected.length >= maxSelected) {
                            onMaxSelected?.(safeSelected.length);
                            return;
                        }
                        const newOptions = [...safeSelected, {value, label: value}];
                        setSelected(newOptions);
                        onChange?.(newOptions);
                        setInputValue("");
                    }}
                >
                    {`Create "${inputValue}"`}
                </CommandItem>
            );
        };

        const EmptyItem = () => {
            if (Object.keys(options).length === 0) {
                return <CommandEmpty>{emptyIndicator}</CommandEmpty>;
            }
            return null;
        };

        return (
            <Command
                {...commandProps}
                onKeyDown={handleKeyDown}
                className={classNames("h-auto overflow-visible bg-transparent", commandProps?.className)}
            >
                <div
                    className={classNames(
                        "min-h-10 rounded-md border border-input text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                        {"px-3 py-2": safeSelected.length !== 0},
                        className
                    )}
                    onClick={() => !disabled && inputRef.current?.focus()}
                >
                    <div className="flex flex-wrap gap-3">
                        {safeSelected.map((option) => (
                            <Badge key={option.value} className={badgeClassName}>
                                {option.label}
                                {!disabled && (
                                    <button onClick={() => handleUnselect(option)}>
                                        <MdClose className="h-4 w-4"/>
                                    </button>
                                )}
                            </Badge>
                        ))}
                        <CommandPrimitive.Input
                            {...inputProps}
                            ref={inputRef}
                            value={inputValue}
                            onValueChange={setInputValue}
                            placeholder={placeholder}
                            className={classNames("flex-1 bg-transparent", inputProps?.className)}
                        />
                    </div>
                </div>

                {open && (
                    <CommandList
                        className="absolute top-1 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
                        {isLoading ? loadingIndicator : EmptyItem()}
                        {CreatableItem()}
                        {Object.entries(options).map(([key, dropdowns]) => (
                            <CommandGroup key={key} heading={key}>
                                {dropdowns.map((option) => (
                                    <CommandItem key={option.value} value={option.value} disabled={option.disable}>
                                        {option.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        ))}
                    </CommandList>
                )}
            </Command>
        );
    }
);

MultipleSelector.displayName = "MultipleSelector";
export default MultipleSelector;
