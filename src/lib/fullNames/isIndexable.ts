export interface IndexabilityEvaluation {
  eligible: boolean;
  reasons: string[];
}

export interface CandidateEntity {
  firstName: string;
  lastName: string;
  slug: string;
  firstNameLiving: number;
  surnameCount: number;
  rawEstimate: number;
}

/**
 * Validates whether a candidate Full-Name combination qualifies for static indexation.
 */
export function evaluateFullNameIndexability(candidate: CandidateEntity): IndexabilityEvaluation {
  const reasons: string[] = [];

  if (!candidate.firstName || candidate.firstName.trim().length < 2) {
    reasons.push("invalid-first-name");
  }

  if (!candidate.lastName || candidate.lastName.trim().length < 2) {
    reasons.push("invalid-last-name");
  }

  if (candidate.firstNameLiving < 100) {
    reasons.push("first-name-data-insufficient");
  }

  if (candidate.surnameCount < 500) {
    reasons.push("surname-data-insufficient");
  }

  if (candidate.rawEstimate <= 0) {
    reasons.push("zero-model-estimate");
  }

  if (!candidate.slug || candidate.slug.split("-").length < 2) {
    reasons.push("malformed-slug");
  }

  return {
    eligible: reasons.length === 0,
    reasons,
  };
}
