// Shared enter/exit motion for anything that mounts and unmounts: popovers,
// modals, toasts. Pair a class here with Floating UI's `useTransitionStatus`
// and put the returned `status` on the element as `data-status`:
//   const { isMounted, status } = useTransitionStatus(context, { duration: motionDuration })
//   {isMounted && <div data-status={status} className={motionPop}>...</div>}
// Everything is skipped under `prefers-reduced-motion`. Full class strings so
// Tailwind can detect them.

/** Milliseconds; keep in step with `duration-150` below. */
export const motionDuration = 150;

/** Small panels (menus, tooltips, pickers): fade and grow from 95%. */
export const motionPop =
  'transition duration-150 ease-out motion-reduce:transition-none data-[status=initial]:scale-95 data-[status=initial]:opacity-0 data-[status=close]:scale-95 data-[status=close]:opacity-0';

/** Backdrops: fade only. */
export const motionFade =
  'transition-opacity duration-150 ease-out motion-reduce:transition-none data-[status=initial]:opacity-0 data-[status=close]:opacity-0';

/** Toasts: fade and rise from slightly below. */
export const motionSlide =
  'transition duration-200 ease-out motion-reduce:transition-none data-[status=initial]:translate-y-2 data-[status=initial]:opacity-0 data-[status=close]:translate-y-2 data-[status=close]:opacity-0';
