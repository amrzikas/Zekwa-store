# Security Specification for Reviews

## Data Invariants
- A review must be linked to a valid `productId`.
- A review must be linked to a valid `userId` which matches the `request.auth.uid`.
- Rating must be an integer between 1 and 5.
- Comment must be a string with a maximum length of 1000 characters.

## The Dirty Dozen Payloads (Rejection Tests)
1. **Identity Theft**: Creating a review with `userId` different from `request.auth.uid`.
2. **Schema Poisoning**: Adding a `ghostField: true` to a review.
3. **Invalid Rating (Too High)**: Rating `6`.
4. **Invalid Rating (Too Low)**: Rating `0`.
5. **Invalid Rating (Type)**: Rating `"5"` (string instead of number).
6. **Resource Exhaustion**: 1MB string as a comment.
7. **Identity Spoofing**: Updating `userId` after creation.
8. **Relational Poisoning**: Updating `productId` after creation.
9. **Unverified Write**: Writing a review without a verified email (if strict mode is on).
10. **Admin Escalation**: Setting `isAdmin: true` in a user profile.
11. **Shadow Update**: Updating a review with a field not in the allowlist.
12. **Orphaned Write**: Creating a review for a non-existent product.

## Rules Draft
I will implement a `isValidReview` helper that checks all types and constraints.
I will use `affectedKeys().hasOnly()` for updates.
