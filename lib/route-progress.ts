export const ROUTE_PROGRESS_START = "anvui:route-progress-start";
export const ROUTE_PROGRESS_END = "anvui:route-progress-end";
export const ROUTE_PROGRESS_CANCEL = "anvui:route-progress-cancel";

export function startRouteProgress() {
  window.dispatchEvent(new Event(ROUTE_PROGRESS_START));
}

export function cancelRouteProgress() {
  window.dispatchEvent(new Event(ROUTE_PROGRESS_CANCEL));
}
