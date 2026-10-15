# Spec Delta

## Purpose

Provides aggregate learning statistics:lessons completed, total attempts and accuracy, due review count, and daily activity streak, so learners can track progress over time.

## ADDED Requirements

### Requirement: Dashboard statistics
The system SHALL expose a statistics summary covering lessons completed, total exercise attempts and accuracy, number of due reviews, and the current daily streak based on recorded activity days..

#### Scenario: Statistics returned
- **WHEN** a client requests statistics
- **THEN** the response includes lessons completed count, total attempts count, accuracy percentage, due reviews count, and streak in consecutive days ending today (or the most recent activity day) with recorded attempts

#### Scenario: No activity yet
- **WHEN** no attempts have been recorded
- **THEN** statistics return zero attempts, zero accuracy, no due reviews, and a zero streak