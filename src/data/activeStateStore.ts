// Helper for temporary active state transitions during press actions

export function getActiveState(_scope: string): string | null {
  return null
}

export function setActiveState(_scope: string, _id: string | null) {
  // No-op: active states revert to default after action completion
}
