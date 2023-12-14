class ClaimStatus {
  static pending = "NEW";
  static submitted = "APPROVAL PENDING";
  static hold = "HOLD";
  static accepted = "APPROVED";
  static rejected = "REJECTED";
  static partiallyPaid = "PARTIALLY PAID";
  static paymentCompleted = "REIMBURSED";
}

export default ClaimStatus;
