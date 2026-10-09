import {
  cloneElement,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useMergeRefs,
  useRole,
  type Placement,
} from '@floating-ui/react';
import { cn } from '../utils/cn';
import { controlFocusRing } from '../theme/control';

export interface MenuItem {
  label: ReactNode;
  onSelect: () => void;
  disabled?: boolean;
}

export interface MenuProps {
  /** Single element that opens the menu (must accept a ref and click handlers). */
  trigger: ReactElement<{ ref?: Ref<HTMLElement> }>;
  items: MenuItem[];
  placement?: Placement;
  className?: string;
}

// A list of actions opened from a trigger. For choosing a form value, use Select.
export function Menu({
  trigger,
  items,
  placement = 'bottom-end',
  className,
}: MenuProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const listRef = useRef<Array<HTMLButtonElement | null>>([]);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [offset(6), flip(), shift({ padding: 8 })],
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    useClick(context),
    useDismiss(context),
    useRole(context, { role: 'menu' }),
    useListNavigation(context, { listRef, activeIndex, onNavigate: setActiveIndex }),
  ]);

  const ref = useMergeRefs([refs.setReference, trigger.props.ref]);

  return (
    <>
      {cloneElement(trigger, getReferenceProps({ ref }))}
      {open && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false} initialFocus={-1}>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
              className={cn(
                'z-50 min-w-40 rounded-control border border-border bg-surface-raised p-1 shadow-lg',
                className,
              )}
            >
              {items.map((item, i) => (
                <button
                  key={i}
                  type="button"
                  role="menuitem"
                  disabled={item.disabled}
                  tabIndex={activeIndex === i ? 0 : -1}
                  ref={(node) => {
                    listRef.current[i] = node;
                  }}
                  {...getItemProps({
                    onClick() {
                      item.onSelect();
                      setOpen(false);
                    },
                  })}
                  className={cn(
                    'flex w-full items-center rounded-control px-3 py-2 text-left text-sm text-ink transition-colors',
                    'hover:bg-surface focus-visible:bg-surface',
                    controlFocusRing,
                    'disabled:cursor-not-allowed disabled:opacity-50',
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
}
