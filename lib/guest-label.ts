export function guestNameSuffix(guest: {
  relatedTo: string | null;
  jobTitle: string | null;
}): string | null {
  const details = [
    guest.jobTitle,
    guest.relatedTo ? `Người thân của ${guest.relatedTo}` : null,
  ].filter((value): value is string => Boolean(value));
  return details.length ? details.join("; ") : null;
}
