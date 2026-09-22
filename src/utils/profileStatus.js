'use strict';

/**
 * Single source of truth for PSU PROFILE approval statuses.
 *
 * 0 -> Draft (PSU editing)
 * 1 -> Pending at FA (waiting for Finance approval)
 * 2 -> Rejected by FA (back with PSU, can edit & resend)
 * 3 -> Pending at SEC (waiting for SEC approval)
 * 4 -> Rejected by SEC (back with PSU, can edit & resend)
 * 5 -> Approved
 *
 * NOTE: tbl_psu_yearwise_mstr uses a DIFFERENT status chain - do not mix them.
 */

const PROFILE_STATUS = {
  DRAFT: 0,
  PENDING_FA: 1,
  REJECTED_FA: 2,
  PENDING_SEC: 3,
  REJECTED_SEC: 4,
  APPROVED: 5
};

const PROFILE_STATUS_LABELS = {
  0: 'Draft',
  1: 'Pending at FA',
  2: 'Rejected by FA',
  3: 'Pending at SEC',
  4: 'Rejected by SEC',
  5: 'Approved'
};

// Statuses in which the PSU is allowed to edit / resend the profile.
const PSU_EDITABLE_STATUSES = [
  PROFILE_STATUS.DRAFT,
  PROFILE_STATUS.REJECTED_FA,
  PROFILE_STATUS.REJECTED_SEC
];

function statusLabel(status) {
  const n = Number(status);
  return Object.prototype.hasOwnProperty.call(PROFILE_STATUS_LABELS, n)
    ? PROFILE_STATUS_LABELS[n]
    : 'Unknown';
}

module.exports = {
  PROFILE_STATUS,
  PROFILE_STATUS_LABELS,
  PSU_EDITABLE_STATUSES,
  statusLabel
};
