/**
 * DetailSkeleton — replaced by LoadingSpinner.
 *
 * Admin detail pages (OrderDetailPage, UserDetailPage, ProductDetailPage)
 * fetch a single record on mount. The window is brief enough that the
 * generic centered spinner is a better UX than a large skeleton that would
 * need to be kept in sync with complex, rapidly-changing layouts.
 *
 * This file is kept to avoid broken imports, but it simply delegates to
 * LoadingSpinner.
 */
export { default } from '../common/LoadingSpinner';
